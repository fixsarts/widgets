# Support Widget

Widget "Support the Creator" (popup QRIS). Tanpa build, tanpa framework.

```
Support/
├── index.html            contoh halaman yang memakai widget
├── demo.html             halaman pengaturan (live preview + unduh config)
├── assets/qris.jpg       gambar QRIS
├── css/support-widget.css  style widget (dimuat otomatis)
├── css/demo.css            style demo.html
├── js/support-widget.js    mesin widget (jarang perlu diubah)
├── js/support-config.js    PENGATURAN — file inilah yang ditimpa
└── js/demo.js              logika demo.html
```

## Cara ubah pengaturan
1. Buka `demo.html` (lewat server, mis. GitHub Pages atau `python3 -m http.server`).
2. Atur tampilan, lihat hasilnya di preview (desktop / mobile).
3. Klik **Unduh support-config.js**, lalu timpa `js/support-config.js`.

Mengganti QRIS: taruh gambar di `assets/`, isi lokasinya di bagian QRIS pada demo.html.

## Pasang di website
```html
<div id="support-widget"></div>
<script src="js/support-config.js"></script>
<script src="js/support-widget.js"></script>
```
`support-config.js` harus dimuat **sebelum** `support-widget.js`. CSS dan gambar QRIS dicari relatif ke lokasi `support-widget.js`, jadi pemasangan lewat URL penuh (GitHub Pages / jsDelivr) tetap jalan:
```html
<script src="https://cdn.jsdelivr.net/gh/fixsarts/widgets@main/Support/js/support-config.js"></script>
<script src="https://cdn.jsdelivr.net/gh/fixsarts/widgets@main/Support/js/support-widget.js"></script>
```
Mode melayang (tanpa `<div>`): pilih "Melayang di sudut layar" di demo.html.

## Teks tombol
Ada dua pengaturan tombol terpisah, masing-masing punya teks, warna, ukuran, ketebalan:
- `launcherButton` — tombol di tampilan widget
- `popupButton` — tombol di dalam popup (konfirmasi + tutup)

## Opsi banner
- `orientation` — bentuk banner: `auto` | `landscape` (selalu satu baris) | `portrait` (selalu tersusun ke bawah)
- `launcherButton.placement` — posisi tombol di banner: `side` (di samping teks) | `below` (di bawah teks) | `bottom` (di bawah, selebar banner)
- `size.autoHeight` / `size.height` — tinggi otomatis, atau tinggi tetap dalam px (sebelum skala)
- `closeButton.show` — tombol X agar pengunjung bisa menyembunyikan widget; `closeButton.remember`: `never` | `session` | `forever`
- `icon.name` — ikon bawaan: heart-handshake, heart, qr-code, scan-qr, barcode, scan-barcode, coffee, gift, star, sparkles, wallet, coins, banknote, smile, thumbs-up, zap, crown, gem, flame
- `size.autoWidth` — `true`: lebar banner pas dengan isinya (`size.width` jadi batas maksimal); `false`: lebar tetap `size.width`
- `size.scale` — skala banner 40–150%. Seluruh banner diperkecil/dibesarkan dengan bentuk yang sama (ukuran tampil = `size.width` × skala); popup tidak terpengaruh
- `contentAlign` — rata isi banner (ikon, teks, tombol): `left` | `center` | `right`
- Mode melayang: di demo.html seret widget langsung di preview; hasilnya masuk ke `position.corner`, `offsetX`, `offsetY`
- `launcherButton.show` — `false` untuk menyembunyikan tombol "Dukung Sekarang" (banner tetap bisa diklik)
- Gambar QRIS di popup bisa diklik untuk diperbesar (klik lagi atau Esc untuk menutup)

## Preview di website sendiri (demo.html)
Isi alamat website di kolom di atas preview lalu klik **Muat**. Website tampil di dalam preview dan widget ditempel di atasnya (desktop/mobile, popup, animasi semuanya bisa dicoba). Untuk mode "di dalam halaman", atur "Jarak dari atas" supaya posisinya mirip letak `<div id="support-widget">` di websitemu.
Batasan: website yang melarang ditampilkan di iframe (header `X-Frame-Options` / CSP `frame-ancestors`, mis. Google dan Facebook) akan tampil kosong. Pengaturan tampil desktop/mobile baru berlaku di website asli, bukan di preview ini.
