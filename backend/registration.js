const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const db = require('./dbConnection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotnev = require('dotenv');
const fs = require('fs');
const app = express();

dotnev.config({ path: './backend/.env' });
app.use(cors());
app.use(bodyparser.json());
const ACCESS_TOKEN_KEY = "920243ae1898061df9a0f699b7caa9feb3cad03c58d414d0b7ca1ee3d992efaf56e61c276c8c09f78f5af920098369623ecb3602cb6a824ce4fa85923a58f202";


app.post('/utenti/register', async (req, res) => {
    try {
        // Hashing della password inserita dall'utente
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const id = 0;
        const nome = req.body.nome;
        const cognome = req.body.cognome;
        const email = req.body.email;
        const password = hashedPassword;
        const ruolo = 'default';
        const avatar = req.body.avatar;

        db.query('insert into utenti(id_utente,nome,cognome,email,password,ruolo,avatar) values(?,?,?,?,?,?,?)',
            [id, nome, cognome, email, password, ruolo, avatar], (err, result) => {
                if (err) {
                    console.log(err.message);
                    res.status(500).send();
                }
                if (result) {
                    if (result.length > 0) {
                        const user = {
                            email: email,
                            ruolo: ruolo,
                        }
                        res.send({
                            data: user,
                        });
                    } else {
                        res.send({
                            data: 0
                        })
                    }
                }
            })
    } catch {
        res.status(500).send();
    }
})

app.get('/utenti/check/:email', (req,res)=>{
    const email = req.params.email;
    db.query('select * from utenti where email = ?', [email], (err,result) => {
        if(err){
            console.log('Errore');
        }
        if(result.length > 0){
            res.send({
                data: 0
            })
        } else {
            res.send({
                data: "Utente non esistente"
            }) 
        }
    });
})

app.get('/utenti/info/:id', (req,res)=>{
    const id = req.params.id;
    db.query('select nome,cognome,email,avatar from utenti where id_utente = ?', [id], (err,result) => {
        if(err){
            console.log('Errore');
        }
        if(result){
            res.send(result);
        } else {
            res.send({
                data: "Utente non esistente"
            }) 
        }
    });
})

app.put('/utenti/update', (req,res)=>{
    const nome = req.body.nome;
    const cognome = req.body.cognome;
    const id = req.body.id;
    
    db.query('update utenti set nome = ?, cognome = ? where id_utente = ?', [nome, cognome, id], (err,result) => {
        if(err){
            console.log('Errore');
        }
        if(result){
            res.send(result);
        } else {
            res.send({
                data: "Utente non esistente"
            }) 
        }
    });
})

app.post('/utenti/delete', (req,res)=>{
    const id = req.body.id;
    const email = req.body.email;

    db.query('delete from utenti where id_utente = ?', [id], (err,result) => { 
        if(err){
            console.log('Errore');
        }
        if(result){
            res.send(result);
        } else {
            res.send({
                message: "Non sono stati trovati valori" 
            }) 
        }
    });

    
    const path = `../src/assets/avatar/image_${email}.jpg`;

    fs.unlink(path, (error) => {
        if (error) {
            console.error(`Errore durante l'eliminazione del file: ${error}`);
        } else {
            console.log('Avatar eliminato con successo.');
        }
    });

})

module.exports = app;
