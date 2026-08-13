const scenes=[...document.querySelectorAll('.scene')];
let current=0;const music=document.getElementById('bgMusic');
const gate = document.getElementById('fullscreenGate');
const enterBtn = document.getElementById('enterFullscreen');
function startMusic(){if(music.paused){music.volume=.35;music.play().catch(()=>{});}}
if (enterBtn) {
  enterBtn.addEventListener('click', async () => {
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      }
    } catch (e) {}

    if (gate) gate.style.display = 'none';
    startMusic();
  });
}
const story = `Sometimes I think there’s another universe where our story started on a random street.

We were strangers who kept crossing paths until one day the rain pushed us into the same little café.

I like to believe that was our first conversation.

You told me you wanted to see cherry blossoms someday, and somehow that one sentence stayed with me.

After that, every small thing became our thing.

We kept meeting, kept talking, kept laughing, and somehow the days became memories before we even noticed them.

One evening we finally stood beneath cherry blossoms, and I’d remember that first conversation and think, “So this is what you meant.”

I like to think we would have stayed there for hours, talking about everything and nothing, without ever noticing how late it had become. And when we finally looked up, it was already night.

We started counting stars, teased each other over who lost count first, and laughed until neither of us remembered what we were counting.

Months would pass like that, so quietly that we wouldn’t even realize how many days had gone by.

Then one morning your birthday would arrive, and somehow I’d forget to wish you. You’d be genuinely angry, and I’d spend the whole day trying to make you smile again.

In the end, we found ourselves talking about that cherry blossom evening, and somehow that memory was enough.

That night we filled the whole sky with lanterns, with our names written on them, because I wanted the entire universe to know it was your birthday.

Maybe that’s how the stars learned your name.

Maybe that’s how our constellation was made.

Slowly, all those laughs, accidental meetings, late-night conversations, and little memories turned into promises.

The kind that quietly become a lifetime.

Maybe this is just how I imagine us in another universe.

Or maybe there are a thousand more versions of us out there, each one a little more beautiful.

Because with you, every universe is beautiful.

And one thing I’m sure of is this—

In every universe, I’d still choose you.`;
function show(i){
  scenes[current].classList.remove('active');
  current = i;
  scenes[current].classList.add('active');
  typeSubtitle(scenes[current])
  if (i === 16) {
  setTimeout(startStoryTyping, 300);
}

  // reset scroll to top whenever a new page opens
  scenes[current].scrollTop = 0;
}
function startStoryTyping(){
  const storyText = document.getElementById('storyText');
  const replayStory = document.getElementById('replayStory');
  if (!storyText) return;

  storyText.textContent = '';
  storyText.classList.remove('done');
  if (replayStory){
    replayStory.classList.remove('show');
    replayStory.classList.add('hidden');
  }

  let i = 0;

  function type(){
    if (i >= story.length){
      storyText.classList.add('done');
      if (replayStory){
        replayStory.classList.add('show');
      }
      return;
    }

    storyText.textContent += story.charAt(i);
    i++;

    const ch = story.charAt(i-1);
    let delay = 55;
    if (ch === '\n') delay = 300;
    else if (ch === '.' || ch === ',' || ch === '—') delay = 180;

    setTimeout(type, delay);
  }

  type();
}
function createSparkle(x, y){
  const s = document.createElement('div');
  s.className = 'sparkle';

  const ox = (Math.random() - 0.5) * 16;
  const oy = (Math.random() - 0.5) * 16;

  s.style.left = (x + ox) + 'px';
  s.style.top  = (y + oy) + 'px';

  document.body.appendChild(s);
  setTimeout(() => s.remove(), 700);
}
function makeSlider(id, next) {
  const el = document.getElementById(id);

  let down = false;
  let startX = 0;
  let currentX = 0;

  el.addEventListener('pointerdown', e => {
    startMusic();
    down = true;
    startX = e.clientX;
    el.style.transition = 'none';
    el.setPointerCapture(e.pointerId);
  });

  el.addEventListener('pointermove', e => {
    if (!down) return;

    const rect = el.parentElement.getBoundingClientRect();
    const max = rect.width - el.offsetWidth;

    currentX = Math.max(0, Math.min(max, e.clientX - startX));
el.style.transform = `translate(${currentX}px, -50%)`;

// Sparkle trail
const r = el.getBoundingClientRect();
createSparkle(r.left + r.width / 2, r.top + r.height / 2);
  });

  function finish() {
    if (!down) return;
    down = false;

    const rect = el.parentElement.getBoundingClientRect();
    const max = rect.width - el.offsetWidth;

    el.style.transition = 'transform .28s cubic-bezier(.22,1,.36,1)';

if (currentX > max * 0.7) {
  el.style.transform = `translate(${max}px, -50%) scale(1.15)`;
  el.style.filter = 'drop-shadow(0 0 22px rgba(245,217,139,.95))';

  if (navigator.vibrate) navigator.vibrate(30);

  setTimeout(() => {
    el.style.transition = 'none';
    el.style.transform = 'translate(0, -50%) scale(1)';
    el.style.filter = '';
    currentX = 0;
    show(next);
  }, 340);
}
else {
      el.style.transform = 'translate(0, -50%)';
      currentX = 0;
    }
  }

  el.addEventListener('pointerup', finish);
  el.addEventListener('pointercancel', finish);
  el.addEventListener('pointerleave', finish);
}
makeSlider('startStar',1);makeSlider('plane',2);makeSlider('heart',7);makeSlider('ring',11);
let holdTimer;
let holdSparkInterval = null;

