# Support Widget

Widget "Support the Creator" (popup QRIS). Tanpa build, tanpa framework.

```
Support/
├── index.html            contoh halaman yang memakai widget
├── demo.html             halaman pengaturan (live preview + salin script)
├── assets/qris.jpg       gambar QRIS
├── css/support-widget.css  style widget (dimuat otomatis)
├── css/demo.css            style demo.html
├── js/support-widget.js    mesin widget (jarang perlu diubah)
└── js/demo.js              logika demo.html
```

## Cara pakai (salin script → tempel)
1. Buka `demo.html` (lewat server, mis. GitHub Pages atau `python3 -m http.server`).
2. Atur tampilan, lihat hasilnya di preview (desktop / mobile).
3. Di bagian **Pasang di website**, isi *Alamat folder widget* (URL publik tempat folder `js/` dan `css/` ini di-hosting), lalu klik **Salin script**.
4. Tempel di website tujuan, di tempat widget mau muncul.

Hasilnya seperti ini (config tertanam di dalam script, hanya nilai yang beda dari bawaan):
```html
<div id="support-widget"></div>
<script>
window.SUPPORT_CONFIG = { "text": { "title": "Traktir kopi dong" }, "icon": { "name": "coffee" } };
</script>
<script src="https://cdn.jsdelivr.net/gh/fixsarts/widgets@main/Support/js/support-widget.js"></script>
```
Tiap website boleh punya script sendiri dengan tampilan/teks berbeda, tanpa menimpa file apa pun. Mode melayang tidak butuh `<div>`.
Pilih target lain dengan `data-target="#id"` di tag `<script src>`. CSS dan gambar QRIS dicari relatif ke lokasi `support-widget.js`.

Pengaturan terakhir tersimpan otomatis di browser yang dipakai membuka `demo.html` (tombol **Reset** mengembalikan ke bawaan). Tidak ada file config yang perlu diunduh atau ditimpa.

Mengganti QRIS: taruh gambar di `assets/` di hosting widget, isi lokasinya di bagian QRIS pada demo.html.

## Teks tombol
Ada dua pengaturan tombol terpisah, masing-masing punya teks, warna, ukuran, ketebalan:
- `launcherButton` — tombol di tampilan widget
- `popupButton` — tombol di dalam popup (konfirmasi + tutup)

## Opsi banner
- `orientation` — bentuk banner: `auto` | `landscape` (selalu satu baris) | `portrait` (selalu tersusun ke bawah)
- `launcherButton.placement` — posisi tombol di banner: `side` (di samping teks) | `below` (di bawah teks) | `bottom` (di bawah, selebar banner)
- `size.autoHeight` / `size.height` — tinggi otomatis, atau tinggi tetap dalam px (sebelum skala)
- `closeButton.show` — tombol X agar pengunjung bisa menyembunyikan widget; `closeButton.remember`: `never` | `session` | `forever`
- `closeButton.size` (diameter lingkaran, px), `iconSize` (tanda X, px), `background` (warna lingkaran), `color` (warna tanda X)
- `closeButton.alignIcon` — `true`: tengah X otomatis sejajar tengah ikon (diukur langsung); `offsetY` = geser halus (negatif naik), `offsetX` = jarak dari sisi kanan
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
