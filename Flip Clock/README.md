# Flip Clock

Widget jam flip untuk website mana pun. Satu file JavaScript, tanpa dependensi, style terisolasi (Shadow DOM) sehingga tidak bentrok dengan CSS website kamu.

- Waktu & tanggal dengan efek flip tiap detik, menit, dan jam
- Dua tema standar: **dark** dan **light**, warna tetap bisa diubah custom
- Bisa menampilkan sebagian saja (misal jam & menit saja)
- Format 12 jam (AM/PM) atau 24 jam, zona waktu, dan bahasa tanggal bisa diatur
- **Jadwal sholat** (opsional, default mati): Imsak, Subuh, Terbit, Dhuha, Dzuhur, Ashar, Maghrib, Isya sesuai wilayah, dengan hitung mundur

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
| `padX` | `data-pad-x` | `null` | Jarak isi jam ke tepi shape, kiri-kanan (px). Kosong = otomatis |
| `padY` | `data-pad-y` | `null` | Jarak isi jam ke tepi shape, atas-bawah (px). Kosong = otomatis |
| `shadow` | `data-shadow` | `false` | Bayangan di sekeliling shape (true/false) |
| `border` | `data-border` | `false` | Garis tepi shape; warna lewat data-border-color |
| `blinkColon` | `data-blink-colon` | `false` | Titik dua berkedip tiap detik (butuh separator colon) |
| `secondsBar` | `data-seconds-bar` | `false` | Bar progres detik di bawah jam |
| `align` | `data-align` | `center` | `left`, `center`, `right` |
| `padding` | `data-padding` | `true` | `false` = tanpa padding luar (navbar/footer) |
| `transparent` | `data-transparent` | `false` | Latar transparan, ikut warna website |
| `position` | `data-position` | - | Mode melayang: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`. Widget otomatis dipindah ke `<body>`, jadi tetap menempel di layar walau tag-nya ditaruh di footer/section yang punya `transform`/`filter` |
| `offset` | `data-offset` | `16` | Jarak dari tepi layar untuk mode melayang (px) |
| `credit` | `data-credit` | `true` | Tulisan ©fixsarts.studio |
| `prayer.enabled` | `data-prayer` | `false` | Aktifkan jadwal sholat. `data-prayer="false"` untuk mematikan |
| `prayer.region` | `data-prayer-region` | `banjarmasin-timur` | Id / nama wilayah. Daftar lengkap: `FixsFlipClock.regions()` |
| `prayer.lat` `prayer.lon` | `data-prayer-lat` `data-prayer-lon` | - | Koordinat sendiri (mengalahkan `region`), isi bersama `prayer.timezone` |
| `prayer.show` | `data-prayer-show` | tanpa Terbit & Dhuha | Waktu yang tampil, contoh `imsak,subuh,terbit,dhuha,dzuhur,ashar,maghrib,isya` |
| `prayer.layout` | `data-prayer-layout` | `row` | `row` (satu baris) atau `grid` (menyesuaikan lebar container) |
| `prayer.countdown` | `data-prayer-countdown` | `true` | Hitung mundur menuju waktu berikutnya |
| `prayer.location` | `data-prayer-location` | `true` | Tampilkan nama wilayah |
| `prayer.highlight` | `data-prayer-highlight` | `true` | Tandai waktu berikutnya, redupkan yang sudah lewat |
| `prayer.lang` | `data-prayer-lang` | `id` | `id` atau `en` (nama waktu) |
| `prayer.onPrayer` | - | - | Callback `(nama, key, 'HH:MM')` saat waktu sholat masuk |
| `maxWidth` | `data-max-width` | `null` | Lebar maksimum widget (px). Kosong = penuh mengikuti container. Cocok untuk section, contoh `720` |
| `marginX` `marginY` | `data-margin-x` `data-margin-y` | `0` | Margin luar widget dari tepi container (px) |
| `mobile.breakpoint` | `data-mobile-breakpoint` | `520` | Aturan HP aktif jika lebar container <= nilai ini |
| `mobile.size` | `data-mobile-size` | `null` | Ukuran kartu di HP (px). Kosong = sama dengan `size` |
| `mobile.marginX` `mobile.marginY` `mobile.maxWidth` | `data-mobile-margin-x` `-margin-y` `-max-width` | `null` | Margin & lebar maksimum khusus HP. Kosong = sama dengan desktop |
| `order` | `data-order` | `clock,date,location,prayer,countdown,credit` | Urutan komponen dari atas ke bawah |
| `loadFont` | - | `true` | Muat Oswald & Roboto dari Google Fonts. Set `false` untuk pakai font sendiri |
| `fontFamily` | - | Oswald | Font angka |

## Jadwal sholat

Fitur opsional, **default mati**. Jadwal dihitung langsung di browser (tanpa API, tanpa internet) dengan acuan Kemenag RI: Subuh 20°, Isya 18°, Ashar Syafi'i, ihtiyat +2 menit, Imsak = Subuh - 10 menit. Jam otomatis mengikuti zona waktu wilayah yang dipilih (kecuali `timezone` diisi sendiri).

```html
<!-- aktifkan: tambahkan data-prayer + pilih wilayah -->
<div data-fixs-flipclock data-theme="dark" data-size="80" data-hour12="false"
     data-prayer data-prayer-region="kota-palembang"
     data-prayer-show="imsak,subuh,terbit,dhuha,dzuhur,ashar,maghrib,isya"
     data-prayer-layout="grid"></div>
