const express = require('express');
const router = express.Router();
const {pool} = require("../db/db");
const {bcrypt, saltRounds} = require("../utilities/Bcrypt");


router.route("")
    .get((req, res) =>{
        res.status(200).json("reset");
    })
    .post( async (req, res) =>{
        const{tokenID, password} = req.body;        
        if(global.tokenID === tokenID){
           
            resetPassword(res, password)
        }
        else res.status(200).json({result: "token"});

    })

    const resetPassword = (res, password) =>{

        ( async () =>{
            const client = await pool.connect();
           
            try{
                await client.query("BEGIN");

                const selectTxt = 'SELECT password_id FROM users WHERE user_id = $1';
                const selectValue = [global.Id];

                const selectpasswordIdRes = await client.query(selectTxt, selectValue);
                const {password_id} = selectpasswordIdRes.rows[0];

                const selectHashedTxt = 'SELECT hashed_password FROM passwords WHERE password_id = $1';
                const selectHashedValue = [password_id];
                const selectHashedResponse = await client.query(selectHashedTxt, selectHashedValue);
                const {hashed_password} = selectHashedResponse.rows[0];

                const isPassThesame = bcrypt.compareSync(password, hashed_password);
                if(isPassThesame){
                    res.status(200).json({result: "same pass"});
                    
                }else{
                    const salt = bcrypt.genSaltSync(saltRounds);
                    const hashed_pass = bcrypt.hashSync(password, salt);

                    const updateTxt = 'UPDATE passwords SET hashed_password=$1 WHERE password_id = $2 RETURNING password_id';
                    const updateValue = [hashed_pass,password_id];
                    const response = await  client.query(updateTxt, updateValue);
                    if(response.rows[0].password_id)
                        res.status(200).json({result: "changed"});    
                }
               
                await client.query("COMMIT");
            }catch(e){
                await client.query("ROLLBACK");
                res.status(400).json({result: "server"});
            }
            finally{client.release()}

        })().catch(console.error)
    }


module.exports = router;