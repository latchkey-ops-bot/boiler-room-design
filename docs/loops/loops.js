/* Boiler Room loop diagrams. A page passes its stations, pipes and steps to BRLoop, which builds
   the stage and plays it. Like the films, the whole picture is a pure function of the frame
   number, at 12 frames a second, so stepping and scrubbing land on exactly the same picture. */
(function () {
  const FPS = 12;
  const W = 1600;
  const H = 900;
  const SPEED = 30; // pixels per frame along a pipe
  const HOLD = 50; // frames a step stays on screen after the packet arrives
  const END_PAUSE = 36; // frames on the last step before the loop starts again

  const ICONS = () => window.BR_ICONS || {};
  const icon = (name, cls = '') => `<i class="icon ${cls}">${ICONS()[name] || ''}</i>`;
  const STATUS = {
    live: '<span class="badge badge-done st-status">Live</span>',
    building: '<span class="badge badge-working st-status">Building</span>',
    planned: '<span class="badge badge-queued st-status">Planned</span>',
    paused: '<span class="badge badge-queued st-status">Paused</span>',
  };
  const VERDICT = {
    pass: 'badge badge-done verdict',
    fail: 'badge badge-failed verdict',
    work: 'badge badge-working verdict',
    human: 'badge badge-needs verdict',
  };

  function lengths(points) {
    const out = [];
    for (let i = 1; i < points.length; i++) {
      out.push(Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
    }
    return out;
  }

  function along(points, t) {
    const parts = lengths(points);
    let distance = t * parts.reduce((sum, part) => sum + part, 0);
    for (let i = 0; i < parts.length; i++) {
      if (distance <= parts[i] || i === parts.length - 1) {
        const f = parts[i] ? Math.min(1, distance / parts[i]) : 0;
        const [a, b] = [points[i], points[i + 1]];
        return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
      }
      distance -= parts[i];
    }
    return points[points.length - 1];
  }

  const svgPoints = (points) => points.map((p) => p.join(',')).join(' ');

  window.BRLoop = function BRLoop(cfg) {
    const stage = document.getElementById('stage');
    const stations = Object.fromEntries(cfg.stations.map((s) => [s.id, s]));
    const at = (id) => [stations[id].x, stations[id].y];
    const pipes = cfg.pipes.map((p) => ({ ...p, points: p.points || [at(p.from), at(p.to)] }));
    const pipeById = Object.fromEntries(pipes.map((p) => [p.id, p]));

    // ---------- The timeline: every step's start frame, travel and hold ----------
    const steps = [];
    let cursor = 0;
    let from = cfg.start;
    for (const step of cfg.steps) {
      const route = step.via
        ? [at(from), ...pipeById[step.via].points, at(step.to)]
        : [at(from), at(step.to)];
      const distance = lengths(route).reduce((sum, part) => sum + part, 0);
      const travel = step.to === from ? 0 : Math.max(6, Math.round(distance / SPEED));
      steps.push({ ...step, from, route, start: cursor, travel, hold: step.hold ?? HOLD });
      cursor += travel + (step.hold ?? HOLD);
      from = step.to;
    }
    const total = cursor;
    const arrived = (i) => steps[i].start + steps[i].travel;

    // ---------- Build the stage ----------
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'pipes');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    const line = (points, cls) => {
      const el = document.createElementNS(svgNS, 'polyline');
      el.setAttribute('points', svgPoints(points));
      el.setAttribute('class', cls);
      svg.append(el);
      return el;
    };
    const backLines = {};
    for (const pipe of pipes) {
      if (pipe.kind === 'back') {
        backLines[pipe.id] = line(pipe.points, 'pipe-back');
      } else {
        line(pipe.points, 'pipe-outer');
        line(pipe.points, 'pipe-inner');
      }
    }
    const flow = line([[0, 0]], 'pipe-flow');
    stage.append(svg);

    for (const pipe of pipes) {
      if (!pipe.label) continue;
      const label = document.createElement('span');
      label.className = `badge ${pipe.kind === 'back' ? 'badge-failed' : 'badge-plain'} pipe-label`;
      label.textContent = pipe.label;
      label.style.left = `${pipe.labelAt[0]}px`;
      label.style.top = `${pipe.labelAt[1]}px`;
      stage.append(label);
    }

    const stationEls = {};
    for (const s of cfg.stations) {
      const el = document.createElement('div');
      el.className = 'station card px';
      el.dataset.kind = s.kind || 'agent';
      el.style.left = `${s.x}px`;
      el.style.top = `${s.y}px`;
      el.innerHTML =
        `<span class="crew">${icon(s.icon)}</span>` +
        `<div><div class="name">${s.name}</div><div class="what">${s.what}</div></div>` +
        (s.status ? STATUS[s.status] : '') +
        `<span class="verdict"></span>` +
        `<div class="progress meter"><span style="width: 0"></span></div>` +
        `<img class="steam" src="../../design-system/logo/puff.svg" alt=""><img class="steam" src="../../design-system/logo/puff.svg" alt="">` +
        `<span class="sparkles">${icon('sparkle')}${icon('sparkle')}${icon('sparkle')}${icon('sparkle')}</span>`;
      stage.append(el);
      stationEls[s.id] = el;
    }

    const packet = document.createElement('div');
    packet.className = 'packet';
    packet.hidden = true;
    stage.append(packet);

    let board = null;
    if (cfg.board) {
      board = document.createElement('section');
      board.className = 'board card card-flat';
      board.style.left = `${cfg.board.x}px`;
      board.style.top = `${cfg.board.y}px`;
      board.innerHTML =
        `<div class="board-head"><span class="label">${cfg.board.title}</span><span class="label muted">${cfg.board.note}</span></div>` +
        `<div class="now">${icon('doc')}<span class="card-title"></span><span class="badge badge-working who"></span></div>` +
        `<ol></ol>`;
      stage.append(board);
    }

    const caption = document.createElement('footer');
    caption.className = 'caption card';
    caption.innerHTML =
      `<span class="score cap-num"></span>` +
      `<div><h2 class="cap-title"></h2><p class="cap-text"></p></div>` +
      `<div class="cap-side">` +
      `<div class="controls">` +
      `<button class="btn btn-sm prev" aria-label="Previous step">${icon('arrow-right')}</button>` +
      `<button class="btn btn-sm btn-primary play" aria-label="Pause">${icon('play')}</button>` +
      `<button class="btn btn-sm next" aria-label="Next step">${icon('arrow-right')}</button>` +
      `</div>` +
      `<div class="dots">${steps.map((_, i) => `<button aria-label="Step ${i + 1}" data-i="${i}"></button>`).join('')}</div>` +
      `<span class="label keys">← → step · space pause · S status</span>` +
      `</div>`;
    stage.append(caption);
    const dots = [...caption.querySelectorAll('.dots button')];
    const playButton = caption.querySelector('.play');

    // ---------- Render one frame ----------
    function stepAt(frame) {
      let i = steps.length - 1;
      while (i > 0 && steps[i].start > frame) i--;
      return i;
    }

    function render(frame) {
      const f = Math.min(frame, total - 1);
      const i = stepAt(f);
      const s = steps[i];
      const local = f - s.start;
      const moving = local < s.travel;

      // The packet rides the pipe, then disappears into the station that works on it
      if (moving) {
        const [x, y] = along(s.route, local / s.travel);
        packet.hidden = false;
        packet.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px) translate(-50%, -50%)`;
        packet.dataset.tone = s.tone || '';
        packet.innerHTML = `${icon(s.carryIcon || 'doc')}${s.carry}`;
        flow.setAttribute('points', svgPoints(s.route));
        flow.setAttribute('class', s.via ? 'pipe-flow back' : 'pipe-flow');
        flow.style.strokeDashoffset = String(-frame * 6);
      } else {
        packet.hidden = true;
        flow.setAttribute('points', '0,0');
      }

      const visited = new Set([cfg.start, ...steps.slice(0, i).map((step) => step.to)]);
      for (const [id, el] of Object.entries(stationEls)) {
        const active = !moving && id === s.to;
        el.dataset.state = active ? 'active' : visited.has(id) ? 'done' : 'idle';
        el.dataset.verdict = active && s.verdict ? s.verdict[0] : '';
        const verdict = el.querySelector('.verdict');
        if (active && s.verdict) {
          verdict.className = VERDICT[s.verdict[0]];
          verdict.textContent = s.verdict[1];
        }
        const meter = el.querySelector('.meter > span');
        if (active && s.meter) {
          const done = Math.min(1, (local - s.travel) / Math.max(1, s.hold - 12));
          meter.parentElement.style.display = '';
          meter.style.width = `${Math.floor(done * 20) * 5}%`;
        } else {
          meter.parentElement.style.display = 'none';
        }
      }

      for (const [id, el] of Object.entries(backLines)) {
        el.classList.toggle('hinted', !moving && (s.hint || []).includes(id));
      }

      caption.querySelector('.cap-num').textContent = String(i + 1).padStart(2, '0');
      caption.querySelector('.cap-title').textContent = s.title;
      caption.querySelector('.cap-text').textContent = s.text;
      dots.forEach((dot, n) => {
        dot.classList.toggle('seen', n < i);
        if (n === i) dot.setAttribute('aria-current', 'step');
        else dot.removeAttribute('aria-current');
      });

      if (board) {
        board.querySelector('.card-title').textContent = s.board.card;
        board.querySelector('.who').textContent = s.board.who;
        const log = steps.slice(0, i + 1).filter((step) => step.board.log).map((step) => step.board.log).slice(-3);
        board.querySelector('ol').innerHTML = log.map((entry) => `<li>${icon('check')}${entry}</li>`).join('');
      }
    }

    // ---------- Playback ----------
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = reduced ? arrived(0) : 0;
    let playing = !reduced;
    let stopAt = null;

    function setPlaying(value) {
      playing = value;
      playButton.innerHTML = playing ? '<span class="pause-glyph" aria-hidden="true"></span>' : icon('play');
      playButton.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    }

    function jump(i, animate) {
      const target = steps[(i + steps.length) % steps.length];
      if (animate && !reduced) {
        frame = target.start;
        if (!playing) {
          stopAt = arrived(steps.indexOf(target));
          setPlaying(true);
        }
      } else {
        frame = arrived(steps.indexOf(target));
      }
      render(frame);
    }

    setInterval(() => {
      if (!playing) return;
      frame += 1;
      if (stopAt != null && frame >= stopAt) {
        frame = stopAt;
        stopAt = null;
        setPlaying(false);
      }
      if (frame >= total + END_PAUSE) frame = 0;
      render(frame);
    }, 1000 / FPS);

    caption.querySelector('.next').addEventListener('click', () => jump(stepAt(frame) + 1, true));
    caption.querySelector('.prev').addEventListener('click', () => jump(stepAt(frame) - 1, false));
    playButton.addEventListener('click', () => {
      stopAt = null;
      setPlaying(!playing);
    });
    dots.forEach((dot) => dot.addEventListener('click', () => jump(Number(dot.dataset.i), false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'PageDown') jump(stepAt(frame) + 1, true);
      else if (event.key === 'ArrowLeft' || event.key === 'PageUp') jump(stepAt(frame) - 1, false);
      else if (event.key === ' ') {
        stopAt = null;
        setPlaying(!playing);
      } else if (event.key === 's' || event.key === 'S') stage.classList.toggle('hide-status');
      else if (event.key === 'f' || event.key === 'F') {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen?.();
      } else return;
      event.preventDefault();
    });

    // ---------- Fit the 1600 by 900 stage to the window ----------
    function fit() {
      stage.style.setProperty('--scale', Math.min(window.innerWidth / W, window.innerHeight / H));
    }
    window.addEventListener('resize', fit);
    fit();
    setPlaying(playing);
    render(frame);
  };
})();
