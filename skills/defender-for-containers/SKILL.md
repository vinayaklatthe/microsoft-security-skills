---
name: defender-for-containers
description: "Guidance for Microsoft Defender for Containers — Kubernetes and container security across AKS, Azure Arc-enabled Kubernetes, EKS, GKE, and OpenShift. Covers agentless discovery, agentless vulnerability assessment for images and running containers (powered by Microsoft Defender Vulnerability Management), runtime threat detection via the Defender sensor (eBPF on Linux), Kubernetes data plane hardening with Azure Policy / Gatekeeper, registry scanning for ACR / ECR / GAR, admission control, attack path analysis, and Sentinel integration. WHEN: Defender for Containers, AKS security, container runtime threat detection, Kubernetes admission control, image vulnerability scanning, ACR scan, EKS GKE security in Defender for Cloud, K8s posture, container attack path, Defender container sensor, Gatekeeper Azure Policy AKS, agentless container scan. DO NOT USE for VM/host hardening (use defender-for-servers), AKS networking design (use azure-network-security-design), or general AKS day-2 ops unrelated to security."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Defender for Containers

Defender for Containers is the Kubernetes-aware plan in Microsoft Defender for Cloud. It
covers **AKS**, **Azure Arc-enabled Kubernetes** (on-prem, EKS, GKE, OpenShift), and the
container registries that feed them, providing posture, image vulnerability assessment,
runtime threat detection, and admission control.

## When to use
Securing Kubernetes clusters and the registries that supply them. Use this skill for plan
rollout, sensor vs agentless trade-offs, registry scanning, admission policy design, and
runtime alert response.

**Do not use this skill** for VM/host hardening (`defender-for-servers`), cluster
networking design (`azure-network-security-design`), or generic AKS operations (`azure-kubernetes`).

## Capability map

| Capability | How it works | Coverage |
|---|---|---|
| **Agentless discovery** | API-based cluster inventory, control-plane misconfig, K8s API audit log analytics | AKS, EKS, GKE, Arc |
| **Agentless vulnerability assessment** | Snapshots node disks; scans images in registries and running containers | AKS, EKS, GKE |
| **Registry scanning** | Pull-time, push-time, and continuous scan of images | ACR, ECR, GAR |
| **Runtime threat detection** | Defender sensor (DaemonSet, eBPF on Linux) — fileless, lateral movement, crypto-miner detections | AKS, Arc, EKS, GKE |
| **Kubernetes data plane hardening** | Azure Policy add-on (OPA/Gatekeeper) | AKS, Arc-enabled K8s |
| **Attack path analysis** | Combines posture + vuln + runtime to surface internet → pod → cloud-IAM paths | All |

## Approach

1. **Enable Defender for Containers at subscription scope.** Auto-provisioning installs:
   - Defender sensor (DaemonSet) for runtime detection on Linux nodes.
   - Azure Policy for Kubernetes add-on for admission control.
   - Connects ACR scanning automatically.
   *Verify: `kubectl get ds -n kube-system` shows `microsoft-defender-collector-ds`; AKS
   shows Defender profile = enabled.*

2. **Connect non-Azure clusters via Arc.** EKS/GKE need a connector at the AWS/GCP cloud
   account level + Arc onboarding for runtime sensor (agentless features work without sensor).

3. **Registry scanning posture.** Turn on **continuous scanning** so newly-disclosed CVEs
   raise findings on already-pushed images, not just at push time. Set retention so you can
   answer "is image X vulnerable to CVE-Y" 90 days later.

4. **Image vuln management at the pipeline.** Don't wait for runtime: integrate the same
   MDVM API into CI to fail builds on critical, exploitable CVEs. Pair with image signing
   (Notation / cosign) and admission control to require signed images.

5. **Runtime threat detection — sensor or agentless?**
   - Sensor required for: fileless attacks, process tree, in-memory exploitation, lateral
     movement, reverse shell.
   - Agentless covers: image vuln, posture, K8s API audit-based detections.
   - **Use both** in production. Sensor only on Linux node pools (Windows runtime sensor
     coverage is limited).

