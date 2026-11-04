# Fixs.Arts Welcome Widget · Model1

Modal sambutan portable: satu script, tanpa framework, CSS terisolasi (Shadow DOM) sehingga tidak bentrok dengan website pengguna.

## Instalasi

```html
<script src="https://cdn.jsdelivr.net/gh/fixsarts/widgets@main/Pop%20up/Model1/widget.js"></script>
<script>
  FixsArtsWelcome.init({
    title: "Welcome!",
    description: "Welcome to our website.",
    theme: "glass",
    closeButton: true,
    credit: true
  });
</script>
```

Untuk mengunci versi, ganti `@main` dengan tag/release, misalnya `@v1.0.0`. Cara ini bisa dipakai di website mana pun (WordPress, Blogger, Webflow, HTML biasa): tempel kode di atas sebelum `</body>`.

### Pemanggilan asynchronous
Script boleh dimuat dengan `async`/`defer`. Antrikan perintah sebelum script selesai dimuat:

```html
<script>window.FixsArtsWelcome = window.FixsArtsWelcome || []; FixsArtsWelcome.push(["init", { title: "Halo" }]);</script>
<script src="…/widget.js" async></script>
```

## API

| Method | Fungsi |
|---|---|
| `init(config)` | Pasang widget. Jika dipanggil lagi, hanya memperbarui (modal tidak muncul ganda). |
| `open()` / `close()` | Buka / tutup modal. |
| `update(config)` | Gabungkan konfigurasi baru. `update(config, { replace: true })` mengganti seluruh konfigurasi. |
| `destroy()` | Hapus widget dan semua listener. |
| `isOpen()`, `getConfig()`, `getPreset(nama)` | Info status / konfigurasi. |

## Konfigurasi

Semua opsi opsional. Nilai tidak valid dikoreksi ke default dan menampilkan peringatan di console.

| Opsi | Default | Keterangan |
|---|---|---|
| `theme` | `dark` | `dark`, `light`, `glass`, `neon`, `minimal` |
| `title`, `subtitle`, `description`, `info` | | Teks (baris baru `\n` didukung) |
| `align` | `center` | Posisi isi: `left` / `center` / `right` |
| `closeButton`, `closeOnOverlay`, `closeOnEsc` | `true` | Cara menutup modal |
| `autoOpen`, `delay` | `true`, `300` | Tampil otomatis dan jeda (ms) |
| `once`, `storageKey` | `false` | `"session"` / `"forever"`: tampilkan sekali saja |
| `size` | `{width:460,height:'auto'}` | Ukuran modal (px) |
| `shape`, `radius` | `rounded`, `24` | `rectangle`, `rounded`, `pill`, `custom` |
| `padding`, `gap`, `opacity` | `32`, `14`, `1` | Spasi dan transparansi background modal |
| `colors` | | `background`, `text`, `muted`, `accent`, `accent2`, `border`, `overlay` |
| `gradient` | | `{enabled, from, to, angle}` |
| `backgroundImage` | | `{src, size, position, dim}` |
| `show` | semua `true` | On/off elemen: `{image, subtitle, title, description, info, buttons}`. Contoh hanya gambar + tombol: `show: {subtitle:false, title:false, description:false, info:false}` |
| `text` | | Gaya tiap teks: `text.title`, `text.subtitle`, `text.description`, `text.info`, masing-masing `{size, color, weight}`. `color: ""` = ikut tema |
| `image` | | `{src, alt, height, width, align, order, bleed, zoom, posX, posY, radius, fit}`. `height: 0` = otomatis (rasio asli). `posX`/`posY` (0-100) menggeser gambar, `zoom` (1-4) memperbesar, `order`: `top`/`bottom`, `bleed`: penuh sampai tepi modal |
| `buttons` | `[]` | Maks. 4: `{label, href, target, color, textColor, variant, size, radius, close, onClick}` |
| `buttonsAlign` | `center` | Posisi tombol |
| `effects.overlay` | | `{enabled, opacity}` (dark overlay) |
| `effects.blur` | `enabled: false` | `{enabled, amount}`. Blur layar penuh bisa membuat gerak mouse patah-patah di web yang banyak animasi, jadi default mati. Gunakan overlay gelap sebagai gantinya |
| `effects.glass` | | `{enabled, blur, opacity}` (glassmorphism) |
| `effects.animation` | | `{type, duration}`: `fade`, `scale`, `slide-up`, `slide-down`, `slide-left`, `none` |
| `effects.shadow` / `glow` / `border` | | Shadow, glow, dan garis tepi, masing-masing bisa on/off |
| `audio` | | `{src, autoplay, volume, muted, loop, controls}` |
| `credit` | | `{enabled, text, href, color, size, position}` |
| `container`, `zIndex`, `lockScroll` | | Render di dalam elemen tertentu (selector/elemen), tumpukan layer, kunci scroll |
| `onOpen`, `onClose` | | Callback |

