const easeOutCubic = t => (--t)*t*t+1;

const typeText = (element, text, delay = 70) => {
  element.textContent = '';
  let index = 0;
  const type = () => {
    if (index <= text.length) {
      element.textContent = text.slice(0, index++);
      setTimeout(type, delay);
    }
  };
  type();
};

const updateScrollBar = () => {
  const bar = document.querySelector('.scroll-progress__bar');
  if (!bar) return;
  const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  bar.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
};

const initCursor = () => {
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower) return;

  window.addEventListener('pointermove', e => {
    cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    follower.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  });

  document.querySelectorAll('a, button, .cta, .profile-button, .schedule-button, summary').forEach(el => {
    el.addEventListener('pointerenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    el.addEventListener('pointerleave', () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });
};

const initThemeToggle = () => {
  const button = document.querySelector('.theme-toggle');
  if (!button) return;
  const setMode = mode => {
    if (mode === 'light') {
      document.body.classList.add('light-mode');
      button.textContent = '☾';
    } else {
      document.body.classList.remove('light-mode');
      button.textContent = '☀';
    }
    localStorage.setItem('ace-theme', mode);
  };

  const saved = localStorage.getItem('ace-theme') || 'dark';
  setMode(saved);

  button.addEventListener('click', () => {
    const next = document.body.classList.contains('light-mode') ? 'dark' : 'light';
    setMode(next);
  });
};

const initAudioControl = () => {
  let audio = document.querySelector('#gym-audio');
  if (!audio) {
    audio = document.createElement('audio');
    audio.id = 'gym-audio';
    audio.src = 'videos/gym-music.mp3';
    audio.loop = true;
    audio.preload = 'none';
    document.body.appendChild(audio);
  }

  let button = document.querySelector('.audio-toggle');
  if (!button) {
    button = document.createElement('button');
    button.className = 'audio-toggle';
    button.type = 'button';
    button.setAttribute('aria-label', 'Toggle gym music');
    button.textContent = '🔈';
    document.body.appendChild(button);
  }

  const updateButton = playing => {
    button.textContent = playing ? '🔊' : '🔈';
    button.dataset.playing = playing ? 'true' : 'false';
  };

  button.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {});
      updateButton(true);
    } else {
      audio.pause();
      updateButton(false);
    }
  });

  updateButton(false);
};

const initBackToTop = () => {
  const button = document.querySelector('.back-to-top');
  if (!button) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      button.classList.add('visible');
    } else {
      button.classList.remove('visible');
    }
  });
  button.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
};

const initStickyNav = () => {
  const nav = document.querySelector('.header-nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav-scrolled', window.scrollY > 60);
  });
};

const initTyping = () => {
  document.querySelectorAll('.typing-text').forEach(el => {
    const text = el.dataset.text || el.textContent.trim();
    if (text.length) typeText(el, text, 65);
  });
};

const initStats = () => {
  document.querySelectorAll('.stat-number').forEach(counter => {
    const rawTarget = counter.getAttribute('data-target') || '0';
    const suffix = counter.getAttribute('data-suffix') || '';
    const decimals = parseInt(counter.getAttribute('data-decimals') || (rawTarget.indexOf('.')>-1?1:0),10);
    const target = parseFloat(rawTarget);
    const duration = 1400;
    const start = performance.now();
    const step = now => {
      const progress = Math.min((now-start)/duration,1);
      const value = target * easeOutCubic(progress);
      counter.innerText = decimals > 0 ? `${value.toFixed(decimals)}${suffix}` : `${Math.round(value).toLocaleString()}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
};

const initBMI = () => {
  const form = document.querySelector('.bmi-form');
  if (!form) return;
  const result = form.querySelector('.bmi-result');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const weight = parseFloat(form.weight.value);
    const height = parseFloat(form.height.value) / 100;
    if (!weight || !height) return;
    const bmi = weight / (height * height);
    let category = 'Unknown';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';
    result.textContent = `Your BMI is ${bmi.toFixed(1)} — ${category}.`;
  });
};

const initSchedule = () => {
  const buttons = Array.from(document.querySelectorAll('.schedule-button'));
  const cards = Array.from(document.querySelectorAll('.workout-card'));
  if (!buttons.length || !cards.length) return;
  const update = day => {
    buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.day === day));
    cards.forEach(card => card.classList.toggle('active', card.dataset.day === day));
  };
  buttons.forEach(button => {
    button.addEventListener('click', () => update(button.dataset.day));
  });
  update(buttons[0].dataset.day);
};

const initMap = () => {
  const map = document.querySelector('.map-card');
  if (!map) return;
  map.addEventListener('load', () => {
    console.log('Map loaded');
  });
};

const initFeatures = () => {
  initCursor();
  initThemeToggle();
  initAudioControl();
  initBackToTop();
  initStickyNav();
  initTyping();
  initStats();
  initBMI();
  initSchedule();
  initMap();
  updateScrollBar();
  window.addEventListener('scroll', updateScrollBar);
};

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded','theme-premium');
  const loader = document.querySelector('.loading-screen');
  if (loader) setTimeout(() => loader.classList.add('fade-out'), 900);
  initFeatures();
});
