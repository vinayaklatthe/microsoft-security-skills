---
name: bitlocker-design
description: "Guidance for designing BitLocker drive encryption for Windows endpoints managed via Microsoft Intune — encryption policy, silent enablement, recovery key escrow to Entra ID, TPM, pre-boot authentication trade-offs, and BitLocker To Go for removable media. Covers compliance integration with Conditional Access and recovery workflows. WHEN: BitLocker, disk encryption, Windows encryption policy, BitLocker recovery key, silent BitLocker enablement, Intune disk encryption, TPM 2.0, escrow recovery key, encrypt endpoints, XTS-AES, BitLocker To Go, pre-boot authentication, removable drive encryption. DO NOT USE for general Intune device management (use intune-device-mgmt), Linux/macOS encryption (use intune-device-mgmt FileVault), or Azure disk encryption (use azure-key-vault)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# BitLocker Design

BitLocker provides full-volume encryption for Windows devices, protecting data at rest against
device loss or theft. In cloud-managed estates it is deployed and monitored through Intune
**disk encryption** endpoint security policies with recovery key escrow to Microsoft Entra ID.

## When to use
Encrypting Windows endpoints and centrally managing recovery keys and compliance. Use this
skill to choose pre-boot mode, configure silent enablement, and plan recovery before rollout.

**Do not use this skill** for general Intune device baseline (`intune-device-mgmt`),
macOS FileVault (use Intune disk encryption policy directly), or Azure VM disk
encryption (`azure-key-vault`).

## Pick the configuration by device type

| Device profile | Pre-boot auth | Encryption | Notes |
|---|---|---|---|
| **Modern corporate laptop (TPM 2.0, Secure Boot)** | TPM-only (no PIN) | XTS-AES 256 | Default; silent enable |
| **High-sensitivity admin / Tier 0 (PAW)** | TPM + PIN | XTS-AES 256 | Stronger; pairs with PAW |
| **Kiosk / unattended** | TPM-only with Network Unlock | XTS-AES 256 | No user to type PIN |
| **Legacy device (no TPM 2.0 / no Secure Boot)** | Replace device | n/a | Don't try to enable on bare-metal legacy |
| **Removable media (USB)** | BitLocker To Go (password or smart card) | XTS-AES 256 | Separate policy |
| **Fixed data drives** | Auto-unlock with OS drive | XTS-AES 256 | Encrypt with OS drive |

> **Rule of thumb:** TPM-only + silent enablement is the right default for 95% of modern
> corporate laptops. TPM+PIN doubles the security against physical attack but triples support
> calls. Reserve TPM+PIN for Tier 0 / PAW.

## Approach

1. **Confirm prerequisites** — TPM 2.0 (TPM 1.2 in narrow cases), Secure Boot UEFI, supported
   Windows edition (Pro/Enterprise), Entra-joined or hybrid-joined (required for key escrow).
   *Verify: `Get-Tpm` shows `TpmReady=True`; `manage-bde -status` shows the drive as
   encryptable.*

2. **Configure Intune disk encryption policy** — Endpoint security → Disk encryption →
   create a BitLocker profile. Set encryption method (XTS-AES 256), encrypt OS drive +
   fixed drives, pre-boot mode (TPM-only by default).

3. **Silent enablement** — Enable **silently enable BitLocker on devices** and **escrow
   recovery keys to Microsoft Entra ID automatically**. User sees no prompt; encryption
   completes in background. This is the modern default.
   *Verify: pilot device shows BitLocker = On, key escrowed to Entra (visible on device
   object), no user interaction recorded.*

4. **Verify recovery key escrow before broad rollout** — Pull a pilot device's recovery key
   from the Entra device blade. If you can't retrieve it, your policy is wrong - fix
   **before** scaling. Un-escrowed keys mean unrecoverable devices.
   *Verify: 100% of pilot ring devices have key visible in Entra; help desk can retrieve.*

5. **BitLocker To Go for removable drives** — Separate policy: require password (8+ chars) or
   smart card for **removable-drive encryption**. Block writes to unencrypted removable
   drives via Defender for Endpoint device control if data sensitivity warrants.

6. **Feed compliance and Conditional Access** — Add BitLocker / encryption to the Intune
   compliance policy. CA grant control "Require compliant device" then gates corporate apps
   on encryption status.
   *Verify: an unencrypted device is reported non-compliant within the compliance grace
   period; blocked by CA.*

7. **Monitor + recovery operations** — Encryption report daily; alert on devices stuck at
   encrypting > 7 days. Document the help-desk recovery flow: user reads recovery key ID
   from boot screen → help desk looks up in Entra → reads back the key.

## Guardrails
- **Verify recovery key escrow is working before broad rollout - un-escrowed keys risk data
  loss.** Pilot 50 devices, retrieve every key, then scale.
- **Pilot pre-boot authentication choices; they affect user experience and automation /
  imaging.** TPM+PIN can break Wake-on-LAN, remote management, and unattended reboots.
- **Removable-drive encryption (BitLocker To Go) is a separate policy decision.** Don't
  assume the OS-drive policy covers USB drives.
- **No TPM = no BitLocker (in practice).** Software-only BitLocker is far weaker and a
  signal the device should be retired.
- **Recovery keys are sensitive.** Help-desk procedure should require caller verification
  before reading a recovery key out loud.
- **Don't rotate recovery keys casually.** Each rotation invalidates the escrowed key for a
  window; verify new escrow before treating the rotation as complete.

## Common anti-patterns
- **"Enable BitLocker without verifying escrow"** - First lost device, key missing, data
  unrecoverable. Verify escrow first.
- **"TPM+PIN for everyone"** - 3x ticket volume on PIN-forgotten / PIN-locked. Reserve for
  PAW / Tier 0.
- **"Skip compliance integration"** - Encrypted devices not surfaced to CA. Add to
  compliance policy.
- **"BitLocker To Go optional"** - USB stick of customer data, unencrypted, lost = breach.
  Require for any device handling sensitive data.
- **"Help desk reads recovery key without verifying caller"** - Social-engineering route
  to data theft. Verify identity.
- **"Encrypt then re-image without saving keys"** - Easy to skip during refresh; re-images
  destroy recoverable state. Verify escrow before wiping.

## Example prompts
- `Design a BitLocker policy with silent enablement via Intune and Entra escrow.`
- `Set up TPM+PIN pre-boot authentication for our PAW devices.`
- `Verify recovery key escrow on a pilot ring before broad rollout.`
- `Configure BitLocker To Go for removable USB drives with password protection.`
- `Add disk encryption to Intune compliance policy and gate Conditional Access.`
- `Plan and document the help-desk recovery key workflow.`

## Microsoft Learn
- BitLocker overview: https://learn.microsoft.com/windows/security/operating-system-security/data-protection/bitlocker/
- Manage BitLocker with Intune: https://learn.microsoft.com/mem/intune/protect/encrypt-devices
- Disk encryption policy: https://learn.microsoft.com/mem/intune/protect/endpoint-security-disk-encryption-policy
- Silent encryption: https://learn.microsoft.com/intune/device-configuration/endpoint-security/encrypt-bitlocker-windows
- Recovery keys in Entra: https://learn.microsoft.com/entra/identity/devices/manage-device-identities
- BitLocker To Go: https://learn.microsoft.com/windows/security/operating-system-security/data-protection/bitlocker/bitlocker-to-go-faq
- BitLocker recovery: https://learn.microsoft.com/windows/security/operating-system-security/data-protection/bitlocker/recovery-overview
