# Asri Collection — Duitku POP

Dokumentasi dan bahan kerja integrasi pembayaran Duitku POP untuk Asri Collection.

## Cakupan
- Requirement berdasarkan dokumentasi resmi Duitku POP
- Pembuatan invoice dan redirect ke halaman pembayaran Duitku
- Request signature dan validasi callback signature
- Status pembayaran, rekonsiliasi, dan expiry
- Idempotensi transaksi serta konsistensi order/inventory
- Checklist pengujian Sandbox dan catatan audit

## Edge Functions baseline
- `duitku-create-invoice`
- `duitku-callback`
- `get-payment-status`
- `reconcile-payment`
- `expire-pending-payments`

## Keamanan
- Jangan commit merchant key, API key, secrets, atau data pembayaran sensitif.
- Redirect/return dari browser bukan bukti pembayaran berhasil; status final harus diverifikasi backend.
- Gunakan Duitku Sandbox untuk pengujian sebelum perubahan produksi.
- Deployment dan perubahan backend/database tetap memerlukan persetujuan terpisah.

## Referensi
- [Dokumentasi resmi Duitku POP](https://docs.duitku.com/pop/id/)
