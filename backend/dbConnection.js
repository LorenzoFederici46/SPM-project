const mysql = require('mysql2');
const dotnev = require('dotenv');

dotnev.config({path: './backend/.env'});

    const db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "lorenzo",
        database: "spm",
        port: "3306"
});

    db.connect((error) => {
        if(error){
            console.log('Connection error!' + error.message);
           
        } else {
            console.log('Database succesfully connected!');
    }
})

module.exports = db;