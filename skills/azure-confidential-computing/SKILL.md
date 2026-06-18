---
name: azure-confidential-computing
description: "Guidance for Azure Confidential Computing — protecting data in use through hardware-based Trusted Execution Environments (TEEs). Covers Confidential VMs (AMD SEV-SNP, Intel TDX), Confidential containers on AKS (Kata + AMD SEV-SNP), confidential GPU VMs (NVIDIA H100 with TDX), Azure Key Vault Managed HSM and Premium with secure-key-release for confidential workloads, attestation (Microsoft Azure Attestation service), confidential ledger, scenarios (multi-party data sharing, regulated workload isolation, AI training on sensitive data), key-release policies tying secrets to attested TEE state, and decision criteria vs CMK/Customer Key. WHEN: Azure Confidential Computing, AMD SEV-SNP, Intel TDX, confidential VM, confidential AKS container, confidential GPU H100, Azure Attestation, secure key release, multi-party computation, confidential AI, encrypted memory Azure, hardware enclave Azure. DO NOT USE for general data-at-rest CMK (use azure-key-vault), application encryption SDK only, or non-Azure TEE design."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure Confidential Computing

Confidential computing is the third pillar of data protection — **data in use** —
complementing encryption at rest and in transit. Azure Confidential Computing uses
hardware-based **Trusted Execution Environments (TEEs)** so workloads run on encrypted
memory the host (and Microsoft) cannot inspect, with cryptographic **attestation** to
prove the TEE state to a remote relying party before secrets are released.

## When to use
- Multi-party data collaboration where parties must compute on each other's data
  without seeing it (clean rooms, fraud consortia, joint analytics).
- Regulated workloads requiring isolation from cloud operator access (defense, certain
  financial / healthcare scenarios).
- Sensitive AI training/inference where model weights or training data are crown
  jewels.
- Cryptographic operations that must be hardware-rooted with attestation evidence.

**Do not use this skill** for ordinary data-at-rest CMK (`azure-key-vault`), generic app
encryption, or non-Azure TEE / Intel SGX-only designs.

## Form factors

| Form factor | Hardware | Best for |
|---|---|---|
| **Confidential VMs (DCasv5/ECasv5)** | AMD SEV-SNP | Lift-and-shift Linux/Windows workloads with whole-VM TEE |
| **Confidential VMs (DCesv5/ECesv5)** | Intel TDX | Trust-domain isolation for VMs |
| **Confidential containers on AKS** | Kata Containers + AMD SEV-SNP | Container workloads, per-pod TEE |
| **Confidential GPU VMs (NCC H100 v5)** | NVIDIA H100 + Intel TDX | Confidential AI training/inference |
| **App-enclave** (Intel SGX, DCsv2/3) | Intel SGX | Targeted enclaves; legacy pattern, less common in new builds |
| **Azure Confidential Ledger** | Hardware-backed append-only ledger | Tamper-evident audit logs |

## Approach

1. **Validate the threat model.** Confidential computing protects against:
   - Cloud operator (host admin) memory inspection.
   - Co-tenant side-channel reads (within hardware mitigation limits).
   - Snapshot/disk-image exfiltration combined with memory dump.
   It does **not** protect against application bugs, supply-chain compromise of your
   own code, or insider access at the customer.

2. **Pick the right form factor.**
   - Existing VM workload moving sensitive without code changes → **Confidential VM
     (SEV-SNP)** is the easiest lift.
   - K8s cluster with mixed sensitivity → **Confidential containers on AKS**, scoping
     pods that need TEE.
   - Confidential GPU (LLM training/inference on sensitive data) → **NCC H100 v5**.
   - Multi-party computation with secret protocol → enclave-aware code with SGX (only
     where you need finer-grained TEE than whole-VM).

3. **Stand up Microsoft Azure Attestation.** The MAA service issues signed attestation
   tokens describing the TEE state (CPU model, firmware version, security version).
   Relying parties (your apps, Key Vault) verify these tokens before trusting the
   workload.

4. **Wire secure key release (SKR).** Azure Key Vault Premium / Managed HSM supports
   key-release policies that gate `release` operations on a verified MAA token. The
   workflow:
   1. Confidential workload requests an attestation from MAA.
   2. Workload presents the token to Key Vault.
   3. Key Vault validates against the configured policy (allowed TEE type, firmware
      version, owner identity).
   4. Key is released into the TEE memory.
   This is the foundation for "even Microsoft cannot read this key — only the right
   workload running on the right hardware can use it."

5. **Confidential containers on AKS** — use the Confidential Container add-on.
   Configure pod security with attestation-aware init containers; sensitive secrets
   pulled via SKR after pod attestation.

