const jwt = require('jsonwebtoken');
const dotnev = require('dotenv');

dotnev.config({path: './backend/.env'});

const authenticationCheck = (req, res, next) => {
    const header = req.headers.authorization
    if(!header) {
        return res.status(403).json({
            message: 'non si possiede il token di accesso'
        })
    }
    else {
        const token = (header.split(' '))[1];
        if(token) {
            jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, data) => {
                if(err) {
                    return res.status(403).json({
                        message: 'ERRORE'
                    })
                }
                else {
                    const ruolo = data.ruolo;
                    const id_utente = data.id;
                    res.locals.auth = {
                        id_utente,
                        ruolo
                    }
                    next()
                }
            });
        } 
        else {
            return res.status(403).json({
                message: 'non si possiede il token di accesso'
            })
        }
    }
}

module.exports = authenticationCheck;