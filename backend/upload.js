const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const db = require('./dbConnection');
const multer = require('multer');
const path = require('path');
const Jimp = require('jimp');
const fs = require('fs');
const { upload, resizeImageAsync } = require('./resizeImage');
const { load, generateThumb } = require('./thumbGenerator');
const { avload, generateAvatar } = require('./avatarGenerator');

const app = express();
app.use(
    bodyparser.json({
        extended: true,
        limit: '35mb',
        parameterLimit: 50000,
    }),
);

app.use(cors());

// "upload.single('image')" carica la foto prima di ridimensionarla (Jimp legge l'immagine solo se già presente)
app.post('/test', upload.single('image'), async (req, res) => {
    const targetWidth = 900;
    const targetHeight = 600;

    const uploadedFileName = req.file.filename;
    const timestamp = Date.now();
    const filename = `image_${timestamp}.jpg`;

    const inputPath = `../src/assets/upload/${uploadedFileName}`; // Path per l'immagine da ridimensionare
    const outputPath = `../src/assets/resize/${filename}`; // Path per la scrittura dell'immagine dopo il ridimensionamento
    const imageUrl = `../../assets/resize/${filename}`; 

    // Ridimensionamento dell'immagine 
    try {
        resizeImageAsync(inputPath, outputPath, targetWidth, targetHeight);
    } catch (error) {
        console.error("Errore durante l'upload e la ridimensione dell'immagine:", error);
    }

    // Eliminazione dell'immagine con le dimensioni originali
    fs.unlink(inputPath, (error) => {
        if (error) {
            console.error(`Errore durante l'eliminazione del file: ${error}`);
        } else {
            console.log('File eliminato con successo.');
        }
    });

    res.send({ imageUrl });
});

app.post('/thumb', load.single('image'), async (req, res) => {
    const targetWidth = 50;
    const targetHeight = 50;

    const uploadedFileName = req.file.filename;
    const timestamp = Date.now();
    const filename = `image_${timestamp}.jpg`;

    const inputPath = `../src/assets/upload/${uploadedFileName}`;
    const outputPath = `../src/assets/thumbs/${filename}`;
    const imageUrl = `../../assets/thumbs/${filename}`;

    try {
        generateThumb(inputPath, outputPath, targetWidth, targetHeight);
    } catch (error) {
        console.error("Errore durante l'upload e la ridimensione dell'immagine:", error);
    }

    fs.unlink(inputPath, (error) => {
        if (error) {
            console.error(`Errore durante l'eliminazione del file: ${error}`);
        } else {
            console.log('File eliminato con successo.');
        }
    });

    res.send({ imageUrl });
});

app.post('/avatar', avload.single('image'), async (req, res) => {
    const targetWidth = 80;
    const targetHeight = 80;

    const user = req.body.user;
    const uploadedFileName = req.file.filename;
    const filename = `image_${user}.jpg`;

    const inputPath = `../src/assets/upload/${uploadedFileName}`;
    const outputPath = `../src/assets/avatar/${filename}`;
    const imageUrl = `../../assets/avatar/${filename}`;

    try {
        generateAvatar(inputPath, outputPath, targetWidth, targetHeight);
    } catch (error) {
        console.error("Errore durante l'upload e la ridimensione dell'immagine:", error);
    }

    fs.unlink(inputPath, (error) => {
        if (error) {
            console.error(`Errore durante l'eliminazione del file: ${error}`);
        } else {
            console.log('File eliminato con successo.');
        }
    });

    res.send({ imageUrl });
});



app.post('/upload', (req, res) => {

    const id = 0;
    const img = req.body.image;
    const thumb = req.body.thumb;
    const nome = req.body.nome;
    const desc = req.body.descrizione;
    const anno = req.body.anno;
    const lat = req.body.lat;
    const long = req.body.long;
    const id_utente = req.body.id_utente;

    db.query('insert into foto(id_foto,value,nome,anno,latitudine,longitudine,descrizione,thumb,id_utente) values(?,?,?,?,?,?,?,?,?)',
        [id, img, nome, anno, lat, long, desc, thumb, id_utente], (err, result) => {
            if (err) {
                console.log(err.message);
            }
            if (result) {
                if(result.length > 0){
                  res.send({
                    message: "Foto Registrata"
                })  
                } else {
                    res.send({
                        data: 0
                    })
                }     
            }
        })
});

app.get('/img/:anno', (req, res) => {

    const anno = req.params.anno;

    db.query('select latitudine, longitudine, min(thumb) as thumb, count(*) as conteggio from foto where anno = ? group by latitudine, longitudine', [anno], (err, result) => {
        if (err) {
            console.log('Errore');
        }
        if (result) {
            res.send(result);
        } else {
            res.send({
                message: "Non sono stati trovati valori"
            })
        }
    });
})

app.get('/img', (req, res) => {

    const anno = req.params.anno;

    db.query('select * from foto', (err, result) => {
        if (err) {
            console.log('Errore');
        }
        if (result) {
            res.send(result);
        } else {
            res.send({
                message: "Non sono stati trovati valori"
            })
        }
    });
})

app.get('/img/:lat/:long/:anno', (req, res) => {

    const lat = req.params.lat;
    const long = req.params.long;
    const anno = req.params.anno;

    db.query('select utenti.avatar,utenti.nome as nome_utente,foto.nome,foto.anno,foto.value,foto.descrizione from foto,utenti where latitudine = ? and longitudine = ? and anno = ? and foto.id_utente = utenti.id_utente', [lat, long, anno], (err, result) => {
        if (err) {
            console.log('Errore');
        }
        if (result) {
            res.send(result);
        } else {
            res.send({
                message: "Non sono stati trovati valori"
            })
        }
    });
})

app.get('/year', (req, res) => {

    db.query('select distinct anno from foto', (err, result) => {
        if (err) {
            console.log('Errore');
        }
        if (result) {
            res.send(result);
        } else {
            res.send({
                message: "Non sono stati trovati valori"
            })
        }
    });
})

app.get('/slider', (req, res) => {

    // Valori massimi e minimi dello slider in base al DB
    db.query('select MAX(anno) as max,MIN(anno) as min from foto', (err, result) => {
        if (err) {
            console.log('Errore');
        }
        if (result) {
            res.send(result);
        } else {
            res.send({
                message: "Non sono stati trovati valori"
            })
        }
    });
})

app.get('/foto/:id', (req, res) => {
    const id = req.params.id;

    // Eliminazione foto dell'utente dal DB
    db.query('delete from foto where id_utente = ?', [id], (err, result) => {
        if (err) {
            console.log('Errore');
        }
        if (result) {
            res.send(result);
        } else {
            res.send({
                message: "Non sono stati trovati valori"
            })
        }
    });
})


module.exports = app;