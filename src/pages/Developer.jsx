import { Link } from 'react-router-dom';
import Section from '../components/Section';
import Card from '../components/Card';
import Label from '../components/Label';
import SchemaRegistry from '../components/SchemaRegistry';

export default function Developer() {
  return (
    <>
      <p><Link to="/" className="link-btn">[&larr; Home]</Link></p>

      <pre className="ascii">{`
####  ##### #   #
#   # #     #   #
#   # ###   #   #
#   # #      # #
####  #####   #`.trim()}</pre>

      <h1 className="tagline">Developer Guide</h1>

      <p>FoldDB is a personal database that uses AI to automatically organize your data. Drop in files, JSON, or social media exports &mdash; FoldDB detects schemas, extracts searchable keywords, and lets you query with natural language.</p>

      <p className="dim">----------------------------------------------------------------------------------------------------------------------------------------</p>

      {/* QUICK START */}
      <Section variant="amber">
        <h2 id="quickstart"><span className="bold">QUICK START</span> <span className="dim">Up and running in 5 minutes</span></h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1em', margin: '1em 0' }}>
          <Card><p><Label color="yellow">1. INSTALL</Label></p>
            <pre>curl -fsSL https://raw.githubusercontent.com/shiba4life/fold_db/master/install.sh | sh</pre>
            <p className="dim">Auto-detects macOS (Apple Silicon / Intel) and Linux x86_64</p>
            <p>Or from source:</p>
            <pre>cargo install --git https://github.com/shiba4life/fold_db.git --bin folddb</pre></Card>

          <Card><p><Label color="yellow">2. CONFIGURE</Label></p>
            <pre>export FOLD_OPENROUTER_API_KEY=&quot;sk-...&quot;</pre>
            <p className="dim">Required for AI-powered ingestion and natural language queries</p></Card>

          <Card><p><Label color="yellow">3. RUN</Label></p>
            <pre>./run.sh --local</pre>
            <p className="dim">Web UI at localhost:5173 &middot; Backend API at localhost:9001</p>
            <pre>{'./run.sh --local --local-schema  # Fully offline\n./run.sh --local --empty-db      # Fresh database\n./run.sh --local --dev           # Dev schema service'}</pre></Card>

          <Card><p><Label color="yellow">4. INGEST SAMPLE DATA</Label></p>
            <pre>{`curl -s -X POST http://localhost:9001/api/ingestion/process \\
  -H "Content-Type: application/json" \\
  -d '{
    "data": {
      "name": "John Doe",
      "email": "john@example.com",
      "role": "engineer",
      "joined": "2024-03-15"
    }
  }' | jq .`}</pre>
            <p className="dim">AI detects the schema, creates it if needed, writes the data, and indexes keywords</p></Card>

          <Card><p><Label color="yellow">5. QUERY IT BACK</Label></p>
            <pre>{`curl -s -X POST http://localhost:9001/api/query \\
  -H "Content-Type: application/json" \\
  -d '{
    "schema_name": "person_profile",
    "fields": ["name", "email", "role"]
  }' | jq .`}</pre>
            <p className="dim">Use the schema name from step 4&rsquo;s response</p></Card>

          <Card><p><Label color="yellow">6. SEARCH THE INDEX</Label></p>
            <pre>curl -s &quot;http://localhost:9001/api/native-index/search?term=john&quot; | jq .</pre>
            <p className="dim">Returns all indexed entries matching the search term</p></Card>
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section variant="slate">
        <h2 id="architecture"><span className="bold">HOW IT WORKS</span> <span className="dim">The ingestion-to-query pipeline</span></h2>

        <pre className="compare-table">{`
Files / JSON / APIs
       |
       v
  AI Ingestion -----> Schema Service (detects or creates schema)
       |
       v
  Mutation ----------> Storage (Sled local or DynamoDB cloud)
       |
       v
  Keyword Indexing --> AI extracts and normalizes searchable terms
       |
       v
  Query -------------> Natural language or structured field queries`}</pre>

        <div className="grid-3">
          <Card><p><Label color="blue">INGEST</Label></p><p>
            Send data in any format. AI analyzes the structure and maps it to a schema automatically.</p></Card>

          <Card><p><Label color="blue">SCHEMA</Label></p><p>
            The global schema service at <a href="https://schema.folddb.com" target="_blank" rel="noreferrer">schema.folddb.com</a> checks for existing compatible schemas or creates new ones.</p></Card>

          <Card><p><Label color="blue">STORE</Label></p><p>
            Data is written as mutations with AES-256-GCM encryption at rest. Local keys or AWS KMS.</p></Card>

          <Card><p><Label color="blue">INDEX</Label></p><p>
            AI extracts keywords and normalizes terms (dates, names, etc.) for search.</p></Card>

          <Card><p><Label color="blue">QUERY</Label></p><p>
            Search with natural language or structured field queries. Schema-aware planning for efficient retrieval.</p></Card>

          <Card><p><Label color="blue">PERMISSIONS</Label></p><p>
            Trust-based access control at the field level. Multi-tenant isolation enforced at the storage layer.</p></Card>
        </div>
      </Section>

      {/* CODE EXAMPLES */}
      <Section variant="rose">
        <h2 id="code"><span className="bold">CODE EXAMPLES</span> <span className="dim">HTTP API &amp; TypeScript</span></h2>

        <p>Most integrations use the HTTP API at <span className="bold">localhost:9001</span>. All endpoints accept and return JSON.</p>
        <p className="dim">Rust library API is also available for embedded use &mdash; see <a href="https://github.com/shiba4life/fold_db" target="_blank" rel="noreferrer">the source on GitHub</a>.</p>

        <div className="grid-2">
          <Card>
            <p><Label color="red">HTTP &mdash; INGEST JSON</Label></p>
            <pre>{`curl -X POST http://localhost:9001/api/ingestion/process \\
  -H "Content-Type: application/json" \\
  -d '{
    "data": {
      "title": "Quarterly Report",
      "content": "Revenue grew 15% in Q3...",
      "author": "Jane Smith",
      "date": "2024-09-30"
    }
  }'`}</pre>
            <p className="dim">AI determines schema, writes data, and indexes keywords in one call</p>
          </Card>

          <Card>
            <p><Label color="red">HTTP &mdash; QUERY DATA</Label></p>
            <pre>{`curl -X POST http://localhost:9001/api/query \\
  -H "Content-Type: application/json" \\
  -d '{
    "schema_name": "quarterly_report",
    "fields": ["title", "content", "author"]
  }'`}</pre>
            <p className="dim">Structured query &mdash; returns all matching molecules</p>
          </Card>

          <Card>
            <p><Label color="red">HTTP &mdash; NATURAL LANGUAGE</Label></p>
            <pre>{`curl -X POST http://localhost:9001/api/llm-query/agent \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "What reports did Jane write?"
  }'`}</pre>
            <p className="dim">AI agent plans and executes queries across all schemas</p>
          </Card>

          <Card>
            <p><Label color="red">HTTP &mdash; SEARCH INDEX</Label></p>
            <pre>curl &quot;http://localhost:9001/api/native-index/search?term=revenue&quot;</pre>
            <p className="dim">Fast keyword search across all indexed data</p>
          </Card>

          <Card>
            <p><Label color="red">HTTP &mdash; UPLOAD FILE</Label></p>
            <pre>{`curl -X POST http://localhost:9001/api/ingestion/upload \\
  -F "file=@report.pdf"`}</pre>
            <p className="dim">Upload any file &mdash; AI extracts content, converts to JSON, and ingests</p>
          </Card>

          <Card>
            <p><Label color="red">TYPESCRIPT &mdash; FRONTEND CLIENTS</Label></p>
            <pre>{`import {
  schemaClient,
  securityClient,
  systemClient
} from "../api/clients";

// Schema operations with automatic caching
const response = await schemaClient.getSchemas();
if (response.success) {
  const schemas = response.data; // Fully typed
}

// System monitoring with 30-second cache
const status = await systemClient.getSystemStatus();`}</pre>
            <p className="dim">Available clients: SchemaClient &middot; SecurityClient &middot; SystemClient &middot; TransformClient &middot; IngestionClient &middot; MutationClient</p>
          </Card>
        </div>
      </Section>

      {/* REST API REFERENCE */}
      <Section variant="lavender">
        <h2 id="api"><span className="bold">REST API REFERENCE</span> <span className="dim">All endpoints at localhost:9001</span></h2>

        <p>Full OpenAPI spec available at <a href="http://localhost:9001/api/openapi.json" target="_blank" rel="noreferrer">localhost:9001/api/openapi.json</a> when the server is running.</p>

        <div className="grid-2">
          <Card>
            <p><Label color="purple">SCHEMAS</Label></p>
            <pre className="compare-table">{`GET  /api/schemas                    List all schemas
GET  /api/schema/{name}              Get schema by name
GET  /api/schema/{name}/keys         List keys (paginated)
POST /api/schemas/load               Load from schema dirs
POST /api/schema/{name}/approve      Approve a schema
POST /api/schema/{name}/block        Block a schema
GET  /api/backfill/{hash}            Get backfill status`}</pre>
          </Card>

          <Card>
            <p><Label color="purple">INGESTION</Label></p>
            <pre className="compare-table">{`POST /api/ingestion/process          Ingest JSON data
POST /api/ingestion/upload           Upload a file
POST /api/ingestion/validate         Validate without ingesting
POST /api/ingestion/batch-folder     Batch ingest a folder
GET  /api/ingestion/status           Ingestion status
GET  /api/ingestion/config           Get ingestion config
POST /api/ingestion/config           Save ingestion config
GET  /api/ingestion/progress         All active progress
GET  /api/ingestion/progress/{id}    Progress by ID`}</pre>
          </Card>

          <Card>
            <p><Label color="purple">SMART FOLDER</Label></p>
            <pre className="compare-table">{`POST /api/ingestion/smart-folder/scan
                                     AI-classify files
POST /api/ingestion/smart-folder/ingest
                                     Ingest recommended
POST /api/ingestion/smart-folder/resume
                                     Resume a batch
POST /api/ingestion/smart-folder/cancel
                                     Cancel a batch
GET  /api/ingestion/batch/{batch_id}
                                     Batch status`}</pre>
          </Card>

          <Card>
            <p><Label color="purple">QUERY &amp; MUTATION</Label></p>
            <pre className="compare-table">{`POST /api/query                      Execute a query
POST /api/mutation                   Execute a mutation
POST /api/mutations/batch            Batch mutations
GET  /api/native-index/search        Keyword search (?term=)
GET  /api/indexing/status            Indexing status`}</pre>
          </Card>

          <Card>
            <p><Label color="purple">LLM QUERY</Label></p>
            <pre className="compare-table">{`POST /api/llm-query/agent            Agent-based NL query
POST /api/llm-query/analyze          Analyze a query
POST /api/llm-query/execute          Execute a query plan
POST /api/llm-query/chat             Chat endpoint
POST /api/llm-query/analyze-followup Follow-up analysis
GET  /api/llm-query/backfill/{hash}  Backfill status`}</pre>
          </Card>

          <Card>
            <p><Label color="purple">SYSTEM</Label></p>
            <pre className="compare-table">{`GET  /api/system/status              System health
GET  /api/system/public-key          Node public key
GET  /api/system/private-key         Node private key
GET  /api/system/database-config     Database config
POST /api/system/database-config     Update DB config
POST /api/system/reset-database      Reset database
POST /api/system/setup               Apply setup
POST /api/system/complete-path       Path completion
GET  /api/system/auto-identity       Auto-gen identity
GET  /api/openapi.json               OpenAPI spec`}</pre>
          </Card>
        </div>
      </Section>

      {/* CLI REFERENCE */}
      <Section variant="sage">
        <h2 id="cli"><span className="bold">CLI REFERENCE</span> <span className="dim">folddb command line</span></h2>

        <div className="grid-2">
          <Card>
            <p><Label color="green">STATUS &amp; SCHEMAS</Label></p>
            <pre>{`folddb status                          # Node health + config
folddb schema list                     # List all schemas
folddb schema get my_schema            # Inspect a schema
folddb schema approve my_schema        # Approve pending
folddb schema block my_schema          # Block a schema
folddb schema load                     # Load from schema dirs`}</pre>
          </Card>

          <Card>
            <p><Label color="green">INGEST</Label></p>
            <pre>{`folddb ingest file data.json           # Ingest a JSON file
folddb ingest file < data.json         # Ingest from stdin
folddb ingest smart-scan ~/Documents   # AI-classify files
folddb ingest smart ~/Documents --all  # Scan + ingest all
folddb ingest smart ~/Documents \\
  --files a.json,b.csv                 # Ingest specific files`}</pre>
          </Card>

          <Card>
            <p><Label color="green">QUERY &amp; SEARCH</Label></p>
            <pre>{`folddb query tweets --fields text,author
                                       # Structured query
folddb search "machine learning"       # Keyword search
folddb ask "recent purchases over $50"
                                       # Natural language (AI)`}</pre>
          </Card>

          <Card>
            <p><Label color="green">MUTATE</Label></p>
            <pre>{`folddb mutate run tweets \\
  --type create \\
  --fields '{"text":"hello"}'          # Single mutation
folddb mutate batch mutations.json     # Batch from file`}</pre>
          </Card>

          <Card>
            <p><Label color="green">SYSTEM</Label></p>
            <pre>{`folddb config show                     # Show config
folddb config path                     # Config file path
folddb reset --confirm                 # Reset database
folddb transform list                  # List transforms
folddb backfill stats                  # Backfill stats
folddb completions bash                # Shell completions`}</pre>
          </Card>

          <Card>
            <p><Label color="green">GLOBAL FLAGS</Label></p>
            <pre>{`folddb --json <command>                # JSON output
folddb -v <command>                    # Verbose output
folddb --config path/to/config.toml <command>
folddb --user-hash abc123 <command>
folddb --data-path /tmp/mydb <command>
folddb --schema-service-url http://... <command>`}</pre>
          </Card>
        </div>
      </Section>

      {/* CONFIGURATION */}
      <Section variant="amber">
        <h2 id="config"><span className="bold">CONFIGURATION</span> <span className="dim">Environment variables</span></h2>

        <pre className="compare-table">{`
VARIABLE                         PURPOSE
${'─'.repeat(65)}
FOLD_OPENROUTER_API_KEY          API key for AI ingestion
FOLD_SCHEMA_SERVICE_URL          Schema service (default: schema.folddb.com)
FOLD_CONFIG                      Path to config file
FOLD_LOG_LEVEL                   trace | debug | info | warn | error
FOLD_STORAGE_MODE                Storage backend ("s3" for cloud)
FOLD_S3_BUCKET                   S3 bucket for database storage
FOLD_S3_REGION                   AWS region for S3
FOLD_UPLOAD_STORAGE_MODE         Upload storage ("s3" for cloud)`}</pre>
      </Section>

      {/* SCHEMA REGISTRY */}
      <Section variant="lavender">
        <h2 id="schemas"><span className="bold">SCHEMA REGISTRY</span> <span className="dim">Live from schema.folddb.com</span></h2>

        <p>Browse the global schema registry. Schemas define data structure and permissions for interoperability across nodes. During ingestion, AI checks this registry for compatible schemas before creating new ones.</p>

        <SchemaRegistry />
      </Section>

      {/* CONTRIBUTING / DEV SETUP */}
      <Section variant="sage">
        <h2 id="contributing"><span className="bold">CONTRIBUTING</span> <span className="dim">Developer setup</span></h2>

        <div className="grid-2">
          <Card>
            <p><Label color="green">LOCAL DEVELOPMENT</Label></p>
            <pre>{`git clone https://github.com/shiba4life/fold_db
cd fold_db
./run.sh --local                       # Backend + React UI`}</pre>
            <p className="dim">Always use run.sh &mdash; never start services manually</p>
          </Card>

          <Card>
            <p><Label color="green">TESTING</Label></p>
            <pre>{`cargo test --lib                       # Rust unit tests
cargo test --bin folddb                 # CLI integration tests
cargo clippy                           # Lint (zero warnings)
cd src/server/static-react
npm test                               # Frontend tests
npm run lint                           # ESLint`}</pre>
          </Card>
        </div>
      </Section>

      {/* DOCUMENTATION LINKS */}
      <Section variant="slate">
        <h2 id="docs"><span className="bold">DOCUMENTATION</span> <span className="dim">Deeper reading</span></h2>

        <div className="grid-2">
          <Card><p><Label color="blue">API REFERENCE</Label></p><p>
            Rust source code and API on <a href="https://github.com/shiba4life/fold_db" target="_blank" rel="noreferrer">GitHub</a></p></Card>

          <Card><p><Label color="blue">INGESTION GUIDE</Label></p><p>
            AI-powered data ingestion &mdash; <a href="https://github.com/shiba4life/fold_db/blob/mainline/INGESTION_README.md" target="_blank" rel="noreferrer">INGESTION_README.md</a></p></Card>

          <Card><p><Label color="blue">AI QUERY GUIDE</Label></p><p>
            Natural language queries &mdash; <a href="https://github.com/shiba4life/fold_db/blob/mainline/docs/AI_QUERY_USAGE_GUIDE.md" target="_blank" rel="noreferrer">AI_QUERY_USAGE_GUIDE.md</a></p></Card>

          <Card><p><Label color="blue">ARCHITECTURE</Label></p><p>
            System design and patterns &mdash; <a href="https://github.com/shiba4life/fold_db/blob/mainline/docs/Unified_Architecture.md" target="_blank" rel="noreferrer">Unified_Architecture.md</a></p></Card>
        </div>
      </Section>

      <p className="dim">----------------------------------------------------------------------------------------------------------------------------------------</p>
    </>
  );
}
