// Genera las portadas SVG por categoría (se ejecuta una sola vez: node gen-covers.mjs)
import { writeFileSync } from 'node:fs';

const W = 1200, H = 750;
const covers = {
  'inteligencia-artificial': { from: '#10281f', to: '#24634a', motif: () => {
    const nodes = [[200,200],[200,375],[200,550],[480,140],[480,300],[480,450],[480,610],[760,220],[760,380],[760,540],[1000,300],[1000,460]];
    const links = [[0,3],[0,4],[0,5],[1,3],[1,4],[1,5],[1,6],[2,4],[2,5],[2,6],[3,7],[3,8],[4,7],[4,8],[4,9],[5,8],[5,9],[6,9],[7,10],[8,10],[8,11],[9,11],[7,11]];
    return links.map(([a,b]) => `<line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}" stroke="#faf6ec" stroke-opacity=".28" stroke-width="2"/>`).join('')
      + nodes.map(([x,y],i) => `<circle cx="${x}" cy="${y}" r="${i%5===0?20:14}" fill="${i%5===0?'#b3401c':'#faf6ec'}"/>`).join('');
  }},
  'modelos-de-lenguaje': { from: '#143328', to: '#1b4d3a', motif: () => {
    let s = '';
    const rows = [[160,130,[300,180,220]],[160,220,[200,340,160]],[160,310,[260,120,300]],[160,400,[180,260,240]],[160,490,[340,200,140]],[160,580,[220,300,180]]];
    rows.forEach(([x,y,ws], r) => { let cx = x; ws.forEach((w,i) => { s += `<rect x="${cx}" y="${y}" width="${w}" height="46" rx="23" fill="${(r+i)%4===0?'#b3401c':'#faf6ec'}" fill-opacity="${(r+i)%4===0?1:.85}"/>`; cx += w + 24; }); });
    return s;
  }},
  'hardware-y-chips': { from: '#0d2019', to: '#1f5a43', motif: () => {
    let s = '<rect x="400" y="195" width="400" height="360" rx="28" fill="#faf6ec" fill-opacity=".95"/><rect x="460" y="255" width="280" height="240" rx="16" fill="#10281f"/><circle cx="600" cy="375" r="52" fill="#b3401c"/>';
    for (let i=0;i<6;i++){ const p = 440+i*64; s += `<rect x="${p}" y="145" width="22" height="50" fill="#faf6ec" fill-opacity=".8"/><rect x="${p}" y="555" width="22" height="50" fill="#faf6ec" fill-opacity=".8"/>`; }
    for (let i=0;i<5;i++){ const p = 235+i*64; s += `<rect x="340" y="${p}" width="60" height="22" fill="#faf6ec" fill-opacity=".8"/><rect x="800" y="${p}" width="60" height="22" fill="#faf6ec" fill-opacity=".8"/>`; }
    return s;
  }},
  'ingenieria-de-software': { from: '#10281f', to: '#2a6e52', motif: () => {
    return `<text x="600" y="440" font-family="Consolas,monospace" font-size="300" font-weight="700" text-anchor="middle" fill="#faf6ec">&lt;/&gt;</text>`
      + `<rect x="160" y="130" width="260" height="22" rx="11" fill="#faf6ec" fill-opacity=".35"/><rect x="160" y="175" width="180" height="22" rx="11" fill="#b3401c"/>`
      + `<rect x="780" y="560" width="260" height="22" rx="11" fill="#faf6ec" fill-opacity=".35"/><rect x="860" y="605" width="180" height="22" rx="11" fill="#b3401c"/>`;
  }},
  'etica-y-sociedad': { from: '#163d2e', to: '#24634a', motif: () => {
    return `<rect x="588" y="170" width="24" height="420" fill="#faf6ec"/><rect x="420" y="590" width="360" height="26" rx="13" fill="#faf6ec"/>`
      + `<rect x="250" y="210" width="700" height="18" rx="9" fill="#faf6ec"/><circle cx="600" cy="205" r="26" fill="#b3401c"/>`
      + `<line x1="290" y1="228" x2="210" y2="400" stroke="#faf6ec" stroke-width="5"/><line x1="290" y1="228" x2="370" y2="400" stroke="#faf6ec" stroke-width="5"/><path d="M190 400 H390 A100 70 0 0 1 190 400 Z" fill="#faf6ec" fill-opacity=".9"/>`
      + `<line x1="910" y1="228" x2="830" y2="360" stroke="#faf6ec" stroke-width="5"/><line x1="910" y1="228" x2="990" y2="360" stroke="#faf6ec" stroke-width="5"/><path d="M810 360 H1010 A100 70 0 0 1 810 360 Z" fill="#faf6ec" fill-opacity=".9"/>`;
  }},
  'robotica': { from: '#0f2a21', to: '#1f5a43', motif: () => {
    return `<rect x="170" y="560" width="300" height="40" rx="10" fill="#faf6ec"/><rect x="270" y="500" width="100" height="62" fill="#faf6ec" fill-opacity=".85"/>`
      + `<line x1="320" y1="500" x2="520" y2="300" stroke="#faf6ec" stroke-width="34" stroke-linecap="round"/><circle cx="320" cy="500" r="34" fill="#b3401c"/>`
      + `<line x1="520" y1="300" x2="780" y2="250" stroke="#faf6ec" stroke-width="30" stroke-linecap="round"/><circle cx="520" cy="300" r="30" fill="#b3401c"/>`
      + `<circle cx="780" cy="250" r="26" fill="#b3401c"/><path d="M780 250 L860 200 M780 250 L870 290" stroke="#faf6ec" stroke-width="16" stroke-linecap="round" fill="none"/>`
      + `<circle cx="950" cy="580" r="60" fill="#faf6ec" fill-opacity=".25"/>`;
  }}
};

for (const [slug, c] of Object.entries(covers)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.from}"/><stop offset="1" stop-color="${c.to}"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#g)"/>
<circle cx="1080" cy="90" r="190" fill="#faf6ec" fill-opacity=".05"/><circle cx="90" cy="700" r="230" fill="#faf6ec" fill-opacity=".05"/>
${c.motif()}
</svg>`;
  writeFileSync(`../public/covers/${slug}.svg`, svg);
}
console.log('Portadas generadas:', Object.keys(covers).join(', '));
