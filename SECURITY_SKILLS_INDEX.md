# Universal Security Skills Master Index

This master index provides comprehensive pointers and architectural guidance for all 20 global security skills deployed across the system. These skills establish the non-negotiable security engineering baseline for autonomous AI agents, native desktop applications, cloud services, and general software development.

All skills are globally available in two discovery locations:
- Primary Configuration Root: [C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/)
- Hardened Plugin Directory: [C:/Users/0.USS-OPPENHEIMER/.gemini/config/plugins/owasp-agentic-skills-security/skills/](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/plugins/owasp-agentic-skills-security/skills/)

---

## 1. Universal Application Security Spectrum (General Development)

```text
       ┌────────────────────────────────────────────────────────┐
       │         UNIVERSAL APPLICATION SECURITY SPECTRUM        │
       └───────────────────────────┬────────────────────────────┘
                                   │
      ┌────────────────┬───────────┴───────────┬────────────────┐
      ▼                ▼                       ▼                ▼
 [ CORE LOGIC ]   [ DATA & AUTH ]        [ HOST & RUNTIME ] [ SUPPLY & OPS ]
 • Defensive      • Injection Defense    • Memory Safety    • Supply Chain / SLSA
 • Fail-Closed    • Auth & Access        • SSRF Defense     • Observability &
 • Zero Trust     • Cryptography         • Client Shell        Audit Trails
```

### 1.1 Core Architecture & Threat Modeling
* **Skill**: [`appsec-core-defensive-design`](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/appsec-core-defensive-design/SKILL.md)
* **Scope**: Universal engineering baseline aligned with OWASP ASVS Level 3.
* **Core Invariants**: Complete mediation, fail-closed defaults, zero trust at component boundaries, parameter canonicalization before validation, and making illegal states unrepresentable through strong typing.

### 1.2 Deep Injection & Input Validation
* **Skill**: [`appsec-injection-and-input-validation`](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/appsec-injection-and-input-validation/SKILL.md)
* **Scope**: Eliminates SQL, NoSQL, OS command, template (SSTI), LDAP, and ReDoS injection across all languages.
* **Core Invariants**: 100% parameterized queries, ban on shell interpreters (`sh -c`, `cmd.exe /c`) in favor of direct binary spawning with argument vectors, CLI argument separation (`--`), and linear-time regex engines.

### 1.3 Authentication, Session & Access Control
* **Skill**: [`appsec-auth-session-and-access-control`](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/appsec-auth-session-and-access-control/SKILL.md)
* **Scope**: Zero-trust credential handling, session state lifecycles, and object-level permissions.
* **Core Invariants**: Argon2id memory-hard password hashing ($m=64\text{MB}, t=3, p=4$), constant-time token comparison, defense-in-depth cookie attributes (`HttpOnly; Secure; SameSite=Strict; Partitioned`), and object-level access control (anti-BOLA/IDOR).

### 1.4 Cryptography & Secrets Hygiene
* **Skill**: [`appsec-cryptography-and-secrets-hygiene`](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/appsec-cryptography-and-secrets-hygiene/SKILL.md)
* **Scope**: Cryptographic primitives, in-memory secrets zeroization, and OS keystore integration.
* **Core Invariants**: AEAD symmetric encryption only (AES-256-GCM, ChaCha20-Poly1305) with unique CSPRNG nonces, constant-time verification, memory zeroization (`zeroize::ZeroizeOnDrop`, `SecureZeroMemory`), and native OS Keystore storage (Windows DPAPI, macOS Keychain, Linux Secret Service).

### 1.5 Systems Memory Safety & Concurrency
* **Skill**: [`appsec-systems-memory-safety-and-concurrency`](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/appsec-systems-memory-safety-and-concurrency/SKILL.md)
* **Scope**: Low-level systems programming, bounds checking, integer overflow defense, and concurrency invariants.
* **Core Invariants**: Checked/saturating integer arithmetic, compiler binary hardening (ASLR/PIE, DEP/NX, full RELRO, stack canaries), mandatory `// SAFETY:` rationale comments on Rust `unsafe` blocks, and atomic filesystem access preventing TOCTOU races.

