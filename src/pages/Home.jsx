import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Section from '../components/Section';
import Card from '../components/Card';
import Label from '../components/Label';
import AsciiTitle from '../components/AsciiTitle';
import TypingAnimation from '../components/TypingAnimation';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>FoldDB - The Last Database</title>
        <meta name="description" content="FoldDB is an experimental self-managing database designed to outlive applications. One permanent database for a person's data." />
        <meta property="og:title" content="FoldDB - The Last Database" />
        <meta property="og:description" content="A database designed to outlive applications. Your data lives in one permanent database under your control. Applications no longer store your data — they interact with it." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://folddb.com" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="FoldDB - The Last Database" />
        <meta name="twitter:description" content="A database designed to outlive applications. One permanent database for a person's data." />
        <link rel="canonical" href="https://folddb.com" />
      </Helmet>
      <AsciiTitle />
      <br />
      <TypingAnimation />
      <hr className="decorative-rule" aria-hidden="true" />
      <h1 className="tagline">The Last Database.</h1>
      <p className="dim">A database designed to outlive applications.</p>
      <hr className="decorative-rule" aria-hidden="true" />
      <br />

      <p>Modern software forces people to scatter their data across hundreds of services. Every application creates its own database. Every database traps your information.</p>

      <p><span className="bold white">FoldDB is an experiment in inverting this model.</span></p>

      <p>Your data lives in one permanent database under your control. Applications no longer store your data &mdash; they interact with it.</p>

      <Section variant="rose" id="problem">
        <h2><span className="bold">THE PROBLEM</span></h2>

        <pre className="compare-table">{
`  App A        App B        App C        App D
    |              |            |            |
    v              v            v            v
 `}<span style={{color:'#fb4934'}}>Notes DB</span>{`    `}<span style={{color:'#fb4934'}}>Health DB</span>{`    `}<span style={{color:'#fb4934'}}>Msgs DB</span>{`    `}<span style={{color:'#fb4934'}}>Finance DB</span>{`
  (silo)       (silo)       (silo)       (silo)`}
        </pre>

        <p>Every application rebuilds user accounts, storage, indexing, permissions, and sync. Each stores its own copy of your information. No single system understands the full picture.</p>

        <p>Your data is <span className="bold white">fragmented, duplicated, and outside your control</span>.</p>
      </Section>

      <Section variant="sage" id="model">
        <h2><span className="bold">THE FOLDDB MODEL</span></h2>

        <pre className="compare-table">{
`  App A     App B     App C     App D     App E
    \\         |         |         |         /
     \\        |         |         |        /
      `}<span style={{color:'#fabd2f'}}>{`+----------------------------------------+`}</span>{`
      `}<span style={{color:'#fabd2f'}}>{`|`}</span>{`          `}<span className="bold white">Your FoldDB Database</span>{`          `}<span style={{color:'#fabd2f'}}>{`|`}</span>{`
      `}<span style={{color:'#fabd2f'}}>{`|`}</span>{`     `}<span className="dim">{`encrypted / local / permanent`}</span>{`      `}<span style={{color:'#fabd2f'}}>{`|`}</span>{`
      `}<span style={{color:'#fabd2f'}}>{`+----------------------------------------+`}</span>
        </pre>

        <p>Applications become <span className="bold white">clients of the user&rsquo;s database</span> rather than owners of the data. This simple inversion changes the foundation of software architecture.</p>
      </Section>

      <Section variant="slate" id="architecture">
        <h2><span className="bold">ARCHITECTURE</span></h2>

        <pre className="compare-table">{
`  `}<span style={{color:'#b8bb26'}}>{`Applications`}</span>{`  Notes · Health · Finance · AI · Email
        |
        v
  `}<span style={{color:'#83a598'}}>{`Shared Structures`}</span>{`    public interfaces, standardized
        |
        v
  `}<span style={{color:'#d3869b'}}>{`Transforms`}</span>{`           local computation, deterministic
        |
        v
  `}<span style={{color:'#fe8019'}}>{`Vector Embeddings`}</span>{`    semantic index across all data
        |
        v
  `}<span style={{color:'#fb4934'}}>{`Encrypted Storage`}</span>{`    user-controlled, append-only`}
        </pre>

        <p>All computation happens locally. <span className="bold white">Raw data never leaves the user&rsquo;s control.</span></p>
      </Section>

      <Section variant="amber" id="principles">
        <h2><span className="bold">CORE PRINCIPLES</span></h2>

        <div className="grid-3">
          <Card><p><Label color="yellow">NEVER TRUST THE CLOUD</Label></p><p>
            All data remains <span className="bold white">end-to-end encrypted</span>. Cloud infrastructure may store or transport data, but it cannot read it.</p></Card>

          <Card><p><Label color="yellow">REVEAL THE MINIMUM</Label></p><p>
            Applications receive only the information required to perform their function. Transform results are stored in structures with access policies &mdash; <span className="bold white">nothing is visible without explicit permission</span>.</p></Card>

          <Card><p><Label color="yellow">SELF-MAINTAINING</Label></p><p>
            Users should not manage schemas, migrations, indexing, or cleanup. <span className="bold white">The system organizes itself.</span></p></Card>
        </div>
      </Section>

      <Section variant="sage" id="how-it-works">
        <h2><span className="bold">HOW IT WORKS</span></h2>

        <h2 className="section-subheading"><span className="bold">Shared Structures</span></h2>

        <p>FoldDB structures are <span className="bold white">public and standardized</span>. They define how data is organized, what queries are possible, and how derived results are generated. Because structures are shared, applications can interact with any user database without migrations or custom integrations.</p>

        <h2 className="section-subheading"><span className="bold">Transforms</span></h2>

        <p>Transforms are deterministic functions attached to structures. They define how applications retrieve computed results from the database. Transform results are written back to a structure &mdash; which means they are <span className="bold white">subject to the same access restrictions as any other data</span>. A third party cannot see transform results unless they have explicit access to the output structure.</p>

        <pre className="compare-table">{
`  Structure: `}<span className="bold white">{`Messages`}</span>{`

    Fields    `}<span className="dim">{`id · sender · recipient · timestamp · body`}</span>{`

    Transforms
      `}<span style={{color:'#fe8019'}}>{`inbox`}</span><span className="dim">{`(user_id)`}</span>{`
      `}<span style={{color:'#fe8019'}}>{`conversation`}</span><span className="dim">{`(user_a, user_b)`}</span>{`
      `}<span style={{color:'#fe8019'}}>{`semantic_search`}</span><span className="dim">{`(query)`}</span>{`
      `}<span style={{color:'#fe8019'}}>{`unread_count`}</span><span className="dim">{`(user_id)`}</span>
        </pre>

        <p>Transforms execute locally. Their outputs are stored in structures with their own access policies &mdash; <span className="bold white">no data is ever exposed without explicit permission</span>.</p>

        <h2 className="section-subheading"><span className="bold">Semantic Index</span></h2>

        <p>FoldDB maintains a <span className="bold white">unified semantic index</span> across all user data &mdash; documents, messages, photos, code, notes, structured records. Search becomes semantic rather than schema-bound. Applications can discover relevant data even when they were never designed to interact.</p>

        <h2 className="section-subheading"><span className="bold">AI-Assisted Ingestion</span></h2>

        <p>Incoming data is automatically normalized using opinionated ingestion pipelines. <span className="bold white">Users do not configure schemas or pipelines.</span> Data becomes usable immediately.</p>
      </Section>

      <Section variant="lavender" id="discovery">
        <h2><span className="bold">PRIVACY-PRESERVING DISCOVERY</span></h2>

        <p>FoldDB allows <span className="bold white">discovery without revealing raw data</span>. Anonymized vector embeddings allow systems to query for the existence of semantic information without exposing the data itself or its origin.</p>

        <p>Everyone shares the same publicly available structures. Third-party apps can write code that fetches and writes to user&rsquo;s data locally. This enables new types of collaboration while preserving privacy.</p>
      </Section>

      <Section variant="slate" id="status">
        <h2><span className="bold">STATUS</span> <span className="dim">Experimental &mdash; in active development</span></h2>

        <p>FoldDB is an <span className="bold white">experimental system</span> under active development.</p>

        <p>FoldDB explores whether modern technology can support a new model of computing: <span className="bold white">one permanent database for every person</span>. A system where data is private, computation is local, and applications are temporary tools rather than permanent custodians.</p>

        <p>Early releases focus on local encrypted storage, shared structures, transform execution, and semantic indexing.</p>

        <p>
          <a href="/papers/fold_db_paper.pdf" target="_blank" rel="noreferrer" className="link-btn">[Read the Paper]</a>{'  '}
          <a href="/papers/fold_db_paper_eli5.pdf" target="_blank" rel="noreferrer" className="link-btn">[ELI5 Version]</a>{'  '}
          <a href="https://github.com/shiba4life/fold_db" target="_blank" rel="noreferrer" className="link-btn">[View on GitHub]</a>{'  '}
          <Link to="/developer" className="link-btn">[Developer Guide]</Link>{'  '}
          <a href="https://schema.folddb.com" target="_blank" rel="noreferrer" className="link-btn">[Schema Registry]</a>
        </p>
      </Section>

    </>
  );
}
