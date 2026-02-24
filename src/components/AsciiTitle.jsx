import { useRef, useEffect } from 'react';

function generateAsciiArt(text, fontSize) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const fontStr = 'bold ' + fontSize + 'px monospace';
  ctx.font = fontStr;
  const metrics = ctx.measureText(text);

  canvas.width = Math.ceil(metrics.width) + 4;
  canvas.height = Math.ceil(fontSize * 1.3);

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = fontStr;
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'top';
  ctx.fillText(text, 2, Math.floor(fontSize * 0.1));

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;

  const lines = [];
  for (let y = 0; y < height; y += 2) {
    let line = '';
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const brightness = data[i];
      if (brightness > 170) line += '#';
      else if (brightness > 60) line += ':';
      else line += ' ';
    }
    lines.push(line);
  }

  while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();
  while (lines.length > 0 && lines[0].trim() === '') lines.shift();

  let maxRight = 0;
  for (let k = 0; k < lines.length; k++) {
    const trimmed = lines[k].replace(/\s+$/, '');
    if (trimmed.length > maxRight) maxRight = trimmed.length;
  }
  for (let k = 0; k < lines.length; k++) {
    lines[k] = lines[k].substring(0, maxRight);
  }

  return lines.join('\n');
}

function getResponsiveFontSize(el) {
  const containerWidth = el.parentElement ? el.parentElement.clientWidth : window.innerWidth;
  const style = window.getComputedStyle(el);

  const span = document.createElement('span');
  span.style.font = style.font;
  span.style.visibility = 'hidden';
  span.style.position = 'absolute';
  span.style.whiteSpace = 'pre';
  span.textContent = 'M';
  document.body.appendChild(span);
  const charWidth = span.getBoundingClientRect().width;
  document.body.removeChild(span);

  const availableCols = Math.floor(containerWidth / charWidth);

  const refSize = 48;
  const refArt = generateAsciiArt('FOLD DB', refSize);
  const refLines = refArt.split('\n');
  let refMaxCols = 0;
  for (let i = 0; i < refLines.length; i++) {
    if (refLines[i].length > refMaxCols) refMaxCols = refLines[i].length;
  }

  if (refMaxCols === 0) return refSize;
  const scaledSize = Math.floor(refSize * (availableCols / refMaxCols));
  return Math.max(10, Math.min(64, scaledSize));
}

export default function AsciiTitle({ text = 'FOLD DB' }) {
  const preRef = useRef(null);

  useEffect(() => {
    const el = preRef.current;
    if (!el) return;

    function render() {
      const fontSize = getResponsiveFontSize(el);
      el.textContent = generateAsciiArt(text, fontSize);
    }

    render();

    let resizeTimer;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(render, 150);
    }

    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    };
  }, [text]);

  return <pre className="ascii" ref={preRef} />;
}
