---
name: pki-design
description: "Guidance for designing public key infrastructure (PKI) and certificate management on Azure — certificate authority options, Azure Key Vault certificates, certificate-based authentication in Entra ID, and lifecycle/rotation. WHEN: PKI design, certificate authority, certificate management, Key Vault certificates, certificate-based authentication, CBA, certificate lifecycle, issue and rotate certificates, mTLS certificates, root and issuing CA."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# PKI Design

Public Key Infrastructure (PKI) issues and manages the digital certificates that underpin
authentication, encryption, and signing. This skill covers PKI and certificate management in
Azure-centric environments.

## When to use
Designing certificate issuance, distribution, and lifecycle for authentication (incl. Entra
certificate-based auth), TLS/mTLS, code signing, and device identity.

## Approach
1. **CA strategy** — Choose the trust source: an existing enterprise/on-prem **AD CS** hierarchy
   (offline root + issuing CAs), a managed/third-party CA, or a public CA for internet-facing TLS.
   Keep the **root CA offline**; issue from subordinate CAs.
2. **Certificate storage** — Use **Azure Key Vault** to store and manage certificates; integrate
   with supported issuer CAs for automatic enrollment and renewal.
3. **Authentication** — For passwordless/phishing-resistant auth, configure **Entra ID
   certificate-based authentication (CBA)** with trusted CAs and authentication binding policies.
4. **Lifecycle & rotation** — Automate issuance, renewal, and **rotation**; monitor expiry; define
   revocation (CRL/OCSP) and re-key processes.
5. **Distribution** — Deploy device/user certificates via **Intune** SCEP/PKCS connectors where
   needed.

## Guardrails
- Protect the root and issuing CA keys (HSM / Managed HSM); a compromised CA undermines all trust.
- Never let certificates silently expire — monitor and automate renewal (outages and auth
  failures stem from expiry).
- Plan revocation and CRL/OCSP availability before relying on certificates for access.

## Example prompts
- `Design a PKI with root and issuing CAs and a certificate lifecycle.`
- `Use Azure Key Vault to issue, rotate, and manage certificates.`
- `Set up certificate-based authentication (CBA) for Entra.`
- `Plan mTLS certificate issuance and rotation.`

## Microsoft Learn
- Key Vault certificates: https://learn.microsoft.com/azure/key-vault/certificates/about-certificates
- Entra certificate-based auth: https://learn.microsoft.com/entra/identity/authentication/concept-certificate-based-authentication
- Intune certificate profiles: https://learn.microsoft.com/mem/intune/protect/certificates-configure
- Certificate lifecycle in Key Vault: https://learn.microsoft.com/azure/key-vault/certificates/create-certificate