function holdSparkle(targetX, targetY){
  const s = document.createElement('div');
  s.className = 'hold-spark';

  // Spawn from anywhere on the screen
  const startX = Math.random() * window.innerWidth;
  const startY = Math.random() * window.innerHeight;

  s.style.left = startX + 'px';
  s.style.top = startY + 'px';
  s.style.opacity = '1';
  s.style.transform = 'translate(-50%, -50%) scale(1)';

  document.body.appendChild(s);

  // Force layout so the transition starts correctly
  s.offsetWidth;

  // Move directly to the hold point
  s.style.left = targetX + 'px';
  s.style.top = targetY + 'px';
  s.style.opacity = '0';
  s.style.transform = 'translate(-50%, -50%) scale(0)';

  setTimeout(() => s.remove(), 700);
}
function startHoldEffect(el){
  el.classList.add('hold-glow');

  holdSparkInterval = setInterval(() => {
    const r = el.getBoundingClientRect();
    const targetX = r.left + r.width / 2;
    const targetY = r.top + r.height / 2;

    holdSparkle(targetX, targetY);
  }, 70);
}
function stopHoldEffect(el){
  el.classList.remove('hold-glow');
  clearInterval(holdSparkInterval);
  holdSparkInterval = null;
}

['umbrella','promise','promiseFinal'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;

  el.addEventListener('pointerdown', (e) => {
  if (id === 'promise' || id === 'promiseFinal') {
    el.classList.add('active');
  }

  const x = e.clientX;
const y = e.clientY;
startHoldEffect(el, x, y);

  holdTimer = setTimeout(() => {
    stopHoldEffect(el);

    if (id === 'umbrella') {
      show(3);
    } else if (id === 'promise') {
      if (navigator.vibrate) navigator.vibrate(50);
      setTimeout(() => {
        show(15);
      }, 900);
    } else if (id === 'promiseFinal') {
      if (navigator.vibrate) navigator.vibrate(50);
      setTimeout(() => {
        show(16);
      }, 900);
    }
  }, 2000);
});

['pointerup','pointercancel','pointerleave'].forEach(evt => {
  el.addEventListener(evt, () => {
    clearTimeout(holdTimer);
    stopHoldEffect(el);

    if (id === 'promise' || id === 'promiseFinal') {
      el.classList.remove('active');
    }
  });
});
});

// Swipe gesture for Scene 4 (current === 3)
let swipeX = 0;
let swipeY = 0;

document.addEventListener('touchstart', (e) => {
  if (current !== 3) return;
  swipeX = e.touches[0].clientX;
  swipeY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  if (current !== 3) return;

  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;

  const dx = endX - swipeX;
  const dy = endY - swipeY;

// Horizontal swipe only
if (Math.abs(dx) > 160 && Math.abs(dx) > Math.abs(dy) * 1.5) {
  show(4);
}
}, { passive: true });
let petalsCaught = 0;
document.querySelectorAll('#petalField .petal').forEach(petal => {
  petal.addEventListener('click', () => {
    if (petal.classList.contains('gone')) return;

    petal.classList.add('gone');
    petalsCaught++;

    if (navigator.vibrate) navigator.vibrate(15);

    if (petalsCaught >= 6) {
      setTimeout(() => {
        petalsCaught = 0;
        document.querySelectorAll('#petalField .petal')
          .forEach(p => p.classList.remove('gone'));
        show(5);
      }, 400);
    }
  });
});
let petalsCaught2 = 0;
const field2 = document.getElementById('petalField2');

