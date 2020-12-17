const express = require('express');
const router = express.Router();
const {pool} = require("../db/db");
const generateUniqueId = require('generate-unique-id');
const nodemailer = require("nodemailer");


const transprot = nodemailer.createTransport( { 
    service: 'gmail',//smtp.gmail.com  //in place of service use host...
    secure: false,//true
    auth: {
        user:process.env.OWNEMAIL,
        pass:process.env.PASSWORD
    }, tls: {
    rejectUnauthorized: false
  }
})

const token = generateUniqueId({
    length: 40,
});






router.route("")
    .get((req, res) =>{
    res.status(200).json("forget");
    })
    .post( async (req, res) =>{
        const {email} = req.body;
        checkTheUser(res ,email);
    })

const checkTheUser = async (res ,email) =>{
    (async () =>{ 
        const client = await pool.connect();

        try{
            await client.query("BEGIN")
            
            const querySelectUser = 'SELECT user_id,username FROM users WHERE email = $1';
            const valueSelectUser = [email];
            const response = await client.query(querySelectUser, valueSelectUser);
            
            const {user_id, username} = response.rows[0];
            if(user_id){
                
                for(let i = 0; i < 5; i++){
                    global.tokenID = token;
                    global.Id = user_id;
                }
                res.status(200).json({resetId: user_id});
                sendEmail(email, username);
            }
            await client.query("COMMIT")
        }catch(e){
            await client.query("ROLLBACK")
            res.status(200).json({resetId: -1});
        }
        finally{client.release()}

    })().catch(console.error)


     const sendEmail = (email, username) =>{          
       const mailOptions = {
            from: process.env.OWNEMAIL,
            to: email,
            subject:'reseting your password',
            html: ` this Email is sent to you because you want to change your password 
                    <br/>please click on this Link in order to reset your password
                    <a href="https://cryptic-bastion-84659.herokuapp.com/passwordReset/${token}"><strong>Link</strong></a>
                    if you are not ${username} please ignore this Email`
        }

        transprot.sendMail(mailOptions, (err, info) =>{
            if(err){
                console.log(err)
            }else{
                console.log('Email sent: ' +info.response);
            }
        })
    } 

}



module.exports = router;