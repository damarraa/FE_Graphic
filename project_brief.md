# Project Brief  
## Frontend Input Data & Grafik Dinamis (Tanpa Framework)

---
## Latar Belakang
Dibutuhkan sebuah halaman frontend sederhana (tanpa framework) yang berfungsi sebagai media input data numerik per **part** dan **tanggal**, serta menampilkan grafik dinamis berdasarkan data yang diinput. Halaman ini nantinya akan **diintegrasikan dan disesuaikan** dengan sistem berbasis **.NET** yang sedang dikembangkan.
---
## Tujuan Project
- Menyediakan halaman input data yang **mirip Excel**
- Menampilkan **grafik dinamis** berdasarkan data input
- Mendukung **penyimpanan dan pemanggilan data**
- Memudahkan proses **konversi & integrasi ke .NET**
---
## Ruang Lingkup Pekerjaan
Pembuatan **1 halaman frontend** dengan fitur utama:
- Tabel input data dinamis
- Grafik otomatis berbasis input
- Penyimpanan data (save & load)
---
## Fitur & Kebutuhan Fungsional
### 1. Input Part & Tanggal (Dinamis)
- User dapat menambahkan:
  - Part (contoh: Part 1, Part 2, dst)
  - Tanggal (format bebas / date picker)
- Jumlah part dan tanggal **tidak dibatasi secara statis**
---
### 2. Input Angka per Part & Tanggal
- Setiap pertemuan **part × tanggal** berisi input angka (numeric)
- Validasi input hanya angka
- Nilai boleh kosong
---
### 3. Tampilan Data (15–20 Kolom)
- Default menampilkan ±15–20 tanggal
- Mendukung:
  - Scroll horizontal, atau
  - Navigasi data ke tanggal sebelumnya & berikutnya
- Digunakan untuk kebutuhan **review data ke belakang dan ke depan**
---
### 4. Grafik Dinamis
- Grafik otomatis berubah saat data diinput atau diperbarui
- Grafik menampilkan:
  - Sumbu X: Tanggal
  - Sumbu Y: Nilai angka
  - Line terpisah untuk setiap Part
- Grafik menyesuaikan data yang sedang ditampilkan
---
### 5. Penyimpanan Data
- Tersedia tombol **Save**
- Saat tombol diklik:
  - Seluruh data tersimpan sekaligus
  - Tidak perlu penyimpanan per cell
- Saat halaman dibuka ulang:
  - Data otomatis tampil kembali seperti terakhir disimpan
---
## Catatan Tambahan
- Tampilan dan interaksi dibuat **mirip Excel**
- Fokus pada **fungsionalitas**, bukan UI kompleks
- Struktur kode dibuat rapi agar:
  - Mudah dibaca
  - Mudah dikonversi
  - Mudah diintegrasikan ke project .NET
- Tidak menggunakan framework frontend
---
## Teknologi yang Digunakan (Rekomendasi)
- HTML
- CSS
- JavaScript (Vanilla)
- Library grafik ringan (contoh: Chart.js)
- Penyimpanan sementara:
  - `localStorage` (untuk demo), atau
  - Struktur JSON (untuk integrasi backend)
---
## Contoh Struktur Data
```json
{
  "dates": ["08/08/2026", "12/08/2026", "20/08/2026"],
  "parts": {
    "Part 1": [450, 455, 470],
    "Part 2": [465, 465, null],
    "Part 3": [455, 456, null]
  }
}