6. **Admission control with Azure Policy / Gatekeeper.** Roll out as **audit** for 14 days,
   then deny. Baseline policies:
   - No privileged containers.
   - No `hostPath` mounts to sensitive paths.
   - Required readOnlyRootFilesystem for app workloads.
   - Required resource limits.
   - Required signed images (allowlist registries).

7. **Attack path analysis** — review weekly. The high-value paths to fix first are
   *internet-exposed pod with critical CVE → workload identity → cloud IAM*. Prioritise by
   blast radius, not finding count.

8. **Stream alerts to Sentinel** via the Defender for Cloud connector. Build hunting queries
   on `SecurityAlert` filtered to ProductName = "Microsoft Defender for Containers".

## Guardrails
- **Defender sensor is required for runtime detection.** Agentless alone won't catch
  reverse shells or crypto miners running inside pods.
- **Roll admission policies in audit first.** A `requiredLabels` policy in deny mode on day
  one will brick deployments.
- **Don't run two privileged DaemonSets that hook the kernel** (e.g., Defender sensor +
  Falco + a third-party EDR) without testing — eBPF program collisions and node instability.
- **ACR + private endpoint + Defender scanning needs careful network design.** The scanner
  must reach the registry; verify private DNS resolution and trusted-services bypass.
- **Don't scope plan to a single cluster's RG.** New clusters in other RGs go unprotected.
  Subscription scope + policy enforcement.
- **Windows containers have limited sensor coverage.** Compensate with stricter admission
  control and image scanning for Windows workloads.
- **Image vuln findings without exploitability context are noise.** Always filter by
  exploitable / KEV before triage.

## Common anti-patterns
- **"Agentless only because the sensor adds 80 MB of RAM per node"** — and you have no
  runtime detection. Budget the RAM.
- **"Admission policy in deny on day one"** — outage. 14-day audit, fix violations, then
  deny.
- **"Image scanning at push only"** — tomorrow's CVE on yesterday's image goes unflagged.
  Continuous scanning on.
- **"CI ignores MDVM findings — we'll catch it at runtime"** — vulnerabilities reach prod;
  rollback is expensive. Fail the build on critical exploitable.
- **"All clusters in scope, no exemptions for sandbox"** — alert volume buries real
  incidents. Tag/scope sandbox out of admission deny + alert routing.
- **"Used Defender for Containers for VM hosts running Docker directly"** — wrong tool;
  that's a `defender-for-servers` scenario.
- **"Skipped Arc for EKS/GKE because connector is enough"** — no runtime sensor, no eBPF
  detections.

## Example prompts
- `Enable Defender for Containers across 5 subs with AKS clusters; pilot on dev for 7 days.`
- `Roll out Azure Policy for Kubernetes admission control — baseline policy set in audit.`
- `Connect 3 EKS clusters via Arc and enable runtime sensor.`
- `Build a CI gate that fails on critical exploitable CVEs from MDVM.`
- `Investigate a "Crypto-mining activity in container" alert — runbook + KQL.`
- `Tune attack path analysis to surface only internet-to-cloud-IAM paths.`
- `Design admission control to require signed images from approved ACRs only.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-containers-introduction
- Enable plan: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-containers-enable
- Architecture: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-containers-architecture
- Vulnerability assessment: https://learn.microsoft.com/azure/defender-for-cloud/agentless-vulnerability-assessment-azure
- Runtime detection alerts: https://learn.microsoft.com/azure/defender-for-cloud/alerts-reference#alerts-k8scluster
- Azure Policy for Kubernetes: https://learn.microsoft.com/azure/governance/policy/concepts/policy-for-kubernetes
- EKS / GKE protection: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-containers-enable?pivots=defender-for-container-eks
- Attack path analysis: https://learn.microsoft.com/azure/defender-for-cloud/concept-attack-path
