const {createPool} = require('mysql');
const express = require('express');
const cors = require("cors");
const bcrypt = require('bcrypt');

const saltRounds = 10;

const app = express();
app.use(express.json());
app.use(cors());

const pool = createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"testing",
    connectionLimit: 10
})

// pool.query('select * from users', (err,result, fields) => {
//     if(err){
//         return console.log(err);
//     }return console.log(result);
// })

// pool.query('INSERT INTO users (userName, password) VALUES ("suresh", "vvdhbdjkdk")', (err,result, fields) => {
//     if(err){
//         return console.log(err);
//     }return console.log(result);
// })

app.post('/register', (req, res) =>{

    const userName = req.body.userName;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) =>{
        if(err){
            console.log(err);
        }
        pool.query(
            "INSERT INTO users (userName, password) VALUES (?,?)",
            [userName, hash],
            (err,result) => {
                console.log(err);
            }
        );
    })
    
});

app.post('/login', (req, res) =>{

    const userName = req.body.userName;
    const password = req.body.password;

    pool.query(
        "SELECT * FROM users WHERE userName = ?;",
        userName,
        (err,result) => {
            if(err){
                res.send({err: err})
            }
            if(result.length > 0){
                bcrypt.compare(password, result[0].password, (error,response) => {
                    if(response){
                        res.send(result)
                    }else{
                        res.send({message: "Wrong combination entered"});
                    }
                })
            }else{
                res.send({message: "User doesn't exist"});
            }
        }
    );
});

app.listen(3001, () => {
    console.log("running on port 3001");
});