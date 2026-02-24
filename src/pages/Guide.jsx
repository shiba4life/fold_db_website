import { Link } from 'react-router-dom';
import Section from '../components/Section';
import Card from '../components/Card';
import Label from '../components/Label';

export default function Guide() {
  return (
    <>
      <pre className="ascii">{`
 ###  #   # ### ####  #####
#     #   #  #  #   # #
#  ## #   #  #  #   # ###
#   # #   #  #  #   # #
 ###   ###  ### ####  #####`.trim()}</pre>

      <h1 className="tagline">User Guide</h1>

      <p>Get FoldDB running on your machine in minutes. No developer tools required &mdash; just install, launch, and start organizing your data with AI.</p>

      <p className="dim">----------------------------------------------------------------------------------------------------------------------------------------</p>

      {/* INSTALL */}
      <Section variant="sage">
        <h2 id="install"><span className="bold">INSTALL</span> <span className="dim">Choose your platform</span></h2>

        <div className="grid-2">
          <Card><p><Label color="green">macOS APP</Label></p>
            <p>Download the <span className="bold">.dmg</span> from GitHub releases. Open the file and drag FoldDB to your Applications folder.</p>
            <pre><a href="https://github.com/shiba4life/fold_db/releases" target="_blank" rel="noreferrer">github.com/shiba4life/fold_db/releases</a></pre>
            <p className="dim">Available for Apple Silicon and Intel Macs</p></Card>

          <Card><p><Label color="green">HOMEBREW</Label></p>
            <pre>brew install shiba4life/tap/folddb</pre>
            <p className="dim">Installs folddb and folddb_server binaries</p></Card>

          <Card><p><Label color="green">CURL INSTALL SCRIPT</Label></p>
            <pre>curl -fsSL https://raw.githubusercontent.com/shiba4life/fold_db/master/install.sh | sh</pre>
            <p className="dim">Auto-detects macOS (Apple Silicon / Intel) and Linux x86_64</p></Card>

          <Card><p><Label color="green">BUILD FROM SOURCE</Label></p>
            <p>Need full control? Clone the repo and build with Cargo.</p>
            <p>See the <Link to="/developer#quickstart">Developer Guide</Link> for build instructions.</p></Card>
        </div>
      </Section>

      {/* RUN */}
      <Section variant="slate">
        <h2 id="run"><span className="bold">RUN</span> <span className="dim">Launch FoldDB</span></h2>

        <Card style={{ maxWidth: '80ch' }}>
          <p><Label color="blue">START THE SERVER</Label></p>
          <pre>folddb_server</pre>
          <p>Then open your browser to:</p>
          <pre><a href="http://localhost:9001" target="_blank" rel="noreferrer">http://localhost:9001</a></pre>
          <p>The FoldDB web UI loads automatically. No additional setup needed &mdash; the server is zero-config.</p>
        </Card>

        <p className="dim">If you installed the macOS .dmg app, just open FoldDB from your Applications folder. The UI opens automatically.</p>
      </Section>

      {/* SETUP WIZARD */}
      <Section variant="amber">
        <h2 id="setup"><span className="bold">SETUP WIZARD</span> <span className="dim">First-launch configuration</span></h2>

        <p>The first time you open FoldDB, the onboarding wizard walks you through configuration.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1em', margin: '1em 0' }}>
          <Card><p><Label color="yellow">STEP 1 &mdash; WELCOME</Label></p>
            <p>Overview of what FoldDB does and how it organizes your data with AI.</p></Card>

          <Card><p><Label color="yellow">STEP 2 &mdash; CONFIGURE AI</Label></p>
            <p>Choose your AI provider:</p>
            <p><span className="bold">OpenRouter</span> &mdash; Cloud-based AI. Sign up at <a href="https://openrouter.ai" target="_blank" rel="noreferrer">openrouter.ai</a> and paste your API key.<br />
              <span className="bold">Ollama</span> &mdash; Run AI locally on your machine. Install from <a href="https://ollama.com" target="_blank" rel="noreferrer">ollama.com</a>, then select a model.</p>
            <p className="dim">AI powers schema detection, keyword extraction, and natural language queries.</p></Card>

          <Card><p><Label color="yellow">STEP 3 &mdash; STORAGE</Label></p>
            <p>Choose where your data lives:</p>
            <p><span className="bold">Local</span> &mdash; Data stored on your machine (default). Fast, private, no cloud needed.<br />
              <span className="bold">Cloud</span> &mdash; AWS-backed storage with client-side encryption. Data is encrypted before leaving your device.</p></Card>

          <Card><p><Label color="yellow">STEP 4 &mdash; DONE</Label></p>
            <p>Configuration saved. You&rsquo;re ready to start using FoldDB.</p>
            <p className="dim">You can change these settings anytime via the gear icon in the top-right corner of the UI.</p></Card>
        </div>
      </Section>

      {/* USING FOLDDB */}
      <Section variant="rose">
        <h2 id="using"><span className="bold">USING FOLDDB</span> <span className="dim">What you can do</span></h2>

        <div className="grid-2">
          <Card><p><Label color="red">INGEST DATA</Label></p>
            <p>Upload files or paste JSON directly into FoldDB. AI automatically detects the structure, creates a schema, and extracts searchable keywords.</p>
            <p className="dim">Supports JSON, CSV, text files, and more</p></Card>

          <Card><p><Label color="red">SEARCH</Label></p>
            <p>Use the <span className="bold">AI Query</span> tab to search your data with natural language. Ask questions like &ldquo;show me recent purchases&rdquo; or &ldquo;find emails from last week.&rdquo;</p>
            <p className="dim">AI understands context and returns relevant results</p></Card>

          <Card><p><Label color="red">BROWSE</Label></p>
            <p>The <span className="bold">Data Browser</span> tab shows all your stored data organized by schema. Inspect individual records, view fields, and see data history.</p>
            <p className="dim">Everything is organized automatically by schema</p></Card>

          <Card><p><Label color="red">SMART FOLDERS</Label></p>
            <p>Point FoldDB at a directory on your machine. It scans for personal data files, processes them with AI, and ingests everything automatically.</p>
            <p className="dim">Great for importing documents, exports, and archives</p></Card>
        </div>
      </Section>

      {/* QUICK REFERENCE */}
      <Section variant="lavender">
        <h2 id="reference"><span className="bold">QUICK REFERENCE</span> <span className="dim">UI tabs and CLI commands</span></h2>

        <pre className="compare-table"><span className="dim">UI TAB                  WHAT IT DOES</span>{'\n'}<span className="dim">{'\u2500'.repeat(65)}</span>{'\n'}Data Browser            Browse all stored data by schema{'\n'}AI Query                Natural language search across your data{'\n'}Ingest                  Upload files or paste JSON to ingest{'\n'}Smart Folders           Scan and auto-ingest directories{'\n'}Schemas                 View and manage data schemas{'\n'}Settings                Configure AI provider, storage, and keys</pre>

        <p style={{ marginTop: '1.5em' }}><span className="bold">CLI COMMANDS</span> <span className="dim">for power users</span></p>

        <pre className="compare-table"><span className="dim">COMMAND                              WHAT IT DOES</span>{'\n'}<span className="dim">{'\u2500'.repeat(65)}</span>{'\n'}folddb_server                        Start the server (UI at :9001){'\n'}folddb --help                        Show all CLI commands{'\n'}folddb status -p                     Check node health{'\n'}folddb ingest run data.json          Ingest a JSON file{'\n'}folddb query ai &quot;your question&quot;      Natural language query{'\n'}folddb schema list -p                List all schemas</pre>

        <p className="dim">See the <Link to="/developer#cli">Developer Guide CLI Reference</Link> for the full command list.</p>
      </Section>

      {/* TROUBLESHOOTING */}
      <Section variant="slate">
        <h2 id="troubleshooting"><span className="bold">TROUBLESHOOTING</span> <span className="dim">Common issues</span></h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1em', margin: '1em 0' }}>
          <Card><p><Label color="blue">AI NOT WORKING</Label></p>
            <p>Check your API key in Settings (gear icon). Make sure you&rsquo;ve configured either OpenRouter or Ollama. For OpenRouter, verify your key at <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer">openrouter.ai/keys</a>. For Ollama, ensure it&rsquo;s running locally.</p></Card>

          <Card><p><Label color="blue">PORT ALREADY IN USE</Label></p>
            <p>Another instance of FoldDB (or another application) is using port 9001. Stop the other process first:</p>
            <pre>{'lsof -i :9001    # Find what\'s using the port\nkill <PID>       # Stop it'}</pre></Card>

          <Card><p><Label color="blue">PERMISSION DENIED (macOS)</Label></p>
            <p>macOS may block apps from unidentified developers. Go to <span className="bold">System Settings &rarr; Privacy &amp; Security</span> and click &ldquo;Open Anyway&rdquo; next to the FoldDB warning.</p></Card>

          <Card><p><Label color="blue">DATA NOT APPEARING</Label></p>
            <p>After ingesting data, it may take a moment for AI to process schemas and keywords. Check the progress indicator in the UI. If ingestion fails, verify your AI provider is configured and responding.</p></Card>
        </div>
      </Section>

      <p className="dim">----------------------------------------------------------------------------------------------------------------------------------------</p>
    </>
  );
}
