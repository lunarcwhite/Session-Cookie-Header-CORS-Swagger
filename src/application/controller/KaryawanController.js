const fs = require('fs');
const path = require('path');
const dbPath = path.resolve(__dirname, '../../../database/karyawan/karyawan.json');

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
            message: 'Data Karyawan Tidak Ditemukan'
        });
    }
}

function create(req, res) {
    let bodyData = req.body;
    let id = req.body.id;
    let oneData = getOne(id);
    if (!oneData) {
        let data = getData();
        data.push(bodyData);
        writeData(data);
        res.send({
            message: 'Berhasil Menambahkan',
            data: bodyData,
        });
    } else {
        res.status(500).send({
            code: 500,
            message: 'ID Karyawan Sudah Ada'
        });
    }

}

function update(req, res) {
    let bodyData = req.body;
    let id = req.params.id;
    let data = getOne(id);
    let allData = getData();
    const index = allData.findIndex((d) => d.id == id);
    if (index == true || data !== undefined) {
        data = {
            ...data,
            ...bodyData
        };
        allData[index] = data;
        writeData(allData);
        res.send({
            message: 'Data Karyawan Berhasil Diperbarui',
            data: data
        });
    } else {
        res.status(404).send({
            code: 404,
            message: 'Data Karyawan Tidak Ditemukan'
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
            message: 'Data Karyawan Berhasil Dihapus'
        });
    } else {
        res.status(404).send({
            code: 404,
            message: 'Data Karyawan Tidak Ditemukan'
        });
    }
}
module.exports = {
    fetch,
    create,
    show,
    update,
    destroy,
};