import { useRef, useEffect } from 'react';

export default function TypingAnimation() {
  const spanRef = useRef(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    const typeSpeed = 120;
    const eraseSpeed = 80;
    const pauseAfterType = 800;
    const pauseAfterErase = 300;
    const pauseBeforeLoop = 4000;

    let cancelled = false;
    let timeoutId;

    function delay(ms) {
      return new Promise(resolve => {
        timeoutId = setTimeout(resolve, ms);
      });
    }

    async function run() {
      while (!cancelled) {
        let text = '';
        const word = 'folder';

        // Type "folder"
        for (let i = 0; i < word.length && !cancelled; i++) {
          text += word[i];
          el.textContent = text;
          await delay(typeSpeed);
        }
        if (cancelled) break;

        await delay(pauseAfterType);
        if (cancelled) break;

        // Erase "er"
        for (let i = 0; i < 2 && !cancelled; i++) {
          text = text.slice(0, -1);
          el.textContent = text;
          await delay(eraseSpeed);
        }
        if (cancelled) break;

        await delay(pauseAfterErase);
        if (cancelled) break;

        // Type " db"
        const suffix = ' db';
        for (let i = 0; i < suffix.length && !cancelled; i++) {
          text += suffix[i];
          el.textContent = text;
          await delay(typeSpeed);
        }
        if (cancelled) break;

        await delay(pauseBeforeLoop);
      }
    }

    // Initial delay before starting
    timeoutId = setTimeout(run, 500);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <p className="typing-line">
      {'> '}<span ref={spanRef} /><span className="cursor">{'\u2588'}</span>
    </p>
  );
}