document.querySelectorAll('#petalField2 .petal').forEach(petal => {
  petal.addEventListener('click', () => {
    if (petal.dataset.collected === '1') return;

    petal.dataset.collected = '1';
    petalsCaught2++;

    // Move every petal to the center bouquet
    petal.style.transition = 'all .6s cubic-bezier(.22,1,.36,1)';
    petal.style.left = '50%';
    petal.style.top = '50%';

    // Small random offset so they stack like a bouquet
    const ox = (Math.random() - 0.5) * 26;
    const oy = (Math.random() - 0.5) * 26;
    petal.style.transform = `translate(-50%, -50%) translate(${ox}px, ${oy}px) scale(.95)`;

    if (navigator.vibrate) navigator.vibrate(15);

    if (petalsCaught2 >= 6) {
      setTimeout(() => {
        // Fade the whole bouquet away
        document.querySelectorAll('#petalField2 .petal').forEach(p => {
          p.style.transition = 'opacity .45s ease, transform .45s ease';
          p.style.opacity = '0';
          p.style.transform += ' scale(.6)';
        });

        setTimeout(() => {
          // Reset petals for replay
          petalsCaught2 = 0;
          document.querySelectorAll('#petalField2 .petal').forEach(p => {
            p.dataset.collected = '0';
            p.style.transition = '';
            p.style.left = '';
            p.style.top = '';
            p.style.transform = '';
            p.style.opacity = '';
          });

          show(09); // Scene 14
        }, 450);
      }, 500);
    }
  });
});
// Smooth constellation interaction
const sky = document.getElementById('sky');
const ctx = sky.getContext('2d');

function resizeSky() {
  sky.width = sky.clientWidth;
  sky.height = sky.clientHeight;

  // Reapply drawing style after resize/fullscreen
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#f5d98b';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#f5d98b';
  ctx.shadowBlur = 10;
}
resizeSky();
window.addEventListener('resize', resizeSky);

let drawing = false;
let distance = 0;
let lastX = 0;
let lastY = 0;

ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.strokeStyle = '#f5d98b';
ctx.lineWidth = 4;
ctx.shadowColor = '#f5d98b';
ctx.shadowBlur = 10;

function getPos(e) {
  const rect = sky.getBoundingClientRect();
  const touch = e.touches ? e.touches[0] : e;
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top
  };
}

function startDraw(e) {
  drawing = true;
  distance = 0;
  const p = getPos(e);
  lastX = p.x;
  lastY = p.y;
  ctx.clearRect(0, 0, sky.width, sky.height);
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
}

function moveDraw(e) {
  if (!drawing) return;
  e.preventDefault();

  const p = getPos(e);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();

  distance += Math.hypot(p.x - lastX, p.y - lastY);
  lastX = p.x;
  lastY = p.y;
}

function endDraw() {
  if (!drawing) return;
  drawing = false;

  if (distance > 180) {
    // Draw a glowing heart
    ctx.clearRect(0, 0, sky.width, sky.height);
    ctx.beginPath();

    const cx = sky.width / 2;
    const cy = sky.height / 2;
    const s = 40;

    ctx.moveTo(cx, cy + s);
    ctx.bezierCurveTo(cx + 60, cy - 20, cx + 120, cy + 40, cx, cy + 120);
    ctx.bezierCurveTo(cx - 120, cy + 40, cx - 60, cy - 20, cx, cy + s);
    ctx.stroke();

    if (navigator.vibrate) navigator.vibrate(25);

    setTimeout(() => show(6), 700);
  } else {
    ctx.clearRect(0, 0, sky.width, sky.height);
  }
}

sky.addEventListener('mousedown', startDraw);
sky.addEventListener('mousemove', moveDraw);
window.addEventListener('mouseup', endDraw);

sky.addEventListener('touchstart', startDraw, { passive: true });
sky.addEventListener('touchmove', moveDraw, { passive: false });
sky.addEventListener('touchend', endDraw);

