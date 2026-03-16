'use strict';

// ─── Inline the core logic from content.js ───────────────────────────────────

const round = (n, dp = 2) => Math.round(n * Math.pow(10, dp)) / Math.pow(10, dp);

const conversions = {
  fahrenheit(f)       { return `${round((f - 32) * 5 / 9, 1)}°C`; },
  inches(i)           { const cm = round(i * 2.54, 1); return i < 1 ? `${cm} cm · ${round(i * 25.4, 1)} mm` : `${cm} cm`; },
  feet(f)             { return `${round(f * 0.3048, 2)} m · ${round(f * 30.48, 1)} cm`; },
  heightFtIn(f, i)    { return `${round((f * 12 + i) * 2.54, 0)} cm`; },
  yards(y)            { return `${round(y * 0.9144, 2)} m`; },
  miles(m)            { return `${round(m * 1.60934, 2)} km`; },
  ounces(o)           { return `${round(o * 28.3495, 1)} g`; },
  pounds(p)           { return `${round(p * 0.453592, 2)} kg`; },
  tons(t)             { return `${round(t * 0.907185, 3)} metric tons`; },
  teaspoon(t)         { return `${round(t * 4.92892, 1)} mL`; },
  tablespoon(t)       { return `${round(t * 14.7868, 1)} mL`; },
  fluidOunces(f)      { return `${round(f * 29.5735, 1)} mL`; },
  cups(c)             { return `${round(c * 236.588, 0)} mL`; },
  pints(p)            { return `${round(p * 473.176, 0)} mL`; },
  quarts(q)           { return `${round(q * 0.946353, 2)} L`; },
  gallons(g)          { return `${round(g * 3.78541, 2)} L`; },
  sqFeet(s)           { return `${round(s * 0.092903, 2)} m²`; },
  sqYards(s)          { return `${round(s * 0.836127, 2)} m²`; },
  acres(a)            { return `${round(a * 0.404686, 3)} ha`; },
  sqMiles(s)          { return `${round(s * 2.58999, 2)} km²`; },
  mph(m)              { return `${round(m * 1.60934, 1)} km/h`; },
};

const stripCommas = (s) => s.replace(/,/g, '');
const NUM = '([\\d,]+(?:\\.\\d+)?)';