```

```js
const jam = FixsFlipClock.create('#jam', {
  prayer: { enabled: true, region: 'kota-bandung', layout: 'grid' }
});

jam.update({ prayer: { enabled: false } });   // matikan jadwal tanpa membuat ulang widget
jam.update({ prayer: { enabled: true } });    // nyalakan lagi
```

- **Matikan fitur**: hapus `data-prayer` (atau `enabled: false`). Jam tampil seperti biasa.
- **Pilih waktu yang tampil**: `data-prayer-show` (nama Indonesia) atau `prayer.show` (`fajr`, `sunrise`, `dhuhr`, `asr`, `isha`, dst.). Nama alias seperti `subuh`, `dzuhur`, `isya` juga dikenali di JS.
- **Daftar wilayah**: `FixsFlipClock.regions()` mengembalikan seluruh kota/kabupaten (+ beberapa kecamatan) beserta id-nya. Wilayah di luar daftar bisa pakai `lat` + `lon` + `timezone`.
- **Cek jadwal tanpa widget**: `FixsFlipClock.prayerTimes(new Date(), { region: 'kota-banjarmasin' })`.
- **Notifikasi saat waktu masuk**: `prayer.onPrayer = (nama, key, jam) => { ... }`.
- Layout `grid` menyesuaikan lebar container. Pada mode melayang (`data-position`) lebar mengikuti isi, jadi grid tampil satu baris.

## Penempatan di section, margin & tampilan HP

Secara default widget memenuhi lebar container-nya. Di section yang lebar (full width), atur lebar maksimum dan margin supaya tidak terlalu penuh:

```html
<div data-fixs-flipclock data-theme="light" data-size="90" data-hour12="false"
     data-max-width="760" data-margin-x="16" data-margin-y="24"
     data-mobile-size="56" data-mobile-margin-x="16" data-mobile-margin-y="12"></div>
```

- `maxWidth` membatasi lebar widget dan otomatis di-center (atau ikut `align`). Grid jadwal sholat ikut dibatasi.
- `marginX` / `marginY` memberi jarak dari tepi container, dihitung dalam auto-fit sehingga jam tidak mepet.
- Blok `mobile` hanya berlaku saat lebar **container** <= `mobile.breakpoint` (default 520px). Nilai yang dikosongkan mengikuti pengaturan desktop. Tanpa opsi ini, tampilan sama seperti versi sebelumnya.
- Di `demo.html`, tombol **Pratinjau HP** menyempitkan preview untuk mencoba aturan HP.

## Susunan komponen

Urutan komponen diatur lewat `order` (atau `data-order`). Komponen: `clock`, `date`, `location` (nama wilayah), `prayer` (jadwal), `countdown` (hitung mundur), `credit`. Komponen yang tidak aktif dilewati, dan yang tidak disebut ditaruh di belakang.

```html
<!-- nama wilayah dipindah ke bawah "Menuju ..." -->
<div data-fixs-flipclock data-prayer data-order="clock,date,prayer,countdown,location,credit"></div>
```

Di Playground `demo.html` ada bagian **Susunan komponen (BETA)**: seret (drag & drop) atau pakai tombol ▲▼, lalu salin kode hasilnya.

## Contoh penempatan

Nama class wrapper bebas, tidak berpengaruh ke widget. Yang wajib hanya atribut `data-fixs-flipclock`.

**Di bawah kotak Search (hero)**
```html
<div style="max-width:560px;margin:24px auto 0">
  <div data-fixs-flipclock data-theme="light" data-show="hours,minutes,date"
       data-hour12="false" data-size="90"></div>
</div>
```

**Navbar / header** (kecil, transparan, rata kanan)
```html
<div style="width:150px">
  <div data-fixs-flipclock data-theme="dark" data-show="hours,minutes" data-hour12="false"
       data-size="34" data-transparent data-padding="false" data-credit="false" data-align="right"></div>
</div>
```

**Sidebar / card** (ukuran menyesuaikan lebar container)
```html
<div data-fixs-flipclock data-theme="light" data-show="hours,minutes,seconds"
     data-hour12="false" data-size="56" data-credit="false"></div>
```

**Footer**
```html
<div style="width:100%;max-width:400px">
  <div data-fixs-flipclock data-theme="light" data-show="hours,minutes,date"
       data-size="46" data-transparent data-padding="false"></div>
