const fs = require('fs');
const r = JSON.parse(fs.readFileSync('lighthouse-v2.json', 'utf8'));
const c = r.categories;

console.log('');
console.log('='.repeat(50));
console.log('LIGHTHOUSE AUDIT - After Fixes');
console.log('='.repeat(50));
console.log('');

Object.keys(c).forEach(k => {
  const s = Math.round(c[k].score * 100);
  const e = s >= 90 ? 'GREEN' : s >= 50 ? 'YELLOW' : 'RED';
  console.log(`${c[k].title}: ${s} (${e})`);
});

const a = r.audits;
console.log('');
console.log('Core Web Vitals:');
console.log('LCP: ' + a['largest-contentful-paint'].displayValue);
console.log('FCP: ' + a['first-contentful-paint'].displayValue);
console.log('TBT: ' + a['total-blocking-time'].displayValue);
console.log('CLS: ' + a['cumulative-layout-shift'].displayValue);
console.log('Speed Index: ' + a['speed-index'].displayValue);

const passed = Object.values(a).filter(x => x.score === 1).length;
const total = Object.values(a).filter(x => x.score !== null).length;
console.log('');
console.log(`Passed audits: ${passed}/${total}`);
