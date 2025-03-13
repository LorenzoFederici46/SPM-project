const multer = require('multer');
const path = require('path');
const Jimp = require('jimp');

// Storage per l'upload delle immagini
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../src/assets/upload/');
    },
    // Generazione dinamica dei nomi delle immagini inserite
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

function generateAvatar(inputPath, outputPath, width, height) {
    try {
        // Lettura e ridimensionamento dell'immagine
        Jimp.read(inputPath)
            .then((image) => {
                image.scaleToFit(width, height, Jimp.RESIZE_BEZIER);
                image.write(outputPath);
            })
            .catch((error) => {
                console.error("errore nel read: ", error);
            });
        console.log('Immagine ridimensionata con successo!');
    } catch (error) {
        console.error("Errore durante la ridimensione dell'immagine:", error);
    }
}

// Metodo per l'effettiva upload dell'immagine
const avload = multer({ storage: storage });

module.exports = { avload, generateAvatar };