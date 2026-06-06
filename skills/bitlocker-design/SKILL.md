---
name: bitlocker-design
description: "Guidance for designing BitLocker drive encryption for Windows endpoints managed via Microsoft Intune — encryption policy, key escrow, silent enablement, and recovery. Covers disk encryption policy, TPM, and recovery key management. WHEN: BitLocker, disk encryption, Windows encryption policy, BitLocker recovery key, silent BitLocker enablement, Intune disk encryption, TPM, escrow recovery key, encrypt endpoints."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# BitLocker Design

BitLocker provides full-volume encryption for Windows devices, protecting data at rest against
device loss/theft. In modern, cloud-managed estates it is deployed and monitored through
Microsoft Intune disk encryption policies.

## When to use
Encrypting Windows endpoints and centrally managing recovery keys and compliance.

## Approach
1. **Prerequisites** — Confirm **TPM** (2.0 recommended), supported Windows edition, and
   Entra/hybrid join for key escrow.
2. **Policy** — Configure Intune **disk encryption** (endpoint security) BitLocker policy: OS drive
   and fixed-drive settings, encryption method (e.g., XTS-AES 256), and pre-boot authentication
   requirements.
3. **Silent enablement** — Use settings that **silently enable** BitLocker and **escrow recovery
   keys to Microsoft Entra ID** automatically, minimising user disruption.
4. **Recovery management** — Ensure recovery keys are stored in Entra ID; define admin/self-service
   recovery key retrieval and help-desk processes.
5. **Compliance** — Add BitLocker/encryption to Intune **compliance policy** so Conditional Access
   can require encrypted devices.
6. **Monitor** — Track encryption status via Intune encryption reports.

## Guardrails
- Verify recovery key escrow is working **before** broad rollout — un-escrowed keys risk data loss.
- Pilot pre-boot authentication choices; they affect user experience and automation/imaging.
- Removable-drive encryption (BitLocker To Go) is a separate policy decision.

## Microsoft Learn
- BitLocker overview: https://learn.microsoft.com/windows/security/operating-system-security/data-protection/bitlocker/
- Manage with Intune: https://learn.microsoft.com/mem/intune/protect/encrypt-devices
- Disk encryption policy: https://learn.microsoft.com/mem/intune/protect/endpoint-security-disk-encryption-policy
- Recovery keys in Entra: https://learn.microsoft.com/entra/identity/devices/device-management-azure-portal
