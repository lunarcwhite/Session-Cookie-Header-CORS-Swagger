const express = require('express');
const multer = require('multer');
const path = require('path');
const ProdukController = require('../controller/ProdukController');
const KaryawanController = require('../controller/KaryawanController')
const auth = require('../middleware/auth');
const app = express.Router();

app.get('/', function (req, res) {
  res.send({ message: 'Rest API sederhana' });
});
const upload = multer({dest: path.resolve('./tmp')});

app.get('/produk', ProdukController.fetch);
app.get('/produk/:id', ProdukController.show);

app.get('/karyawan', KaryawanController.fetch);
app.get('/karyawan/:id', KaryawanController.show);
app.use(auth);
app.post('/produk/create', upload.single('gambar_produk') ,ProdukController.create);
app.put('/produk/:id', upload.single('gambar_produk'), ProdukController.update);
app.delete('/produk/:id', ProdukController.destroy);
app.post('/uploads/produk', upload.single('produk'), ProdukController.uploads);
app.use('/uploads/produk', express.static(path.resolve(`public/img/produk`)));

app.post('/karyawan/create',KaryawanController.create);
app.put('/karyawan/:id', KaryawanController.update);
app.delete('/karyawan/:id', KaryawanController.destroy);

module.exports = app;


