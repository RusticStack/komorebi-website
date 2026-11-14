// The site's video player (src/components/Player.astro): the launch film and the help videos.
// The markup is a plain <video controls>; this script takes the native controls away and gives the
// player its own: the big play button, the control pill, the scrubber, captions drawn by the page,
// speed, full screen and the keys. Without it the native controls stay.
//
// Keys, while focus is anywhere in the player: Space or K play and pause, Left and Right seek 5 s
// (Home and End on the scrubber go to the ends), F full screen, M mute, C captions.
//
// The film (data-mode="film") plays itself, muted and looping, while at least half of it is on
// screen, and pauses when it leaves; once the visitor pauses it, it stays paused. With reduced
// motion or Save-Data it waits for a press like the help videos.

type Strings = {
  play: string;
  pause: string;
  replay: string;
  mute: string;
  unmute: string;
  fullscreen: string;
  exitFullscreen: string;
  timeOf: string;
  speed: string;
};

type FullscreenVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
  webkitDisplayingFullscreen?: boolean;
  mozHasAudio?: boolean;
  webkitAudioDecodedByteCount?: number;
  audioTracks?: { length: number };
};

const CAPTIONS_KEY = "player-captions";
const SPEEDS = [1, 1.25, 1.5, 2, 0.75];
const IDLE_MS = 2200;
const SEEK_S = 5;
const still = matchMedia("(prefers-reduced-motion: reduce)");
// a phone or tablet: full screen is the browser's own, on the video, with its own controls
const touch = matchMedia("(pointer: coarse)");

function clock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const s = Math.floor(seconds);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m % 60).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

function saveData(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData === true;
}