6. **Confidential AI patterns.** Two common shapes:
   - **Confidential inference**: model weights remain encrypted on disk; loaded into
     TEE memory; client traffic terminates inside TEE. Used for proprietary models.
   - **Confidential training**: training data uploaded encrypted; key released only to
     attested training job; trained model artifacts encrypted to data owner's key.
   - Multi-party: each party's data and the model in separate (or shared) TEE; output
     released only with attested evidence.

7. **Confidential Ledger** for high-integrity audit (regulator log, IoT trust). Don't
   use for high-throughput general logging — it's append-only, blockchain-backed,
   higher latency.

8. **Operate.** Monitor attestation failures (firmware drift, hardware updates).
   Maintain an SKR policy review cadence — security version numbers tighten over time.

## Guardrails
- **Confidential computing is not a silver bullet.** Application security, supply-chain
  hygiene, and identity remain primary. TEEs raise the bar against the host operator,
  not against you.
- **Key-release policies must include security-version-number floors.** Otherwise an
  outdated/vulnerable firmware passes attestation and gets keys.
- **Confidential VMs have feature gaps with regular VMs.** Validate snapshot, backup,
  ASR, custom extensions before commit.
- **Performance overhead is small but real.** Memory encryption costs a few percent;
  confidential GPU has additional overhead. Benchmark.
- **Confidential containers in AKS require careful image design.** Don't bake secrets;
  use SKR.
- **Some regions / SKUs are limited.** Confidential GPU and TDX-VM SKUs aren't
  everywhere. Plan per region.
- **Don't conflate Customer Key / CMK with confidential computing.** They solve
  different problems (key custody for data-at-rest vs runtime memory protection).
- **Attestation evidence is time-bound.** Tokens expire; design refresh into the app.

## Common anti-patterns
- **"Confidential VM with the secret hardcoded in the image"** — TEE protects memory at
  runtime, not your image. Use SKR.
- **"SKR policy allowing any AMD SEV-SNP without firmware floor"** — vulnerable
  firmware accepted; defeats the model.
- **"Confidential container as a generic 'extra security' choice"** — operational
  complexity without commensurate threat-model benefit. Reserve for clear sensitive
  workloads.
- **"Confidential ledger as an append-only log store"** — wrong throughput class. Use
  it for high-integrity, low-volume regulator/audit chains.
- **"SGX-only design forced into a whole-VM use case"** — code-rewrite cost; use
  Confidential VM.
- **"Snapshot + restore on Confidential VM without testing"** — workflow may not
  preserve attested state expectations; test.
- **"Marketed confidential computing as 'encryption stronger than CMK'"** — different
  control category. Communicate accurately.

## Example prompts
- `Architect a multi-party fraud consortium where 4 banks submit encrypted data and a
  joint model trains in a Confidential GPU VM with attestation-gated key release.`
- `Lift-and-shift a regulated Linux workload to Confidential VM (SEV-SNP) with backup
  and DR validation.`
- `Confidential AKS cluster: which pods need TEE, how to wire SKR for per-pod secrets,
  attestation flow.`
- `Configure Key Vault Managed HSM with an SKR policy gated on Confidential VM
  attestation with firmware floor.`
- `Compare Confidential VM (SEV-SNP) vs (TDX) for our workload mix.`
- `Confidential inference for a proprietary LLM on Confidential GPU H100 — design.`
- `Decide: Customer Key vs Confidential Computing for a sovereignty requirement.`

## Microsoft Learn
- Confidential computing overview: https://learn.microsoft.com/azure/confidential-computing/overview
- Confidential VMs: https://learn.microsoft.com/azure/confidential-computing/confidential-vm-overview
- AMD SEV-SNP CVMs: https://learn.microsoft.com/azure/confidential-computing/virtual-machine-solutions-amd
- Intel TDX CVMs: https://learn.microsoft.com/azure/confidential-computing/tdx-confidential-vm-overview
- Confidential containers on AKS: https://learn.microsoft.com/azure/confidential-computing/confidential-containers-on-aks-preview
- Confidential GPU (NCC H100 v5): https://learn.microsoft.com/azure/confidential-computing/confidential-vm-overview#confidential-vms-with-gpu
- Microsoft Azure Attestation: https://learn.microsoft.com/azure/attestation/overview
- Secure key release: https://learn.microsoft.com/azure/key-vault/keys/policy-grammar
- Confidential Ledger: https://learn.microsoft.com/azure/confidential-ledger/overview
- Confidential AI scenarios: https://learn.microsoft.com/azure/confidential-computing/confidential-ai
