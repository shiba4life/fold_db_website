import { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import Label from './Label';

const SCHEMA_SERVICE_URL = 'https://y0q3m6vk75.execute-api.us-west-2.amazonaws.com';
const SCHEMA_API_ENDPOINTS = {
  available: `${SCHEMA_SERVICE_URL}/api/schemas/available`,
  health: `${SCHEMA_SERVICE_URL}/health`,
};

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export default function SchemaRegistry() {
  const [allSchemas, setAllSchemas] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [serviceStatus, setServiceStatus] = useState({ text: 'checking...', color: '#928374' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalSchema, setModalSchema] = useState(null);
  const [copyText, setCopyText] = useState('[Copy JSON]');

  const loadSchemas = useCallback(async () => {
    setLoading(true);
    setError(false);

    // Health check
    try {
      const healthResponse = await fetch(SCHEMA_API_ENDPOINTS.health);
      if (healthResponse.ok) {
        setServiceStatus({ text: '\u2713 online', color: '#b8bb26' });
      } else {
        setServiceStatus({ text: '\u26a0 degraded', color: '#fabd2f' });
      }
    } catch {
      setServiceStatus({ text: '\u2717 offline', color: '#fb4934' });
    }

    // Fetch schemas
    try {
      const response = await fetch(SCHEMA_API_ENDPOINTS.available);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setAllSchemas(data.schemas || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load schemas:', err);
      setLoading(false);
      setError(true);
    }
  }, []);

  useEffect(() => { loadSchemas(); }, [loadSchemas]);

  // Close modal on Escape
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') setModalSchema(null);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    if (modalSchema) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [modalSchema]);

  const schemaCount = allSchemas.length;
  const totalFields = allSchemas.reduce((sum, schema) => {
    const fieldCount = schema.fields?.length || 0;
    const transformCount = schema.transform_fields ? Object.keys(schema.transform_fields).length : 0;
    return sum + fieldCount + transformCount;
  }, 0);

  const filtered = allSchemas.filter(s => {
    if (currentFilter === 'all') return true;
    return (s.schema_type || 'Single') === currentFilter;
  });

  const filters = ['all', 'Single', 'Range', 'HashRange'];

  function handleCopy() {
    if (modalSchema) {
      navigator.clipboard.writeText(JSON.stringify(modalSchema, null, 2));
      setCopyText('[Copied!]');
      setTimeout(() => setCopyText('[Copy JSON]'), 1500);
    }
  }

  function renderModalBody(schema) {
    const fields = schema.fields || [];
    const transforms = schema.transform_fields ? Object.entries(schema.transform_fields) : [];

    return (
      <>
        {fields.length > 0 && (
          <>
            <p><span className="bold">Fields</span></p>
            <pre>{fields.map(f => `  \u00b7 ${f}\n`).join('')}</pre>
          </>
        )}
        {transforms.length > 0 && (
          <>
            <p><span className="bold">Transform Fields</span></p>
            <pre>{transforms.map(([name, config]) => {
              let line = `  \u00b7 ${name}`;
              if (config && config.source) line += ` \u2190 ${config.source}`;
              return line + '\n';
            }).join('')}</pre>
          </>
        )}
        {schema.key && <p><span className="bold">Key:</span> {schema.key}</p>}
      </>
    );
  }

  return (
    <>
      <p>
        <span className="bold">{schemaCount || '\u2014'}</span> schemas
        {' '}<span className="dim">|</span>{' '}
        <span className="bold">{totalFields || '\u2014'}</span> total fields
        {' '}<span className="dim">|</span>{' '}
        service: <span className="bold" style={{ color: serviceStatus.color }}>{serviceStatus.text}</span>
      </p>

      <p>
        {filters.map(f => (
          <button
            key={f}
            className={`filter-btn${currentFilter === f ? ' active' : ''}`}
            onClick={() => setCurrentFilter(f)}
          >
            [{f === 'all' ? 'All' : f}]
          </button>
        ))}
      </p>

      {loading && <div className="dim"><p>Loading schemas from registry...</p></div>}
      {error && (
        <div>
          <p>Failed to load schemas.{' '}
            <span className="link-btn" style={{ cursor: 'pointer' }} onClick={loadSchemas}>[Retry]</span>
          </p>
        </div>
      )}
      {!loading && !error && filtered.length === 0 && (
        <div><p className="dim">No schemas found.</p></div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid-3">
          {filtered.map(schema => {
            const name = schema.name || 'Unnamed';
            const type = schema.schema_type || 'Single';
            const fields = schema.fields || [];
            const transforms = schema.transform_fields ? Object.keys(schema.transform_fields) : [];
            const allFields = [...fields, ...transforms];
            const displayFields = allFields.slice(0, 4);
            const moreCount = allFields.length - displayFields.length;

            return (
              <Card key={name} className="schema-card" style={{ cursor: 'pointer' }} onClick={() => setModalSchema(schema)}>
                <p><Label color="green">{name}</Label> <span className="dim">{type}</span></p>
                <p className="dim">{allFields.length} field{allFields.length !== 1 ? 's' : ''}</p>
                {displayFields.length > 0 && (
                  <p>
                    {displayFields.map(f => (
                      <span key={f} className="label label-blue" style={{ fontSize: '0.8em' }}>{f}</span>
                    ))}
                    {displayFields.map((_, i) => i < displayFields.length - 1 ? ' ' : null)}
                    {moreCount > 0 && <span className="dim"> +{moreCount}</span>}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <div
        className={`modal-overlay${modalSchema ? ' open' : ''}`}
        onClick={e => { if (e.target === e.currentTarget) setModalSchema(null); }}
      >
        <div className="modal">
          {modalSchema && (
            <>
              <p>
                <span className="bold">{modalSchema.name || 'Unnamed'}</span>{' '}
                <Label color="purple">{modalSchema.schema_type || 'Single'}</Label>
                <span className="link-btn" style={{ cursor: 'pointer', float: 'right' }} onClick={() => setModalSchema(null)}>[Close]</span>
              </p>
              {renderModalBody(modalSchema)}
              <p>
                <span className="link-btn" style={{ cursor: 'pointer' }} onClick={handleCopy}>{copyText}</span>{' '}
                <span className="link-btn" style={{ cursor: 'pointer' }} onClick={() => setModalSchema(null)}>[Close]</span>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