### 1.6 Network Transport & SSRF Defense
* **Skill**: [`appsec-network-transport-and-ssrf-defense`](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/appsec-network-transport-and-ssrf-defense/SKILL.md)
* **Scope**: TLS configuration, HTTP transport security, and Server-Side Request Forgery (SSRF) defense.
* **Core Invariants**: TLS 1.3/1.2 forward-secrecy ciphers with mandatory CA verification, HSTS headers, multi-stage SSRF blocking (RFC 1918, loopback, link-local, cloud metadata `169.254.169.254`, IPv4-mapped IPv6), and direct socket IP pinning against DNS rebinding.

### 1.7 Client Shell & UI Containment
* **Skill**: [`appsec-client-shell-and-ui-containment`](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/appsec-client-shell-and-ui-containment/SKILL.md)
* **Scope**: Desktop shells (Tauri, Electron), WebViews, and frontend browser UI security.
* **Core Invariants**: Shell isolation (`withGlobalTauri: false`, `nodeIntegration: false`, `contextIsolation: true`), strict nonced Content Security Policy without `'unsafe-inline'` or `'unsafe-eval'`, DOMPurify HTML/SVG sanitization, and deep link URI validation.

### 1.8 Supply Chain, CI/CD Hardening & SLSA
* **Skill**: [`appsec-supply-chain-ci-cd-and-slsa`](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/appsec-supply-chain-ci-cd-and-slsa/SKILL.md)
* **Scope**: Software supply chain integrity, SLSA Level 3 compliance, and CI/CD automation hardening.
* **Core Invariants**: Cryptographic checksum pinning for all dependencies, enforced frozen lockfiles (`cargo build --locked`, `npm ci`, `pip install --require-hashes`), 40-character commit SHA pinning for CI actions, and automated CycloneDX SBOM generation.

### 1.9 Observability, Audit Logging & Incident Response
* **Skill**: [`appsec-observability-audit-logging-and-incident-response`](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/appsec-observability-audit-logging-and-incident-response/SKILL.md)
* **Scope**: Structured security logging, log injection prevention, DLP redaction, and kill switches.
* **Core Invariants**: Machine-readable JSON audit events with standardized actor/context schemas, cryptographic hash chaining for tamper evidence, CRLF control-character sanitization, DLP secrets redaction, and emergency circuit breaker flags.

---

## 2. OWASP Agentic Skills Top 10 (AST10 Framework)

```text
   ┌────────────────────────────────────────────────────────┐
   │            THE B1-B4 TRUST BOUNDARY MODEL              │
   └───────────────────────────┬────────────────────────────┘
                               │
      ┌────────────────┬───────┴────────┬────────────────┐
      ▼                ▼                ▼                ▼
   [ B1 ]           [ B2 ]           [ B3 ]           [ B4 ]
 User/Context    Agent/Repo       Repo/Build       Build/Host
 Prompt Guard    FS Isolation     Hash Pinning     Local Sandboxing
 Steganography   Anti-Slop        SLSA L3          mTLS & Auth
```

### 2.1 Master Runbook
* **Skill**: [`owasp-ast-appsec-hardened`](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/owasp-ast-appsec-hardened/SKILL.md)
* **Scope**: Master architectural standard enforcing B1-B4 isolation boundaries, permission manifests, and pre-mutation receipts across all agent workflows.

### 2.2 AST01: Malicious Code & Agent Takeover Defense
* **Skill**: [`owasp-ast01-malicious-code-defense`](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/owasp-ast01-malicious-code-defense/SKILL.md)
* **Scope**: Defends against malicious skills, code payloads, steganographic instructions, and unauthorized persistence mechanisms.
* **Core Invariants**: Strict write denial to identity and startup files (`SOUL.md`, `MEMORY.md`, `.bashrc`, Startup folders), and canary sandbox pre-flight checks.

### 2.3 AST02: Supply Chain & Skill Integrity
* **Skill**: [`owasp-ast02-supply-chain-integrity`](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/owasp-ast02-supply-chain-integrity/SKILL.md)
* **Scope**: Enforces supply chain integrity, immutable dependency hash pinning, and pre-mutation installation receipts.
* **Core Invariants**: Mandatory `--plan` reviewable receipts before configuration mutation, and cryptographic checksum validation.

