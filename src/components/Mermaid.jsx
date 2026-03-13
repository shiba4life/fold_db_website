import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    darkMode: true,
    background: '#282828',
    primaryColor: '#3c3836',
    primaryTextColor: '#ebdbb2',
    primaryBorderColor: '#504945',
    lineColor: '#928374',
    secondaryColor: '#333c31',
    tertiaryColor: '#31353c',
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '14px',
    nodeBorder: '#504945',
    mainBkg: '#3c3836',
    clusterBkg: '#32302f',
    clusterBorder: '#504945',
    edgeLabelBackground: '#282828',
  },
});

export default function Mermaid({ chart }) {
  const [svg, setSvg] = useState('');

  useEffect(() => {
    const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    mermaid.render(id, chart).then(({ svg: rendered }) => {
      setSvg(rendered);
    }).catch((err) => {
      console.error('Mermaid render error:', err);
    });
  }, [chart]);

  return <div className="mermaid-diagram" dangerouslySetInnerHTML={{ __html: svg }} />;
}
