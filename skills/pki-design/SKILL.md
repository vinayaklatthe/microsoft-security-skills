---
name: pki-design
description: "Guidance for designing public key infrastructure (PKI) and certificate management on Azure and hybrid environments. Covers CA strategy (offline root + issuing CAs, AD CS vs managed/third-party vs public CA), Azure Key Vault certificates, HSM key protection, Entra certificate-based authentication (CBA), certificate lifecycle (issuance, renewal, rotation, revocation), and Intune SCEP/PKCS distribution. WHEN: PKI design, certificate authority, root CA offline, issuing CA, certificate management, Key Vault certificates, certificate-based authentication, CBA, certificate lifecycle, issue and rotate certificates, mTLS certificates, code signing, CRL OCSP, certificate expiry, certificate rotation, AD CS, HSM, Managed HSM. DO NOT USE for Entra ID identity model (use entra-id) or Key Vault secrets/keys only (use azure-key-vault)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# PKI Design

Public Key Infrastructure (PKI) issues and manages the digital certificates that underpin
authentication, encryption, and signing. In Azure-centric and hybrid environments this means
combining a trusted CA hierarchy, Key Vault storage, automated lifecycle, and certificate-based
authentication.

## When to use
Designing certificate issuance, distribution, and lifecycle for: Entra phishing-resistant CBA,
TLS / mTLS for services, device identity (Wi-Fi 802.1x, VPN), code signing, and S/MIME. Use
this skill when the question is "where do certificates come from and how do they renew", not
"how do I store one secret".

**Do not use this skill** for Key Vault secrets/keys (`azure-key-vault`) or Entra ID model
(`entra-id`).

## Pick the CA strategy by use case