function resetConstellation(){
  if (!leftName || !rightName || !shivika || !mergeCanvas) return;

  // Reset visuals
  shivika.classList.remove('show');
  shivika.textContent = '';

  leftName.style.opacity = '1';
  rightName.style.opacity = '1';

  leftName.style.transform = 'translateY(-50%)';
  rightName.style.transform = 'translateY(-50%)';

  // Clear canvas
  const ctxReset = mergeCanvas.getContext('2d');
  ctxReset.clearRect(0, 0, mergeCanvas.width, mergeCanvas.height);
}
function resetEverything() {
  // Music
  music.pause();
  music.currentTime = 0;

  // Sliders
  ['startStar','plane','heart','ring'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.transition = 'none';
      el.style.transform = 'translate(0, -50%)';
    }
  });

  // Drawing canvas
  // reset drawing canvas
ctx.clearRect(0, 0, sky.width, sky.height);

// reset candle
const candle = document.getElementById('candle');
if (candle) candle.classList.remove('active');

// Restore drawing style
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.strokeStyle = '#f5d98b';
ctx.lineWidth = 4;
ctx.shadowColor = '#f5d98b';
ctx.shadowBlur = 10;

// Reset drawing state
drawing = false;
distance = 0;
lastX = 0;
lastY = 0;

  // Constellation
  resetConstellation();
  window.constellationMerged = false;

  // Story page
  const storyText = document.getElementById('storyText');
  if (storyText) {
    storyText.textContent = '';
    storyText.classList.remove('done');
  }

  const replayStory = document.getElementById('replayStory');
  if (replayStory) {
    replayStory.classList.remove('show');
    replayStory.classList.add('hidden');
  }
}
// Replay button - return to the first scene
const replayStory = document.getElementById('replayStory');

if (replayStory) {
  replayStory.addEventListener('click', () => {
    resetEverything();
    show(0);
  });
}
const brightStar = document.getElementById('brightStar');
if (brightStar) {
  brightStar.addEventListener('click', () => {
    if (navigator.vibrate) navigator.vibrate(20);
    show(9); // go to Scene 10
  });
}
// Lantern interaction (Scene 10)
const lantern = document.getElementById('lantern');

if (lantern) {
  let startY = 0;
  let dragging = false;

  lantern.addEventListener('pointerdown', e => {
    if (current !== 10) return;
    dragging = true;
    startY = e.clientY;
    lantern.setPointerCapture(e.pointerId);
  });

  lantern.addEventListener('pointermove', e => {
    if (!dragging || current !== 10) return;

    const dy = startY - e.clientY;

    if (dy > 120) {
      dragging = false;
      lantern.classList.add('floating');

      if (navigator.vibrate) navigator.vibrate(20);

      setTimeout(() => {
        lantern.classList.remove('floating');
        show(12); // Go to Scene 11
      }, 1200);
    }
  });

  lantern.addEventListener('pointerup', () => dragging = false);
  lantern.addEventListener('pointercancel', () => dragging = false);
}
// Polaroid swipe interaction (Scene 11)
const polaroid = document.getElementById('polaroid');

if (polaroid) {
  let startX = 0;
  let dragging = false;

  polaroid.addEventListener('pointerdown', e => {
    if (current !== 9) return; // only work on Scene 11
    dragging = true;
    startX = e.clientX;
    polaroid.style.transition = 'none';
    polaroid.setPointerCapture(e.pointerId);
  });

  polaroid.addEventListener('pointermove', e => {
    if (!dragging || current !== 9) return;

    const dx = e.clientX - startX;

    polaroid.style.transform =
      `translate(${dx}px, ${Math.abs(dx) * 0.08}px) rotate(${dx * 0.08}deg)`;
  });

  function endSwipe(e) {
    if (!dragging || current !== 9) return;
    dragging = false;

    const dx = e.clientX - startX;

    if (Math.abs(dx) > 120) {
      polaroid.style.transition = 'transform .45s ease, opacity .45s ease';
      polaroid.style.transform =
        `translate(${dx > 0 ? 700 : -700}px, 120px) rotate(${dx > 0 ? 25 : -25}deg)`;
      polaroid.style.opacity = '0';

      if (navigator.vibrate) navigator.vibrate(20);

      setTimeout(() => {
        polaroid.style.transition = 'none';
        polaroid.style.transform = 'translate(0,0) rotate(0deg)';
        polaroid.style.opacity = '1';
        show(13); // go to Scene 12
      }, 450);
    } else {
      polaroid.style.transition = 'transform .25s ease';
      polaroid.style.transform = 'translate(0,0) rotate(0deg)';
    }
  }

  polaroid.addEventListener('pointerup', endSwipe);
  polaroid.addEventListener('pointercancel', () => dragging = false);
}
// Candle interaction (Scene 12)
const candle = document.getElementById('candle');

