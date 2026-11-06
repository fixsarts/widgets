/*!
 * Fixs Flip Clock v1.3.0
 * Widget jam flip tanpa dependensi, bisa dipasang di website mana pun.
 * ©fixsarts.studio
 *
 * Pemakaian cepat (HTML saja):
 *   <script src="flip-clock.js"></script>
 *   <div data-fixs-flipclock data-theme="dark"></div>
 *
 * Pemakaian via JavaScript:
 *   FixsFlipClock.create('#jam', { theme: 'light', show: { seconds: false } });
 */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  Tema bawaan & opsi default                                         */
  /* ------------------------------------------------------------------ */
  var THEMES = {
    dark: {
      background: '#000000',
      card: '#2b2b2b',
      text: '#f2f2f2',
      divider: '#000000',
      label: '#b5b5b5',
      date: '#a8a8a8',
      credit: '#6b6b6b',
      border: '#3a3a3a'
    },
    light: {
      background: '#ffffff',
      card: '#d3d3d3',
      text: '#1b1b1b',
      divider: '#ffffff',
      label: '#555555',
      date: '#666666',
      credit: '#222222',
      border: '#c4c4c4'
    }
  };

  var DEFAULTS = {
    theme: 'dark',          // 'dark' | 'light'
    colors: {},             // override: background, card, text, divider, label, date, credit
    show: {
      hours: true,
      minutes: true,
      seconds: true,
      date: true,
      ampm: true            // label AM/PM (hanya jika hour12 = true)
    },
    hour12: true,           // true = 12 jam (AM/PM), false = 24 jam
    leadingZero: true,      // 09 atau 9
    separator: 'none',      // 'none' | 'colon'
    flip: true,             // efek flip on/off
    flipDuration: 0.3,      // detik (per setengah putaran)
    size: 160,              // tinggi kartu (px)
    fit: true,              // otomatis mengecil jika container sempit
    timezone: null,         // contoh: 'Asia/Makassar' (null = zona waktu perangkat)
    locale: 'en-US',        // bahasa untuk tanggal, contoh: 'id-ID'
    dateFormat: {           // format tanggal, contoh hasil (id-ID): Senin, 02 Nov 2026
      weekday: 'long',      //   'long' (Senin) | 'short' (Sen) | false
      day: '2-digit',       //   '2-digit' (02) | 'numeric' (2) | false
      month: 'short',       //   'short' (Nov) | 'long' (November) | '2-digit' (11) | 'numeric' (11) | false
      year: 'numeric',      //   'numeric' (2026) | '2-digit' (26) | false
      comma: true,          //   koma setelah nama hari
      uppercase: false      //   HURUF BESAR
    },
    gapDigit: null,         // jarak antar kartu dalam satu pasang angka (px pada ukuran `size`), null = otomatis
    gapGroup: null,         // jarak antar pasangan jam / menit / detik (px), null = otomatis
    gapDate: null,          // jarak antara jam dengan tanggal & credit (px), null = otomatis
    credit: true,           // tulisan ©fixsarts.studio
    radius: 14,             // lengkung sudut kartu (px)
    align: 'center',        // 'left' | 'center' | 'right' (posisi jam di dalam container)
    padding: true,          // false = tanpa padding luar (cocok untuk navbar / footer)
    padX: null,             // jarak kiri-kanan isi jam ke tepi shape (px). null = otomatis
    padY: null,             // jarak atas-bawah isi jam ke tepi shape (px). null = otomatis
    shadow: false,          // bayangan di sekeliling shape
    border: false,          // garis tepi shape (warna: colors.border)
    blinkColon: false,      // titik dua berkedip tiap detik (jika separator = 'colon')
    secondsBar: false,      // garis progres detik di bawah jam
    transparent: false,     // true = latar widget transparan (ikut warna website)
    position: null,         // null = ikut posisi elemen | 'top-left' | 'top-center' | 'top-right'
                            //   | 'bottom-left' | 'bottom-center' | 'bottom-right' (melayang/fixed)
    offset: 16,             // jarak dari tepi layar (px), hanya untuk mode melayang
    maxWidth: null,         // lebar maksimum widget (px). null = penuh mengikuti container (cocok untuk section: mis. 720)
    marginX: 0,             // margin kiri-kanan dari tepi container (px)
    marginY: 0,             // margin atas-bawah (px)
    mobile: {               // aturan khusus layar sempit (HP). Aktif jika lebar container <= breakpoint
      breakpoint: 520,      //   batas lebar (px)
      size: null,           //   ukuran kartu di HP (px). null = sama seperti `size`
      marginX: null,        //   margin kiri-kanan di HP. null = sama seperti `marginX`
      marginY: null,        //   margin atas-bawah di HP
      maxWidth: null        //   lebar maksimum di HP
    },
    order: ['clock', 'date', 'location', 'prayer', 'countdown', 'credit'],   // urutan komponen (bisa diubah / drag & drop di demo)
    prayer: {               // JADWAL SHOLAT (dihitung di browser, tanpa API)
      enabled: false,       //   true = tampilkan jadwal sholat di bawah tanggal
      region: 'banjarmasin-timur',  // id / nama wilayah, contoh: 'kota-bandung', 'Kota Makassar', 'Jakarta Selatan'
      lat: null, lon: null, //   koordinat sendiri (mengalahkan `region`). Wajib diisi bersama `timezone`
      elevation: null,      //   ketinggian tempat (m), null = ikut data wilayah
      name: null,           //   nama lokasi yang ditampilkan (untuk lat/lon sendiri)
      timezone: null,       //   zona waktu IANA lokasi, contoh 'Asia/Makassar' (null = ikut wilayah)
      show: { imsak: true, fajr: true, sunrise: false, dhuha: false, dhuhr: true, asr: true, maghrib: true, isha: true },
      layout: 'row',        //   'row' (satu baris) | 'grid' (menyesuaikan lebar jam, boleh 2 baris)
      countdown: true,      //   hitung mundur menuju waktu berikutnya
      location: true,       //   tampilkan nama wilayah
      highlight: true,      //   tandai waktu berikutnya
      lang: 'id',           //   'id' | 'en' (nama waktu)
      names: {},            //   ganti nama waktu, contoh { fajr: 'Shubuh' }
      ihtiyat: 2,           //   menit pengaman (standar Kemenag = 2)
      fajrAngle: 20,        //   sudut Subuh (Kemenag = 20)
      ishaAngle: 18,        //   sudut Isya (Kemenag = 18)
      asrFactor: 1,         //   1 = Syafi'i (Kemenag), 2 = Hanafi
      adjust: {},           //   koreksi manual (menit) per waktu, contoh { fajr: 1, isha: -1 }
      gap: null,            //   tambahan jarak jam/tanggal ke jadwal (px pada ukuran `size`), null = otomatis
      onPrayer: null        //   fungsi(nama, key, 'HH:MM') dipanggil tepat saat waktu masuk
    },
    loadFont: true,         // muat font Oswald & Roboto dari Google Fonts
    fontFamily: "'Oswald','Bebas Neue','Arial Narrow',Impact,sans-serif"
  };

  /* ------------------------------------------------------------------ */
  /*  Helper                                                             */
  /* ------------------------------------------------------------------ */
  function isObj(x) { return x && typeof x === 'object' && !Array.isArray(x); }

  function merge(base, extra) {
    var out = {}, k;
    for (k in base) out[k] = isObj(base[k]) ? merge(base[k], {}) : base[k];
    if (extra) {
      for (k in extra) {
        if (extra[k] === undefined) continue;
        if (isObj(extra[k]) && isObj(out[k])) out[k] = merge(out[k], extra[k]);
        else out[k] = extra[k];
      }
    }
    return out;
  }

  function el(tag, cls, parent) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (parent) parent.appendChild(n);
    return n;
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ---- format tanggal ---- */
  function hasDate(f) { return !!(f.weekday || f.day || f.month || f.year); }

  function makeDateFmt(o, tzName) {
    function opts(tz) {
      var f = o.dateFormat, r = {};
      if (tz) r.timeZone = tz;
      if (f.weekday) r.weekday = f.weekday;
      if (f.day) r.day = f.day;
      if (f.month) r.month = f.month;
      if (f.year) r.year = f.year;
      return r;
    }
    try { return new Intl.DateTimeFormat(o.locale, opts(tzName || o.timezone || undefined)); }
    catch (e) { return new Intl.DateTimeFormat('en-US', opts()); }
  }

  function dateText(dfmt, f, now) {
    if (!hasDate(f)) return '';
    var p = {};
    dfmt.formatToParts(now).forEach(function (x) { p[x.type] = x.value; });
    var numMonth = f.month === 'numeric' || f.month === '2-digit';
    var nums = [f.day && p.day, f.month && p.month, f.year && p.year].filter(Boolean);
    var s = nums.join(numMonth ? '/' : ' ');
    if (f.weekday && p.weekday) s = s ? p.weekday + (f.comma ? ', ' : ' ') + s : p.weekday;
    return f.uppercase ? s.toUpperCase() : s;
  }

  /* ------------------------------------------------------------------ */
  /*  JADWAL SHOLAT                                                      */
  /*  Dihitung langsung di browser (astronomi NOAA/Meeus), tanpa API,    */
  /*  tanpa internet. Aturan mengikuti Kemenag RI (Bimas Islam):         */
  /*  Subuh 20°, Isya 18°, Ashar Syafi'i, Maghrib -1° (+koreksi         */
  /*  ketinggian tempat), ihtiyat +2 menit dibulatkan ke atas,           */
  /*  Imsak = Subuh - 10 menit.                                          */
  /* ------------------------------------------------------------------ */
  var RAD = Math.PI / 180, DEG = 180 / Math.PI;
  var PRAYER_ORDER = ['imsak', 'fajr', 'sunrise', 'dhuha', 'dhuhr', 'asr', 'maghrib', 'isha'];
  var PRAYER_NAMES = {
    id: { imsak: 'Imsak', fajr: 'Subuh', sunrise: 'Terbit', dhuha: 'Dhuha', dhuhr: 'Dzuhur', asr: 'Ashar', maghrib: 'Maghrib', isha: 'Isya' },
    en: { imsak: 'Imsak', fajr: 'Fajr', sunrise: 'Sunrise', dhuha: 'Duha', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha' }
  };
  var PRAYER_ALIAS = {
    subuh: 'fajr', shubuh: 'fajr', fajar: 'fajr', terbit: 'sunrise', duha: 'dhuha',
    dzuhur: 'dhuhr', zuhur: 'dhuhr', dzuhr: 'dhuhr', ashar: 'asr', ashr: 'asr', magrib: 'maghrib', isya: 'isha', isyak: 'isha'
  };
  var DEFAULT_REGION = 'banjarmasin-timur';

  function julianDay(y, m, d) {                        // JD pada 00:00 UT
    if (m <= 2) { y -= 1; m += 12; }
    var A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  }

  function sunPos(jd) {                                 // deklinasi & equation of time (menit)
    var T = (jd - 2451545) / 36525;
    var L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;
    var M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
    var e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
    var C = Math.sin(M * RAD) * (1.914602 - T * (0.004817 + 0.000014 * T)) +
            Math.sin(2 * M * RAD) * (0.019993 - 0.000101 * T) + Math.sin(3 * M * RAD) * 0.000289;
    var om = (125.04 - 1934.136 * T) * RAD;
    var lam = L0 + C - 0.00569 - 0.00478 * Math.sin(om);
    var eps = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60 + 0.00256 * Math.cos(om);
    var decl = Math.asin(Math.sin(eps * RAD) * Math.sin(lam * RAD)) * DEG;
    var y = Math.tan(eps * RAD / 2); y *= y;
    var eot = 4 * DEG * (y * Math.sin(2 * L0 * RAD) - 2 * e * Math.sin(M * RAD) +
              4 * e * y * Math.sin(M * RAD) * Math.cos(2 * L0 * RAD) -
              0.5 * y * y * Math.sin(4 * L0 * RAD) - 1.25 * e * e * Math.sin(2 * M * RAD));
    return { decl: decl, eot: eot };
  }

  /**
   * Hitung waktu sholat satu hari. Hasil: menit sejak 00:00 waktu lokal (bilangan bulat, sudah ihtiyat).
   * loc = { lat, lon, offset (jam dari UTC), elev (m) }
   */
  function calcPrayer(y, m, d, loc, c) {
    var lat = loc.lat, lon = loc.lon, tz = loc.offset, jd0 = julianDay(y, m, d);
    function noonUT(t) { return 720 - 4 * lon - sunPos(jd0 + t / 1440).eot; }
    var nUT = noonUT(noonUT(720 - 4 * lon));
    function at(alt, after) {                           // menit lokal saat matahari di ketinggian `alt`
      var t = nUT, i, s, k, H;
      for (i = 0; i < 3; i++) {
        s = sunPos(jd0 + t / 1440);
        k = (Math.sin(alt * RAD) - Math.sin(lat * RAD) * Math.sin(s.decl * RAD)) / (Math.cos(lat * RAD) * Math.cos(s.decl * RAD));
        if (k > 1 || k < -1) return NaN;
        H = Math.acos(k) * DEG;
        t = noonUT(t) + (after ? 1 : -1) * 4 * H;
      }
      return t + tz * 60;
    }
    var decl = sunPos(jd0 + nUT / 1440).decl;
    var dip = loc.elev > 0 ? 0.0347 * Math.sqrt(loc.elev) : 0;                // koreksi ketinggian tempat
    var asrAlt = Math.atan(1 / (c.asrFactor + Math.tan(Math.abs(lat - decl) * RAD))) * DEG;
    var ih = c.ihtiyat, adj = c.adjust || {}, t = {};

    t.fajr = Math.ceil(at(-c.fajrAngle, false) + ih);
    t.imsak = t.fajr - 10;
    t.sunrise = Math.floor(at(-0.8333, false) - ih);
    t.dhuha = Math.ceil(at(4.5, false) + ih);
    t.dhuhr = Math.ceil(nUT + tz * 60 + ih + 1);          // kulminasi + ihtiyat (+1 mnt, sesuai tabel Bimas Islam)
    t.asr = Math.ceil(at(asrAlt, true) + ih);
    t.maghrib = Math.ceil(at(-(1 + dip), true) + ih);
    t.isha = Math.ceil(at(-c.ishaAngle, true) + ih);

    PRAYER_ORDER.forEach(function (k) {
      if (isNaN(t[k])) t[k] = null; else if (adj[k]) t[k] += adj[k];
    });
    return t;
  }

  function hhmm(min) {
    if (min == null || isNaN(min)) return '--:--';
    min = ((min % 1440) + 1440) % 1440;
    return pad(Math.floor(min / 60)) + ':' + pad(min % 60);
  }

  /* ---- data wilayah Indonesia ----
     Format: 'nama,lat,lon[,elevasi m[,kecamatan1/kecamatan2]]'. Koordinat = pusat kota / ibu kota kabupaten.
     Kecamatan memakai koordinat kotanya (Kemenag menerbitkan jadwal per kota/kabupaten). */
  var RG = [
    ['Aceh', 'Asia/Jakarta', 'Kota Banda Aceh,5.5483,95.3238;Kota Sabang,5.8947,95.3194;Kota Lhokseumawe,5.1801,97.1507;Kota Langsa,4.4683,97.9683;Kota Subulussalam,2.6429,97.9506;Kab. Aceh Besar,5.2777,95.6194;Kab. Pidie,5.3871,95.9610;Kab. Aceh Utara,5.0554,97.3074;Kab. Aceh Tengah,4.6333,96.8500,1200;Kab. Aceh Barat,4.1431,96.1287;Kab. Aceh Selatan,3.2645,97.1797'],
    ['Sumatera Utara', 'Asia/Jakarta', 'Kota Medan,3.5952,98.6722;Kota Binjai,3.6001,98.4854;Kota Pematangsiantar,2.9595,99.0687;Kota Tebing Tinggi,3.3280,99.1625;Kota Tanjungbalai,2.9667,99.7999;Kota Sibolga,1.7427,98.7792;Kota Padangsidimpuan,1.3730,99.2749;Kota Gunungsitoli,1.2874,97.6143;Kab. Deli Serdang,3.5463,98.8740;Kab. Karo,3.1000,98.4900,1300;Kab. Simalungun,2.9200,99.0400;Kab. Toba,2.3333,99.0500,905;Kab. Labuhanbatu,2.1000,99.8333;Kab. Asahan,2.9830,99.6150;Kab. Langkat,3.7600,98.4500;Kab. Mandailing Natal,0.9922,99.5683;Kab. Tapanuli Utara,2.0167,98.9667,1100'],
    ['Sumatera Barat', 'Asia/Jakarta', 'Kota Padang,-0.9471,100.4172;Kota Bukittinggi,-0.3055,100.3692,930;Kota Payakumbuh,-0.2299,100.6331;Kota Padang Panjang,-0.4630,100.4000,770;Kota Solok,-0.7919,100.6570;Kota Sawahlunto,-0.6810,100.7780;Kota Pariaman,-0.6264,100.1200;Kab. Agam,-0.3167,100.0500;Kab. Tanah Datar,-0.4540,100.5940;Kab. Pesisir Selatan,-1.3500,100.5700;Kab. Lima Puluh Kota,-0.0951,100.6285;Kab. Pasaman,0.1500,100.1400;Kab. Kepulauan Mentawai,-2.0270,99.5920'],
    ['Riau', 'Asia/Jakarta', 'Kota Pekanbaru,0.5071,101.4478;Kota Dumai,1.6670,101.4500;Kab. Kampar,0.3400,101.0200;Kab. Siak,0.8000,102.0500;Kab. Indragiri Hulu,-0.3800,102.5200;Kab. Indragiri Hilir,-0.3167,103.1500;Kab. Bengkalis,1.4833,102.1000;Kab. Rokan Hulu,0.8800,100.3000;Kab. Rokan Hilir,2.1500,100.8000;Kab. Pelalawan,0.3330,101.8330;Kab. Kuantan Singingi,-0.5400,101.5500;Kab. Kepulauan Meranti,1.0500,102.7167'],
    ['Kepulauan Riau', 'Asia/Jakarta', 'Kota Batam,1.0456,104.0305;Kota Tanjungpinang,0.9186,104.4586;Kab. Bintan,1.0800,104.5800;Kab. Karimun,1.0000,103.4333;Kab. Natuna,3.9500,108.3833;Kab. Lingga,-0.2000,104.6000;Kab. Kepulauan Anambas,3.2200,106.2300'],
    ['Jambi', 'Asia/Jakarta', 'Kota Jambi,-1.6101,103.6131;Kota Sungai Penuh,-2.0600,101.3900,800;Kab. Batanghari,-1.7167,103.2000;Kab. Muaro Jambi,-1.6300,103.6700;Kab. Merangin,-2.1167,102.1333;Kab. Kerinci,-2.0900,101.4900,800;Kab. Bungo,-1.4800,102.1200;Kab. Tebo,-1.4900,102.4400;Kab. Tanjung Jabung Barat,-0.8167,103.4833;Kab. Tanjung Jabung Timur,-1.2000,103.8000'],
    ['Sumatera Selatan', 'Asia/Jakarta', 'Kota Palembang,-2.9761,104.7754;Kota Prabumulih,-3.4320,104.2310;Kota Pagar Alam,-4.0270,103.2520,700;Kota Lubuklinggau,-3.2967,102.8617;Kab. Ogan Komering Ilir,-3.4000,104.8300;Kab. Ogan Ilir,-3.2300,104.6500;Kab. Muara Enim,-3.6500,103.7700;Kab. Musi Banyuasin,-2.8600,103.8500;Kab. Ogan Komering Ulu,-4.1333,104.1667;Kab. Lahat,-3.7900,103.5400'],
    ['Bangka Belitung', 'Asia/Jakarta', 'Kota Pangkalpinang,-2.1291,106.1140;Kab. Bangka,-1.8500,106.1167;Kab. Belitung,-2.7500,107.6500;Kab. Bangka Barat,-2.0700,105.1800;Kab. Bangka Tengah,-2.4800,106.4000'],
    ['Bengkulu', 'Asia/Jakarta', 'Kota Bengkulu,-3.8004,102.2655;Kab. Rejang Lebong,-3.4667,102.5167,1000;Kab. Bengkulu Utara,-3.4600,102.1900;Kab. Kaur,-4.7833,103.3167'],
    ['Lampung', 'Asia/Jakarta', 'Kota Bandar Lampung,-5.3971,105.2668;Kota Metro,-5.1130,105.3070;Kab. Lampung Selatan,-5.7300,105.5800;Kab. Lampung Tengah,-4.9500,105.2500;Kab. Lampung Timur,-5.0700,105.5500;Kab. Lampung Utara,-4.8300,104.9000;Kab. Pringsewu,-5.3580,104.9740;Kab. Pesawaran,-5.4400,105.0900;Kab. Tulang Bawang,-4.4000,105.2800'],
    ['DKI Jakarta', 'Asia/Jakarta', 'Kota Jakarta,-6.1700,106.8300,0,Jakarta Pusat/Jakarta Utara/Jakarta Barat/Jakarta Selatan/Jakarta Timur;Kab. Kepulauan Seribu,-5.8000,106.5167'],
    ['Banten', 'Asia/Jakarta', 'Kota Serang,-6.1200,106.1500;Kota Tangerang,-6.1783,106.6319;Kota Tangerang Selatan,-6.2886,106.7179;Kota Cilegon,-6.0025,106.0111;Kab. Tangerang,-6.2800,106.4800;Kab. Lebak,-6.3600,106.2500;Kab. Pandeglang,-6.3100,106.1000'],
    ['Jawa Barat', 'Asia/Jakarta', 'Kota Bandung,-6.9175,107.6191,768;Kota Bekasi,-6.2383,106.9756;Kota Depok,-6.4025,106.7942;Kota Bogor,-6.5950,106.8167,265;Kota Cimahi,-6.8721,107.5420,700;Kota Sukabumi,-6.9277,106.9300,584;Kota Cirebon,-6.7320,108.5523;Kota Tasikmalaya,-7.3274,108.2207,350;Kota Banjar,-7.3700,108.5400;Kab. Bandung,-7.0251,107.5193,830;Kab. Bandung Barat,-6.8420,107.4900,700;Kab. Bogor,-6.4800,106.8500;Kab. Bekasi,-6.2650,107.1500;Kab. Karawang,-6.3000,107.3000;Kab. Purwakarta,-6.5560,107.4430;Kab. Subang,-6.5700,107.7600;Kab. Indramayu,-6.3270,108.3200;Kab. Cirebon,-6.7500,108.4800;Kab. Majalengka,-6.8360,108.2270;Kab. Kuningan,-6.9760,108.4840;Kab. Sumedang,-6.8590,107.9230;Kab. Garut,-7.2140,107.9000,717;Kab. Tasikmalaya,-7.3500,108.1100;Kab. Ciamis,-7.3260,108.3530;Kab. Cianjur,-6.8200,107.1400,450;Kab. Sukabumi,-6.9860,106.5500;Kab. Pangandaran,-7.6860,108.6500'],
    ['Jawa Tengah', 'Asia/Jakarta', 'Kota Semarang,-6.9667,110.4167;Kota Surakarta,-7.5666,110.8283;Kota Magelang,-7.4797,110.2177,380;Kota Salatiga,-7.3305,110.5084,600;Kota Pekalongan,-6.8886,109.6753;Kota Tegal,-6.8694,109.1402;Kab. Semarang,-7.1400,110.4000;Kab. Banyumas,-7.4214,109.2343;Kab. Cilacap,-7.7260,109.0150;Kab. Kebumen,-7.6680,109.6520;Kab. Purworejo,-7.7140,110.0060;Kab. Magelang,-7.5900,110.2200;Kab. Boyolali,-7.5320,110.5960;Kab. Klaten,-7.7050,110.6030;Kab. Sukoharjo,-7.6800,110.8400;Kab. Karanganyar,-7.5970,110.9500;Kab. Sragen,-7.4280,111.0260;Kab. Wonogiri,-7.8130,110.9220;Kab. Kudus,-6.8050,110.8400;Kab. Jepara,-6.5890,110.6700;Kab. Demak,-6.8940,110.6390;Kab. Grobogan,-7.0900,110.9100;Kab. Pati,-6.7540,111.0380;Kab. Rembang,-6.7090,111.3420;Kab. Blora,-6.9700,111.4200;Kab. Batang,-6.9090,109.7270;Kab. Pemalang,-6.8900,109.3800;Kab. Brebes,-6.8730,109.0400;Kab. Banjarnegara,-7.3970,109.6890;Kab. Wonosobo,-7.3630,109.9000,775;Kab. Temanggung,-7.3160,110.1740,600;Kab. Kendal,-6.9200,110.2000'],
    ['DI Yogyakarta', 'Asia/Jakarta', 'Kota Yogyakarta,-7.7956,110.3695;Kab. Sleman,-7.7150,110.3550;Kab. Bantul,-7.8880,110.3290;Kab. Kulon Progo,-7.8600,110.1600;Kab. Gunungkidul,-7.9640,110.6020'],
    ['Jawa Timur', 'Asia/Jakarta', 'Kota Surabaya,-7.2575,112.7521;Kota Malang,-7.9666,112.6326,440;Kota Batu,-7.8700,112.5260,871;Kota Kediri,-7.8480,112.0178;Kota Blitar,-8.0955,112.1609;Kota Madiun,-7.6298,111.5239;Kota Mojokerto,-7.4720,112.4330;Kota Pasuruan,-7.6453,112.9075;Kota Probolinggo,-7.7543,113.2159;Kab. Sidoarjo,-7.4478,112.7183;Kab. Gresik,-7.1550,112.5720;Kab. Malang,-8.1300,112.5700,450;Kab. Jember,-8.1845,113.6681;Kab. Banyuwangi,-8.2190,114.3690;Kab. Lamongan,-7.1170,112.4160;Kab. Tuban,-6.8970,112.0640;Kab. Bojonegoro,-7.1500,111.8800;Kab. Ngawi,-7.4030,111.4460;Kab. Ponorogo,-7.8650,111.4600;Kab. Pacitan,-8.2000,111.1000;Kab. Trenggalek,-8.0500,111.7100;Kab. Tulungagung,-8.0650,111.9000;Kab. Nganjuk,-7.6050,111.9030;Kab. Jombang,-7.5460,112.2330;Kab. Mojokerto,-7.5300,112.5600;Kab. Pasuruan,-7.5950,112.8200;Kab. Probolinggo,-7.7500,113.4000;Kab. Lumajang,-8.1340,113.2200;Kab. Situbondo,-7.7060,114.0090;Kab. Bondowoso,-7.9130,113.8210;Kab. Pamekasan,-7.1560,113.4760;Kab. Sumenep,-7.0160,113.8670;Kab. Bangkalan,-7.0450,112.7330;Kab. Sampang,-7.1850,113.2400'],
    ['Bali', 'Asia/Makassar', 'Kota Denpasar,-8.6705,115.2126;Kab. Badung,-8.6200,115.1800;Kab. Gianyar,-8.5400,115.3250;Kab. Tabanan,-8.5380,115.1250;Kab. Buleleng,-8.1120,115.0880;Kab. Karangasem,-8.4500,115.6100;Kab. Klungkung,-8.5300,115.4000;Kab. Bangli,-8.4540,115.3550;Kab. Jembrana,-8.3600,114.6300'],
    ['Nusa Tenggara Barat', 'Asia/Makassar', 'Kota Mataram,-8.5833,116.1167;Kota Bima,-8.4600,118.7270;Kab. Lombok Barat,-8.6500,116.1100;Kab. Lombok Tengah,-8.7050,116.2710;Kab. Lombok Timur,-8.6500,116.5300;Kab. Lombok Utara,-8.3700,116.1500;Kab. Sumbawa,-8.5000,117.4200;Kab. Sumbawa Barat,-8.7400,116.8600;Kab. Dompu,-8.5380,118.4650;Kab. Bima,-8.5500,118.7500'],
    ['Nusa Tenggara Timur', 'Asia/Makassar', 'Kota Kupang,-10.1772,123.6070;Kab. Kupang,-10.0200,123.5700;Kab. Timor Tengah Selatan,-9.8600,124.2800,800;Kab. Timor Tengah Utara,-9.4500,124.4800;Kab. Belu,-9.1060,124.8920;Kab. Alor,-8.2200,124.5200;Kab. Flores Timur,-8.3400,122.9900;Kab. Sikka,-8.6200,122.2100;Kab. Ende,-8.8450,121.6600;Kab. Ngada,-8.7800,121.0600,1100;Kab. Manggarai,-8.6100,120.4700,1100;Kab. Manggarai Barat,-8.4960,119.8880;Kab. Sumba Timur,-9.6600,120.2600;Kab. Sumba Barat Daya,-9.4000,119.2400;Kab. Rote Ndao,-10.7000,123.1000;Kab. Lembata,-8.3700,123.9700'],
    ['Kalimantan Barat', 'Asia/Jakarta', 'Kota Pontianak,-0.0263,109.3425;Kota Singkawang,0.9060,108.9870;Kab. Kubu Raya,-0.0900,109.4000;Kab. Mempawah,0.3600,109.0400;Kab. Sambas,1.3600,109.3000;Kab. Bengkayang,0.8333,109.4833;Kab. Landak,0.4000,109.9300;Kab. Sanggau,-0.1200,110.6000;Kab. Sintang,0.0700,111.5000;Kab. Sekadau,-0.0200,110.9500;Kab. Melawi,-0.3000,111.7500;Kab. Ketapang,-1.8300,109.9800;Kab. Kapuas Hulu,0.8800,112.9300;Kab. Kayong Utara,-1.2400,110.0200'],
    ['Kalimantan Tengah', 'Asia/Jakarta', 'Kota Palangka Raya,-2.2161,113.9135;Kab. Kotawaringin Barat,-2.6800,111.6200;Kab. Kotawaringin Timur,-2.5330,112.9500;Kab. Kapuas,-3.0100,114.3900;Kab. Barito Selatan,-1.7167,114.8333;Kab. Barito Utara,-0.9500,114.8900;Kab. Katingan,-1.8800,113.4200;Kab. Gunung Mas,-1.1000,113.8700;Kab. Murung Raya,-0.6300,114.5600'],
    ['Kalimantan Selatan', 'Asia/Makassar', 'Kota Banjarmasin,-3.3194,114.5908,0,Banjarmasin Utara/Banjarmasin Timur/Banjarmasin Selatan/Banjarmasin Tengah/Banjarmasin Barat;Kota Banjarbaru,-3.4420,114.8320,0,Banjarbaru Utara/Banjarbaru Selatan/Cempaka/Landasan Ulin/Liang Anggang;Kab. Banjar,-3.4100,114.8500;Kab. Barito Kuala,-2.9917,114.7500;Kab. Tapin,-2.9500,115.0300;Kab. Hulu Sungai Selatan,-2.7700,115.2600;Kab. Hulu Sungai Tengah,-2.5800,115.3800;Kab. Hulu Sungai Utara,-2.4200,115.2500;Kab. Balangan,-2.3300,115.4700;Kab. Tabalong,-2.1600,115.3800;Kab. Tanah Laut,-3.7900,114.7700;Kab. Tanah Bumbu,-3.4500,115.9900;Kab. Kotabaru,-3.2400,116.2200'],
    ['Kalimantan Timur', 'Asia/Makassar', 'Kota Samarinda,-0.5022,117.1536;Kota Balikpapan,-1.2379,116.8529;Kota Bontang,0.1330,117.5000;Kab. Kutai Kartanegara,-0.4200,116.9900;Kab. Kutai Timur,0.5000,117.1500;Kab. Berau,2.1500,117.4900;Kab. Paser,-1.9100,116.2000;Kab. Penajam Paser Utara,-1.2700,116.7000;Kab. Mahakam Ulu,0.8300,114.8000'],
    ['Kalimantan Utara', 'Asia/Makassar', 'Kota Tarakan,3.3000,117.6330;Kab. Bulungan,2.8400,117.3700;Kab. Malinau,3.5800,116.6500;Kab. Nunukan,4.0700,117.6700'],
    ['Sulawesi Utara', 'Asia/Makassar', 'Kota Manado,1.4748,124.8421;Kota Bitung,1.4400,125.1900;Kota Tomohon,1.3250,124.8400,700;Kota Kotamobagu,0.7300,124.3200;Kab. Minahasa,1.3000,124.9100,700;Kab. Minahasa Utara,1.4100,124.9900;Kab. Minahasa Selatan,1.1900,124.5900;Kab. Kepulauan Sangihe,3.6200,125.5000;Kab. Kepulauan Talaud,4.0000,126.7000'],
    ['Gorontalo', 'Asia/Makassar', 'Kota Gorontalo,0.5435,123.0568;Kab. Gorontalo,0.6200,122.9900;Kab. Bone Bolango,0.5100,123.1400;Kab. Boalemo,0.5300,122.3500;Kab. Pohuwato,0.5100,121.9300;Kab. Gorontalo Utara,0.8700,122.8000'],
    ['Sulawesi Tengah', 'Asia/Makassar', 'Kota Palu,-0.8917,119.8707;Kab. Donggala,-0.6700,119.7400;Kab. Poso,-1.3900,120.7500;Kab. Banggai,-0.9500,122.7900;Kab. Morowali,-2.5500,121.9300;Kab. Parigi Moutong,-0.8000,120.1800;Kab. Tolitoli,1.0400,120.8100;Kab. Sigi,-1.0000,119.9300;Kab. Buol,1.1800,121.4200'],
    ['Sulawesi Barat', 'Asia/Makassar', 'Kab. Mamuju,-2.6740,118.8890;Kab. Majene,-3.5400,118.9700;Kab. Polewali Mandar,-3.4300,119.3400;Kab. Mamasa,-2.9300,119.3700,1000;Kab. Pasangkayu,-1.1817,119.3719'],
    ['Sulawesi Selatan', 'Asia/Makassar', 'Kota Makassar,-5.1477,119.4327;Kota Parepare,-4.0135,119.6290;Kota Palopo,-2.9925,120.1969;Kab. Gowa,-5.2000,119.4500;Kab. Maros,-4.9900,119.5700;Kab. Pangkajene dan Kepulauan,-4.8300,119.5500;Kab. Takalar,-5.4200,119.4800;Kab. Jeneponto,-5.6800,119.7300;Kab. Bantaeng,-5.5400,119.9700;Kab. Bulukumba,-5.5500,120.1900;Kab. Sinjai,-5.1200,120.2500;Kab. Bone,-4.5400,120.3300;Kab. Soppeng,-4.3500,119.8900;Kab. Wajo,-4.1300,120.0200;Kab. Sidenreng Rappang,-3.9800,119.8000;Kab. Pinrang,-3.7900,119.6500;Kab. Enrekang,-3.5600,119.7700;Kab. Tana Toraja,-3.1000,119.8700,800;Kab. Toraja Utara,-2.9700,119.9000,800;Kab. Luwu,-3.4300,120.3500;Kab. Luwu Utara,-2.5500,120.3300;Kab. Luwu Timur,-2.6400,121.1000;Kab. Barru,-4.4000,119.6200;Kab. Kepulauan Selayar,-6.1200,120.4600'],
    ['Sulawesi Tenggara', 'Asia/Makassar', 'Kota Kendari,-3.9985,122.5130;Kota Baubau,-5.4690,122.6200;Kab. Konawe,-3.8300,122.0500;Kab. Kolaka,-4.0500,121.6000;Kab. Muna,-4.8400,122.7200;Kab. Buton,-5.4600,122.8800;Kab. Bombana,-4.6300,121.8800;Kab. Wakatobi,-5.3200,123.5900;Kab. Konawe Selatan,-4.3300,122.5000'],
    ['Maluku', 'Asia/Jayapura', 'Kota Ambon,-3.6954,128.1814;Kota Tual,-5.6300,132.7500;Kab. Maluku Tengah,-3.3000,128.9300;Kab. Seram Bagian Barat,-3.0700,128.1800;Kab. Seram Bagian Timur,-3.1100,130.4800;Kab. Buru,-3.2600,127.0900;Kab. Maluku Tenggara,-5.6400,132.7300;Kab. Kepulauan Aru,-5.7700,134.2100;Kab. Maluku Barat Daya,-8.1500,127.7800;Kab. Kepulauan Tanimbar,-7.9800,131.2900'],
    ['Maluku Utara', 'Asia/Jayapura', 'Kota Ternate,0.7833,127.3667;Kota Tidore Kepulauan,0.6800,127.4000;Kab. Halmahera Barat,1.0600,127.4700;Kab. Halmahera Utara,1.7300,128.0000;Kab. Halmahera Selatan,-0.6300,127.5000;Kab. Halmahera Tengah,0.4300,127.9700;Kab. Halmahera Timur,0.7200,128.2800;Kab. Kepulauan Sula,-2.0600,125.9800;Kab. Pulau Morotai,2.0200,128.4700'],
    ['Papua Barat', 'Asia/Jayapura', 'Kab. Manokwari,-0.8615,134.0620;Kab. Fakfak,-2.9230,132.2970;Kab. Teluk Bintuni,-2.1200,133.5200;Kab. Kaimana,-3.6600,133.7600'],
    ['Papua Barat Daya', 'Asia/Jayapura', 'Kota Sorong,-0.8762,131.2558;Kab. Sorong,-0.9400,131.3000;Kab. Raja Ampat,-0.4300,130.8300;Kab. Sorong Selatan,-1.4500,132.0200'],
    ['Papua', 'Asia/Jayapura', 'Kota Jayapura,-2.5337,140.7181;Kab. Jayapura,-2.5740,140.5130;Kab. Biak Numfor,-1.1800,136.0800;Kab. Kepulauan Yapen,-1.8800,136.2500;Kab. Keerom,-3.0000,140.7500;Kab. Sarmi,-1.8700,138.7500'],
    ['Papua Selatan', 'Asia/Jayapura', 'Kab. Merauke,-8.4932,140.4018;Kab. Mappi,-6.5367,139.3300;Kab. Asmat,-5.5400,138.1300;Kab. Boven Digoel,-6.0900,140.3000'],
    ['Papua Tengah', 'Asia/Jayapura', 'Kab. Nabire,-3.3667,135.4833;Kab. Mimika,-4.5465,136.8870;Kab. Paniai,-3.9300,136.3700,1700'],
    ['Papua Pegunungan', 'Asia/Jayapura', 'Kab. Jayawijaya,-4.0900,138.9500,1650;Kab. Yahukimo,-4.6500,139.4600;Kab. Pegunungan Bintang,-4.9100,140.6300']
  ];
  var REGIONS = null;

  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }

  function regionList() {
    if (REGIONS) return REGIONS;
    REGIONS = [];
    RG.forEach(function (p) {
      p[2].split(';').forEach(function (e) {
        var f = e.split(','), name = f[0], short = name.replace(/^(Kota|Kab\.)\s+/, '');
        var base = { province: p[0], tz: p[1], lat: +f[1], lon: +f[2], elev: f[3] ? +f[3] : 0 };
        var r = { id: slug(name), name: name, label: name + ', ' + p[0] };
        REGIONS.push(merge(base, r));
        if (f[4]) f[4].split('/').forEach(function (s) {
          REGIONS.push(merge(base, { id: slug(s), name: s, parent: name, label: s + ', ' + short + ', ' + p[0] }));
        });
      });
    });
    return REGIONS;
  }

  /** Cari wilayah berdasarkan id / nama (tanpa peduli huruf besar-kecil). Mengembalikan null jika tidak ada. */
  function findRegion(q) {
    if (q == null || q === '') return null;
    var list = regionList(), s = slug(q), i, r, best = null;
    for (i = 0; i < list.length; i++) if (list[i].id === s) return list[i];
    for (i = 0; i < list.length; i++) {                 // "Banjarmasin" -> Kota Banjarmasin (kota diutamakan)
      r = list[i];
      if (slug(r.name.replace(/^(Kota|Kab\.)\s+/, '')) === s) { if (!best || /^Kota/.test(r.name)) best = r; }
    }
    if (best) return best;
    for (i = 0; i < list.length; i++) if (slug(r = list[i].label) === s) return list[i];
    return null;
  }

  function resolveLocation(c, tzFallback) {
    if (typeof c.lat === 'number' && typeof c.lon === 'number' && !isNaN(c.lat) && !isNaN(c.lon)) {
      return { id: 'custom', label: c.name || 'Lokasi kustom', lat: c.lat, lon: c.lon, elev: c.elevation || 0,
               tz: c.timezone || tzFallback || 'Asia/Jakarta' };
    }
    var r = findRegion(c.region);
    if (!r) {
      if (typeof console !== 'undefined' && console.warn) console.warn('[Fixs Flip Clock] wilayah "' + c.region + '" tidak ditemukan, memakai ' + DEFAULT_REGION);
      r = findRegion(DEFAULT_REGION);
    }
    return { id: r.id, label: r.label, lat: r.lat, lon: r.lon, elev: c.elevation != null ? c.elevation : r.elev, tz: c.timezone || r.tz };
  }

  /** Tanggal sipil & selisih zona waktu (jam) untuk instant `now` di zona `tz`. */
  function civilIn(tz, now) {
    var f, p = {};
    try {
      f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (e) {
      f = new Intl.DateTimeFormat('en-US', { hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    f.formatToParts(now).forEach(function (x) { p[x.type] = x.value; });
    var localMs = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
    var off = Math.round((localMs - Math.floor(now.getTime() / 1000) * 1000) / 900000) / 4;
    var sod = ((+p.hour % 24) * 60 + +p.minute) * 60 + +p.second;       // detik sejak 00:00 lokal
    return { y: +p.year, m: +p.month, d: +p.day, offset: off, sod: sod };
  }

  function loadFont() {
    if (document.getElementById('fsc-font')) return;
    var l = document.createElement('link');
    l.id = 'fsc-font';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=Roboto:wght@400;500&display=swap';
    document.head.appendChild(l);
  }

  /* ------------------------------------------------------------------ */
  /*  CSS (hidup di dalam Shadow DOM, jadi tidak bentrok dengan website) */
  /* ------------------------------------------------------------------ */
  var CSS = [
    ':host{all:initial;display:block}',
    '*{box-sizing:border-box;margin:0;padding:0}',
    '.clock{--h:160px;--d:.3s;',
    '  display:flex;flex-direction:column;align-items:var(--ai,center);justify-content:center;',
    '  gap:calc(var(--h)*var(--gt,.17));width:100%;',
    '  padding:calc(var(--h)*.2) calc(var(--h)*.12) calc(var(--h)*.1);',
    '  background:var(--bg);color:var(--text);border-radius:var(--r);user-select:none}',
    '.row{display:flex;align-items:center;gap:calc(var(--h)*var(--gg,.2))}',
    '.group{display:flex;gap:calc(var(--h)*var(--gd,.06))}',
    '.sep{display:flex;flex-direction:column;gap:calc(var(--h)*.14);margin:0 calc(var(--h)*var(--gg,.2)*-.3)}',
    '.sep i{display:block;width:calc(var(--h)*.055);height:calc(var(--h)*.055);border-radius:50%;background:var(--text);opacity:.85}',

    '.rw{display:flex;flex-direction:column;align-items:stretch;gap:calc(var(--h)*.12)}',
    '.bar{height:max(2px,calc(var(--h)*.028));border-radius:99px;background:rgba(128,128,128,.28);overflow:hidden}',
    '.bar b{display:block;height:100%;width:0;border-radius:99px;background:var(--text);opacity:.85;transition:width 1s linear}',
    '.blink .sep i{animation:fsc-blink 1s steps(1,end) infinite}',
    '@keyframes fsc-blink{50%{opacity:.12}}',

    /* kartu */
    '.card{position:relative;width:calc(var(--h)*.64);height:var(--h);',
    '  perspective:calc(var(--h)*5);font-family:var(--font);font-weight:500;',
    '  font-size:calc(var(--h)*.84);color:var(--text)}',
    '.card::after{content:"";position:absolute;left:0;right:0;top:50%;z-index:6;',
    '  height:max(1.5px,calc(var(--h)*.014));transform:translateY(-50%);background:var(--divider)}',
    '.half{position:absolute;left:0;width:100%;height:50%;overflow:hidden;',
    '  background-color:var(--card);backface-visibility:hidden;-webkit-backface-visibility:hidden;',
    '  box-shadow:0 calc(var(--h)*.012) calc(var(--h)*.04) rgba(0,0,0,.22)}',
    '.top,.flip-top{top:0;border-radius:var(--r) var(--r) 0 0;',
    '  background-image:linear-gradient(rgba(255,255,255,.07),rgba(0,0,0,.07))}',
    '.bottom,.flip-bottom{bottom:0;border-radius:0 0 var(--r) var(--r);',
    '  background-image:linear-gradient(rgba(0,0,0,.1),rgba(255,255,255,.04))}',
    '.t{position:absolute;left:0;width:100%;height:var(--h);display:flex;align-items:center;',
    '  justify-content:center;line-height:1;padding-bottom:calc(var(--h)*.03)}',
    '.top .t,.flip-top .t{top:0}',
    '.bottom .t,.flip-bottom .t{bottom:0}',
    '.top{z-index:1}.bottom{z-index:1}',
    '.flip-top,.flip-bottom{display:none;z-index:3}',
    '.flip-top{transform-origin:bottom}',
    '.flip-bottom{transform-origin:top}',
    '.card.flipping .flip-top,.card.flipping .flip-bottom{display:block}',
    '.card.flipping .flip-top{animation:fsc-top var(--d) ease-in both}',
    '.card.flipping .flip-bottom{animation:fsc-bot var(--d) ease-out var(--d) both}',
    '@keyframes fsc-top{from{transform:rotateX(0)}to{transform:rotateX(-90deg)}}',
    '@keyframes fsc-bot{from{transform:rotateX(90deg)}to{transform:rotateX(0)}}',

    /* label AM/PM */
    '.ampm{position:absolute;z-index:7;left:calc(var(--h)*.1);top:calc(var(--h)*.07);',
    '  font-size:calc(var(--h)*.095);letter-spacing:.12em;font-weight:500;color:var(--label)}',

    /* tanggal & credit */
    '.date{font-family:"Roboto","Helvetica Neue",Arial,sans-serif;font-weight:400;',
    '  font-size:calc(var(--h)*.17);letter-spacing:.04em;word-spacing:.1em;color:var(--date);',
    '  text-align:var(--ta,center);white-space:nowrap}',
    '.date.upper{letter-spacing:.2em;word-spacing:.45em}',
    '.credit{font-family:"Roboto","Helvetica Neue",Arial,sans-serif;',
    '  font-size:max(9px,calc(var(--h)*.065));letter-spacing:.04em;color:var(--credit);text-align:var(--ta,center)}',
    /* jadwal sholat */
    '.pt{display:flex;flex-direction:column;align-items:var(--ai,center);font-family:"Roboto","Helvetica Neue",Arial,sans-serif}',
    '.ploc,.pcd{font-family:"Roboto","Helvetica Neue",Arial,sans-serif;max-width:100%}',
    '.tf{margin-top:calc(var(--h)*var(--gp,-.04))}',                   /* komponen sholat pertama dalam satu kelompok */
    '.tg{margin-top:calc(var(--h)*(.09 - var(--gt,.17)))}',            /* komponen sholat yang menempel di komponen sholat lain */
    '.ploc{font-size:calc(var(--h)*.115);letter-spacing:.03em;color:var(--date);text-align:var(--ta,center)}',
    '.pl{display:flex;gap:calc(var(--h)*.05);justify-content:var(--ai,center)}',
    '.pg{align-self:stretch}',
    '.pg .pl{display:grid;grid-template-columns:repeat(auto-fit,minmax(calc(var(--h)*.62),calc(var(--h)*1.15)));width:100%}',
    '.pi{display:flex;flex-direction:column;align-items:center;gap:calc(var(--h)*.02);',
    '  min-width:calc(var(--h)*.62);padding:calc(var(--h)*.07) calc(var(--h)*.08);',
    '  border-radius:calc(var(--r)*.7);background:rgba(128,128,128,.14);transition:opacity .4s,background .4s}',
    '.pi i{font-style:normal;font-size:calc(var(--h)*.075);letter-spacing:.12em;text-transform:uppercase;color:var(--label)}',
    '.pi b{font-family:var(--font);font-weight:500;font-size:calc(var(--h)*.2);line-height:1.1;',
    '  color:var(--text);font-variant-numeric:tabular-nums}',
    '.pi.past{opacity:.5}',
    '.pi.on{background:var(--card);box-shadow:inset 0 0 0 max(1px,calc(var(--h)*.012)) var(--text)}',
    '.pi.on i{color:var(--text)}',
    '.pcd{font-size:calc(var(--h)*.13);color:var(--date);letter-spacing:.03em;text-align:var(--ta,center);white-space:nowrap}',
    '.pcd b{font-family:var(--font);font-weight:500;color:var(--text);font-variant-numeric:tabular-nums;letter-spacing:.06em}',
    '@media (prefers-reduced-motion:reduce){.card.flipping .flip-top,.card.flipping .flip-bottom{animation-duration:.01s}}'
  ].join('\n');

  /* ------------------------------------------------------------------ */
  /*  Satu kartu angka                                                   */
  /* ------------------------------------------------------------------ */
  function Digit(parent, duration) {
    this.value = null;
    this.timer = null;
    this.duration = duration;

    this.el = el('div', 'card', parent);
    var self = this;
    function half(cls) {
      var h = el('div', 'half ' + cls, self.el);
      return el('span', 't', h);
    }
    this.topT = half('top');
    this.botT = half('bottom');
    this.flipTopT = half('flip-top');
    this.flipBotT = half('flip-bottom');
    this.el.style.setProperty('--d', duration + 's');
  }

  Digit.prototype._all = function (v) {
    this.topT.textContent = this.botT.textContent =
      this.flipTopT.textContent = this.flipBotT.textContent = v;
  };

  Digit.prototype._finish = function () {
    clearTimeout(this.timer);
    this.timer = null;
    this._all(this.value);
    this.el.classList.remove('flipping');
  };

  Digit.prototype.set = function (v, animate) {
    if (v === this.value) return;
    if (this.timer) this._finish();
    var old = this.value;
    this.value = v;

    if (!animate || old === null) { this._all(v); return; }

    this.topT.textContent = v;          // setengah atas = angka baru (terlihat setelah kartu lama jatuh)
    this.flipTopT.textContent = old;    // kartu atas lama jatuh ke bawah
    this.flipBotT.textContent = v;      // kartu bawah baru naik menutup
    void this.el.offsetWidth;           // restart animasi
    this.el.classList.add('flipping');

    var self = this;
    this.timer = setTimeout(function () { self._finish(); }, this.duration * 2000 + 40);
  };

  Digit.prototype.destroy = function () { clearTimeout(this.timer); };

  /* ------------------------------------------------------------------ */
  /*  Widget utama                                                       */
  /* ------------------------------------------------------------------ */
  function FlipClock(target, options) {
    var t = typeof target === 'string' ? document.querySelector(target) : target;
    if (!t) throw new Error('FixsFlipClock: elemen target tidak ditemukan');

    if (t.__fsc && t.__fsc !== this) t.__fsc.destroy();   // cegah dobel di satu elemen
    t.__fsc = this;
    t.__fscOff = false;

    this.target = t;
    this.opts = merge(DEFAULTS, options || {});
    this.host = el('div', 'fixs-flipclock-host', t);
    this.root = this.host.attachShadow({ mode: 'open' });
    this.tick = this.tick.bind(this);

    this._build();
    this._schedule();

    var self = this;
    if (typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver(function () { self._fit(); });
      this.ro.observe(t);
    }
    this._onResize = function () { self._fit(); };
    window.addEventListener('resize', this._onResize);

    // ukur ulang setelah font (Oswald/Roboto) selesai dimuat, karena lebar teks berubah
    this._onFonts = function () { self._fit(); };
    if (document.fonts) {
      if (document.fonts.ready) document.fonts.ready.then(this._onFonts);
      if (document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', this._onFonts);
    }
  }

  FlipClock.prototype._formatters = function () {
    var o = this.opts, tz = this.tzName || undefined, f;
    var base = { hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    try {
      f = new Intl.DateTimeFormat('en-US', merge(base, { timeZone: tz }));
    } catch (e) {
      f = new Intl.DateTimeFormat('en-US', base);
    }
    this.fmt = f;
    this.dfmt = makeDateFmt(o, tz);
  };

  FlipClock.prototype._build = function () {
    var o = this.opts, show = o.show, self = this;

    this._ready = false;
    this._mobile = this._calcMobile();
    if (o.loadFont) loadFont();
    // lokasi sholat menentukan zona waktu jam & tanggal (kecuali `timezone` diisi sendiri)
    this.loc = o.prayer.enabled ? resolveLocation(o.prayer, o.timezone) : null;
    this.tzName = o.timezone || (this.loc && this.loc.tz) || null;
    this._formatters();

    this.root.innerHTML = '';
    var style = el('style', null, this.root);
    style.textContent = CSS;

    var clock = this.clock = el('div', 'clock', this.root);
    var c = merge(THEMES[o.theme] || THEMES.dark, o.colors);
    clock.style.setProperty('--bg', c.background);
    clock.style.setProperty('--card', c.card);
    clock.style.setProperty('--text', c.text);
    clock.style.setProperty('--divider', c.divider);
    clock.style.setProperty('--label', c.label);
    clock.style.setProperty('--date', c.date);
    clock.style.setProperty('--credit', c.credit);
    clock.style.setProperty('--font', o.fontFamily);
    clock.style.setProperty('--r', o.radius + 'px');
    clock.style.setProperty('--h', this._v('size') + 'px');
    clock.style.setProperty('--ai', o.align === 'left' ? 'flex-start' : o.align === 'right' ? 'flex-end' : 'center');
    clock.style.setProperty('--ta', o.align === 'left' || o.align === 'right' ? o.align : 'center');
    if (o.transparent) clock.style.setProperty('--bg', 'transparent');
    if (!o.padding) clock.style.padding = '0';
    if (o.padX != null || o.padY != null) {
      var px = o.padX != null ? o.padX : o.size * 0.12, py = o.padY != null ? o.padY : o.size * 0.15;
      clock.style.padding = py + 'px ' + px + 'px';
    }
    clock.style.setProperty('--border', c.border || c.card);
    if (o.shadow) clock.style.boxShadow = '0 10px 34px rgba(0,0,0,.32), 0 2px 8px rgba(0,0,0,.18)';
    if (o.border) clock.style.border = Math.max(1, Math.round(o.size * 0.02)) + 'px solid var(--border)';
    if (o.blinkColon) clock.classList.add('blink');
    if (o.gapDigit != null) clock.style.setProperty('--gd', o.gapDigit / o.size);
    if (o.gapGroup != null) clock.style.setProperty('--gg', o.gapGroup / o.size);
    if (o.gapDate != null) clock.style.setProperty('--gt', o.gapDate / o.size);
    this._place();

    var wrap = el('div', 'rw');
    var row = this.row = el('div', 'row', wrap);
    var dur = o.flipDuration;
    this.digits = { hours: null, minutes: null, seconds: null };

    var order = ['hours', 'minutes', 'seconds'], first = true;
    order.forEach(function (key) {
      if (!show[key]) return;
      if (!first && o.separator === 'colon') {
        var sep = el('div', 'sep', row);
        el('i', null, sep); el('i', null, sep);
      }
      var g = el('div', 'group', row);
      self.digits[key] = [new Digit(g, dur), new Digit(g, dur)];
      first = false;
    });

    this.bar = null;
    if (o.secondsBar) {
      this.bar = el('div', 'bar', wrap);
      this.barFill = el('b', null, this.bar);
    }

    // label AM/PM di kartu pertama jam
    this.ampmEl = null;
    if (this.digits.hours && o.hour12 && show.ampm) {
      this.ampmEl = el('div', 'ampm', this.digits.hours[0].el);
    }

    this.dateEl = (show.date && hasDate(o.dateFormat))
      ? el('div', 'date' + (o.dateFormat.uppercase ? ' upper' : '')) : null;
    this._buildPrayer(clock);
    this.creditEl = o.credit ? el('div', 'credit') : null;
    if (this.creditEl) this.creditEl.textContent = '\u00A9fixsarts.studio';

    // pasang semua komponen sesuai `order` (komponen yang tidak aktif dilewati)
    var parts = { clock: wrap, date: this.dateEl, location: this.pLocEl, prayer: this.prayerEl, countdown: this.pCd, credit: this.creditEl };
    var prevGroup = false, placed = 0;
    normOrder(o.order).forEach(function (k) {
      var n = parts[k];
      if (!n) return;
      var grp = k === 'location' || k === 'prayer' || k === 'countdown';   // kelompok sholat dirapatkan satu sama lain
      if (grp && prevGroup) n.classList.add('tg');
      else if (grp && placed) n.classList.add('tf');
      prevGroup = grp;
      placed++;
      clock.appendChild(n);
    });

    this._dt = null;
    this._pKey = null;
    this._pLast = null;
    this._pPrev = null;
    this._render(false);   // isi angka & tanggal dulu supaya lebar tanggal ikut terukur
    this._ready = true;
    this._fit();
  };


  /* ------------------------------------------------------------------ */
  /*  Jadwal sholat: tampilan, hitung mundur, callback                   */
  /* ------------------------------------------------------------------ */
  var ORDER_DEFAULT = ['clock', 'date', 'location', 'prayer', 'countdown', 'credit'];
  var ORDER_ALIAS = { jam: 'clock', time: 'clock', tanggal: 'date', wilayah: 'location', lokasi: 'location', jadwal: 'prayer',
                      sholat: 'prayer', hitungmundur: 'countdown', kredit: 'credit' };

  /** Rapikan urutan komponen: nama alias dikenali, yang tidak disebut ditaruh di belakang (urutan default). */
  function normOrder(list) {
    var out = [];
    (Array.isArray(list) ? list : []).forEach(function (k) {
      k = String(k).toLowerCase().replace(/[^a-z]/g, '');
      k = ORDER_ALIAS[k] || k;
      if (ORDER_DEFAULT.indexOf(k) > -1 && out.indexOf(k) < 0) out.push(k);
    });
    ORDER_DEFAULT.forEach(function (k) { if (out.indexOf(k) < 0) out.push(k); });
    return out;
  }

  function pKey(k) { k = String(k).toLowerCase(); return PRAYER_ALIAS[k] || k; }

  /** Kunci waktu yang tampil (urut kronologis). Nama alias (subuh, dzuhur, isya, dst.) ikut dikenali. */
  function prayerKeys(show) {
    var m = {}, k;
    for (k in show) if (PRAYER_ORDER.indexOf(k) > -1) m[k] = !!show[k];       // nama baku dulu
    for (k in show) if (PRAYER_ORDER.indexOf(k) < 0 && PRAYER_ALIAS[String(k).toLowerCase()]) m[PRAYER_ALIAS[String(k).toLowerCase()]] = !!show[k];
    return PRAYER_ORDER.filter(function (x) { return m[x]; });
  }

  FlipClock.prototype._buildPrayer = function (clock) {
    var o = this.opts, p = o.prayer, self = this;
    this.prayerEl = null; this.pLocEl = null; this.pItems = {}; this.pCd = null; this._pKeys = [];
    if (!p.enabled || !this.loc) return;
    var keys = this._pKeys = prayerKeys(p.show || {});
    if (!keys.length) return;

    var names = merge(PRAYER_NAMES[p.lang] || PRAYER_NAMES.id, {});
    if (isObj(p.names)) Object.keys(p.names).forEach(function (k) { names[pKey(k)] = p.names[k]; });
    this._pNames = names;

    var wrap = this.prayerEl = el('div', 'pt' + (p.layout === 'grid' ? ' pg' : ''));
    if (p.gap != null && !isNaN(p.gap)) clock.style.setProperty('--gp', p.gap / o.size);

    if (p.location) { this.pLocEl = el('div', 'ploc'); this.pLocEl.textContent = this.loc.label; }

    var list = el('div', 'pl', wrap);
    keys.forEach(function (k) {
      var box = el('div', 'pi', list);
      el('i', null, box).textContent = names[k];
      self.pItems[k] = { box: box, time: el('b', null, box) };
    });

    if (p.countdown) {
      var cd = this.pCd = el('div', 'pcd');
      this.pCdLbl = document.createTextNode('');
      cd.appendChild(this.pCdLbl);
      this.pCdTime = el('b', null, cd);
    }
  };

  FlipClock.prototype._renderPrayer = function () {
    if (!this.prayerEl) return;
    var p = this.opts.prayer, loc = this.loc, keys = this._pKeys, self = this;
    var now = new Date(), c = civilIn(loc.tz, now), day = c.y + '-' + c.m + '-' + c.d, i, k, t;

    // jadwal dihitung ulang hanya saat ganti hari (di zona waktu wilayah)
    if (day !== this._pKey) {
      var L = { lat: loc.lat, lon: loc.lon, offset: c.offset, elev: loc.elev };
      var nx = new Date(Date.UTC(c.y, c.m - 1, c.d + 1));
      this._pKey = day;
      this._pToday = calcPrayer(c.y, c.m, c.d, L, p);
      this._pNext = calcPrayer(nx.getUTCFullYear(), nx.getUTCMonth() + 1, nx.getUTCDate(), L, p);
      keys.forEach(function (key) { self.pItems[key].time.textContent = hhmm(self._pToday[key]); });
      this._pLast = null;
      if (this._ready) this._fit();
    }

    // waktu berikutnya (kalau hari ini sudah lewat semua, ambil besok)
    var next = null, left = 0, tomorrow = false;
    for (i = 0; i < keys.length; i++) {
      t = this._pToday[keys[i]];
      if (t != null && t * 60 > c.sod) { next = keys[i]; left = t * 60 - c.sod; break; }
    }
    if (!next) {
      for (i = 0; i < keys.length; i++) {
        t = this._pNext[keys[i]];
        if (t != null) { next = keys[i]; left = 86400 - c.sod + t * 60; tomorrow = true; break; }
      }
    }

    var sig = next ? next + (tomorrow ? '+1' : '') : '';
    if (sig !== this._pLast) {
      var prev = this._pPrev;
      // waktu sholat baru saja masuk -> panggil onPrayer (diabaikan jika sudah lewat >5 detik, mis. tab baru aktif lagi)
      if (prev && !prev.tomorrow && typeof p.onPrayer === 'function' && this._pToday[prev.key] != null &&
          c.sod - this._pToday[prev.key] * 60 <= 5 && c.sod >= this._pToday[prev.key] * 60) {
        try { p.onPrayer(this._pNames[prev.key], prev.key, hhmm(this._pToday[prev.key])); } catch (e) { if (typeof console !== 'undefined' && console.error) console.error(e); }
      }
      this._pPrev = next ? { key: next, tomorrow: tomorrow } : null;
      this._pLast = sig;
      var reached = true;
      keys.forEach(function (key) {
        var it = self.pItems[key].box, isNext = key === next;
        if (isNext) reached = false;
        it.classList.toggle('on', !!p.highlight && isNext);
        it.classList.toggle('past', !!p.highlight && !isNext && (tomorrow || reached));
      });
      if (this.pCd && next) this.pCdLbl.nodeValue = (p.lang === 'en' ? 'Next: ' : 'Menuju ') + this._pNames[next] + ' ';
    }

    if (this.pCd && next) {
      this.pCdTime.textContent = pad(Math.floor(left / 3600)) + ':' + pad(Math.floor(left % 3600 / 60)) + ':' + pad(left % 60);
    }
  };

  /**
   * Penempatan host.
   * - Mode melayang: host dipindah ke <body> supaya `position: fixed` selalu relatif ke layar.
   *   Kalau tetap di dalam footer/section, ancestor yang punya transform / filter / backdrop-filter /
   *   contain / will-change akan "menyandera" fixed sehingga jam ikut posisi ancestor (bug "nyangkut di footer").
   * - Semua properti kritis dipasang inline + !important agar tidak ditimpa CSS website.
   */
  FlipClock.prototype._place = function () {
    var host = this.host, s = host.style, o = this.opts, p = o.position;
    var imp = function (k, v) { s.setProperty(k, v, 'important'); };
    s.cssText = '';

    imp('display', 'block'); imp('margin', '0'); imp('padding', '0');
    imp('overflow', 'visible'); imp('float', 'none');

    if (!p) {                                   // ikut posisi elemen
      if (host.parentNode !== this.target) this.target.appendChild(host);
      imp('position', 'static'); imp('transform', 'none');
      var mx = this._v('marginX') || 0, my = this._v('marginY') || 0, mw = this._v('maxWidth');
      var lim = 'calc(100% - ' + (mx * 2) + 'px)';
      imp('max-width', mw ? 'min(' + mw + 'px, ' + lim + ')' : lim);      // lebar penuh dikurangi margin, dibatasi maxWidth
      imp('margin-top', my + 'px'); imp('margin-bottom', my + 'px');
      imp('margin-left', o.align === 'left' ? mx + 'px' : 'auto');          // sisa ruang dibagi sesuai `align`
      imp('margin-right', o.align === 'right' ? mx + 'px' : 'auto');
      return;
    }

    var body = document.body || document.documentElement;
    if (host.parentNode !== body) body.appendChild(host);

    var off = o.offset, px = off + 'px';
    imp('position', 'fixed');
    imp('z-index', '2147483000');
    imp('width', 'max-content');
    imp('max-width', 'calc(100vw - ' + (off * 2) + 'px)');
    imp('top', 'auto'); imp('bottom', 'auto'); imp('left', 'auto'); imp('right', 'auto');
    imp('transform', 'none');

    var vert = p.indexOf('top') === 0 ? 'top' : 'bottom';
    imp(vert, px);
    imp(vert, 'calc(' + px + ' + env(safe-area-inset-' + vert + ', 0px))');   // aman untuk notch / home bar

    if (/left$/.test(p)) imp('left', px);
    else if (/right$/.test(p)) imp('right', px);
    else { imp('left', '50%'); imp('transform', 'translateX(-50%)'); }
  };

  /** Apakah container sedang "sempit" (HP)? Mode melayang membandingkan dengan lebar layar. */
  FlipClock.prototype._calcMobile = function () {
    var o = this.opts, bp = o.mobile && o.mobile.breakpoint;
    if (!bp) return false;
    var w = o.position ? window.innerWidth : this.target.clientWidth;
    return w > 0 && w <= bp;
  };

  /** Nilai opsi yang berlaku sekarang (memperhitungkan aturan `mobile`). */
  FlipClock.prototype._v = function (k) {
    var m = this.opts.mobile;
    if (this._mobile && m && m[k] != null) return m[k];
    return this.opts[k];
  };

  /** Lebar yang tersedia untuk jam (di luar padding container, margin, dan maxWidth). */
  FlipClock.prototype._avail = function () {
    var o = this.opts, mw = this._v('maxWidth'), w;
    if (o.position) w = window.innerWidth - o.offset * 2;
    else {
      var t = this.target;
      w = t.clientWidth;
      if (!w) return 0;
      var cs = window.getComputedStyle(t);
      w = w - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0) - (this._v('marginX') || 0) * 2;
    }
    if (mw) w = Math.min(w, mw);
    return w;
  };

  FlipClock.prototype._fit = function () {
    var o = this.opts;
    if (this._dead || !this.clock) return;
    var mob = this._calcMobile();
    if (mob !== this._mobile) { this._mobile = mob; this._place(); }      // masuk/keluar mode HP -> terapkan margin & lebar maksimum yang sesuai
    var size = this._v('size');
    this.clock.style.setProperty('--h', size + 'px');
    if (!o.fit) return;
    var avail = this._avail();
    if (avail <= 0) return;
    var w = this.row.getBoundingClientRect().width;
    if (this.dateEl) w = Math.max(w, this.dateEl.getBoundingClientRect().width);
    if (this.creditEl) w = Math.max(w, this.creditEl.getBoundingClientRect().width);
    if (this.prayerEl && o.prayer.layout !== 'grid') {      // layout 'row' = satu baris, jam ikut mengecil; 'grid' menyesuaikan sendiri
      var pl = this.prayerEl.querySelector('.pl');
      if (pl) w = Math.max(w, pl.getBoundingClientRect().width, pl.scrollWidth);
    }
    var padW = (o.padX != null || o.padY != null) ? (o.padX != null ? o.padX : size * 0.12) * 2 : (o.padding ? size * 0.24 : 0);
    var natural = w + padW;
    if (natural > avail) {
      this.clock.style.setProperty('--h', Math.max(24, size * avail / natural) + 'px');
    }
  };

  FlipClock.prototype._render = function (animate) {
    var o = this.opts, now = new Date(), p = {}, d = this.digits;
    animate = animate && o.flip && !document.hidden;

    this.fmt.formatToParts(now).forEach(function (x) { p[x.type] = x.value; });
    var h24 = parseInt(p.hour, 10) % 24;
    var min = p.minute, sec = p.second, hh;

    if (o.hour12) {
      var h = h24 % 12 || 12;
      hh = (h < 10 && !o.leadingZero) ? ['', String(h)] : [pad(h)[0], pad(h)[1]];
    } else {
      hh = [pad(h24)[0], pad(h24)[1]];
    }

    if (d.hours)   { d.hours[0].set(hh[0], animate);   d.hours[1].set(hh[1], animate); }
    if (d.minutes) { d.minutes[0].set(min[0], animate); d.minutes[1].set(min[1], animate); }
    if (d.seconds) { d.seconds[0].set(sec[0], animate); d.seconds[1].set(sec[1], animate); }

    if (this.barFill) {
      var sn = parseInt(sec, 10), f = this.barFill;
      if (sn === 0) { f.style.transition = 'none'; f.style.width = '0%'; void f.offsetWidth; f.style.transition = ''; }
      f.style.width = ((sn + 1) / 60 * 100) + '%';
    }
    if (this.ampmEl) this.ampmEl.textContent = h24 >= 12 ? 'PM' : 'AM';
    this._renderPrayer();
    if (this.dateEl) {
      var dt = dateText(this.dfmt, o.dateFormat, now);
      if (dt !== this._dt) {
        this._dt = dt;
        this.dateEl.textContent = dt;
        if (this._ready) this._fit();     // teks tanggal berubah (ganti hari), ukur ulang
      }
    }
  };

  FlipClock.prototype._schedule = function () {
    var delay = 1000 - (Date.now() % 1000) + 8;
    this.timeout = setTimeout(this.tick, delay);
  };

  FlipClock.prototype.tick = function () {
    this._render(true);
    this._schedule();
  };

  /** Ubah konfigurasi saat berjalan. Contoh: clock.update({ theme: 'light' }) */
  FlipClock.prototype.update = function (opts) {
    this.opts = merge(this.opts, opts || {});
    if (opts && isObj(opts.colors)) this.opts.colors = merge({}, opts.colors);   // colors selalu diganti total
    var all = this.digits;
    ['hours', 'minutes', 'seconds'].forEach(function (k) {
      if (all[k]) all[k].forEach(function (x) { x.destroy(); });
    });
    this._build();
    return this;
  };

  /** Hapus widget dari halaman. */
  FlipClock.prototype.destroy = function () {
    this._dead = true;
    clearTimeout(this.timeout);
    if (this.ro) this.ro.disconnect();
    window.removeEventListener('resize', this._onResize);
    if (document.fonts && document.fonts.removeEventListener) document.fonts.removeEventListener('loadingdone', this._onFonts);
    var all = this.digits;
    ['hours', 'minutes', 'seconds'].forEach(function (k) {
      if (all[k]) all[k].forEach(function (x) { x.destroy(); });
    });
    if (this.host.parentNode) this.host.parentNode.removeChild(this.host);
    if (this.target.__fsc === this) { this.target.__fsc = null; this.target.__fscOff = true; }
  };

  /* ------------------------------------------------------------------ */
  /*  Auto-init lewat atribut data-*                                     */
  /* ------------------------------------------------------------------ */
  function bool(v) { return !(v === 'false' || v === '0' || v === 'no'); }

  function fromData(n) {
    var d = n.dataset, o = {};
    if (d.theme) o.theme = d.theme;
    if (d.show) {
      var list = d.show.toLowerCase().split(/[\s,]+/);
      var has = function (a, b) { return list.indexOf(a) > -1 || list.indexOf(b) > -1; };
      o.show = {
        hours: has('hours', 'h'),
        minutes: has('minutes', 'm'),
        seconds: has('seconds', 's'),
        date: has('date', 'd')
      };
    }
    if (d.hour12 !== undefined) o.hour12 = bool(d.hour12);
    if (d.ampm !== undefined) o.show = merge(o.show || {}, { ampm: bool(d.ampm) });
    if (d.leadingZero !== undefined) o.leadingZero = bool(d.leadingZero);
    if (d.separator) o.separator = d.separator;
    if (d.flip !== undefined) o.flip = bool(d.flip);
    if (d.size) o.size = parseFloat(d.size);
    if (d.fit !== undefined) o.fit = bool(d.fit);
    if (d.timezone) o.timezone = d.timezone;
    if (d.locale) o.locale = d.locale;
    if (d.credit !== undefined) o.credit = bool(d.credit);
    if (d.radius) o.radius = parseFloat(d.radius);
    if (d.align) o.align = d.align;
    if (d.padding !== undefined) o.padding = bool(d.padding);
    if (d.padX !== undefined) o.padX = parseFloat(d.padX);
    if (d.padY !== undefined) o.padY = parseFloat(d.padY);
    if (d.shadow !== undefined) o.shadow = bool(d.shadow);
    if (d.border !== undefined) o.border = bool(d.border);
    if (d.blinkColon !== undefined) o.blinkColon = bool(d.blinkColon);
    if (d.secondsBar !== undefined) o.secondsBar = bool(d.secondsBar);
    if (d.transparent !== undefined) o.transparent = bool(d.transparent);
    if (d.position) o.position = d.position;
    if (d.offset) o.offset = parseFloat(d.offset);

    // lebar maksimum & margin: data-max-width / data-margin-x / data-margin-y
    if (d.maxWidth !== undefined) o.maxWidth = parseFloat(d.maxWidth) || null;
    if (d.marginX !== undefined) o.marginX = parseFloat(d.marginX) || 0;
    if (d.marginY !== undefined) o.marginY = parseFloat(d.marginY) || 0;

    // aturan HP: data-mobile-breakpoint / -size / -margin-x / -margin-y / -max-width
    var mb = {};
    if (d.mobileBreakpoint) mb.breakpoint = parseFloat(d.mobileBreakpoint);
    if (d.mobileSize) mb.size = parseFloat(d.mobileSize);
    if (d.mobileMarginX !== undefined) mb.marginX = parseFloat(d.mobileMarginX) || 0;
    if (d.mobileMarginY !== undefined) mb.marginY = parseFloat(d.mobileMarginY) || 0;
    if (d.mobileMaxWidth) mb.maxWidth = parseFloat(d.mobileMaxWidth);
    if (Object.keys(mb).length) o.mobile = mb;

    // urutan komponen: data-order="clock,date,prayer,countdown,location,credit"
    if (d.order) o.order = d.order.split(/[\s,]+/).filter(Boolean);

    // jadwal sholat: data-prayer (aktifkan) + data-prayer-region / -lat / -lon / -show / -layout / ...
    if (d.prayer !== undefined) {
      var pr = { enabled: bool(d.prayer) };
      if (d.prayerRegion) pr.region = d.prayerRegion;
      if (d.prayerLat !== undefined && d.prayerLon !== undefined) { pr.lat = parseFloat(d.prayerLat); pr.lon = parseFloat(d.prayerLon); }
      if (d.prayerElevation !== undefined) pr.elevation = parseFloat(d.prayerElevation);
      if (d.prayerName) pr.name = d.prayerName;
      if (d.prayerTimezone) pr.timezone = d.prayerTimezone;
      if (d.prayerShow !== undefined) {                       // contoh: "imsak,subuh,dzuhur,ashar,maghrib,isya"
        var want = d.prayerShow.toLowerCase().split(/[\s,]+/).filter(Boolean).map(pKey), sh = {};
        PRAYER_ORDER.forEach(function (k) { sh[k] = want.indexOf(k) > -1; });
        pr.show = sh;
      }
      if (d.prayerLayout) pr.layout = d.prayerLayout;
      if (d.prayerCountdown !== undefined) pr.countdown = bool(d.prayerCountdown);
      if (d.prayerLocation !== undefined) pr.location = bool(d.prayerLocation);
      if (d.prayerHighlight !== undefined) pr.highlight = bool(d.prayerHighlight);
      if (d.prayerLang) pr.lang = d.prayerLang;
      if (d.prayerIhtiyat !== undefined) pr.ihtiyat = parseFloat(d.prayerIhtiyat);
      if (d.prayerFajrAngle !== undefined) pr.fajrAngle = parseFloat(d.prayerFajrAngle);
      if (d.prayerIshaAngle !== undefined) pr.ishaAngle = parseFloat(d.prayerIshaAngle);
      if (d.prayerAsrFactor !== undefined) pr.asrFactor = parseFloat(d.prayerAsrFactor);
      if (d.prayerGap !== undefined) pr.gap = parseFloat(d.prayerGap);
      if (d.prayerAdjust) {                                   // contoh: "fajr:1,isha:-1"
        var adj = {};
        d.prayerAdjust.split(',').forEach(function (x) {
          var kv = x.split(':'); if (kv.length === 2 && !isNaN(parseFloat(kv[1]))) adj[pKey(kv[0].trim())] = parseFloat(kv[1]);
        });
        pr.adjust = adj;
      }
      o.prayer = pr;
    }

    // format tanggal: data-date-weekday / -day / -month / -year (nilai "false" = sembunyikan)
    var fv = function (v) { return (v === 'false' || v === 'none' || v === 'off') ? false : v; };
    var df = {};
    if (d.dateWeekday !== undefined) df.weekday = fv(d.dateWeekday);
    if (d.dateDay !== undefined) df.day = fv(d.dateDay);
    if (d.dateMonth !== undefined) df.month = fv(d.dateMonth);
    if (d.dateYear !== undefined) df.year = fv(d.dateYear);
    if (d.dateComma !== undefined) df.comma = bool(d.dateComma);
    if (d.dateUppercase !== undefined) df.uppercase = bool(d.dateUppercase);
    if (Object.keys(df).length) o.dateFormat = df;

    // jarak (px): data-gap-digit / data-gap-group / data-gap-date
    if (d.gapDigit !== undefined) o.gapDigit = parseFloat(d.gapDigit);
    if (d.gapGroup !== undefined) o.gapGroup = parseFloat(d.gapGroup);
    if (d.gapDate !== undefined) o.gapDate = parseFloat(d.gapDate);

    var colors = {};
    if (d.bg) colors.background = d.bg;
    if (d.card) colors.card = d.card;
    if (d.text) colors.text = d.text;
    if (d.divider) colors.divider = d.divider;
    if (d.label) colors.label = d.label;
    if (d.dateColor) colors.date = d.dateColor;
    if (d.creditColor) colors.credit = d.creditColor;
    if (d.borderColor) colors.border = d.borderColor;
    if (Object.keys(colors).length) o.colors = colors;
    return o;
  }

  function autoInit(root) {
    (root || document).querySelectorAll('[data-fixs-flipclock]').forEach(function (n) {
      if (n.__fsc || n.__fscOff) return;
      new FlipClock(n, fromData(n));
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { autoInit(); });
    else autoInit();

    // elemen [data-fixs-flipclock] yang baru muncul belakangan (SPA, builder, popup, footer yang di-inject)
    if (typeof MutationObserver !== 'undefined') {
      var queued = false;
      new MutationObserver(function () {
        if (queued) return;
        queued = true;
        (window.requestAnimationFrame || setTimeout)(function () { queued = false; autoInit(); });
      }).observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  /* ------------------------------------------------------------------ */
  /*  API publik                                                         */
  /* ------------------------------------------------------------------ */
  var API = {
    version: '1.3.0',
    themes: THEMES,
    defaults: DEFAULTS,
    create: function (target, options) { return new FlipClock(target, options); },
    /** Hasil teks tanggal untuk opsi tertentu, contoh: FixsFlipClock.formatDate(new Date(), { locale: 'id-ID' }) */
    formatDate: function (date, options) {
      var o = merge(DEFAULTS, options || {});
      return dateText(makeDateFmt(o), o.dateFormat, date || new Date());
    },
    init: autoInit,
    /** Daftar wilayah bawaan: [{ id, name, label, province, tz, lat, lon, elev }]. Dipakai untuk dropdown pilihan wilayah. */
    regions: function () {
      return regionList().map(function (r) {
        return { id: r.id, name: r.name, label: r.label, province: r.province, parent: r.parent || null, tz: r.tz, lat: r.lat, lon: r.lon, elev: r.elev };
      });
    },
    findRegion: function (q) { var r = findRegion(q); return r ? merge(r, {}) : null; },
    /** Jadwal sholat satu hari tanpa membuat widget. Contoh: FixsFlipClock.prayerTimes(new Date(), { region: 'kota-banjarmasin' }) */
    prayerTimes: function (date, options) {
      var p = merge(DEFAULTS.prayer, options || {}), loc = resolveLocation(p, null), c = civilIn(loc.tz, date || new Date());
      var t = calcPrayer(c.y, c.m, c.d, { lat: loc.lat, lon: loc.lon, offset: c.offset, elev: loc.elev }, p), out = {};
      PRAYER_ORDER.forEach(function (k) { out[k] = hhmm(t[k]); });
      return out;
    },
    /** Diagnosa: ketik FixsFlipClock.debug() di Console (F12) untuk lihat kondisi jam di halaman. */
    debug: function () {
      var out = [];
      document.querySelectorAll('.fixs-flipclock-host').forEach(function (h) {
        var r = h.getBoundingClientRect(), cs = window.getComputedStyle(h);
        var d = h.shadowRoot && h.shadowRoot.querySelector('.date');
        out.push({
          version: API.version,
          parent: h.parentNode.tagName + (h.parentNode.id ? '#' + h.parentNode.id : ''),
          position: cs.position,
          rect: { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height) },
          viewport: { w: window.innerWidth, h: window.innerHeight },
          date: d ? d.textContent : '(tanpa tanggal)',
          dateWidth: d ? Math.round(d.getBoundingClientRect().width) : 0
        });
      });
      console.log('[Fixs Flip Clock] v' + API.version + ', jumlah jam: ' + out.length);
      console.log(JSON.stringify(out, null, 2));
      return out;
    }
  };

  if (typeof console !== 'undefined' && console.info) console.info('[Fixs Flip Clock] v' + API.version + ' aktif');
  if (typeof module === 'object' && module.exports) module.exports = API;
  global.FixsFlipClock = API;
})(typeof window !== 'undefined' ? window : this);
