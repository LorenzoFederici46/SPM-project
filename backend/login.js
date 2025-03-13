const express = require('express');
const authenticationCheck = require('./authMiddleware')
const bodyparser = require('body-parser');
const cors = require('cors');
const db = require('./dbConnection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotnev = require('dotenv');
const app = express();

dotnev.config({ path: './backend/.env' });
app.use(cors());
app.use(bodyparser.json());

const ACCESS_TOKEN_KEY = "920243ae1898061df9a0f699b7caa9feb3cad03c58d414d0b7ca1ee3d992efaf56e61c276c8c09f78f5af920098369623ecb3602cb6a824ce4fa85923a58f202";

// End-point per il login per l'utente
app.post('/utenti/login', async (req, res) => {
    const email = req.body.email;
    try {
        // Ottengo l'email dell'utente che vuole effettuare il login 
        db.query('select * from utenti where email = ?', [email], async function (err, result) {
            if (err) {
                console.log(err.message);
                res.status(500).send();
            }
            if (result.length > 0) {
                // Controllo se la password in input corrisponde a quella salvatata nel DB
                if (await bcrypt.compare(req.body.password, result[0].password)) {
                    const user = {
                        id: result[0].id_utente,
                        email: result[0].email,
                        ruolo: result[0].ruolo,
                    }
                    // Con esito positivo viene assegnato il token di sessione
                    const token = jwt.sign(user, ACCESS_TOKEN_KEY, { expiresIn: '1h' });
                    res.send({
                        data: user,
                        token: token
                    })
                }
                else {
                    res.send({
                        data: 0
                    })
                }
            }
            else {
                res.send({
                    data: 0
                })
            }
        })
    } catch {
        res.status(500).send()
    }
})

// Verifica del possesso del token di sessione
app.get('/utenti/verifica', (req, res) => {
    const token = req.body.token;
    try {
        // Verifica e decodifica il token
        const decoded = jwt.verify(token, ACCESS_TOKEN_KEY);
        res.send({
            data: 1
        })
      } catch (error) {
        // Il token non è valido
        res.send({
            data: 0
        })
      }
})

module.exports = app;