const express = require('express');
const router = express.Router();

const {bcrypt} = require("../utilities/Bcrypt");
const {pool} = require("../db/db");
const fs = require("fs");
const Buffer = require('buffer/').Buffer;

router.route("")
    .get((req, res) =>{
        res.status(200).json("siginin");
    })
    .post((req, res) =>{
        const {email, password} = req.body;
        getUserFromDB(res ,email, password);      
    }); 


const getUserFromDB = (res, email, password) =>{
     // Load hash from your password DB.
     (async ()=>{
        const client  = await pool.connect();

        try{
            await client.query('BEGIN')
            
            const queryUserText = 'SELECT password_id, user_id, rank, username, profile_id FROM users WHERE email = $1';
            const valueUserText = [email];
            const emailResult = await client.query(queryUserText, valueUserText);
            
            const {password_id, user_id, rank, username, profile_id} = emailResult.rows[0];

            const queryPassText = 'SELECT hashed_password FROM passwords WHERE password_id = $1';
            const valuePassText = [password_id];
            const passResult = await client.query(queryPassText, valuePassText);
           
            const {hashed_password} = passResult.rows[0];
            const isPasswordVaild = bcrypt.compareSync(password, hashed_password); 

            const queryProfileText = 'SELECT profile_image FROM profiles WHERE profile_id= $1'
            const valueProfileText = [profile_id]
            const profileResponse = await client.query(queryProfileText, valueProfileText);
            let img64 = null;
            let profileImage = null;
            if(profileResponse.rows[0].profile_image){
                profileImage = profileResponse.rows[0].profile_image;
                img64 = await convertingBufferToBase64(profileImage);
            }

            setTimeout( async () =>{
                
            if(isPasswordVaild){
                const response = {  "username":username, 
                                    "user_id":user_id, 
                                    "rank":rank, 
                                    "email":email,
                                    "profileImg": img64
                                }
                res.status(200).json(response)
            }
            else res.status(400).json("invalid password");
            await client.query('COMMIT');
            
            }, 100)
        }catch(e){
            await client.query('ROLLBACK')
            res.status(400).json("invalid email");
            throw e
        }finally{
            client.release();
        }
    })().catch(e => console.error(e.stack))

    const convertingBufferToBase64 = async (path) =>{
        const decimalImg = fs.readFileSync(path);
        let buffer = Buffer.from(decimalImg);
        let img64 = buffer.toString();
        return img64;
    }
 
}


module.exports = router;