# Asri Collection — Duitku POP

Dokumentasi requirement dan bahan kerja integrasi pembayaran **Duitku POP** untuk Asri Collection.

> **Status dokumen:** diselaraskan dengan dokumentasi resmi Duitku POP berbahasa Indonesia yang diperiksa pada 15 Oktober 2026. Dokumentasi provider dapat berubah; verifikasi kembali bagian terkait sebelum implementasi atau pengujian.

## Sumber resmi

- [Duitku POP — API Reference (Bahasa Indonesia)](https://docs.duitku.com/pop/id/)
- Bagian **Integrasi Backend atau Server → Create Invoice** pada [dokumentasi POP](https://docs.duitku.com/pop/id/)
- Bagian **Integrasi Backend atau Server → Callback** pada [dokumentasi POP](https://docs.duitku.com/pop/id/)
- Bagian **Integrasi Frontend atau View** (Duitku JS, JS Callback, Window Redirection, Redirect) pada [dokumentasi POP](https://docs.duitku.com/pop/id/)
- [Duitku API Reference umum](https://docs.duitku.com/api/id/) — referensi pembanding; jangan menganggap endpoint/kontrak API umum otomatis berlaku untuk POP.

Gunakan dokumentasi POP sebagai sumber utama untuk kontrak POP. Jangan menyalin signature, endpoint, parameter, atau status dari produk Duitku lain maupun contoh lama tanpa verifikasi.

## Cakupan integrasi

- Create Invoice dari backend dan penyimpanan reference serta paymentUrl.
- Pilihan metode tampilan pembayaran: Duitku JS/popup atau window redirection. **Jangan mengubah mode yang sudah disetujui proyek tanpa persetujuan.**
- Request signature dan validasi HTTP callback.
- Sinkronisasi status pembayaran dan rekonsiliasi jika callback terlambat/tidak diterima.
- Idempotensi, transisi status order/payment, dan konsistensi inventory.
- Expiry, pembatalan, penanganan error, serta pengujian Sandbox.
- Audit keamanan Supabase: RLS, grants, RPC, Edge Functions, secrets, dan jalur pemanggil frontend.

## Kontrak resmi yang perlu dipatuhi

### 1. Create Invoice

- HTTP POST, Content-Type: application/json.
- Sandbox: https://api-sandbox.duitku.com/api/merchant/createInvoice
- Production: https://api-prod.duitku.com/api/merchant/createInvoice
- Header autentikasi yang didokumentasikan: x-duitku-merchantcode, x-duitku-timestamp (Unix timestamp milidetik), dan x-duitku-signature.
- Formula request signature pada dokumentasi POP saat pemeriksaan:
  - stringToSign = merchantCode + timestamp
  - signature = HMAC_SHA256(stringToSign, apiKey)
- Field invoice mencakup paymentAmount, merchantOrderId, productDetails, email, callbackUrl, dan returnUrl; expiryPeriod, paymentMethod, itemDetails, dan customerDetail digunakan sesuai kebutuhan dan ketentuan provider.
- Simpan reference provider dan periksa statusCode/respons bisnis serta HTTP status. Jangan menganggap HTTP 200 saja berarti invoice berhasil.
- merchantOrderId harus unik untuk transaksi baru. Dokumentasi menjelaskan request berulang dengan order ID yang sama dapat mengembalikan respons yang sama dalam jangka waktu tertentu atau error jika transaksi masih diproses/nominal berbeda.
- Jumlah paymentAmount harus konsisten dengan detail item yang dikirim. Untuk Asri Collection, backend tetap menjadi sumber tepercaya untuk harga, promo, ongkir, dan total final; gunakan integer Rupiah.

### 2. HTTP Callback

- Dokumentasi POP menjelaskan callback sebagai HTTP POST dengan application/x-www-form-urlencoded.
- Validasi signature menggunakan formula yang didokumentasikan:
  - stringToSign = merchantCode + amount + merchantOrderId
  - signature = HMAC_SHA256(stringToSign, apiKey)
- Cocokkan merchant code, order ID, nominal, referensi provider, transaksi yang tersimpan, dan transisi status yang diizinkan.
- Proses callback secara idempoten. Callback duplikat atau bersamaan tidak boleh menggandakan perubahan status, pengurangan stok, atau proses fulfillment.
- Dokumentasi menyebut callback perlu merespons HTTP 200 OK dan dapat dikirim ulang jika provider tidak menerima respons tersebut. Pastikan callback baru diakui berhasil setelah pemrosesan aman atau event tersimpan untuk retry/reconciliation.
- Whitelist IP hanya pertahanan tambahan bila diterapkan; tidak menggantikan validasi signature.

### 3. Frontend: JS callback dan return URL

- Duitku JS menyediakan event seperti successEvent, pendingEvent, errorEvent, dan closeEvent.
- **JS callback dan parameter returnUrl bukan bukti pembayaran yang otoritatif.** Dokumentasi POP secara eksplisit melarang penggunaan hasil JS callback atau resultCode pada URL redirect untuk langsung mengubah status pembayaran.
- Frontend menggunakan hasil tersebut hanya untuk UX/navigasi, lalu mengambil status terkini dari backend yang tepercaya.
- Untuk window redirection, gunakan paymentUrl yang diterima dari Create Invoice; jangan membuat URL pembayaran sendiri.

### 4. Status, rekonsiliasi, dan expiry

- Bedakan status order, pembayaran, dan pengiriman.
- Periksa kontrak resmi yang berlaku sebelum menggunakan mekanisme inquiry/status check. Jangan mengarang endpoint atau menganggap API dari produk Duitku lain berlaku untuk POP.
- Rekonsiliasi harus terbatas, terukur, dan idempoten; hindari polling berlebihan.
- Gunakan expiryPeriod hanya sesuai satuan dan batas yang dikonfirmasi dokumentasi/konfigurasi merchant saat implementasi. Jangan mengasumsikan masa berlaku tetap.
- Pembayaran berhasil baru boleh memicu perubahan order/inventory setelah bukti provider tervalidasi dan perubahan database dilakukan secara atomik atau melalui mekanisme konsistensi yang aman.

## Baseline Edge Functions Asri Collection

Daftar baseline yang telah ditetapkan:

1. duitku-create-invoice
2. duitku-callback
3. get-payment-status
4. reconcile-payment
5. expire-pending-payments

Daftar tersebut adalah target/baseline, **bukan bukti bahwa fungsi-fungsi itu sudah ada, benar, teruji, atau ter-deploy**. Audit repository dan Supabase aktual sebelum menyimpulkan status implementasi. Pertahankan nama dan cakupan baseline kecuali ada persetujuan perubahan.

## Keamanan dan batas perubahan

- Simpan merchant API key hanya di Supabase Edge Function secrets atau secret manager backend yang disetujui. Jangan commit secrets, service-role keys, kredensial, signature sensitif, atau payload pelanggan lengkap.
- Jangan pernah mengekspos API key ke frontend atau variabel VITE_*.
- Validasi input dan otorisasi di backend; harga/total dari browser bukan sumber kebenaran.
- Jangan membuat fallback invoice palsu, status pembayaran simulasi, atau bypass validasi signature.
- Perubahan schema, data, RLS/grants, secrets, Edge Functions, dan deployment memerlukan persetujuan sesuai lingkup perubahan. Tidak ada deployment atau pembayaran produksi yang diizinkan hanya oleh README ini.
- Mulai audit dengan mode read-only dan catat repository/commit, project Supabase, fungsi/tabel yang benar-benar ditemukan, bukti, serta bagian yang belum diverifikasi.

## Checklist pengujian Sandbox

- [ ] Invoice valid menghasilkan respons provider yang sesuai dan reference/paymentUrl tersimpan.
- [ ] Request signature memakai formula dan timestamp dari dokumentasi POP terkini.
- [ ] Callback valid memverifikasi signature dan mencocokkan merchant, order, amount, dan reference.
- [ ] Signature hilang/salah, secret hilang, order tidak dikenal, merchant salah, atau amount tidak cocok ditolak dengan aman.
- [ ] Callback duplikat dan callback bersamaan tidak menggandakan perubahan state/inventory.
- [ ] HTTP 200 dengan respons bisnis gagal tidak dianggap invoice sukses.
- [ ] Callback terlambat/tidak diterima dapat ditangani melalui retry atau rekonsiliasi yang terverifikasi.
- [ ] Return URL/JS callback yang dimanipulasi tidak mengubah status pembayaran.
- [ ] Race antara callback, expiry, pembatalan, dan perubahan inventory ditangani aman.
- [ ] RLS, grants, RPC, akses status order, dan secret exposure ditinjau.
- [ ] Hasil pengujian aktual, lingkungan, dan bukti dicatat; jangan menandai lulus jika belum dijalankan.

## Catatan verifikasi

Dokumen ini merangkum kontrak yang ditemukan di dokumentasi resmi; bukan hasil audit kode atau pengujian runtime. Sebelum implementasi, baca kembali bagian terkait di [dokumentasi resmi POP](https://docs.duitku.com/pop/id/) dan verifikasi bahwa kontrak belum berubah.