`credit: true` pada contoh singkat berarti credit aktif dengan pengaturan default. Isi `credit.href` dengan link Fixs.Arts Anda.

## Template banner
Demo memakai banner `assets/images/Card for Linktree.jpg` sebagai template awal:

```js
image: { src: "https://cdn.jsdelivr.net/gh/fixsarts/widgets@main/Pop%20up/Model1/assets/images/Card%20for%20Linktree.jpg" }
```

## Audio
Audio hanya diputar saat modal tampil dan berhenti saat ditutup.

Browser memblokir autoplay bersuara sampai pengunjung berinteraksi dengan halaman (klik, tap, atau tekan tombol). Jika diblokir:
- `controls: false`: tidak ada tombol apa pun. Audio mulai otomatis dari awal pada klik/tap pertama pengunjung di mana saja di halaman.
- `controls: true`: panel audio tampil dengan tombol play ("Ketuk untuk memutar suara"), dan audio juga mulai pada interaksi pertama.

`loop` dan `volume` berlaku setelah audio berjalan. Jika pengunjung sudah pernah berinteraksi dengan situs Anda (misalnya pindah dari halaman lain), autoplay biasanya langsung jalan.

## Mengganti gambar dan audio
Upload file ke `assets/images/` atau `assets/audio/` di repo, lalu isi URL-nya:

```js
image: { src: "https://cdn.jsdelivr.net/gh/fixsarts/widgets@main/Pop%20up/Model1/assets/images/hero.jpg" },
audio: { src: "https://cdn.jsdelivr.net/gh/fixsarts/widgets@main/Pop%20up/Model1/assets/audio/welcome.mp3" }
```

## Menggunakan demo
Buka `demo.html` di browser (satu folder dengan `widget.js`). Ubah pengaturan di panel kanan, preview langsung berubah. Ada preview Desktop/Mobile, pilihan **latar contoh website** (hitam/putih/abu/gradient/warna kustom) untuk memperkirakan tampilan di web terang atau gelap, tombol **Salin** di kotak kode, tombol **Reset Configuration**, **Export JSON**, dan **Copy installation code**. Gambar/audio hasil upload hanya untuk preview; di kode hasil, diganti placeholder yang harus Anda isi dengan URL file di repo.

## Hosting
- **jsDelivr (disarankan):** setelah folder ini ada di repo `fixsarts/widgets`, URL di atas langsung aktif. Jika file belum berubah setelah update, buka `https://purge.jsdelivr.net/gh/fixsarts/widgets@main/Pop%20up/Model1/widget.js`.
- **GitHub Pages:** Settings → Pages → Branch `main` → Save. URL: `https://fixsarts.github.io/widgets/Pop%20up/Model1/widget.js`.

## Struktur
```
Pop up/
└── Model1/
    ├── widget.js        # file utama (siap pakai)
    ├── widget.min.js    # versi ringan
    ├── demo.html        # demo + panel konfigurasi
    ├── README.md
    ├── assets/images, assets/audio
    └── examples/basic-installation.html
```
Model lain (Model2, Model3, …) cukup dibuat sebagai folder baru dengan struktur yang sama.
