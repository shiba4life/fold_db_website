import { Link } from 'react-router-dom';
import Section from '../components/Section';
import Card from '../components/Card';
import Label from '../components/Label';
import AsciiTitle from '../components/AsciiTitle';
import TypingAnimation from '../components/TypingAnimation';

export default function Home() {
  return (
    <>
      <AsciiTitle />
      <br />
      <TypingAnimation />
      /////////////////////////////////////////////////////////////////
      <h1 className="tagline">Your data. Your rules.</h1>
      -----------------------------------------------------------------
      <br />
      <p>The modern internet profits from your personal data while you have no real control. Fold DB is building a different model &mdash; one where <span className="bold white">your data stays yours</span>, accessed only on your terms, mediated by AI that works for you.</p>

      <p><span className="bold white">E2E</span> encrypted | <span className="bold white">P2P</span> architecture | <span className="bold white">AI</span> mediated</p>

      <p>
        <a href="#vision" className="link-btn">[Discover the Vision]</a>{'  '}
        <Link to="/guide" className="link-btn">[User Guide]</Link>{'  '}
        <Link to="/developer" className="link-btn">[Developer Guide]</Link>{'  '}
        <a href="https://github.com/shiba4life/fold_db" target="_blank" rel="noreferrer" className="link-btn">[GitHub]</a>
      </p>

      <Section variant="rose">
        <h2 id="problem"><span className="bold">THE PROBLEM</span> <span className="dim">The internet wasn&rsquo;t built for you</span></h2>

        <p>Your personal data is scattered across hundreds of corporate databases. You didn&rsquo;t choose this. Here&rsquo;s what&rsquo;s broken:</p>

        <div className="grid-3">
          <Card><p><Label color="red">FRAGMENTED SILOS</Label></p><p>
            Your medical records, financial history, social connections, and daily activity live in systems <span className="bold">you don&rsquo;t control</span> and can&rsquo;t easily access. Each company holds a piece of you. None of them have the full picture. Neither do you.</p></Card>

          <Card><p><Label color="red">ILLUSORY CONTROL</Label></p><p>
            &ldquo;Your data&rdquo; means a download button that exports a ZIP file you&rsquo;ll never open. Consent is a legal fiction. Revocation is meaningless because copies of your data persist across backup systems, analytics pipelines, and third-party data brokers.</p></Card>

          <Card><p><Label color="red">COMPLEXITY INVERSION</Label></p><p>
            You manage 100+ accounts, passwords, and privacy settings across services. The system that was supposed to serve you now demands you serve it. The cognitive overhead is the product.</p></Card>
        </div>
      </Section>

      <Section variant="sage" id="vision">
        <h2><span className="bold">THE VISION</span> <span className="dim">Personal data as personhood, not property</span></h2>

        <p>Fold DB reimagines personal data the way we treat people socially &mdash; you selectively reveal insight, summaries, and claims, mediated by trust and context. Not bulk data transfers.</p>

        <div className="grid-2">
          <Card><p><Label color="green">01 DATA SOVEREIGNTY</Label></p><p>
            Your data lives on <span className="bold">your device</span>, in your Personal Data Node. No corporation holds it. No server stores your plaintext. You are the single source of truth about yourself.</p></Card>

          <Card><p><Label color="green">02 CONNECTION-BASED ACCESS</Label></p><p>
            No APIs. No scraping. No OAuth tokens. Access happens through direct peer connections &mdash; like choosing who to invite into your home rather than posting your address publicly.</p></Card>

          <Card><p><Label color="green">03 MEDIATED DISCLOSURE</Label></p><p>
            A local AI agent answers questions <span className="bold">about</span> your data without revealing the data itself. &ldquo;Can they afford this?&rdquo; &rarr; Yes &mdash; not your bank statements, tax returns, or pay stubs.</p></Card>

          <Card><p><Label color="green">04 GLOBAL SCHEMA</Label></p><p>
            A shared vocabulary so systems can ask the <span className="bold">right questions</span> without dictating how you store or organize your own data. Interoperability without centralization.</p></Card>
        </div>
      </Section>

      <Section variant="slate">
        <h2 id="how-it-works"><span className="bold">ARCHITECTURE</span> <span className="dim">Three pillars of the sovereign stack</span></h2>

        <div className="grid-3">
          <Card><p><Label color="blue">PERSONAL DATA NODE</Label></p><p>
            Your private database. All your data &mdash; documents, records, activity &mdash; stored locally and encrypted. Cloud backup available but <span className="bold">always encrypted client-side</span> before it leaves your device.</p><p>
            * Schema-aware storage<br />* Local-first architecture<br />* Permission-gated access<br />* Encrypted cloud backup</p></Card>

          <Card><p><Label color="blue">AI MEDIATOR</Label></p><p>
            Your personal AI gatekeeper. It reads your data so others don&rsquo;t have to. When a service needs information, the mediator provides <span className="bold">claims and answers</span> &mdash; never raw data.</p><p>
            * Answers queries locally<br />* Returns claims, not data<br />* Context-aware disclosure<br />* Never phones home</p></Card>

          <Card><p><Label color="blue">E2E ENCRYPTION</Label></p><p>
            Keys live on your device. The cloud stores ciphertext. Even we can&rsquo;t read your data. <span className="bold">Zero-knowledge</span> by design.</p><p>
            * Client-side encryption<br />* Zero-knowledge cloud<br />* Key never leaves device<br />* Tamper-evident storage</p></Card>
        </div>
      </Section>

      <Section variant="amber">
        <h2 id="compare"><span className="bold">COMPARE</span> <span className="dim">Today&rsquo;s model vs. the sovereign model</span></h2>

        <pre className="compare-table"><span className="dim">FEATURE              TODAY&rsquo;S INTERNET             FOLD DB MODEL</span>{'\n'}<span className="dim">---------------------------------------------------------------------</span>{'\n'}Data Location        <span className="dim">Corporate silos</span>              Your Personal Data Node{'\n'}Access Model         <span className="dim">Proprietary APIs</span>             Peer connections{'\n'}Sharing              <span className="dim">Bulk transfer / blanket</span>      Fine-grained, query-level{'\n'}Control              <span className="dim">Illusory revocation</span>          Immediate, real revocation{'\n'}Data Flow            <span className="dim">Data moves to computation</span>    Computation moves to data{'\n'}Encryption           <span className="dim">Server-side (they can read)</span>  E2E (only you can read){'\n'}Identity             <span className="dim">Platform owns your identity</span>  You own your identity</pre>
      </Section>

      <Section variant="lavender">
        <h2 id="example"><span className="bold">EXAMPLE</span> <span className="dim">Applying for a mortgage</span></h2>

        <p><span className="bold">TODAY</span><br />
          1. Collect pay stubs, tax returns, bank statements<br />
          2. Upload sensitive documents to lender&rsquo;s portal<br />
          3. Lender stores your data on their servers indefinitely<br />
          4. Data shared with underwriters, credit agencies, third parties<br />
          5. No control over who sees what, or for how long</p>

        <p><span className="bold">WITH FOLD DB</span><br />
          1. Lender sends a query: &ldquo;can they afford this?&rdquo;<br />
          2. Your AI mediator reads your local data<br />
          3. Returns a signed claim: &ldquo;income &ge; 3x monthly payment&rdquo;<br />
          4. <span className="bold">No documents leave your device</span><br />
          5. Revoke access anytime &mdash; real revocation</p>

        <p className="dim">The lender doesn&rsquo;t need your life story. They need an answer. Fold DB gives them one &mdash; without giving them your data.</p>
      </Section>

      <p>The internet should feel like a network of people again.</p>

      <p>Fold DB is open source and in active development. Join us in building an internet where people control their own data.</p>

      <Section variant="sage">
        <h2 id="get-started"><span className="bold">GET STARTED</span> <span className="dim">Up and running in minutes</span></h2>

        <div className="grid-3">
          <Card><p><span className="bold">1. INSTALL</span></p>
            <pre>curl -fsSL https://raw.githubusercontent.com/shiba4life/fold_db/master/install.sh | sh</pre>
            <p className="dim">Or download the <a href="https://github.com/shiba4life/fold_db/releases" target="_blank" rel="noreferrer">.dmg for macOS</a></p></Card>

          <Card><p><span className="bold">2. RUN</span></p>
            <pre>folddb_server</pre>
            <p className="dim">Open <a href="http://localhost:9001">localhost:9001</a> in your browser</p></Card>

          <Card><p><span className="bold">3. CONFIGURE</span></p>
            <p>The setup wizard walks you through AI and storage configuration on first launch.</p>
            <p className="dim">No developer tools required</p></Card>
        </div>

        <p>
          <Link to="/guide" className="link-btn">[Read the Full Guide]</Link>{'  '}
          <a href="https://github.com/shiba4life/fold_db" target="_blank" rel="noreferrer" className="link-btn">[View on GitHub]</a>{'  '}
          <Link to="/developer" className="link-btn">[Developer Guide]</Link>{'  '}
          <a href="https://schema.folddb.com" target="_blank" rel="noreferrer" className="link-btn">[Schema Registry]</a>
        </p>
      </Section>
    </>
  );
}
