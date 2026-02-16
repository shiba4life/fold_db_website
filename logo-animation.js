/**
 * FoldDB Animated Logo — reusable canvas animation.
 * Usage: initLogoAnimation(canvasElement, size)
 *   canvasElement — a <canvas> DOM node
 *   size          — CSS pixel size (width & height), default 32
 */
function initLogoAnimation(canvas, size) {
  size = size || 32;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + "px";
  canvas.style.height = size + "px";
  ctx.scale(dpr, dpr);

  const S = size;
  const CX = S / 2,
    CY = S / 2;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function ease(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  // Colors
  var COLORS = ["#E53935", "#FF9800", "#FDD835"];
  var LINE_W = Math.max(1, S * 0.0075);

  // Scale all dimensions relative to the base 400px design
  var sc = S / 400;

  var RECT_W = 60 * sc;
  var RECT_H = 30 * sc;
  var RECT_R = 14 * sc;
  var CIRCLE_R = 60 * sc;
  var SCALE_Y = 0.5;

  var OFFSETS_RECT = [-36 * sc, 0, 36 * sc];
  var OFFSETS_CIRCLE = [-34 * sc, 0, 34 * sc];

  // Timeline constants
  var SPIN_DUR = 0.14;
  var HOLD_RECT = 0.06;
  var HOLD_CIRC = 0.08;

  var FWD_START = [HOLD_RECT, HOLD_RECT + SPIN_DUR, HOLD_RECT + SPIN_DUR * 2];
  var REV_BEGIN = HOLD_RECT + SPIN_DUR * 3 + HOLD_CIRC;
  var REV_START = [REV_BEGIN + SPIN_DUR * 2, REV_BEGIN + SPIN_DUR, REV_BEGIN];

  function getShapeState(p, i) {
    var fs = FWD_START[i],
      fe = fs + SPIN_DUR;
    var rs = REV_START[i],
      re = rs + SPIN_DUR;
    var t, rot;
    if (p < fs) {
      t = 0;
      rot = 0;
    } else if (p < fe) {
      var raw = ease((p - fs) / SPIN_DUR);
      t = raw;
      rot = raw * Math.PI * 2;
    } else if (p < rs) {
      t = 1;
      rot = 0;
    } else if (p < re) {
      var raw2 = ease((p - rs) / SPIN_DUR);
      t = 1 - raw2;
      rot = raw2 * Math.PI * 2;
    } else {
      t = 0;
      rot = 0;
    }
    return { t: t, rot: rot };
  }

  function drawShape(cx, cy, hw, hh, r, color, sy, rot, t) {
    var clampR = Math.min(r, hw, hh);
    var L = cx - hw,
      R = cx + hw,
      T = cy - hh,
      B = cy + hh;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.scale(1, sy);
    ctx.translate(-cx, -cy);
    ctx.beginPath();
    ctx.moveTo(L + clampR, T);
    ctx.lineTo(R - clampR, T);
    ctx.arcTo(R, T, R, T + clampR, clampR);
    ctx.lineTo(R, B - clampR);
    ctx.arcTo(R, B, R - clampR, B, clampR);
    ctx.lineTo(L + clampR, B);
    ctx.arcTo(L, B, L, B - clampR, clampR);
    ctx.lineTo(L, T + clampR);
    ctx.arcTo(L, T, L + clampR, T, clampR);
    ctx.closePath();
    if (t > 0) {
      ctx.globalAlpha = t;
      ctx.fillStyle = color;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = color;
    ctx.lineWidth = LINE_W;
    ctx.stroke();
    ctx.restore();
  }

  function draw(p) {
    ctx.clearRect(0, 0, S, S);
    for (var i = 2; i >= 0; i--) {
      var state = getShapeState(p, i);
      var t = state.t,
        rot = state.rot;
      var hw = lerp(RECT_W, CIRCLE_R, t);
      var hh = lerp(RECT_H, CIRCLE_R, t);
      var r = lerp(RECT_R, CIRCLE_R, t);
      var sy = lerp(1, SCALE_Y, t);
      var cy = CY + lerp(OFFSETS_RECT[i], OFFSETS_CIRCLE[i], t);
      drawShape(CX, cy, hw, hh, r, COLORS[i], sy, rot, t);
    }
  }

  var DUR = 6000;
  var t0 = null;
  var rafId;
  function tick(ts) {
    if (!t0) t0 = ts;
    draw(((ts - t0) % DUR) / DUR);
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  // Return a cleanup function
  return function stop() {
    cancelAnimationFrame(rafId);
  };
}
