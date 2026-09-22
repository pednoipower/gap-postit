// Render QR matrices to plain text so Python can turn them into images
global.window = {};
global.TextEncoder = require('util').TextEncoder;
require('../assets/qrcode.js');
const QR = global.window.QRCode;

const cases = [
  "https://missingpiece.example.com",
  "https://gap-postit.netlify.app/?room=PZKT",
  "http://192.168.1.47:8080",
  "https://a.co/x",
  "https://workshop.example.org/join?room=PZKT&utm_source=projector&ref=slide1",
  "https://really-quite-a-long-domain-name-for-a-workshop.example.org/join/room/PZKT/participant/entry?x=1",
  "HTTPS://EXAMPLE.COM/ÅÄÖ-ทดสอบ"
];

const out = [];
for (const text of cases) {
  const qr = QR.generate(text, { level: "M" });
  out.push({ text, version: qr.version, mask: qr.mask, size: qr.size,
             matrix: qr.matrix.map(r => r.join('')) });
}
console.log(JSON.stringify(out));
