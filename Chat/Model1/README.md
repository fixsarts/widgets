# Fixs.Arts Chat Widget

Widget chat sederhana (Vanilla JS, tanpa dependency, tanpa backend/API). Pengunjung mengetik pesan → widget membalas dengan satu pesan tetap → muncul tombol WhatsApp & Instagram yang mengarahkan ke link masing-masing.

## Konfigurator (beta)

Buka `config.html` (mis. `https://fixsarts.github.io/widgets/Chat/Model1/config.html`). Atur profil, nama, link platform, warna, tema, posisi, ukuran, dan animasi lewat form, lihat hasilnya langsung di widget, lalu klik **Salin script** dan tempel sebelum `</body>` di website lain.

Pengaturan ikon/gambar tombol (`button.*`): `icon` (ikon bawaan, `avatar` = foto profil, `custom` = SVG sendiri) atau `image` (URL gambar/GIF); `imageMode` (`fill` menutupi tombol / `inset` seperti ikon), `imageShape`, `imageSize`, `imageFit`, `imageZoom`, `imageX`/`imageY` (titik fokus), `imageBackground`, `imageBorderWidth`/`imageBorderColor`, `iconStroke`, `iconRotate`. Foto profil di header punya `profile.zoom`, `posX`, `posY`, `fit`, `shape`.

## Pasang (satu script)

```html
<script src="https://fixsarts.github.io/widgets/Chat/Model1/dist/chat.js"></script>
```

Widget langsung muncul di pojok kanan bawah. Versi kecil: `dist/chat.min.js`.

## Ubah pengaturan (opsional)

```html
<script src="https://fixsarts.github.io/widgets/Chat/Model1/dist/chat.js"></script>
<script>
  FixsArtsChat.init({
    profile:  { name: "Fixs.Arts", image: "https://.../foto.png", shape: "circle" },   // circle | square | rounded | squircle | hexagon
    welcome:  { title: "Halo! Selamat datang 👋", message: "Ada yang bisa kami bantu?" },
    chat:     { reply: "Terima kasih sudah menghubungi Fixs.Arts! 👋 ...", placeholder: "Ketik pesan…" },
    theme:    "dark",                                                                   // dark | light | glass | gradient
    appearance: { accent: "#3b82f6", accent2: "#8b5cf6" },
    layout:   { position: "right", vertical: "bottom", offsetX: 24, offsetY: 24, panelWidth: 380, panelHeight: 540 },
    button:   { shape: "circle", size: 60 },                                            // circle | rounded | square | pill | squircle | hexagon
    contacts: [
      { name: "WhatsApp",  url: "https://wa.me/6285655526686",     enabled: true },
      { name: "Instagram", url: "https://instagram.com/fixs.arts/", enabled: true }
      // tambah platform lain: { name: "Telegram", url: "https://t.me/username" }
    ]
  });
</script>
```

Semua teks, warna, posisi, ukuran, bentuk, dan daftar platform bisa diganti lewat konfigurasi — tanpa mengedit source.

## API

`FixsArtsChat.open()` · `close()` · `toggle()` · `minimize()` · `restore()` · `update({...})` · `destroy()`

## Build ulang (jika mengubah `src/`)

```
npm install
npm run build      # menulis dist/chat.js dan dist/chat.min.js
```
