const express = require('express');
const router = express.Router();
const {pool} = require("../db/db");
const fs = require('fs');
const path = require('path');

router.route("")
    .get((req, res) =>{
        res.status(200).json("profile");
    })
    .post((req, res) =>{ 
        const {userId, image} = req.body;
        console.log(makeDirectory(userId));
        const imageDir = storeImage(makeDirectory(userId),image);
        
        getUserFromDB(res ,userId, imageDir);      
    }); 


const getUserFromDB = (res, userId, imageDir) =>{
     // Load hash from your password DB.
     (async ()=>{
        const client  = await pool.connect();

        try{
            await client.query('BEGIN')
            
            const queryUserText = 'SELECT profile_id FROM users WHERE user_id = $1';
            
            const valueUserText = [userId];
            const profileIDResult = await client.query(queryUserText, valueUserText);

       
            const queryProfileText = 'UPDATE profiles  SET profile_image = $1  WHERE profile_id = $2';
            const valueProfileText = [imageDir , profileIDResult.rows[0].profile_id]
            await client.query(queryProfileText, valueProfileText);
            
            res.status(200).json({userID : userId})
            await client.query('COMMIT');
        }catch(e){
            await client.query('ROLLBACK')
            res.status(400).json({userID: -1});
            throw e
        }finally{
            client.release();
        }
    })().catch(e => console.error(e.stack))

 
}

const makeDirectory = (userId) =>{
    let dir = path.join( __dirname, "profiles" , "userid_" + userId )
    try{
       fs.mkdirSync(dir);
       console.log("directory successfully created");
       return dir
    }
    catch(err){
        if (err && err.code == 'EEXIST'){
            console.log("folder is already exits")
            return dir
        }
        else{
            console.log(err)
            return null
        }
    }


}

const storeImage = (directory, croppedImage) =>{
    let file = `${directory}/profile.txt`;
    fs.writeFileSync(file , croppedImage, err=>{
        if(err) console.log(err);
        console.log("successfully is the file created");
    })
    return file;
}


module.exports = router;