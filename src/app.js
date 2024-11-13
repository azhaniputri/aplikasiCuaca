const express = require('express');
const hbs = require('hbs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const geocode = require('./utils/geocode');
const forecast = require('./utils/prediksiCuaca');
const getNews = require('./utils/getnews'); 

// Set view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../templates/views'));

// Menyajikan file statis
app.use(express.static(path.join(__dirname, '../templates')));
app.use(express.static(path.join(__dirname, '../public')));

// Set partials
hbs.registerPartials(path.join(__dirname, '../templates/partials'));

// Rute
app.get('/', (req, res) => {
    res.render('index', {
        judul: 'Aplikasi Cek Cuaca',
        nama: 'Azhani Wydjhe Putri'
    });
});

// Rute untuk info cuaca
app.get('/infocuaca', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Kamu harus memasukan lokasi yang ingin dicari'
        });
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error });
        }
        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error) {
                return res.send({ error });
            }
            res.send({
                prediksiCuaca: dataPrediksi,
                lokasi: location,
                address: req.query.address
            });
        });
    });
});

// Rute untuk halaman tentang
app.get('/tentang', (req, res) => {
    res.render('tentang', {
        judul: 'Tentang Saya',
        nama: 'Azhani Wydjhe Putri',
        tempatLahir: 'Bukittinggi',
        tanggalLahir: '19 September 2002',
        jenisKelamin: 'Wanita',
        kewarganegaraan: 'Indonesia',
        status: 'Belum Menikah',
        email: 'azhaniwp@gmail.com',
        nomorHP: '085214929085'
    });
});
// Rute untuk halaman bantuan
app.get('/bantuan', (req, res) => {
    res.render('bantuan', {
        judul: 'Bantuan dan Dukungan',
        nama: 'Azhani Wydjhe Putri'
    });
});

// Rute untuk halaman penjelasan
app.get('/penjelasan', (req, res) => {
    res.render('penjelasan', {
        judul: 'Penjelasan Aplikasi Cek Cuaca',
        nama: 'Azhani Wydjhe Putri'
    });
});

app.get('/berita', (req, res) => {
    getNews('general', (error, articles) => {  // Mengambil berita dengan kategori 'general'
        if (error) {
            return res.send({ error });
        }
        res.render('berita', {
            judul: 'Berita Terkini',
            articles: articles,
            nama: 'Azhani Wydjhe Putri'
         // Mengirim data berita ke template
        });
    });
});

// Wildcard route untuk halaman tidak ditemukan
app.get('*', (req, res) => {
    res.render('404', {
        pesanKesalahan: 'Halaman tidak ditemukan.'
    });
});


// Jalankan server
app.listen(port, () => {
    console.log('Server berjalan pada port '+ port);
});