| If the use case is... | CA choice | Notes |
|---|---|---|
| Internet-facing TLS (websites, APIs) | **Public CA** (DigiCert, GlobalSign, Let's Encrypt) | Always; private CAs aren't trusted by browsers |
| Internal app TLS, mTLS, service-to-service | Internal **issuing CA** (AD CS or managed) | Private CA chain trusted internally |
| Entra certificate-based authentication | Internal CA published to Entra trust store | Pair with strong binding policy |
| Device identity (Wi-Fi 802.1x, VPN) | AD CS or third-party PKI + Intune SCEP/PKCS | Auto-enrollment essential |
| Code signing | EV code signing cert from a public CA | Hardware token; protect aggressively |
| S/MIME email signing/encryption | Third-party public CA (DigiCert, Sectigo) | Internal CAs not trusted by external recipients |
| Short-lived workload certs (Kubernetes) | **cert-manager** with ACME or internal issuer | Minutes-to-hours TTL |

> **Rule of thumb:** never use a private CA for internet-facing services and never use a
> public CA for internal certificates at scale (cost + agility). Two distinct chains.

## Approach

1. **Design the CA hierarchy** — **Offline root CA** + one or more online **issuing CAs**.
   Root signs issuing CA certs (long validity, e.g. 10-20 years), issuing CAs sign end-entity
   certs (1-2 year validity).
   *Verify: root CA host is powered off or air-gapped except for CRL signing and issuing CA
   renewal.*

2. **Protect the keys with HSM** — Root CA private key in an HSM (FIPS 140-2 Level 2+).
   Azure **Managed HSM** for cloud-native; on-prem HSM for AD CS. Never an unprotected
   filesystem.
   *Verify: `certutil -getreg ca\CSP\Provider` shows the HSM provider, not "Microsoft Software
   Key Storage Provider".*

3. **Storage and lifecycle in Key Vault** — Use **Azure Key Vault certificates** for all
   service certificates. Integrate with supported issuer CAs (DigiCert, GlobalSign, internal
   via Key Vault Acmebot or partner connector) for **automatic renewal**.
   *Verify: cert objects have `lifetime_actions` configured for auto-renewal at 75% of
   lifetime; manual touch required only for new issuance.*

4. **Auto-enrollment for device and user certs** — AD CS auto-enrollment via GPO for domain
   members; **Intune SCEP** or **PKCS connector** for cloud-managed devices. Never email a
   PFX file.
   *Verify: Intune cert profile reports > 95% deployment success; user/device cert visible in
   personal store.*

5. **Plan revocation** — **CRL** (Certificate Revocation List) published to HTTP endpoint;
   **OCSP** responder for real-time. Both must be highly available - if CRL is unreachable,
   modern clients fail closed for high-assurance certs. Use a CDN for the CRL HTTP endpoint.
   *Verify: CRL endpoint reachable from public internet (if external certs) and from all
   internal clients; OCSP responder uptime > 99.9%.*

6. **Monitor expiry** — Key Vault sends events for upcoming expiry. Stream to a dashboard.
   For AD CS, use a script (`certutil -view`) on a schedule. Track 90/60/30/7 days out.
   *Verify: no cert in production expires unmonitored; alerts fire 60 days before expiry.*

7. **Rotation discipline** — Plan rotation before issuance, not when expiry approaches.
   Service teams own renewal automation; PKI team owns CA + alerting infrastructure.

## Guardrails
- **Root CA offline, full stop.** A compromised root undermines every cert it ever signed
  or will sign. Power-off > air-gap > network-isolated VM.
- **HSM for the issuing CA key.** Software-stored issuing CA keys are the single point of
  total trust failure.
- **Never let production certificates silently expire.** Outage at the worst moment. Auto-renew or
  alert 60 days out.
- **Plan revocation before relying on certs.** A cert system without working CRL/OCSP can't
  actually revoke - which means a compromised cert stays valid until expiry.
- **Public CA for internet-facing TLS, always.** Browsers won't trust a private chain.
- **Don't use a wildcard cert across security domains.** One compromise = all subdomains
  compromised. Issue per-service certs and automate the renewal.
- **Hardware token for code signing keys.** Software-signed code signing keys regularly
  appear in malware once stolen.

## Common anti-patterns
- **"We just emailed the PFX to the developer"** - Key exposure. Use Key Vault + managed
  identity / SCEP.
- **"Our root CA is online so we can renew issuing certs easily"** - Convenience that
  compromises the entire trust chain. Offline root.
- **"Software CSP for the issuing CA - HSM is expensive"** - Hardware costs less than the
  incident response when the CA key is stolen.
- **"5-year validity on end-entity certs because renewal is painful"** - Long-lived certs
  are a liability when compromised. Shorten + automate.
- **"CRL is on a single server inside the corp network"** - External users can't validate;
  CRL outage breaks auth. CDN it.
- **"We'll set up monitoring after we issue the certs"** - Cert expiry incidents always
  happen before monitoring is in place.
- **"Use the same cert across all environments (dev/test/prod)"** - Dev cert compromise
  affects production. Per-environment certs.

## Example prompts
- `Design a PKI hierarchy with offline root + two issuing CAs and HSM key protection.`
- `Issue and auto-rotate certificates from Azure Key Vault for our App Service workloads.`
- `Set up Entra certificate-based authentication with our internal CA and strong binding.`
- `Plan SCEP/PKCS certificate deployment via Intune for Wi-Fi 802.1x.`
- `Configure CRL and OCSP for our internal CA with a CDN-backed CRL endpoint.`
- `Monitor and auto-alert on certificate expiry across Key Vault and AD CS.`

## Microsoft Learn
- Key Vault certificates: https://learn.microsoft.com/azure/key-vault/certificates/about-certificates
- Key Vault Managed HSM: https://learn.microsoft.com/azure/key-vault/managed-hsm/overview
- Entra certificate-based auth: https://learn.microsoft.com/entra/identity/authentication/concept-certificate-based-authentication
- CBA strong authentication binding: https://learn.microsoft.com/entra/identity/authentication/concept-certificate-based-authentication-technical-deep-dive
- Intune certificate profiles: https://learn.microsoft.com/mem/intune/protect/certificates-configure
- Intune SCEP: https://learn.microsoft.com/mem/intune/protect/certificates-scep-configure
- AD CS design guidance: https://learn.microsoft.com/windows-server/identity/ad-cs/active-directory-certificate-services-overview
- Certificate lifecycle in Key Vault: https://learn.microsoft.com/azure/key-vault/certificates/create-certificate
