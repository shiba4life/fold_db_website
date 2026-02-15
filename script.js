// Fold DB — Minimal script
// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Typing animation: folder → fold db
(function () {
  const el = document.getElementById("typed");
  if (!el) return;

  const typeSpeed = 120;
  const eraseSpeed = 80;
  const pauseAfterType = 800;
  const pauseAfterErase = 300;
  const pauseBeforeLoop = 4000;

  function run() {
    let text = "";
    const word = "folder";
    let i = 0;

    // Type "folder"
    function typeForward() {
      if (i < word.length) {
        text += word[i];
        el.textContent = text;
        i++;
        setTimeout(typeForward, typeSpeed);
      } else {
        setTimeout(eraseBack, pauseAfterType);
      }
    }

    // Erase "er"
    let eraseCount = 0;
    function eraseBack() {
      if (eraseCount < 2) {
        text = text.slice(0, -1);
        el.textContent = text;
        eraseCount++;
        setTimeout(eraseBack, eraseSpeed);
      } else {
        setTimeout(typeDb, pauseAfterErase);
      }
    }

    // Type " db"
    const suffix = " db";
    let j = 0;
    function typeDb() {
      if (j < suffix.length) {
        text += suffix[j];
        el.textContent = text;
        j++;
        setTimeout(typeDb, typeSpeed);
      } else {
        // Loop
        setTimeout(run, pauseBeforeLoop);
      }
    }

    // Clear and start
    el.textContent = "";
    setTimeout(typeForward, 500);
  }

  run();
})();
