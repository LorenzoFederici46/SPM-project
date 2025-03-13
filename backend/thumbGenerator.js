const multer = require('multer');
const path = require('path');
const Jimp = require('jimp');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../src/assets/upload/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

function generateThumb(inputPath, outputPath, width, height) {
    try {
        Jimp.read(inputPath)
            .then((image) => {
                image.scaleToFit(width, height, Jimp.RESIZE_BEZIER);
                    image.write(outputPath);
            })
            .catch((error) => {
                console.error("errore nella lettura: ", error);
            });
        console.log('Thumbnail generata con successo!');
    } catch (error) {
        console.error("Errore durante la creazione dell'immagine:", error);
    }
}

const load = multer({ storage: storage });

module.exports = { load, generateThumb };