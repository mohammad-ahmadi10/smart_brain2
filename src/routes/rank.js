const express = require('express');
const router = express.Router();
const Clarifai = require('clarifai');
const {pool} = require("../db/db");

const app = new Clarifai.App({
    apiKey: process.env.KEY
}); 


router.route("")
    .post(async  (req, res) =>{
        const {userId, imageUrl} = req.body;
        setTimeout(async()=>{
            try{
                app.models.predict(process.env.MODEL, imageUrl).then(
                    function(response){
                            updateRank(res, response.outputs[0].data.regions, userId);
                        },
                    function (err) { console.log(err) }
                ) 
            }
            catch(error){res.status(400).json(error)}
        }, 100)
})


const updateRank = async (res, regions , userId) =>{
    (async () =>{
        const client = await pool.connect();
        try{
            await client.query('BEGIN');
            const querySelectText = 'SELECT rank FROM users WHERE user_id = $1';
            const querySelectValue = [userId];
            const result = await client.query(querySelectText, querySelectValue);

            let {rank} = result.rows[0];

            const queryUpdateText = 'UPDATE users SET rank = $1 WHERE user_id = $2 RETURNING rank';
            const queryUpdateValues = [++rank, userId];
            const newRank = await client.query(queryUpdateText, queryUpdateValues);
            
            
            await client.query('COMMIT');
            res.status(200).json({userId:userId ,
                                  rank: newRank.rows[0].rank, 
                                  regions:regions, 
                                });
        }
        catch(e) {
            await client.query('ROLLBACK');
            res.status(400).json("no");
            throw e;
        }
        finally{ client.release()}
    })().catch(console.error)
}

module.exports = router;