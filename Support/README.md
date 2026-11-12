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
- `size.scale` — skala banner 40–150% (teks, ikon, padding, tombol ikut menyesuaikan; popup tidak terpengaruh)
- `contentAlign` — rata isi banner: `left` | `center` | `right`
- `launcherButton.show` — `false` untuk menyembunyikan tombol "Dukung Sekarang" (banner tetap bisa diklik)
- Gambar QRIS di popup bisa diklik untuk diperbesar (klik lagi atau Esc untuk menutup)
