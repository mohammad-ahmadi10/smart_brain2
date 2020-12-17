const express = require('express');
const router = express.Router();

const {schema} = require('../utilities/Password_validator');
const  {validator} = require("../utilities/Email_validator");
const {bcrypt, saltRounds} = require("../utilities/Bcrypt");

const {pool} = require("../db/db");

router.route("")
    .get((req, res) =>{
            res.status(200).json("register");
    })
    .post((req, res) =>{
        const {username, email, password} = req.body;
        const isEmailValid = validator.validate(email);
        const isPasswordVaild = schema.validate(password);

        

        if(isEmailValid && isPasswordVaild){
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashed_pass = bcrypt.hashSync(password, salt);
            insertIntoDB(res , username, email, hashed_pass);
        }else{
            res.status(404).json("no");
        }
})

const insertIntoDB = (res, username, email, hashed_pass) =>{
        (async ()=>{
            const client  = await pool.connect();

            try{
                await client.query('BEGIN')
                const queryPassText = 'INSERT INTO passwords (email, hashed_password) VALUES ( $1 , $2) RETURNING password_id';
                const insertPssValue = [email, hashed_pass];
                const result = await client.query(queryPassText, insertPssValue);

                const queryProfileText = 'INSERT INTO profiles ( profile_email)  VALUES ( $1) RETURNING profile_id'
                const insertProfileValues = [email]
                const profileResult =  await client.query(queryProfileText, insertProfileValues);

                const queryUserText = 'INSERT INTO users (username, email, rank, register_date, password_id, profile_id)  VALUES ( $1, $2,$3, $4, $5, $6) RETURNING user_id, rank'
                const insertUserValues = [username, email , 0, new Date(),  result.rows[0].password_id, profileResult.rows[0].profile_id]
                const resultOfUsersTable = await client.query(queryUserText, insertUserValues);
                const {user_id, rank} = resultOfUsersTable.rows[0];

                await client.query('COMMIT');
                res.status(200).json({"username":username, "user_id":user_id, "rank":rank, "email":email});
            
            }catch(e){
                await client.query('ROLLBACK')
                res.status(200).json("no");
                throw e
            
            }finally{
                client.release();
            }
        })().catch(e => console.error(e.stack))
}


module.exports = router;