</div>
```

**Layar penuh (idle / lock screen)**
```html
<div data-fixs-flipclock data-theme="dark" data-size="180"></div>
```

**Melayang di pojok layar** (tanpa wrapper khusus)
```html
<div data-fixs-flipclock data-theme="dark" data-show="hours,minutes,date"
     data-hour12="false" data-size="70" data-position="bottom-right"></div>
```

Semua contoh ini bisa dicoba dan diatur langsung di `demo.html`.

### Contoh warna custom

```html
<div data-fixs-flipclock
     data-bg="#1e1b4b" data-card="#4338ca" data-text="#ffffff" data-divider="#1e1b4b"
     data-label="#c7d2fe" data-date-color="#c7d2fe" data-credit-color="#818cf8"></div>
```

## Troubleshooting

- **Jam melayang malah ikut ke footer / tidak di pojok layar**: sudah diperbaiki di v1.0.1 (host dipindah ke `<body>`). Pastikan memakai file terbaru, bukan salinan lama di CDN/cache.
- **Jam melayang menimpa widget lain (misal musik) di pojok yang sama**: pilih pojok berbeda via `data-position`, atau atur `data-offset` supaya ada jarak.
- **Bagian tanggal/Tahun terpotong**: pastikan `data-fit` tidak diset `false`, dan container tidak lebih sempit dari jamnya. Sejak v1.0.1 padding container ikut dihitung.
- **Elemen jam baru muncul belakangan (SPA, popup, builder)**: sejak v1.0.1 otomatis terdeteksi. Untuk cara manual: `FixsFlipClock.init()`.
- Setelah update file, lakukan hard refresh (Ctrl+Shift+R). Link CDN `@main` bisa tersimpan di cache hingga beberapa jam; gunakan tag versi (`@v1.0.1`) agar pasti.

## Changelog

**v1.3.0**
- Baru: `maxWidth`, `marginX`, `marginY` untuk penempatan di section (lebar terbatas + margin).
- Baru: blok `mobile` (`breakpoint`, `size`, `marginX`, `marginY`, `maxWidth`) untuk aturan khusus layar sempit.
- Baru: `order` / `data-order` untuk mengatur urutan komponen (jam, tanggal, nama wilayah, jadwal, hitung mundur, credit).
- Perubahan: grid jadwal sholat tidak lagi melebar sampai ujung container; kolom dibatasi lebarnya dan di-center.
- Demo: preset & contoh **Section**, bagian "Lebar, margin & HP" (dengan pratinjau Tablet/HP), dan "Susunan komponen (BETA)" dengan drag & drop.

**v1.2.0**
- Baru: **jadwal sholat** (Imsak, Subuh, Terbit, Dhuha, Dzuhur, Ashar, Maghrib, Isya) per wilayah, hitung mundur, penanda waktu berikutnya, layout `row`/`grid`, bisa dimatikan (default mati).
- Baru: atribut `data-prayer-*`, `FixsFlipClock.regions()`, `FixsFlipClock.findRegion()`, `FixsFlipClock.prayerTimes()`, callback `prayer.onPrayer`.
- Demo: bagian "9. Jadwal sholat" di Playground (aktif/nonaktif, wilayah, waktu yang tampil, layout, bahasa, hitung mundur), contoh penempatan ke-7, dan tabel opsi `prayer.*`. Kode HTML/JS hasil Playground ikut menyertakan opsi sholat.

**v1.1.0**
- Baru: `padX` / `padY` untuk mengatur jarak isi jam ke tepi shape.
- Baru (semua bisa on/off, default mati): `shadow`, `border`, `blinkColon`, `secondsBar`.
- Perbaikan: `update()` kini mengganti `colors` secara total, jadi reset warna benar-benar bekerja.
- Demo: preview selalu dibuat ulang dari pengaturan (sinkron), kontrol shape/efek baru, tampilan dirapikan.

**v1.0.2**
- Baru: pesan versi di Console (F12) dan `FixsFlipClock.debug()` untuk cek versi yang termuat dan kondisi jam.

**v1.0.1**
- Fix: mode melayang kini dipindah ke `<body>` + gaya `!important`, sehingga tidak "tersandera" ancestor ber-`transform`/`filter`/`backdrop-filter`/`contain` atau CSS website.
- Fix: auto-fit memakai lebar konten container (padding dikurangi), sehingga jam/tanggal tidak meluber dan Tahun tidak terpotong.
- Fix: lebar tanggal diukur setelah teks terisi, dan diukur ulang saat font selesai dimuat atau tanggal berganti.
- Baru: elemen `data-fixs-flipclock` yang ditambahkan belakangan terdeteksi otomatis; posisi melayang memperhitungkan safe-area (notch/home bar); `:host` diisolasi dari style turunan website.

## Struktur folder

```
Flip Clock/
├── flip-clock.js   # widget
├── demo.html       # demo & playground
└── README.md
```

---

©fixsarts.studio
