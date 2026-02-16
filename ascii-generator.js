/**
 * ASCII Art Generator for Fold DB
 * Uses canvas pixel-sampling to render text as ASCII art at any size.
 * Character palette: '#' (bright), ':' (mid), ' ' (empty) — matches the Gruvbox aesthetic.
 */

/**
 * Generate ASCII art from text using canvas pixel-sampling.
 * @param {string} text - The text to render
 * @param {number} fontSize - Font size in pixels (controls output size)
 * @returns {string} ASCII art string
 */
function generateAsciiArt(text, fontSize) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  // Measure with the target font
  var fontStr = "bold " + fontSize + "px monospace";
  ctx.font = fontStr;
  var metrics = ctx.measureText(text);

  // Size the canvas to fit the text
  canvas.width = Math.ceil(metrics.width) + 4;
  canvas.height = Math.ceil(fontSize * 1.3);

  // Clear and redraw (measureText resets after canvas resize)
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = fontStr;
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "top";
  ctx.fillText(text, 2, Math.floor(fontSize * 0.1));

  // Sample pixels
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imageData.data;
  var width = canvas.width;
  var height = canvas.height;

  // Character map: bright → '#', medium → ':', dark → ' '
  var chars = ["#", ":", " "];

  var lines = [];
  // Step Y by 2 to correct for monospace character aspect ratio (chars are ~2x tall as wide)
  for (var y = 0; y < height; y += 2) {
    var line = "";
    for (var x = 0; x < width; x++) {
      var i = (y * width + x) * 4;
      var brightness = data[i]; // red channel (white text on black bg)
      // Map brightness to character index
      if (brightness > 170) {
        line += chars[0]; // '#'
      } else if (brightness > 60) {
        line += chars[1]; // ':'
      } else {
        line += chars[2]; // ' '
      }
    }
    lines.push(line);
  }

  // Trim trailing empty lines
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
    lines.pop();
  }

  // Trim leading empty lines
  while (lines.length > 0 && lines[0].trim() === "") {
    lines.shift();
  }

  // Find the rightmost non-space character across all lines and trim each line
  var maxRight = 0;
  for (var k = 0; k < lines.length; k++) {
    var trimmed = lines[k].replace(/\s+$/, "");
    if (trimmed.length > maxRight) maxRight = trimmed.length;
  }
  for (var k = 0; k < lines.length; k++) {
    lines[k] = lines[k].substring(0, maxRight);
  }

  return lines.join("\n");
}

/**
 * Pick the appropriate font size so the ASCII art fits the container.
 * Measures available character columns, then scales font size proportionally.
 * @param {HTMLElement} el - The container element to fit within
 * @returns {number} font size in pixels
 */
function getResponsiveFontSize(el) {
  // Measure how many monospace characters fit in the container
  var containerWidth = el.parentElement
    ? el.parentElement.clientWidth
    : window.innerWidth;
  var style = window.getComputedStyle(el);

  // Measure single character width
  var span = document.createElement("span");
  span.style.font = style.font;
  span.style.visibility = "hidden";
  span.style.position = "absolute";
  span.style.whiteSpace = "pre";
  span.textContent = "M";
  document.body.appendChild(span);
  var charWidth = span.getBoundingClientRect().width;
  document.body.removeChild(span);

  var availableCols = Math.floor(containerWidth / charWidth);

  // Test render at a reference size to find the character-width ratio
  var refSize = 48;
  var refArt = generateAsciiArt("FOLD DB", refSize);
  var refLines = refArt.split("\n");
  var refMaxCols = 0;
  for (var i = 0; i < refLines.length; i++) {
    if (refLines[i].length > refMaxCols) refMaxCols = refLines[i].length;
  }

  // Scale font size proportionally so output fits available columns
  if (refMaxCols === 0) return refSize;
  var scaledSize = Math.floor(refSize * (availableCols / refMaxCols));

  // Clamp between 10 and 64
  return Math.max(10, Math.min(64, scaledSize));
}

/**
 * Render ASCII art into a target element, responsive to viewport size.
 * Automatically re-renders on window resize.
 * @param {HTMLElement} el - The target <pre> element
 * @param {string} [text] - Text to render (default: 'FOLD DB')
 */
function renderResponsiveAscii(el, text) {
  if (!el) return;
  text = text || "FOLD DB";

  var resizeTimer;

  function render() {
    var fontSize = getResponsiveFontSize(el);
    el.textContent = generateAsciiArt(text, fontSize);
  }

  // Initial render
  render();

  // Debounced resize handler
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(render, 150);
  });
}
