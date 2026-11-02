# Flip Clock

Widget jam flip untuk website mana pun. Satu file JavaScript, tanpa dependensi, style terisolasi (Shadow DOM) sehingga tidak bentrok dengan CSS website kamu.

- Waktu & tanggal dengan efek flip tiap detik, menit, dan jam
- Dua tema standar: **dark** dan **light**, warna tetap bisa diubah custom
- Bisa menampilkan sebagian saja (misal jam & menit saja)
- Format 12 jam (AM/PM) atau 24 jam, zona waktu, dan bahasa tanggal bisa diatur

## Demo

Buka `demo.html` (butuh `flip-clock.js` di folder yang sama) untuk melihat semua varian dan playground konfigurasi.

## Cara pasang

### 1. Lewat CDN (paling mudah)

```html
<script src="https://cdn.jsdelivr.net/gh/fixsarts/widgets@main/Flip%20Clock/flip-clock.js"></script>
<div data-fixs-flipclock data-theme="dark"></div>
```

Untuk produksi, disarankan mengunci versi dengan tag/release, misalnya `@v1.0.0` menggantikan `@main`, supaya tampilan tidak berubah saat ada update.

### 2. File lokal

Unduh `flip-clock.js`, simpan di proyek kamu, lalu:

```html
<script src="flip-clock.js"></script>
<div data-fixs-flipclock data-theme="light"></div>
```

### 3. Lewat JavaScript

```html
<div id="jam"></div>
<script>
  const jam = FixsFlipClock.create('#jam', {
    theme: 'dark',
    show: { hours: true, minutes: true, seconds: false, date: true },
    hour12: false
  });

  jam.update({ theme: 'light' }); // ubah konfigurasi saat berjalan
  jam.destroy();                  // hapus widget
</script>
```

## Opsi konfigurasi

| Opsi (JS) | Atribut HTML | Default | Keterangan |
|---|---|---|---|
| `theme` | `data-theme` | `dark` | `dark` atau `light` |
| `colors` | `data-bg`, `data-card`, `data-text`, `data-divider`, `data-label`, `data-date-color`, `data-credit-color` | tema | Override warna (nilai CSS apa pun) |
| `show` | `data-show="hours,minutes"` | semua | Bagian yang tampil: `hours`, `minutes`, `seconds`, `date` |
| `hour12` | `data-hour12` | `true` | `true` = 12 jam + AM/PM, `false` = 24 jam |
| `show.ampm` | `data-ampm` | `true` | Label AM/PM (hanya mode 12 jam) |
| `leadingZero` | `data-leading-zero` | `true` | `09` atau `9` |
| `separator` | `data-separator` | `none` | `none` atau `colon` |
| `flip` | `data-flip` | `true` | Efek flip on/off |
| `flipDuration` | - | `0.3` | Detik per setengah putaran |
| `size` | `data-size` | `160` | Tinggi kartu (px). Otomatis mengecil jika container sempit |
| `fit` | `data-fit` | `true` | Auto-fit ke lebar container |
| `timezone` | `data-timezone` | perangkat | Contoh `Asia/Makassar` |
| `locale` | `data-locale` | `en-US` | Bahasa tanggal, contoh `id-ID` |
| `radius` | `data-radius` | `14` | Lengkung sudut kartu (px) |
| `credit` | `data-credit` | `true` | Tulisan ©fixsarts.studio |
| `loadFont` | - | `true` | Muat Oswald & Roboto dari Google Fonts. Set `false` untuk pakai font sendiri |
| `fontFamily` | - | Oswald | Font angka |

### Contoh warna custom

```html
<div data-fixs-flipclock
     data-bg="#1e1b4b" data-card="#4338ca" data-text="#ffffff" data-divider="#1e1b4b"
     data-label="#c7d2fe" data-date-color="#c7d2fe" data-credit-color="#818cf8"></div>
```

## Struktur folder

```
Flip Clock/
├── flip-clock.js   # widget
├── demo.html       # demo & playground
└── README.md
```

---

©fixsarts.studio