### 2.4 AST03: Least Privilege & Non-Human Identity (NHI)
* **Skill**: [`owasp-ast03-least-privilege-enforcement`](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/owasp-ast03-least-privilege-enforcement/SKILL.md)
* **Scope**: Limits tool privileges to minimum required scopes and isolates sensitive credential stores.
* **Core Invariants**: Strict path allowlisting (`child.strip_prefix(parent)`), read-only sandboxing for analysis agents, and total isolation of `.env`, SSH keys, and cloud credentials.

### 2.5 AST04: Secure Metadata Deserialization & Prompt Steganography
* **Skill**: [`owasp-ast04-secure-metadata-deserialization`](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/owasp-ast04-secure-metadata-deserialization/SKILL.md)
* **Scope**: Safeguards against unsafe deserializers, YAML exploit tags, ASCII smuggling, and zero-width prompt injection.
* **Core Invariants**: Safe parsers only (`yaml.safe_load`, schema-validated JSON), strict structural schemas, and sanitization of Unicode tag characters (`U+E0000`-`U+E007F`).

### 2.6 AST05: Untrusted External Instructions & Indirect Prompt Injection
* **Skill**: [`owasp-ast05-untrusted-instruction-defense`](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/owasp-ast05-untrusted-instruction-defense/SKILL.md)
* **Scope**: Protects applications and AI models from prompt injection via fetched remote docs, issue tickets, and web pages.
* **Core Invariants**: Content hashing (`sha256:`) for pinned external references, domain egress allowlists, and context isolation delimiters.

### 2.7 AST06: Sandboxing & Runtime Isolation
* **Skill**: [`owasp-ast06-sandboxing-runtime-isolation`](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/owasp-ast06-sandboxing-runtime-isolation/SKILL.md)
* **Scope**: OS-level containerization, filesystem jailbreak defense, and local control interface security.
* **Core Invariants**: Binding local servers strictly to `127.0.0.1` (never `0.0.0.0`), DNS rebinding mitigation via Host/Origin verification, and mandatory session token authentication for all local endpoints.

### 2.8 AST07: Update Drift & Runtime Immutability
* **Skill**: [`owasp-ast07-update-drift-management`](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/owasp-ast07-update-drift-management/SKILL.md)
* **Scope**: Mitigates silent runtime modifications, unverified automatic updates, and production hot-reloading risks.
* **Core Invariants**: Explicit version lockfiles, ban on runtime auto-updaters without hash validation, and immutable execution containers.

### 2.9 AST08: Multi-Layer Security Scanning
* **Skill**: [`owasp-ast08-multi-layer-security-scanning`](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/owasp-ast08-multi-layer-security-scanning/SKILL.md)
* **Scope**: Automated static analysis, secrets detection, and AST-aware pattern scanning across code and instructions.
* **Core Invariants**: Pre-commit scanner gates (Gitleaks, Semgrep, Trivy, cargo-audit), and zero-tolerance policy for committed credentials.

### 2.10 AST09: Security Governance & Audit Logging
* **Skill**: [`owasp-ast09-governance-audit-logging`](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/owasp-ast09-governance-audit-logging/SKILL.md)
* **Scope**: Enterprise risk tier classification (L0-L3), tamper-evident audit logging, and Non-Human Identity management.
* **Core Invariants**: Capability-based risk categorization, cryptographic hash chaining for audit logs, and ephemeral, short-lived NHI tokens.

### 2.11 AST10: Cross-Platform Security Preservation
* **Skill**: [`owasp-ast10-cross-platform-security`](file:///C:/Users/0.USS-OPPENHEIMER/.gemini/config/skills/owasp-ast10-cross-platform-security/SKILL.md)
* **Scope**: Preserves security guarantees across operating systems (Windows, macOS, Linux) and AI runtimes (Antigravity, Claude Code, Cursor).
* **Core Invariants**: Universal Skill Format compliance, platform-neutral path normalization, case-insensitivity handling, and defense against Windows-specific file path quirks.
