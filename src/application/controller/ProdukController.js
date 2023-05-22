const fs = require('fs');
const path = require('path');
const dbPath = path.resolve(__dirname, '../../../database/produk/produk.json');
const d = new Date();
let time = d.getTime();

function getData() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify([]));
    }
    let data = fs.readFileSync(dbPath);
    data = data.toString('utf-8');
    return JSON.parse(data);
}

function getOne(id) {
    let data = getData();
    return data.find((d) => d.id == id);
}

function writeData(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data), {
        encoding: 'utf-8'
    });
}

function fetch(req, res) {
    let data = getData();
    res.send(data);
}

function show(req, res) {
    let id = req.params.id;
    let oneData = getOne(id);
    if (oneData) {
        res.send(oneData);
    } else {
        res.status(404).send({
            code: 404,
            message: 'Data Produk Tidak Ditemukan'
        });
    }
}

function create(req, res) {
    let bodyData = req.body;
    const metaData = req.file;
    let originalName = "";
    if (metaData) {
        originalName = time += metaData.originalname;
        const oldPath = metaData.path;
        fs.renameSync(oldPath, path.resolve(`public/img/produk/${originalName}`));
    }
    let id = req.body.id;
    let oneData = getOne(id);
    if (!oneData) {
        let data = getData();
        bodyData.gambar_produk = originalName;
        data.push(bodyData);
        writeData(data);
        res.send({
            message: 'Berhasil Menambahkan',
            data: bodyData,
        });
    } else {
        res.status(500).send({
            code: 500,
            message: 'ID Produk Sudah Ada'
        });
    }

}

function update(req, res) {
    let bodyData = req.body;
    const metaData = req.file;
    let originalName = "";
    if (metaData) {
        originalName = time += metaData.originalname;
        const oldPath = metaData.path;
        fs.renameSync(oldPath, path.resolve(`public/img/produk/${originalName}`));
    }
    let id = req.params.id;
    let data = getOne(id);
    let allData = getData();
    const index = allData.findIndex((d) => d.id == id);
    if (index == true || data !== undefined) {
        bodyData.gambar_produk = originalName;
        data = {
            ...data,
            ...bodyData
        };
        allData[index] = data;
        writeData(allData);
        res.send({
            message: 'Data Produk Berhasil Diperbarui',
            data: data
        });
    } else {
        res.status(404).send({
            code: 404,
            message: 'Data Produk Tidak Ditemukan'
        });
    }

}

function destroy(req, res) {
    let id = req.params.id;
    let oneData = getOne(id);
    if (oneData) {
        let data = getData();
        data = data.filter((d) => d.id != id);
        writeData(data);
        res.send({
            message: 'Data Produk Berhasil Dihapus'
        });
    } else {
        res.status(404).send({
            code: 404,
            message: 'Data Produk Tidak Ditemukan'
        });
    }
}
function uploads(req, res){
    let metaData = req.file;
    if (metaData) {
        const originalName = time+'-'+ metaData.originalname;
        const oldPath = metaData.path;
        fs.renameSync(oldPath, path.resolve(`public/img/produk/${originalName}`));
        res.send({
            message: 'Gambar Berhasil Diunggah'
        })
    }
    res.status(500).send({
        message: 'Gambar Gagal Diunggah'
    })
}

module.exports = {
    fetch,
    create,
    show,
    update,
    destroy,
    uploads,
};