const patterns = [
  { re: /(\d+)\s*(?:feet|foot|ft|['\u2032\u2018\u2019])\s*(\d+)\s*(?:inches?|in|["\u2033\u201C\u201D])?/i,
    label: (m) => `${m[1]}′${m[2]}″`,
    convert: (m) => conversions.heightFtIn(+m[1], +m[2]) },
  { re: new RegExp(NUM + '\\s*(?:°\\s*F|degrees?\\s*F(?:ahrenheit)?|Fahrenheit|\\bF\\b)', 'i'),
    label: (m) => `${m[1]}°F`,
    convert: (m) => conversions.fahrenheit(+stripCommas(m[1])) },
  { re: new RegExp(NUM + '\\s*(?:mph|miles?\\s*per\\s*hour)', 'i'),
    label: (m) => `${m[1]} mph`,
    convert: (m) => conversions.mph(+stripCommas(m[1])) },
  { re: new RegExp(NUM + '\\s*(?:sq(?:uare)?[\\s·]*miles?|mi(?:les?)?\\s*²)', 'i'),
    label: (m) => `${m[1]} sq mi`,
    convert: (m) => conversions.sqMiles(+stripCommas(m[1])) },
  { re: new RegExp(NUM + '\\s*acres?', 'i'),
    label: (m) => `${m[1]} acres`,
    convert: (m) => conversions.acres(+stripCommas(m[1])) },
  { re: new RegExp(NUM + '\\s*(?:sq(?:uare)?[\\s·]*f(?:ee|oo)?t|ft\\s*²|sqft)', 'i'),
    label: (m) => `${m[1]} sq ft`,
    convert: (m) => conversions.sqFeet(+stripCommas(m[1])) },
  { re: new RegExp(NUM + '\\s*(?:sq(?:uare)?[\\s·]*y(?:ar)?ds?|yd\\s*²)', 'i'),
    label: (m) => `${m[1]} sq yd`,
    convert: (m) => conversions.sqYards(+stripCommas(m[1])) },
  { re: new RegExp(NUM + '\\s*(?:tablespoons?|tbsp|tbs)', 'i'),
    label: (m) => `${m[1]} tbsp`,
    convert: (m) => conversions.tablespoon(+stripCommas(m[1])) },
  { re: new RegExp(NUM + '\\s*(?:teaspoons?|tsp)', 'i'),
    label: (m) => `${m[1]} tsp`,
    convert: (m) => conversions.teaspoon(+stripCommas(m[1])) },
  { re: new RegExp(NUM + '\\s*(?:fl(?:uid)?[\\s.]*oz(?:s|\\b)|fluid\\s+ounces?)', 'i'),
    label: (m) => `${m[1]} fl oz`,
    convert: (m) => conversions.fluidOunces(+stripCommas(m[1])) },
  { re: new RegExp(NUM + '\\s*(?:gallons?|gal\\b)', 'i'),
    label: (m) => `${m[1]} gal`,
    convert: (m) => conversions.gallons(+stripCommas(m[1])) },
  { re: new RegExp(NUM + '\\s*(?:quarts?|qt\\b)', 'i'),
    label: (m) => `${m[1]} qt`,
    convert: (m) => conversions.quarts(+stripCommas(m[1])) },
  { re: new RegExp(NUM + '\\s*(?:pints?|pt\\b)', 'i'),
    label: (m) => `${m[1]} pt`,
    convert: (m) => conversions.pints(+stripCommas(m[1])) },
  { re: new RegExp(NUM + '\\s*cups?', 'i'),
    label: (m) => `${m[1]} cup`,
    convert: (m) => conversions.cups(+stripCommas(m[1])) },
  { re: new RegExp(NUM + '\\s*(?:short\\s+tons?|\\btons?\\b(?!ne))', 'i'),
    label: (m) => `${m[1]} ton`,
    convert: (m) => conversions.tons(+stripCommas(m[1])) },
  { re: new RegExp(NUM + '\\s*(?:pounds?|lbs?\\b)', 'i'),
    label: (m) => `${m[1]} lbs`,
    convert: (m) => conversions.pounds(+stripCommas(m[1])) },
  { re: new RegExp(NUM + '\\s*(?:ounces?|oz\\b)', 'i'),
    label: (m) => `${m[1]} oz`,
    convert: (m) => conversions.ounces(+stripCommas(m[1])) },
  { re: new RegExp(NUM + '\\s*(?:miles?|mi\\b)', 'i'),
    label: (m) => `${m[1]} mi`,
    convert: (m) => conversions.miles(+stripCommas(m[1])) },
  { re: new RegExp(NUM + '\\s*(?:yards?|yd\\b)', 'i'),
    label: (m) => `${m[1]} yd`,
    convert: (m) => conversions.yards(+stripCommas(m[1])) },
  { re: new RegExp(NUM + '\\s*(?:feet|foot|ft\\b|\'(?!\\s*\\d))', 'i'),
    label: (m) => `${m[1]} ft`,
    convert: (m) => conversions.feet(+stripCommas(m[1])) },
  { re: new RegExp(NUM + '\\s*(?:inches?|in\\b|")', 'i'),
    label: (m) => `${m[1]} in`,
    convert: (m) => conversions.inches(+stripCommas(m[1])) },
];

function parseText(text) {
  for (const p of patterns) {
    const m = text.match(p.re);
    if (m) {
      try { return { label: p.label(m), result: p.convert(m) }; }
      catch (e) {}
    }
  }
  return null;
}

// ─── Test runner ─────────────────────────────────────────────────────────────

let passed = 0, failed = 0;

function test(input, expectedLabel, expectedResult) {
  const out = parseText(input);
  const labelOk = out && out.label === expectedLabel;
  const resultOk = out && out.result === expectedResult;
  if (labelOk && resultOk) {
    console.log(`  ✓  "${input}"`);
    passed++;
  } else {
    console.log(`  ✗  "${input}"`);
    if (!out)           console.log(`       got: null`);
    else {
      if (!labelOk)     console.log(`       label:  got "${out.label}", expected "${expectedLabel}"`);
      if (!resultOk)    console.log(`       result: got "${out.result}", expected "${expectedResult}"`);
    }
    failed++;
  }
}

function noMatch(input) {
  const out = parseText(input);
  if (!out) {
    console.log(`  ✓  "${input}" → (no match, correct)`);
    passed++;
  } else {
    console.log(`  ✗  "${input}" → expected no match, got label="${out.label}" result="${out.result}"`);
    failed++;
  }
}

// ── Height ────────────────────────────────────────────────────────────────────
console.log('\nHeight (ft + in):');
test(`5'10"`,          `5′10″`, `178 cm`);
test(`5'10`,           `5′10″`, `178 cm`);
test(`5 ft 10 in`,     `5′10″`, `178 cm`);
test(`5 feet 10 in`,   `5′10″`, `178 cm`);
test(`5 ft 10 inches`, `5′10″`, `178 cm`);
test(`6'2"`,           `6′2″`,  `188 cm`);
test(`5\u203210\u2033`, `5′10″`, `178 cm`);  // prime symbols
test(`5\u201910\u201D`, `5′10″`, `178 cm`);  // smart quotes

// ── Temperature ───────────────────────────────────────────────────────────────
console.log('\nTemperature:');
test(`72°F`,          `72°F`,  `22.2°C`);
test(`72 F`,          `72°F`,  `22.2°C`);
test(`72 Fahrenheit`, `72°F`,  `22.2°C`);
test(`32°F`,          `32°F`,  `0°C`);
test(`212°F`,         `212°F`, `100°C`);
test(`98.6°F`,        `98.6°F`,`37°C`);

// ── Speed ─────────────────────────────────────────────────────────────────────
console.log('\nSpeed:');
test(`65 mph`,             `65 mph`,  `104.6 km/h`);
test(`65 miles per hour`,  `65 mph`,  `104.6 km/h`);
test(`60 mph`,             `60 mph`,  `96.6 km/h`);

// ── Length ────────────────────────────────────────────────────────────────────
console.log('\nLength – inches:');
test(`25 inches`,  `25 in`, `63.5 cm`);
test(`25 in`,      `25 in`, `63.5 cm`);
test(`25"`,        `25 in`, `63.5 cm`);
test(`0.5 inches`, `0.5 in`, `1.3 cm · 12.7 mm`);

console.log('\nLength – feet:');
test(`6 feet`,  `6 ft`, `1.83 m · 182.9 cm`);
test(`6 ft`,    `6 ft`, `1.83 m · 182.9 cm`);
test(`6'`,      `6 ft`, `1.83 m · 182.9 cm`);

console.log('\nLength – yards:');
test(`10 yards`, `10 yd`, `9.14 m`);
test(`10 yd`,    `10 yd`, `9.14 m`);

console.log('\nLength – miles:');
test(`26.2 miles`, `26.2 mi`, `42.16 km`);
test(`26.2 mi`,    `26.2 mi`, `42.16 km`);

// ── Weight ────────────────────────────────────────────────────────────────────
console.log('\nWeight:');
test(`16 oz`,       `16 oz`,  `453.6 g`);
test(`16 ounces`,   `16 oz`,  `453.6 g`);
test(`180 lbs`,     `180 lbs`,`81.65 kg`);
test(`180 lb`,      `180 lbs`,`81.65 kg`);
test(`180 pounds`,  `180 lbs`,`81.65 kg`);
test(`2 tons`,      `2 ton`,  `1.814 metric tons`);
test(`2 short tons`,`2 ton`,  `1.814 metric tons`);

// ── Volume ────────────────────────────────────────────────────────────────────
console.log('\nVolume:');
test(`1 tsp`,         `1 tsp`,   `4.9 mL`);
test(`1 teaspoon`,    `1 tsp`,   `4.9 mL`);
test(`2 tbsp`,        `2 tbsp`,  `29.6 mL`);
test(`2 tablespoons`, `2 tbsp`,  `29.6 mL`);
test(`8 fl oz`,       `8 fl oz`, `236.6 mL`);
test(`8 fluid ounces`,`8 fl oz`, `236.6 mL`);
test(`2 cups`,        `2 cup`,   `473 mL`);
test(`1 pint`,        `1 pt`,    `473 mL`);
test(`1 pt`,          `1 pt`,    `473 mL`);
test(`1 quart`,       `1 qt`,    `0.95 L`);
test(`1 qt`,          `1 qt`,    `0.95 L`);
test(`2.5 gallons`,   `2.5 gal`, `9.46 L`);
test(`2.5 gal`,       `2.5 gal`, `9.46 L`);

// ── Area ──────────────────────────────────────────────────────────────────────
console.log('\nArea:');
test(`1,500 sq ft`,     `1,500 sq ft`, `139.35 m²`);
test(`1500 sqft`,       `1500 sq ft`,  `139.35 m²`);
test(`1500 square feet`,`1500 sq ft`,  `139.35 m²`);
test(`10 sq yd`,        `10 sq yd`,    `8.36 m²`);
test(`10 square yards`, `10 sq yd`,    `8.36 m²`);
test(`5 acres`,         `5 acres`,     `2.023 ha`);
test(`3 square miles`,  `3 sq mi`,     `7.77 km²`);
test(`3 sq miles`,      `3 sq mi`,     `7.77 km²`);

// ── Comma-separated numbers ───────────────────────────────────────────────────
console.log('\nComma-separated numbers:');
test(`1,500 sq ft`, `1,500 sq ft`, `139.35 m²`);
test(`26,000 lbs`,  `26,000 lbs`,  `11793.39 kg`);

// ── No false positives ────────────────────────────────────────────────────────
console.log('\nNo false positives:');
noMatch(`hello world`);
noMatch(`100%`);
noMatch(`metric tonnes`);  // "tonnes" should not trigger the "ton" pattern

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