function setupPlayer(root: HTMLElement) {
  const video = root.querySelector<FullscreenVideo>("video")!;
  const stage = root.querySelector<HTMLElement>(".player-stage")!;
  const big = root.querySelector<HTMLButtonElement>(".player-big")!;
  const play = root.querySelector<HTMLButtonElement>(".pb-play")!;
  const scrub = root.querySelector<HTMLElement>(".pb-scrub")!;
  const now = root.querySelector<HTMLElement>(".pb-now")!;
  const total = root.querySelector<HTMLElement>(".pb-total")!;
  const mute = root.querySelector<HTMLButtonElement>(".pb-mute")!;
  const cc = root.querySelector<HTMLButtonElement>(".pb-cc");
  const speed = root.querySelector<HTMLButtonElement>(".pb-speed");
  const full = root.querySelector<HTMLButtonElement>(".pb-full")!;
  const caption = root.querySelector<HTMLElement>(".player-caption")!;
  const t = JSON.parse(root.dataset.strings ?? "{}") as Strings;
  const film = root.dataset.mode === "film";

  video.controls = false;
  root.tabIndex = -1;
  root.classList.add("is-ready");
  root.dataset.state = "idle"; // idle (never played), playing, paused, ended
  if (film) video.muted = true;

  // ---------- state ----------
  let userPaused = false;
  let started = false;
  const warm = () => {
    if (video.preload === "none") video.preload = "metadata";
  };
  const render = () => {
    const playing = !video.paused && !video.ended;
    root.dataset.state = playing ? "playing" : video.ended ? "ended" : started ? "paused" : "idle";
    play.setAttribute("aria-label", playing ? t.pause : video.ended ? t.replay : t.play);
    if (!playing) root.classList.remove("is-idle");
  };
  const toggle = (byUser = true) => {
    if (video.paused || video.ended) {
      userPaused = false;
      started = true;
      warm();
      if (film && !still.matches) video.loop = true;
      void video.play().catch(() => render());
    } else {
      if (byUser) userPaused = true;
      video.pause();
    }
  };
  video.addEventListener("play", () => {
    started = true;
    render();
  });
  video.addEventListener("pause", render);
  video.addEventListener("ended", render);
  video.addEventListener("waiting", () => root.classList.add("is-waiting"));
  video.addEventListener("playing", () => {
    root.classList.remove("is-waiting");
    render();
  });

  // ---------- time, progress and what has loaded ----------
  const progress = () => {
    const d = video.duration;
    const known = Number.isFinite(d) && d > 0;
    const p = known ? video.currentTime / d : 0;
    let b = 0;
    for (let i = 0; i < video.buffered.length; i++) {
      if (video.buffered.start(i) <= video.currentTime + 0.5) b = Math.max(b, video.buffered.end(i));
    }
    root.style.setProperty("--p", String(Math.min(1, p)));
    root.style.setProperty("--b", String(known ? Math.min(1, b / d) : 0));
    now.textContent = clock(video.currentTime);
    if (known) total.textContent = clock(d);
    root.classList.toggle("has-duration", known);
    scrub.setAttribute("aria-valuemax", String(known ? Math.round(d) : 0));
    scrub.setAttribute("aria-valuenow", String(Math.round(video.currentTime)));
    scrub.setAttribute("aria-valuetext", t.timeOf.replace("{a}", clock(video.currentTime)).replace("{b}", clock(known ? d : 0)));
  };
  for (const name of ["timeupdate", "durationchange", "loadedmetadata", "progress", "seeked"]) video.addEventListener(name, progress);
  progress();
  // timeupdate comes about four times a second; between them the played line follows each frame
  let frame = 0;
  const glide = () => {
    frame = 0;
    if (video.paused || video.ended || !(video.duration > 0)) return;
    root.style.setProperty("--p", String(Math.min(1, video.currentTime / video.duration)));
    frame = requestAnimationFrame(glide);
  };
  video.addEventListener("playing", () => {
    if (!frame && !still.matches) frame = requestAnimationFrame(glide);
  });

  const seekTo = (seconds: number) => {
    const d = video.duration;
    if (!Number.isFinite(d)) return;
    video.currentTime = Math.max(0, Math.min(d, seconds));
    progress();
  };
  const seekBy = (delta: number) => {
    warm();
    seekTo(video.currentTime + delta);
  };

  // the scrubber: press or drag anywhere on it; the keys move it like a slider
  const fromPointer = (event: PointerEvent) => {
    const box = scrub.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
    seekTo(x * video.duration);
  };
  let dragging = false;
  let resume = false;
  scrub.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    warm();
    if (!Number.isFinite(video.duration)) return;
    dragging = true;
    resume = !video.paused;
    if (resume) video.pause();
    scrub.setPointerCapture(event.pointerId);
    root.classList.add("is-scrubbing");
    fromPointer(event);
  });
  scrub.addEventListener("pointermove", (event) => {
    if (dragging) fromPointer(event);
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    root.classList.remove("is-scrubbing");
    if (resume) void video.play();
  };
  scrub.addEventListener("pointerup", release);
  scrub.addEventListener("pointercancel", release);
  scrub.addEventListener("keydown", (event) => {
    const d = video.duration;
    const step: Record<string, number> = { PageUp: 0.1, PageDown: -0.1 };
    if (event.key === "Home") seekTo(0);
    else if (event.key === "End") seekTo(d);
    else if (event.key in step && Number.isFinite(d)) seekBy(step[event.key] * d);
    else if (event.key === "ArrowUp") seekBy(SEEK_S);
    else if (event.key === "ArrowDown") seekBy(-SEEK_S);
    else return;
    event.preventDefault();
  });

  // ---------- sound: the button shows only once the video turns out to have an audio track ----------
  const hasAudio = () => Boolean(video.mozHasAudio || (video.webkitAudioDecodedByteCount ?? 0) > 0 || (video.audioTracks?.length ?? 0) > 0);
  const checkAudio = () => {
    if (!mute.hidden || !hasAudio()) return;
    mute.hidden = false;
    root.classList.add("has-audio");
  };
  video.addEventListener("loadeddata", checkAudio);
  video.addEventListener("timeupdate", checkAudio);
  const showMute = () => {
    root.classList.toggle("is-muted", video.muted);
    mute.setAttribute("aria-label", video.muted ? t.unmute : t.mute);
  };
  video.addEventListener("volumechange", showMute);
  showMute();
  const toggleMute = () => {
    if (mute.hidden) return;
    video.muted = !video.muted;
  };
  mute.addEventListener("click", toggleMute);

  // ---------- captions: drawn by the page in the lower third, above the controls ----------
  // Off at first on every player (the film's words are already in the picture); the CC button or
  // C turns them on, and the choice is remembered for this visitor's next videos.
  const track = video.textTracks[0];
  const showCaptions = (on: boolean, remember = true) => {
    if (!track || !cc) return;
    track.mode = on ? "hidden" : "disabled";
    cc.setAttribute("aria-pressed", String(on));
    root.classList.toggle("has-captions", on);
    if (!on) {
      caption.textContent = "";
      caption.classList.remove("on");
    }
    if (remember) {
      try {
        localStorage.setItem(CAPTIONS_KEY, on ? "on" : "off");
      } catch {
        // storage blocked: the choice lasts for this page only
      }
    }
  };
  if (track && cc) {
    track.mode = "disabled";
    track.addEventListener("cuechange", () => {
      const cues = track.activeCues;
      caption.textContent = cues && cues.length ? [...cues].map((c) => (c as VTTCue).text).join("\n") : "";
      caption.classList.toggle("on", caption.textContent !== "");
    });
    cc.addEventListener("click", () => showCaptions(cc.getAttribute("aria-pressed") !== "true"));
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(CAPTIONS_KEY);
    } catch {
      saved = null;
    }
    if (saved === "on") showCaptions(true, false);
  }
  const toggleCaptions = () => {
    if (cc) showCaptions(cc.getAttribute("aria-pressed") !== "true");
  };

  // ---------- speed (help videos) ----------
  speed?.addEventListener("click", () => {
    const next = SPEEDS[(SPEEDS.indexOf(video.playbackRate) + 1) % SPEEDS.length] ?? 1;
    video.playbackRate = next;
    video.defaultPlaybackRate = next;
    const text = `${next}×`;
    speed.textContent = text;
    speed.setAttribute("aria-label", `${t.speed}: ${text}`);
  });

  // ---------- full screen ----------
  // Wider screens put the whole player in full screen, so its own controls stay. On a phone the
  // video goes full screen the browser's way (on iPhone the only way), with the native controls.
  const isFull = () => document.fullscreenElement === root || document.fullscreenElement === video || video.webkitDisplayingFullscreen === true;
  const showFull = () => {
    const on = isFull();
    root.classList.toggle("is-full", document.fullscreenElement === root);
    full.setAttribute("aria-label", on ? t.exitFullscreen : t.fullscreen);
    if (!on && video.controls) video.controls = false;
  };
  document.addEventListener("fullscreenchange", showFull);
  video.addEventListener("webkitendfullscreen", () => {
    video.controls = false;
    showFull();
  });
  const canFullRoot = typeof root.requestFullscreen === "function" && document.fullscreenEnabled;
  const toggleFull = async () => {
    if (isFull()) {
      if (document.fullscreenElement) await document.exitFullscreen().catch(() => {});
      return;
    }
    try {
      if (touch.matches || !canFullRoot) {
        video.controls = true;
        if (typeof video.requestFullscreen === "function" && document.fullscreenEnabled) await video.requestFullscreen();
        else if (video.webkitEnterFullscreen) {
          warm();
          video.webkitEnterFullscreen();
        } else video.controls = false;
      } else {
        await root.requestFullscreen();
      }
    } catch {
      video.controls = false;
    }
  };
  if (!canFullRoot && typeof video.requestFullscreen !== "function" && !video.webkitEnterFullscreen) full.hidden = true;
  full.addEventListener("click", () => void toggleFull());

  // ---------- presses ----------
  big.addEventListener("click", () => {
    toggle();
    play.focus({ preventScroll: true });
  });
  play.addEventListener("click", () => toggle());
  // a tap on a playing video first brings the controls back; a click plays or pauses
  let hidden = false;
  video.addEventListener("pointerdown", (event) => {
    hidden = event.pointerType === "touch" && !video.paused && !root.classList.contains("is-active");
  });
  video.addEventListener("click", () => {
    if (video.controls) return;
    if (hidden) wake();
    else toggle();
  });
  video.addEventListener("dblclick", () => {
    if (!video.controls) void toggleFull();
  });
  root.addEventListener("pointerenter", warm, { once: true });
  root.addEventListener("focusin", warm, { once: true });

  // ---------- keys ----------
  root.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const onButton = (event.target as Element).closest("button") !== null;
    const onScrub = event.target === scrub;
    switch (event.key) {
      case " ":
        if (onButton) return; // the button's own press
        toggle();
        break;
      case "k":
      case "K":
        toggle();
        break;
      case "ArrowLeft":
        seekBy(-SEEK_S);
        break;
      case "ArrowRight":
        seekBy(SEEK_S);
        break;
      case "f":
      case "F":
        void toggleFull();
        break;
      case "m":
      case "M":
        if (mute.hidden) return;
        toggleMute();
        break;
      case "c":
      case "C":
        if (!cc) return;
        toggleCaptions();
        break;
      default:
        if (!onScrub) wake();
        return;
    }
    event.preventDefault();
    wake();
  });

  // ---------- the controls hide while playing and the pointer is still ----------
  let timer = 0;
  const keyboardInBar = () => {
    const focused = document.activeElement;
    if (!focused || !root.querySelector(".player-bar")?.contains(focused)) return false;
    try {
      return focused.matches(":focus-visible");
    } catch {
      return true;
    }
  };
  function wake() {
    root.classList.remove("is-idle");
    root.classList.add("is-active");
    clearTimeout(timer);
    timer = window.setTimeout(sleep, IDLE_MS);
  }
  function sleep() {
    clearTimeout(timer);
    if (dragging || keyboardInBar()) return;
    root.classList.remove("is-active");
    if (!video.paused) root.classList.add("is-idle");
  }
  root.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "touch") wake();
  });
  root.addEventListener("pointerdown", wake);
  root.addEventListener("focusin", wake);
  stage.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "touch") sleep();
  });

  // ---------- the film plays itself while it is on screen ----------
  if (film && "IntersectionObserver" in window) {
    let seen = false;
    new IntersectionObserver(
      ([entry]) => {
        seen = entry.isIntersecting;
        if (still.matches || saveData()) return;
        if (seen && !userPaused) {
          video.loop = true;
          video.preload = "auto";
          root.classList.add("is-ambient");
          void video.play().catch(() => render());
        } else if (!seen && !video.paused) {
          video.pause();
        }
      },
      { threshold: 0.5 },
    ).observe(root);
  }
  render();
}

for (const root of document.querySelectorAll<HTMLElement>("[data-player]")) setupPlayer(root);
