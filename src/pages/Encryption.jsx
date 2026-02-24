import { Link } from 'react-router-dom';
import Section from '../components/Section';
import Card from '../components/Card';
import Label from '../components/Label';

export default function Encryption() {
  return (
    <>
      <p><Link to="/" className="link-btn">[&larr; Home]</Link></p>

      <pre className="ascii">{`
##### ##### #####
#         # #
###     ##  ###
#     #     #
##### ##### #####`.trim()}</pre>

      <h1 className="tagline">E2E Encryption</h1>

      <p>Your data encrypted before it leaves your device. The Exemem cloud stores only ciphertext &mdash; we can&rsquo;t read your data, and neither can anyone else.</p>

      <p className="dim">----------------------------------------------------------------------------------------------------------------------------------------</p>

      {/* THE PROMISE */}
      <Section variant="sage">
        <h2 id="promise"><span className="bold">THE PROMISE</span> <span className="dim">Zero-knowledge by design</span></h2>

        <p>End-to-end encryption means the server <span className="bold">never sees plaintext</span>. Your data is encrypted on your device before upload, and decrypted on your device after download. The cloud stores opaque ciphertext.</p>

        <div className="grid-3">
          <Card><p><Label color="green">CLIENT-SIDE ENCRYPTION</Label></p><p>
            All encryption and decryption happens in your browser or native app. Keys never leave your device. The server receives only ciphertext.</p></Card>

          <Card><p><Label color="green">PASSKEY IS THE ONLY KEY</Label></p><p>
            Your passkey generates a deterministic secret via the PRF extension. No passwords to remember, no recovery codes to lose. Same passkey = same encryption key on any device.</p></Card>

          <Card><p><Label color="green">WORKS ACROSS DEVICES</Label></p><p>
            Passkeys sync via iCloud Keychain, Google Password Manager, or 1Password. Authenticate on any synced device and your encryption key is derived automatically.</p></Card>
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section variant="slate">
        <h2 id="how-it-works"><span className="bold">HOW IT WORKS</span> <span className="dim">Write, read, and search paths</span></h2>

        <pre className="compare-table">{`
`}<span className="dim">WRITE PATH</span>{`

  Client (plaintext)
       |
       v
  Compute atom UUID from plaintext (SHA256)
       |
       v
  Encrypt content: AES-256-GCM(encryption_key, nonce, json)
       |
       v
  Extract keywords from plaintext (AI)
       |
       v
  Blind each keyword: HMAC-SHA256(index_key, keyword)
       |
       v
  Upload: ciphertext + blind tokens --> Exemem Cloud (opaque bytes)


`}<span className="dim">READ PATH</span>{`

  Client requests record by key
       |
       v
  Exemem Cloud returns ciphertext
       |
       v
  Decrypt: AES-256-GCM(encryption_key, ciphertext) --> plaintext JSON


`}<span className="dim">SEARCH PATH</span>{`

  User searches for "developer"
       |
       v
  Client computes: blind_token = HMAC-SHA256(index_key, "developer")
       |
       v
  Server matches blind tokens (exact match, no plaintext needed)
       |
       v
  Returns matching record references
       |
       v
  Client fetches and decrypts matching records locally`}</pre>

        <div className="grid-3">
          <Card><p><Label color="blue">WRITE</Label></p><p>
            Content is encrypted with AES-256-GCM before upload. Keywords are blinded with HMAC-SHA256. The server stores ciphertext and blind tokens &mdash; never plaintext.</p></Card>

          <Card><p><Label color="blue">READ</Label></p><p>
            The server returns raw ciphertext. Your client decrypts locally using the encryption key derived from your passkey. Plaintext never exists on the server.</p></Card>

          <Card><p><Label color="blue">SEARCH</Label></p><p>
            Search terms are blinded client-side before querying. The server matches blind tokens without knowing what you searched for. Results are decrypted locally.</p></Card>
        </div>
      </Section>

      {/* KEY MANAGEMENT */}
      <Section variant="amber">
        <h2 id="keys"><span className="bold">KEY MANAGEMENT</span> <span className="dim">Passkey PRF &amp; HKDF derivation</span></h2>

        <pre className="compare-table">{`
  User authenticates with passkey
       |
       v
  PRF Extension (salt = "fold:e2e:v1")
       |
       v
  Deterministic 32-byte secret
  (same passkey + salt = same secret on any device)
       |
       v
  HKDF-SHA256 expands to two keys:
       |
       +-- info="fold:content-key" --> Encryption Key (AES-256-GCM)
       |
       +-- info="fold:index-key"   --> Index Key (HMAC-SHA256)`}</pre>

        <div className="grid-2">
          <Card><p><Label color="yellow">FIRST-TIME SETUP</Label></p>
            <p>1. User registers a passkey with PRF support<br />
              2. PRF extension generates a deterministic 32-byte secret<br />
              3. HKDF derives encryption key + index key<br />
              4. Keys held in memory &mdash; never persisted to disk or server</p></Card>

          <Card><p><Label color="yellow">RETURNING USER (ANY DEVICE)</Label></p>
            <p>1. Authenticate with synced passkey<br />
              2. PRF produces the same 32-byte secret<br />
              3. HKDF derives the same encryption + index keys<br />
              4. All previously encrypted data is immediately accessible</p></Card>
        </div>

        <p style={{ marginTop: '1em' }}><span className="bold">WHERE KEYS LIVE</span></p>

        <pre className="compare-table"><span className="dim">CONTEXT          SOURCE                   LIFETIME                 STORAGE</span>{'\n'}<span className="dim">{'─'.repeat(79)}</span>{'\n'}Browser          Passkey PRF at login      In-memory until tab close     None{'\n'}Native app       Passkey PRF at login      In-memory until app close     None{'\n'}CLI (headless)   Passkey PRF or key file   In-memory until exit          ~/.fold_db/e2e.key (fallback)</pre>

        <p style={{ marginTop: '1em' }}><span className="bold">BROWSER SUPPORT</span></p>

        <pre className="compare-table"><span className="dim">BROWSER              PRF SUPPORT     NOTES</span>{'\n'}<span className="dim">{'─'.repeat(79)}</span>{'\n'}Chrome / Edge        116+            Full support via WebAuthn PRF extension{'\n'}Safari               18+             Full support{'\n'}Firefox              Not yet         Use CLI key file as fallback</pre>
      </Section>

      {/* WHAT'S ENCRYPTED */}
      <Section variant="rose">
        <h2 id="scope"><span className="bold">WHAT&rsquo;S ENCRYPTED</span> <span className="dim">Encrypted vs plaintext by design</span></h2>

        <div className="grid-2">
          <Card><p><Label color="red">ENCRYPTED (OPAQUE TO SERVER)</Label></p>
            <p><span className="bold">Atom content</span> &mdash; All user data values stored in DynamoDB<br />
              AES-256-GCM with random nonce per atom</p>
            <p><span className="bold">Index keywords</span> &mdash; Search terms in the native index<br />
              HMAC-SHA256 blind tokens (deterministic for exact match)</p>
            <p><span className="bold">S3 file uploads</span> &mdash; Binary files stored in S3<br />
              Chunked AES-256-GCM (encrypt before upload)</p></Card>

          <Card><p><Label color="red">PLAINTEXT (STRUCTURAL METADATA)</Label></p>
            <p><span className="bold">Schema names</span> &mdash; e.g. &ldquo;person_profile&rdquo;, &ldquo;medical_record&rdquo;<br />
              <span className="dim">Required for schema routing and validation</span></p>
            <p><span className="bold">Field names</span> &mdash; e.g. &ldquo;name&rdquo;, &ldquo;email&rdquo;, &ldquo;diagnosis&rdquo;<br />
              <span className="dim">Required for structured queries and schema enforcement</span></p>
            <p><span className="bold">Storage keys</span> &mdash; e.g. &ldquo;atom:uuid&rdquo;, &ldquo;ref:mol_uuid&rdquo;<br />
              <span className="dim">Required for key-value lookups and data retrieval</span></p>
            <p><span className="bold">Timestamps &amp; UUIDs</span> &mdash; Record metadata<br />
              <span className="dim">Required for ordering, deduplication, and versioning</span></p></Card>
        </div>

        <p className="dim">Structural metadata is intentionally plaintext &mdash; it enables schema validation, query routing, and deduplication without exposing user data content.</p>
      </Section>

      {/* CODE EXAMPLES */}
      <Section variant="lavender">
        <h2 id="code"><span className="bold">CODE EXAMPLES</span> <span className="dim">Web Crypto API</span></h2>

        <p>These examples show the core cryptographic operations using the browser&rsquo;s Web Crypto API.</p>

        <div className="grid-2">
          <Card>
            <p><Label color="purple">1. PASSKEY PRF LOGIN</Label></p>
            <pre>{`// Request passkey with PRF extension
const assertion = await navigator.credentials.get({
  publicKey: {
    ...options,
    extensions: {
      prf: {
        eval: {
          first: new TextEncoder()
            .encode("fold:e2e:v1")
        }
      }
    }
  }
});

// Extract the deterministic secret
const prf = assertion
  .getClientExtensionResults().prf;
const secret = new Uint8Array(
  prf.results.first
);`}</pre>
            <p className="dim">The PRF extension returns a deterministic 32-byte secret tied to the passkey and salt</p>
          </Card>

          <Card>
            <p><Label color="purple">2. DERIVE ENCRYPTION KEYS</Label></p>
            <pre>{`const enc = (s) => new TextEncoder().encode(s);

// Import PRF secret as HKDF base key
const baseKey = await crypto.subtle.importKey(
  "raw", secret, "HKDF", false, ["deriveKey"]
);

// Derive AES-256-GCM encryption key
const encryptionKey = await crypto.subtle
  .deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: enc("fold:e2e:v1"),
      info: enc("fold:content-key")
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );

// Derive HMAC key for search blinding
const indexKey = await crypto.subtle
  .deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: enc("fold:e2e:v1"),
      info: enc("fold:index-key")
    },
    baseKey,
    { name: "HMAC", hash: "SHA-256", length: 256 },
    false,
    ["sign"]
  );`}</pre>
          </Card>

          <Card>
            <p><Label color="purple">3. ENCRYPT / DECRYPT ATOM</Label></p>
            <pre>{`async function encryptAtom(key, data) {
  const plaintext = new TextEncoder()
    .encode(JSON.stringify(data));
  const nonce = crypto.getRandomValues(
    new Uint8Array(12)
  );
  const ciphertext = await crypto.subtle
    .encrypt(
      { name: "AES-GCM", iv: nonce },
      key,
      plaintext
    );
  // Prepend nonce to ciphertext
  const out = new Uint8Array(
    12 + ciphertext.byteLength
  );
  out.set(nonce);
  out.set(new Uint8Array(ciphertext), 12);
  return out;
}

async function decryptAtom(key, encrypted) {
  const nonce = encrypted.slice(0, 12);
  const ciphertext = encrypted.slice(12);
  const plaintext = await crypto.subtle
    .decrypt(
      { name: "AES-GCM", iv: nonce },
      key,
      ciphertext
    );
  return JSON.parse(
    new TextDecoder().decode(plaintext)
  );
}`}</pre>
          </Card>

          <Card>
            <p><Label color="purple">4. BLIND SEARCH TOKEN</Label></p>
            <pre>{`async function blindToken(indexKey, term) {
  const data = new TextEncoder().encode(term);
  const sig = await crypto.subtle.sign(
    "HMAC", indexKey, data
  );
  // Use first 16 bytes, base64url encode
  const bytes = new Uint8Array(sig).slice(0, 16);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\\+/g, "-")
    .replace(/\\//g, "_")
    .replace(/=+$/, "");
}

// Search for "developer" without revealing
// the search term to the server:
const token = await blindToken(
  indexKey, "developer"
);
const results = await fetch(
  \`/api/native-index/search?term=\${token}\`
);
// Server matches blind tokens, returns
// record references. Client decrypts locally.`}</pre>
          </Card>
        </div>
      </Section>

      {/* SDK QUICK START */}
      <Section variant="sage">
        <h2 id="sdk"><span className="bold">SDK QUICK START</span> <span className="dim">Transparent encryption for developers</span></h2>

        <p>The Exemem SDKs handle encryption transparently. You write normal ingest/query code &mdash; the SDK encrypts on write and decrypts on read.</p>

        <div className="grid-2">
          <Card>
            <p><Label color="green">JAVASCRIPT SDK</Label></p>
            <pre>{`import { ExememClient } from "@exemem/sdk";

// Initialize with passkey-derived secret
const client = await ExememClient.create({
  apiUrl: "https://api.exemem.com",
  // PRF secret from passkey login
  e2eSecret: prfSecret,
});

// Ingest — encrypted automatically
await client.ingest({
  data: {
    name: "John Doe",
    email: "john@example.com",
    role: "engineer",
  },
});

// Query — decrypted automatically
const results = await client.query({
  schema: "person_profile",
  fields: ["name", "email", "role"],
});
// results contain plaintext

// Search — blinded automatically
const hits = await client.search("engineer");
// search term blinded before sending`}</pre>
          </Card>

          <Card>
            <p><Label color="green">PYTHON SDK</Label></p>
            <pre>{`from exemem import ExememClient

# Initialize with passkey-derived secret
client = ExememClient(
    api_url="https://api.exemem.com",
    e2e_secret=prf_secret,  # bytes
)

# Ingest — encrypted automatically
client.ingest(data={
    "name": "John Doe",
    "email": "john@example.com",
    "role": "engineer",
})

# Query — decrypted automatically
results = client.query(
    schema="person_profile",
    fields=["name", "email", "role"],
)
# results contain plaintext

# Search — blinded automatically
hits = client.search("engineer")
# search term blinded before sending`}</pre>
          </Card>
        </div>

        <p className="dim">The SDK wraps the Web Crypto / Python cryptography operations shown above. You never handle keys or ciphertext directly.</p>
      </Section>

      {/* LIMITATIONS */}
      <Section variant="slate">
        <h2 id="limitations"><span className="bold">LIMITATIONS</span> <span className="dim">Known trade-offs</span></h2>

        <div className="grid-2">
          <Card><p><Label color="blue">EXACT-MATCH SEARCH ONLY</Label></p><p>
            HMAC is deterministic but not order-preserving. Search works for exact keyword matches only &mdash; no prefix, substring, or fuzzy search on encrypted tokens. Workaround: client-side filtering after decryption, or AI-mediated search.</p></Card>

          <Card><p><Label color="blue">LLM DECRYPTS TRANSIENTLY</Label></p><p>
            AI-powered natural language queries require plaintext. Content is decrypted in memory on the client, sent to the LLM for processing, then discarded. The LLM does not persist your data.</p></Card>

          <Card><p><Label color="blue">PASSKEY PRF BROWSER SUPPORT</Label></p><p>
            PRF requires Chrome 116+, Safari 18+, or Edge 116+. Firefox does not yet support PRF. Fallback: CLI key file at <span className="bold">~/.fold_db/e2e.key</span> for headless environments.</p></Card>

          <Card><p><Label color="blue">NO KEY ROTATION WITHOUT RE-INDEX</Label></p><p>
            Changing your passkey invalidates all existing blind tokens in the index. A full re-encryption and index rebuild is required. Key rotation is supported but expensive.</p></Card>
        </div>
      </Section>

      {/* DOCUMENTATION */}
      <Section variant="amber">
        <h2 id="docs"><span className="bold">DOCUMENTATION</span> <span className="dim">Deeper reading</span></h2>

        <div className="grid-3">
          <Card><p><Label color="yellow">DESIGN DOC</Label></p><p>
            Full encryption architecture, threat model, and implementation plan.<br />
            <a href="https://github.com/shiba4life/fold_db/blob/mainline/docs/DESIGN_E2E_ENCRYPTION.md" target="_blank" rel="noreferrer">DESIGN_E2E_ENCRYPTION.md</a></p></Card>

          <Card><p><Label color="yellow">CLIENT DESIGN</Label></p><p>
            Exemem client architecture, ExememApiStore, and storage API mapping.<br />
            <a href="https://github.com/shiba4life/fold_db/blob/mainline/docs/exemem_e2e_client.md" target="_blank" rel="noreferrer">exemem_e2e_client.md</a></p></Card>

          <Card><p><Label color="yellow">SOURCE CODE</Label></p><p>
            FoldDB is open source. Browse the code, file issues, or contribute.<br />
            <a href="https://github.com/shiba4life/fold_db" target="_blank" rel="noreferrer">github.com/shiba4life/fold_db</a></p></Card>
        </div>
      </Section>

      <p className="dim">----------------------------------------------------------------------------------------------------------------------------------------</p>
    </>
  );
}
