const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');
const { COUNTRIES, ATTACK_TYPES } = require('./lib/countries');

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);
const app = next({ dev });
const handle = app.getRequestHandler();

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeEvent() {
  let source = pick(COUNTRIES);
  let target = pick(COUNTRIES);
  let guard = 0;
  while (target.code === source.code && guard < 5) {
    target = pick(COUNTRIES);
    guard += 1;
  }
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    time: new Date().toISOString(),
    sourceCountry: source.name,
    sourceCode: source.code,
    sourceLat: source.lat,
    sourceLng: source.lng,
    targetCountry: target.name,
    targetCode: target.code,
    targetLat: target.lat,
    targetLng: target.lng,
    attackType: pick(ATTACK_TYPES),
  };
}

app.prepare().then(() => {
  const httpServer = createServer((req, res) => handle(req, res));
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    // Send a small burst on connect so the map populates immediately.
    for (let i = 0; i < 8; i += 1) {
      socket.emit('attack', makeEvent());
    }
  });

  // Steady, moderate global stream of simulated attacks.
  setInterval(() => {
    const batch = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < batch; i += 1) {
      io.emit('attack', makeEvent());
    }
  }, 700);

  httpServer.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`> Live Threat Map ready on http://localhost:${port}`);
  });
});
