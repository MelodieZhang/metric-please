(() => {
  'use strict';

  // ─── Conversion helpers ───────────────────────────────────────────────────

  const round = (n, dp = 2) => {
    const factor = Math.pow(10, dp);
    return Math.round(n * factor) / factor;
  };

  const fmt = (n) => {
    // Use up to 2 decimal places, strip trailing zeros
    const s = round(n, 2).toString();
    return s;
  };

  // ─── Conversion functions ─────────────────────────────────────────────────

  const conversions = {
    // Temperature
    fahrenheit(f) {
      const c = round((f - 32) * 5 / 9, 1);
      return `${c}°C`;
    },

    // Length
    inches(inches) {
      const cm = round(inches * 2.54, 1);
      if (inches < 1) {
        const mm = round(inches * 25.4, 1);
        return `${cm} cm · ${mm} mm`;
      }
      return `${cm} cm`;
    },

    feet(feet) {
      const m = round(feet * 0.3048, 2);
      const cm = round(feet * 30.48, 1);
      return `${m} m · ${cm} cm`;
    },

    // Height: feet + inches combined
    heightFtIn(feet, inches) {
      const totalIn = feet * 12 + inches;
      const cm = round(totalIn * 2.54, 0);
      return `${cm} cm`;
    },

    yards(yd) {
      const m = round(yd * 0.9144, 2);
      return `${m} m`;
    },

    miles(mi) {
      const km = round(mi * 1.60934, 2);
      return `${km} km`;
    },

    // Weight
    ounces(oz) {
      const g = round(oz * 28.3495, 1);
      return `${g} g`;
    },

    pounds(lbs) {
      const kg = round(lbs * 0.453592, 2);
      return `${kg} kg`;
    },

    tons(t) {
      const mt = round(t * 0.907185, 3);
      return `${mt} metric tons`;
    },

    // Volume
    teaspoon(tsp) {
      const ml = round(tsp * 4.92892, 1);
      return `${ml} mL`;
    },

    tablespoon(tbsp) {
      const ml = round(tbsp * 14.7868, 1);
      return `${ml} mL`;
    },

    fluidOunces(floz) {
      const ml = round(floz * 29.5735, 1);
      return `${ml} mL`;
    },

    cups(c) {
      const ml = round(c * 236.588, 0);
      return `${ml} mL`;
    },

    pints(pt) {
      const ml = round(pt * 473.176, 0);
      return `${ml} mL`;
    },

    quarts(qt) {
      const l = round(qt * 0.946353, 2);
      return `${l} L`;
    },

    gallons(gal) {
      const l = round(gal * 3.78541, 2);
      return `${l} L`;
    },

    // Area
    sqFeet(sqft) {
      const m2 = round(sqft * 0.092903, 2);
      return `${m2} m²`;
    },

    sqYards(sqyd) {
      const m2 = round(sqyd * 0.836127, 2);
      return `${m2} m²`;
    },

    acres(ac) {
      const ha = round(ac * 0.404686, 3);
      return `${ha} ha`;
    },

    sqMiles(sqmi) {
      const km2 = round(sqmi * 2.58999, 2);
      return `${km2} km²`;
    },

    // Speed
    mph(mph) {
      const kmh = round(mph * 1.60934, 1);
      return `${kmh} km/h`;
    },
  };

  // ─── Unit patterns (most-specific first) ─────────────────────────────────

  // Strip commas from number strings
  const stripCommas = (s) => s.replace(/,/g, '');

  const NUM = '([\\d,]+(?:\\.\\d+)?)';  // captures numbers like 1,500 or 3.14
  const NUM_NC = '[\\d,]+(?:\\.\\d+)?';  // non-capturing number

  const patterns = [
    // ── Height: 5'10" or 5'10 or 5 ft 10 in / 5 feet 10 inches ──────────
    {
      re: /(\d+)\s*(?:feet|foot|ft|['\u2032\u2018\u2019])\s*(\d+)\s*(?:inches?|in|["\u2033\u201C\u201D])?/i,
      label: (m) => `${m[1]}′${m[2]}″`,
      convert: (m) => conversions.heightFtIn(+m[1], +m[2]),
    },

    // ── Temperature: 72°F / 72 F / 72 Fahrenheit ──────────────────────────
    {
      re: new RegExp(NUM + '\\s*(?:°\\s*F|degrees?\\s*F(?:ahrenheit)?|Fahrenheit|\\bF\\b)', 'i'),
      label: (m) => `${m[1]}°F`,
      convert: (m) => conversions.fahrenheit(+stripCommas(m[1])),
    },

    // ── Speed: 65 mph / 65 miles per hour ────────────────────────────────
    {
      re: new RegExp(NUM + '\\s*(?:mph|miles?\\s*per\\s*hour)', 'i'),
      label: (m) => `${m[1]} mph`,
      convert: (m) => conversions.mph(+stripCommas(m[1])),
    },

    // ── Area: square miles ───────────────────────────────────────────────
    {
      re: new RegExp(NUM + '\\s*(?:sq(?:uare)?[\\s·]*miles?|mi(?:les?)?\\s*²)', 'i'),
      label: (m) => `${m[1]} sq mi`,
      convert: (m) => conversions.sqMiles(+stripCommas(m[1])),
    },

    // ── Area: acres ───────────────────────────────────────────────────────
    {
      re: new RegExp(NUM + '\\s*acres?', 'i'),
      label: (m) => `${m[1]} acres`,
      convert: (m) => conversions.acres(+stripCommas(m[1])),
    },

    // ── Area: square feet ─────────────────────────────────────────────────
    {
      re: new RegExp(NUM + '\\s*(?:sq(?:uare)?[\\s·]*f(?:ee|oo)?t|ft\\s*²|sqft)', 'i'),
      label: (m) => `${m[1]} sq ft`,
      convert: (m) => conversions.sqFeet(+stripCommas(m[1])),
    },

    // ── Area: square yards ────────────────────────────────────────────────
    {
      re: new RegExp(NUM + '\\s*(?:sq(?:uare)?[\\s·]*y(?:ar)?ds?|yd\\s*²)', 'i'),
      label: (m) => `${m[1]} sq yd`,
      convert: (m) => conversions.sqYards(+stripCommas(m[1])),
    },

    // ── Volume: tablespoon (before teaspoon to avoid prefix match) ────────
    {
      re: new RegExp(NUM + '\\s*(?:tablespoons?|tbsp|tbs)', 'i'),
      label: (m) => `${m[1]} tbsp`,
      convert: (m) => conversions.tablespoon(+stripCommas(m[1])),
    },

    // ── Volume: teaspoon ─────────────────────────────────────────────────
    {
      re: new RegExp(NUM + '\\s*(?:teaspoons?|tsp)', 'i'),
      label: (m) => `${m[1]} tsp`,
      convert: (m) => conversions.teaspoon(+stripCommas(m[1])),
    },

    // ── Volume: fluid ounces (before plain ounces) ───────────────────────
    {
      re: new RegExp(NUM + '\\s*(?:fl(?:uid)?[\\s.]*oz(?:s|\\b)|fluid\\s+ounces?)', 'i'),
      label: (m) => `${m[1]} fl oz`,
      convert: (m) => conversions.fluidOunces(+stripCommas(m[1])),
    },

    // ── Volume: gallons ───────────────────────────────────────────────────
    {
      re: new RegExp(NUM + '\\s*(?:gallons?|gal\\b)', 'i'),
      label: (m) => `${m[1]} gal`,
      convert: (m) => conversions.gallons(+stripCommas(m[1])),
    },

    // ── Volume: quarts ────────────────────────────────────────────────────
    {
      re: new RegExp(NUM + '\\s*(?:quarts?|qt\\b)', 'i'),
      label: (m) => `${m[1]} qt`,
      convert: (m) => conversions.quarts(+stripCommas(m[1])),
    },

    // ── Volume: pints ─────────────────────────────────────────────────────
    {
      re: new RegExp(NUM + '\\s*(?:pints?|pt\\b)', 'i'),
      label: (m) => `${m[1]} pt`,
      convert: (m) => conversions.pints(+stripCommas(m[1])),
    },

    // ── Volume: cups ──────────────────────────────────────────────────────
    {
      re: new RegExp(NUM + '\\s*cups?', 'i'),
      label: (m) => `${m[1]} cup`,
      convert: (m) => conversions.cups(+stripCommas(m[1])),
    },

    // ── Weight: tons (short ton) ──────────────────────────────────────────
    {
      re: new RegExp(NUM + '\\s*(?:short\\s+tons?|\\btons?\\b(?!ne))', 'i'),
      label: (m) => `${m[1]} ton`,
      convert: (m) => conversions.tons(+stripCommas(m[1])),
    },

    // ── Weight: pounds ────────────────────────────────────────────────────
    {
      re: new RegExp(NUM + '\\s*(?:pounds?|lbs?\\b)', 'i'),
      label: (m) => `${m[1]} lbs`,
      convert: (m) => conversions.pounds(+stripCommas(m[1])),
    },

    // ── Weight: ounces ────────────────────────────────────────────────────
    {
      re: new RegExp(NUM + '\\s*(?:ounces?|oz\\b)', 'i'),
      label: (m) => `${m[1]} oz`,
      convert: (m) => conversions.ounces(+stripCommas(m[1])),
    },

    // ── Length: miles ─────────────────────────────────────────────────────
    {
      re: new RegExp(NUM + '\\s*(?:miles?|mi\\b)', 'i'),
      label: (m) => `${m[1]} mi`,
      convert: (m) => conversions.miles(+stripCommas(m[1])),
    },

    // ── Length: yards ─────────────────────────────────────────────────────
    {
      re: new RegExp(NUM + '\\s*(?:yards?|yd\\b)', 'i'),
      label: (m) => `${m[1]} yd`,
      convert: (m) => conversions.yards(+stripCommas(m[1])),
    },

    // ── Length: feet (standalone, no inches following) ───────────────────
    {
      re: new RegExp(NUM + '\\s*(?:feet|foot|ft\\b|\'(?!\\s*\\d))', 'i'),
      label: (m) => `${m[1]} ft`,
      convert: (m) => conversions.feet(+stripCommas(m[1])),
    },

    // ── Length: inches ────────────────────────────────────────────────────
    {
      re: new RegExp(NUM + '\\s*(?:inches?|in\\b|")', 'i'),
      label: (m) => `${m[1]} in`,
      convert: (m) => conversions.inches(+stripCommas(m[1])),
    },
  ];

  // ─── Parse selected text ──────────────────────────────────────────────────

  function parseText(text) {
    for (const p of patterns) {
      const m = text.match(p.re);
      if (m) {
        try {
          const result = p.convert(m);
          const label = p.label(m);
          return { label, result };
        } catch (e) {
          // bad parse, try next
        }
      }
    }
    return null;
  }

  // ─── Tooltip management ───────────────────────────────────────────────────

  let tooltip = null;
  let dismissTimer = null;

  function removeTooltip() {
    if (tooltip) {
      tooltip.remove();
      tooltip = null;
    }
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      dismissTimer = null;
    }
  }

  function showTooltip(label, result, rect) {
    removeTooltip();

    tooltip = document.createElement('div');
    tooltip.id = 'unit-converter-tooltip';

    const originalEl = document.createElement('div');
    originalEl.className = 'uct-original';
    originalEl.textContent = label;

    const resultEl = document.createElement('div');
    resultEl.className = 'uct-result';

    // Split result on " · " and insert separator spans
    const parts = result.split(' · ');
    parts.forEach((part, i) => {
      if (i > 0) {
        const sep = document.createElement('span');
        sep.className = 'uct-separator';
        sep.textContent = ' · ';
        resultEl.appendChild(sep);
      }
      resultEl.appendChild(document.createTextNode(part));
    });

    tooltip.appendChild(originalEl);
    tooltip.appendChild(resultEl);
    document.body.appendChild(tooltip);

    // Position: above selection, centered
    const OFFSET = 8;
    const tw = tooltip.offsetWidth;
    const th = tooltip.offsetHeight;

    let left = rect.left + rect.width / 2 - tw / 2;
    let top = rect.top - th - OFFSET;

    // Flip below if too close to top
    if (top < 8) {
      top = rect.bottom + OFFSET;
    }

    // Clamp horizontally
    left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';

    // Fade in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (tooltip) tooltip.classList.add('visible');
      });
    });

    // Auto-dismiss after 5s
    dismissTimer = setTimeout(removeTooltip, 5000);
  }

  // ─── Event listeners ──────────────────────────────────────────────────────

  document.addEventListener('mouseup', (e) => {
    // Don't trigger inside our own tooltip
    if (e.target && e.target.closest && e.target.closest('#unit-converter-tooltip')) return;

    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;

      const text = sel.toString().trim();
      if (!text) return;

      const parsed = parseText(text);
      if (!parsed) return;

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (!rect || rect.width === 0) return;

      showTooltip(parsed.label, parsed.result, rect);
    }, 10);
  });

  document.addEventListener('click', (e) => {
    if (e.target && e.target.closest && e.target.closest('#unit-converter-tooltip')) return;
    removeTooltip();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') removeTooltip();
  });

  document.addEventListener('selectionchange', () => {
    const sel = window.getSelection();
    if (!sel || sel.toString().trim() === '') {
      removeTooltip();
    }
  });
})();
