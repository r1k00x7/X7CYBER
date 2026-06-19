# Live Threat Map

Visualisasi serangan siber global secara real-time. Globe 3D interaktif menampilkan beam serangan melengkung antar negara, dengan panel filter, counter, dan feed event langsung.

Implementasi orisinal (clean-room). Tidak menyalin kode, aset, atau branding pihak mana pun. Menggunakan library open-source dan tekstur Earth night-lights yang berlisensi bebas.

## Teknologi

- **Next.js (App Router)** + React + TypeScript
- **Tailwind CSS** untuk styling
- **Three.js** via `@react-three/fiber` dan `@react-three/drei`
- **Socket.IO** (server Node kustom + client) untuk stream event real-time

## Fitur

- Globe 3D tema gelap dengan tekstur night-lights, atmosphere glow, dan auto-rotate.
- Drag untuk rotasi, scroll untuk zoom in/out, starfield latar.
- Beam serangan melengkung: titik sumber merah, target biru, kepala beam bergerak, pulse saat mendarat.
- Panel kiri: interval statistik (1 Hour / 6 Hours / 24 Hours) dan filter Attackers (Web Attackers, DDoS Attackers, Intruders, Scanners, Anonymizers).
- Counter bawah: Total Events, Source Countries, Target Countries.
- Feed event terbaru (Time, Source &rarr; Target, Attack Type) yang terus diperbarui.
- Tombol Pause / Resume animasi.

## Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Server `server.js` menjalankan Next.js sekaligus Socket.IO yang mengalirkan event serangan simulasi.

## Build produksi

```bash
npm run build
npm start
```

## Struktur

```
server.js              # Next.js + Socket.IO server (emit event simulasi)
lib/countries.js       # koordinat negara + tipe serangan (server)
lib/geo.ts             # konversi lat/lng -> vektor 3D, arc bezier
lib/types.ts           # tipe AttackEvent
lib/useAttackSocket.ts # hook subscribe Socket.IO
components/            # Globe, Starfield, AttackBeam, panel, counter, feed
app/                   # layout, page, global styles
```