if (candle) {
  candle.addEventListener('click', () => {
    if (navigator.vibrate) navigator.vibrate(20);

    candle.classList.add('active');

    setTimeout(() => {
      show(10);   // Go to Chapter 12
    }, 800);
  });
}
// ---------- Scene 14: Particle constellation merge ----------

const mergeArea = document.getElementById('mergeArea');
const leftName = document.getElementById('hritvik');
const rightName = document.getElementById('shalini');
const shivika = document.getElementById('shivika');
const mergeCanvas = document.getElementById('mergeCanvas');

if (mergeArea && leftName && rightName && shivika && mergeCanvas) {
  const ctx = mergeCanvas.getContext('2d');

  function resizeCanvas() {
    mergeCanvas.width = mergeCanvas.clientWidth;
    mergeCanvas.height = mergeCanvas.clientHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let active = null;
  let startX = 0;
  window.constellationMerged = false;

  function drawParticles(particles) {
    ctx.clearRect(0,0,mergeCanvas.width,mergeCanvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.fillStyle = '#f5d98b';
      ctx.shadowColor = '#f5d98b';
      ctx.shadowBlur = 10;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function particleMerge() {
if (window.constellationMerged) return;
    window.constellationMerged = true;

    // Bring names together elegantly
    leftName.style.transform = 'translate(78px,-50%)';
rightName.style.transform = 'translate(-78px,-50%)';

    setTimeout(() => {
      leftName.style.opacity = '0';
      rightName.style.opacity = '0';

      const particles = [];
      const centerX = mergeCanvas.width / 2;
      const centerY = mergeCanvas.height * 0.38;

      // Create particles from both sides
      for (let i = 0; i < 90; i++) {
        particles.push({
          x: i < 45 ? 60 + Math.random() * 80 : mergeCanvas.width - 140 + Math.random() * 80,
          y: 70 + Math.random() * 40,
          r: 1.5 + Math.random() * 2,
          angle: Math.random() * Math.PI * 2,
          radius: 80 + Math.random() * 30
        });
      }

      let frame = 0;

      function animate() {
        frame++;
        particles.forEach(p => {
          p.angle += 0.08;
          p.radius *= 0.97;
          p.x += (centerX + Math.cos(p.angle) * p.radius - p.x) * 0.12;
          p.y += (centerY + Math.sin(p.angle) * p.radius - p.y) * 0.12;
        });

        drawParticles(particles);

        if (frame < 55) {
          requestAnimationFrame(animate);
        } else {
          ctx.clearRect(0,0,mergeCanvas.width,mergeCanvas.height);
          shivika.textContent = 'SHIVIKA';
          shivika.classList.add('show');

          setTimeout(() => {
            show(14);
          }, 1800);
        }
      }

      animate();
    }, 550);
  }

  function down(el, e) {
    if (window.constellationMerged) return;
    if (!document.getElementById('s13').classList.contains('active')) return;
    active = el;
    startX = e.clientX;
    el.setPointerCapture(e.pointerId);
  }

  function move(e) {
    if (!active || window.constellationMerged) return;

    const dx = e.clientX - startX;

    if (active === leftName) {
      const m = Math.max(0, Math.min(140, dx));
      leftName.style.transform = `translate(${m}px,-50%)`;
      rightName.style.transform = `translate(${-m * 0.45}px,-50%)`;
      if (m > 110) particleMerge();
    } else {
      const m = Math.min(0, Math.max(-140, dx));
      rightName.style.transform = `translate(${m}px,-50%)`;
      leftName.style.transform = `translate(${-m * 0.45}px,-50%)`;
      if (m < -110) particleMerge();
    }
  }

  function up() {
    if (!active || window.constellationMerged) return;
    active = null;
    leftName.style.transform = 'translateY(-50%)';
    rightName.style.transform = 'translateY(-50%)';
  }

  [leftName, rightName].forEach(el => {
    el.addEventListener('pointerdown', e => down(el, e));
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  });
}
function typeSubtitle(scene){
  const el = scene.querySelector('.chapter-subtitle');
  if (!el) return;

  const text = el.dataset.text || '';
  el.textContent = '';

  let i = 0;
  clearInterval(el._typing);

  el._typing = setInterval(() => {
    el.textContent += text.charAt(i);
    i++;
    if (i >= text.length){
      clearInterval(el._typing);
    }
  }, 42);
}
window.addEventListener('load', () => {
  typeSubtitle(scenes[current]);
});