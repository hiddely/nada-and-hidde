(() => {
  const gallery = document.querySelector(".gallery");
  if (!gallery) return;
  const track = gallery.querySelector(".gallery-track");
  const controls = gallery.querySelector(".gallery-controls");
  const pauseButton = controls.querySelector('[data-gallery="pause"]');
  const speed = 25; // Pixels per second.
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // A copy of every photo follows the originals. Jumping back by exactly one
  // set of photos then looks the same, so the strip never runs out.
  const originals = [...track.children];
  for (const photo of originals) track.append(photo.cloneNode());
  const loopWidth = () =>
    track.children[originals.length].offsetLeft - originals[0].offsetLeft;
  const maxScroll = () => track.scrollWidth - track.clientWidth;
  gallery.classList.add("is-looping");
  controls.hidden = false;

  // Swiping or scrolling into either end jumps to the matching photo in the
  // other set, so the photos continue in both directions.
  track.addEventListener("scroll", () => {
    const width = loopWidth();
    if (track.scrollLeft < 1) track.scrollLeft += width;
    else if (track.scrollLeft > maxScroll() - 1) track.scrollLeft -= width;
  });

  // The strip waits while someone uses it, and stops when paused.
  let paused = reducedMotion;
  let hovering = false;
  let focused = false;
  let waitUntil = 0;
  const wait = () => (waitUntil = performance.now() + 4000);
  for (const type of ["pointerdown", "wheel", "touchstart", "keydown"]) {
    track.addEventListener(type, wait, { passive: true });
  }
  gallery.addEventListener("pointerenter", (event) => {
    hovering = event.pointerType === "mouse";
  });
  gallery.addEventListener("pointerleave", () => (hovering = false));
  track.addEventListener("focus", () => (focused = true));
  track.addEventListener("blur", () => (focused = false));

  const showPaused = () => {
    pauseButton
      .querySelector("path")
      .setAttribute("d", paused ? "M8 5l11 7-11 7z" : "M9 5v14M15 5v14");
    pauseButton.setAttribute(
      "aria-label",
      paused ? "Play slideshow" : "Pause slideshow",
    );
  };
  showPaused();

  controls.addEventListener("click", (event) => {
    const action = event.target.closest("button")?.dataset.gallery;
    if (action === "pause") {
      paused = !paused;
      showPaused();
      return;
    }
    if (!action) return;
    wait();
    // Make room first, so the smooth scroll never reaches either end.
    const step = track.clientWidth * 0.8;
    const width = loopWidth();
    if (action === "prev" && track.scrollLeft < step + 1) {
      track.scrollLeft += width;
    } else if (action === "next" && track.scrollLeft + step > maxScroll() - 1) {
      track.scrollLeft -= width;
    }
    track.scrollBy({
      left: action === "next" ? step : -step,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  });

  // Browsers round scrollLeft, so the slow drift keeps its own exact position.
  let position = track.scrollLeft;
  let previous = performance.now();
  const drift = (now) => {
    const seconds = Math.min((now - previous) / 1000, 0.1);
    previous = now;
    // Someone moved the strip: carry on from where they left it.
    if (Math.abs(track.scrollLeft - position) > 2) position = track.scrollLeft;
    if (!paused && !hovering && !focused && now > waitUntil) {
      position += speed * seconds;
      const width = loopWidth();
      if (position >= width + 1) position -= width;
      track.scrollLeft = position;
    }
    requestAnimationFrame(drift);
  };
  requestAnimationFrame(drift);
})();
