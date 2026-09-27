(() => {
  const container = document.getElementById("cairo-basemap");
  const L = window.L;
  if (!container || !L) return;

  // Rough, hand-drawn neighbourhood outlines as [lat, lng]. Smoothed below.
  const stays = [
    {
      name: "Zamalek",
      href: "#stay-zamalek",
      point: [30.0625, 31.2205],
      side: "left",
      // Northern half of Gezira Island, traced from the river data.
      outline: [
        [30.0557, 31.2182],
        [30.0657, 31.216],
        [30.0682, 31.2172],
        [30.0726, 31.2222],
        [30.0684, 31.2223],
        [30.0541, 31.2262],
        [30.0541, 31.2186],
      ],
    },
    {
      name: "Downtown",
      href: "#stay-downtown",
      point: [30.0525, 31.2445],
      side: "right",
      outline: [
        [30.0605, 31.2355],
        [30.0625, 31.2475],
        [30.0535, 31.2555],
        [30.0425, 31.2525],
        [30.0395, 31.2395],
        [30.0455, 31.2315],
      ],
    },
    {
      name: "Heliopolis",
      href: "#stay-heliopolis",
      point: [30.0905, 31.325],
      side: "left",
      outline: [
        [30.1085, 31.3055],
        [30.1115, 31.3405],
        [30.0985, 31.3625],
        [30.0775, 31.3505],
        [30.0745, 31.3195],
        [30.0885, 31.3025],
      ],
    },
    {
      name: "Maadi",
      href: "#stay-maadi",
      point: [29.9605, 31.2605],
      side: "right",
      // Kept on the east bank: clipped against the river outline.
      outline: [
        [29.9748, 31.264],
        [29.9735, 31.2693],
        [29.9699, 31.2755],
        [29.9665, 31.2784],
        [29.9606, 31.2808],
        [29.957, 31.2808],
        [29.9518, 31.2782],
        [29.9461, 31.27],
        [29.9534, 31.2566],
        [29.9622, 31.247],
        [29.9686, 31.2477],
        [29.9731, 31.2505],
        [29.9751, 31.2559],
      ],
    },
  ];

  // Island-level placement; the site does not yet specify an arrival point.
  const palace = {
    name: "Dahab Island Palace",
    href: "faqs.html",
    point: [29.9809, 31.2256],
  };

  // Drawn but not a link; street-level placement only.
  const home = {
    name: "Nada’s home",
    point: [30.1035, 31.3482], // Abd El Aziz Fahmy Street, Heliopolis
  };

  // Hand-drawn ink art: `wash` is a flat colour printed slightly off-register
  // beneath the `ink` lines, like a two-colour print.
  const art = {
    pyramids: {
      viewBox: "0 0 120 56",
      wash: "M30 50 L60 6 L92 50Z M4 50 L22 24 L40 50Z M84 50 L100 30 L116 50Z",
      ink: "M30 50 L60 6 L92 50 M60 6 L66 50 M64 18 L72 30 M66 28 L78 44 M67 38 L72 46 M4 50 L22 24 L36 44 M22 24 L26 50 M86 42 L100 30 L116 50 M100 30 L103 50 M102 36 L108 44 M2 51 Q30 48 60 51 T118 51",
    },
    gem: {
      viewBox: "0 0 70 50",
      wash: "M18 45 V32 L66 16 V45Z M9 45 V19 L11 14 L13 19 V45Z",
      ink: "M18 45 V32 L66 16 V45 M26 45 L32 29.3 L38 45 M38 45 L45 25.3 L52 45 M52 45 L59 21 L66 38 M9 45 V19 L11 14 L13 19 V45 M10 24 H12 M10 30 H12 M2 46 Q35 44 68 46",
    },
    citadel: {
      viewBox: "0 0 80 58",
      wash: "M26 34 Q26 16 40 16 Q54 16 54 34Z M14 38 H66 V53 H14Z",
      ink: "M26 34 Q26 16 40 16 Q54 16 54 34 M40 16 V9 M38.5 9 Q40 6 41.5 9 M18 38 Q18 30 26 30 M54 30 Q62 30 62 38 M14 38 H66 V53 H14Z M24 53 V47 Q27 43 30 47 V53 M36 53 V46 Q40 41 44 46 V53 M50 53 V47 Q53 43 56 47 V53 M8 53 V14 L10 3 L12 14 V53 M7 25 H13 M7 37 H13 M68 53 V14 L70 3 L72 14 V53 M67 25 H73 M67 37 H73 M2 54 Q40 52 78 54",
    },
    // A pharaoh's mask for the museum of Egyptian civilization.
    mask: {
      viewBox: "0 0 44 58",
      wash: "M22 4 C12 4 9 10 9 18 L4 46 H40 L35 18 C35 10 32 4 22 4Z",
      ink: "M22 4 C12 4 9 10 9 18 L4 46 H14 L15 34 M22 4 C32 4 35 10 35 18 L40 46 H30 L29 34 M12 18 H32 M15 18 Q15 33 22 35 Q29 33 29 18 M13 11 Q22 7 31 11 M22 18 V13 Q24.5 12 23 9.5 M17 24 H20 M24 24 H27 M22 26 V29 M20 35 V45 Q22 47 24 45 V35 M6.5 32 H12.5 M5.5 38 H13 M4.5 44 H13.5 M31.5 32 H37.5 M31 38 H38.5 M30.5 44 H39.5 M8 50 Q22 57 36 50",
    },
    // The lotus-topped lattice tower on Gezira Island.
    tower: {
      viewBox: "0 0 24 72",
      wash: "M4 10 Q12 13 20 10 L15 20 H9Z M10 20 L9 64 H15 L14 20Z",
      ink: "M12 1 V6 M8 9 Q12 3 16 9 M4 10 Q12 13 20 10 M4 10 Q7 16 9 20 M20 10 Q17 16 15 20 M12 12 V20 M9 20 H15 M10 20 L9 64 M14 20 L15 64 M10 24 L14 32 L9.6 40 L14.5 48 L9.2 56 L15 64 M14 24 L10 32 L14.4 40 L9.4 48 L14.8 56 L9 64 M5 64 H19 M3 68 Q12 66 21 68",
    },
    // The obelisk at the centre of the Tahrir roundabout.
    obelisk: {
      viewBox: "0 0 32 58",
      wash: "M13 46 L14 11 L16 5 L18 11 L19 46Z M2 50 A14 5 0 1 0 30 50 A14 5 0 1 0 2 50Z",
      ink: "M13 46 L14 11 L16 5 L18 11 L19 46 M14 11 H18 M16 16 V19 M16 23 V26 M16 30 V33 M16 37 V40 M11 46 H21 V50 H11Z M2 50 A14 5 0 1 0 30 50 A14 5 0 1 0 2 50 M6 52 Q9 50 8 47 M26 52 Q23 50 24 47",
    },
    // An airliner climbing away, with a dashed trail.
    plane: {
      viewBox: "0 0 40 56",
      rotate: 40,
      wash: "M20 2 Q23 2 23 8 V32 L28 37 V39 L20 36.5 L12 39 V37 L17 32 V8 Q17 2 20 2Z M23 14 L38 23 V26 L23 22Z M17 14 L2 23 V26 L17 22Z",
      ink: "M20 2 Q23 2 23 8 V14 L38 23 V26 L23 22 V32 L28 37 V39 L20 36.5 L12 39 V37 L17 32 V22 L2 26 V23 L17 14 V8 Q17 2 20 2Z M18.5 7 H21.5 M20 42 V44 M20 47 V49 M20 52 V54",
    },
    house: {
      viewBox: "0 0 30 30",
      wash: "M5 14 L15 5 L25 14 V27 H5Z",
      ink: "M3 15 L15 4 L27 15 M6 13 V27 H24 V13 M12.5 27 V21 H17.5 V27 M21 8 V5 H23.5 V10 M1 28 Q15 26.5 29 28",
      accent:
        "M15 11.8 C13.8 10 11 10.8 11.6 13 C12.1 14.6 15 16.4 15 16.4 C15 16.4 17.9 14.6 18.4 13 C19 10.8 16.2 10 15 11.8Z",
    },
    castle: {
      viewBox: "-4 -4 57 43",
      wash: "M0 35 V3 H7 V9 H14 V3 H21 V15 H28 V3 H35 V9 H42 V3 H49 V35Z",
      ink: "M0 35 V3 H7 V9 H14 V3 H21 V15 H28 V3 H35 V9 H42 V3 H49 V35Z M18 35 V25 Q24.5 14 31 25 V35 M7 17 V23 M42 17 V23 M24.5 15 V-2 L31 1 L24.5 4 M-4 36 Q24.5 34 53 36",
    },
  };

  // Background drawings. `minor` ones only appear once zoomed in a little.
  const sights = [
    {
      name: "Cairo International Airport",
      label: "CAI",
      href: "https://www.google.com/maps/search/?api=1&query=Cairo+International+Airport",
      caption: "left", // Keeps clear of Nada’s home below it.
      point: [30.1219, 31.4056],
      art: art.plane,
      width: 26,
    },
    {
      name: "Pyramids of Giza",
      href: "https://www.google.com/maps/search/?api=1&query=Pyramids+of+Giza",
      point: [29.9775, 31.1325],
      art: art.pyramids,
      width: 96,
    },
    {
      name: "Grand Egyptian Museum",
      label: "GEM",
      href: "https://tickets.gem.eg/",
      caption: "left", // Keeps clear of the pyramids just south of it.
      point: [29.9947, 31.1195],
      art: art.gem,
      width: 50,
    },
    {
      name: "Cairo Tower",
      href: "https://www.google.com/maps/search/?api=1&query=Cairo+Tower",
      caption: "left",
      minor: true,
      point: [30.0459, 31.2243],
      art: art.tower,
      width: 16,
    },
    {
      name: "Tahrir Square",
      label: "Tahrir",
      href: "https://www.google.com/maps/search/?api=1&query=Tahrir+Square+Cairo",
      base: true,
      minor: true,
      point: [30.0444, 31.2357],
      art: art.obelisk,
      width: 22,
    },
    {
      name: "Cairo Citadel",
      label: "Citadel",
      href: "https://egymonuments.gov.eg/archaeological-sites/cairo-citadel/",
      point: [30.0287, 31.2599],
      art: art.citadel,
      width: 54,
    },
    {
      name: "National Museum of Egyptian Civilization",
      label: "NMEC",
      href: "https://nmec.gov.eg/mummies-gallery/",
      point: [30.0081, 31.2479],
      art: art.mask,
      width: 24,
    },
  ];

  // Builds an inline SVG for one of the drawings above at a given pixel width.
  function drawing({ viewBox, wash, ink, accent, rotate }, width, className) {
    const [, , boxWidth, boxHeight] = viewBox.split(" ").map(Number);
    const offset = (2 * boxWidth) / width; // 2px off-register, in art units
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", `basemap-art ${className}`);
    svg.style.width = `${width}px`;
    svg.style.height = `${(width * boxHeight) / boxWidth}px`;
    const turn = rotate
      ? `rotate(${rotate} ${boxWidth / 2} ${boxHeight / 2})`
      : "";
    svg.innerHTML =
      `<g transform="${turn}">` +
      `<path class="art-wash" d="${wash}" transform="translate(${offset} ${offset})"/>` +
      (accent ? `<path class="art-accent" d="${accent}"/>` : "") +
      `<path class="art-ink" d="${ink}"/></g>`;
    return svg;
  }

  // Bursts of fireworks over the palace, twinkling in turn.
  function fireworks() {
    const burst = (x, y, inner, outer, rays) =>
      Array.from({ length: rays }, (_, i) => {
        const angle = (i / rays) * 2 * Math.PI;
        const at = (r) =>
          `${(x + Math.cos(angle) * r).toFixed(1)} ${(y + Math.sin(angle) * r).toFixed(1)}`;
        return `M${at(inner)}L${at(outer)}M${at(outer + 3)}h0`;
      }).join("");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "-30 -30 60 60");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", "basemap-fireworks");
    svg.innerHTML =
      `<path class="fireworks-gold" d="${burst(-4, 2, 4, 13, 12)}"/>` +
      `<path class="fireworks-rose" d="${burst(18, -12, 3, 8, 9)}"/>` +
      `<path class="fireworks-gold fireworks-late" d="${burst(-22, -16, 2, 5, 7)}"/>`;
    return svg;
  }

  // Chaikin corner cutting turns a few points into a soft, hand-drawn blob.
  function soften(points, rounds = 3) {
    let ring = points;
    for (let i = 0; i < rounds; i++) {
      ring = ring.flatMap((a, j) => {
        const b = ring[(j + 1) % ring.length];
        return [
          [a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25],
          [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75],
        ];
      });
    }
    return ring;
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  // A zero-size marker whose contents are positioned by CSS around the point,
  // so every dot sits exactly on its coordinate at any zoom.
  function pin(point, node, pane) {
    return L.marker(point, {
      pane,
      icon: L.divIcon({
        html: node,
        className: "basemap-pin",
        iconSize: [0, 0],
      }),
      keyboard: false, // The link inside the marker is focusable itself.
    });
  }

  function initialize() {
    const fallback = container.querySelector(".basemap-fallback");
    const map = L.map(container, {
      scrollWheelZoom: false,
      zoomSnap: 0.25,
      minZoom: 10.5,
      maxZoom: 16,
      maxBounds: [
        [29.84, 31.0],
        [30.2, 31.48],
      ],
      maxBoundsViscosity: 0.8,
    });
    map.attributionControl.setPrefix(false);

    for (const [name, zIndex] of [
      ["nile", 250],
      ["streetNames", 260],
      ["regions", 400],
      ["sights", 450],
      ["places", 600],
    ]) {
      map.createPane(name).style.zIndex = zIndex;
    }

    const tiles = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 16,
        attribution:
          'Tiles &copy; Esri, HERE, Garmin · River &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    );
    tiles.on("tileload", () => {
      fallback.hidden = true;
    });
    tiles.on("tileerror", () => {
      fallback.textContent =
        "Some map details could not load. Use the Google Maps link below to explore.";
      fallback.hidden = false;
    });
    tiles.addTo(map);

    // Street names only once guests zoom in far enough to need them.
    const streetNames = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 16, pane: "streetNames" },
    );

    // The river follows the real banks, softened so it reads as drawn.
    const nile = (window.CAIRO_NILE || []).map((rings) =>
      rings.map((ring) => soften(ring, 2)),
    );
    L.polygon(nile, {
      pane: "nile",
      className: "basemap-nile",
      interactive: false,
      smoothFactor: 0.6,
    }).addTo(map);

    const nileLabel = element("span", "basemap-nile-label");
    nileLabel.append("the Nile ", element("span", "", "نهر النيل"));
    nileLabel.lastChild.lang = "ar";
    L.marker([30.094, 31.2076], {
      pane: "nile",
      interactive: false,
      keyboard: false,
      icon: L.divIcon({
        html: nileLabel,
        className: "basemap-pin",
        iconSize: [0, 0],
      }),
    }).addTo(map);

    for (const stay of stays) {
      const region = L.polygon(soften(stay.outline), {
        pane: "regions",
        className: "basemap-region",
      }).addTo(map);

      const link = element("a", `basemap-place basemap-place-${stay.side}`);
      link.href = stay.href;
      link.setAttribute("aria-label", `${stay.name}: see places to stay`);
      const text = element("span", "basemap-place-text");
      text.append(element("span", "basemap-place-name", stay.name));
      link.append(element("span", "basemap-dot"), text);
      pin(stay.point, link, "places").addTo(map);

      // Hovering either the label or the area lights up both.
      const highlight = (on) => {
        link.classList.toggle("is-active", on);
        region.getElement()?.classList.toggle("is-active", on);
      };
      region.on("mouseover", () => highlight(true));
      region.on("mouseout", () => highlight(false));
      region.on("click", () => {
        window.location.hash = stay.href;
      });
      link.addEventListener("mouseenter", () => highlight(true));
      link.addEventListener("mouseleave", () => highlight(false));
      link.addEventListener("focus", () => highlight(true));
      link.addEventListener("blur", () => highlight(false));
    }

    for (const sight of sights) {
      const link = element(
        "a",
        [
          "basemap-sight",
          `basemap-sight-${sight.caption || "below"}`,
          sight.base && "basemap-sight-base",
          sight.minor && "basemap-sight-minor",
        ]
          .filter(Boolean)
          .join(" "),
      );
      link.href = sight.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.title = sight.name;
      link.setAttribute("aria-label", `${sight.name} (opens in a new tab)`);
      // The drawing is centred on the landmark; the caption hangs off it.
      const svg = drawing(sight.art, sight.width, "basemap-sight-art");
      link.style.setProperty("--art-width", svg.style.width);
      link.style.setProperty("--art-height", svg.style.height);
      link.append(
        svg,
        element("span", "basemap-sight-name", `${sight.label || sight.name} ↗`),
      );
      pin(sight.point, link, "sights").addTo(map);
    }

    const venue = element("a", "basemap-palace");
    venue.href = palace.href;
    venue.setAttribute("aria-label", `${palace.name}: wedding venue details`);
    const venueText = element("span", "basemap-place-text");
    venueText.append(element("span", "basemap-place-name", palace.name));
    venue.append(
      fireworks(),
      drawing(art.castle, 42, "basemap-palace-icon"),
      venueText,
    );
    pin(palace.point, venue, "places").addTo(map);

    const house = element("span", "basemap-home");
    house.append(
      drawing(art.house, 26, "basemap-home-icon"),
      element("span", "basemap-home-name", home.name),
    );
    pin(home.point, house, "sights").addTo(map);

    L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

    function onZoom() {
      const zoom = map.getZoom();
      container.dataset.zoom = zoom < 11.25 ? "far" : zoom >= 14 ? "near" : "";
      if (zoom >= 14) streetNames.addTo(map);
      else streetNames.remove();
    }
    map.on("zoomend", onZoom);

    const north = L.control({ position: "topright" });
    north.onAdd = () => {
      const compass = element("div", "basemap-north");
      compass.setAttribute("aria-hidden", "true");
      compass.innerHTML =
        '<svg viewBox="-12 -40 24 78"><text x="0" y="-24" text-anchor="middle">N</text><path d="M0 -12 L6 10 L0 5 L-6 10Z"/><path class="art-ink" d="M0 5 V34"/></svg>';
      return compass;
    };
    north.addTo(map);

    // Phones get a tighter frame around the city and compact labels;
    // the pyramids stay in view at the western edge.
    let narrow;
    function frame() {
      const isNarrow = container.clientWidth < 560;
      if (isNarrow === narrow) return;
      narrow = isNarrow;
      container.dataset.size = narrow ? "narrow" : "";
      map.fitBounds(
        narrow
          ? [
              [29.95, 31.115],
              [30.108, 31.345],
            ]
          : [
              [29.94, 31.05],
              [30.128, 31.42],
            ],
        { padding: narrow ? [12, 12] : [24, 24] },
      );
      onZoom();
    }
    frame();
    new ResizeObserver(() => {
      map.invalidateSize();
      frame();
    }).observe(container);
  }

  // Only request tiles when the map is about to enter the viewport.
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        initialize();
      }
    },
    { rootMargin: "200px" },
  );
  observer.observe(container);
})();
