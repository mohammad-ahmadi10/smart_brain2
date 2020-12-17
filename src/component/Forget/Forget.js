import React, { useRef, useState } from 'react';
import "./Forget.css";
import axios  from "axios";

import { IconContext } from "react-icons";
import {TiArrowBack} from "react-icons/ti";

const Forget = ()=>{
    const [email, setEmail] = useState("");
    const forgetContainer = useRef(null);
    const lowerEmail = email.toLowerCase();
    const errorContainer = useRef(null);

    const onCommit = async ()=>{
         axios.post("https://murmuring-chamber-76782.herokuapp.com/forget",{
             email:lowerEmail
         })
         .then(response =>{
             const {resetId} = response.data;
             if(resetId !== -1){
                 setTimeout(() =>{
                    forgetContainer.current.innerHTML = "";
                    forgetContainer.current.innerHTML = `<div> a reset email is sent to you <br/> Please check your email
                                                            
                                                        </div>`   
                 }, 500)
                           
             }else{
                 errorContainer.current.innerHTML = "no user with this email, please entir your Email";
                    
             }
         })
    }


    return(
        <div  id="forget-container">        
             <IconContext.Provider value={{ size:'1.9rem', className: 'react-icon-back' }}>
                    <a href="/login"><TiArrowBack/></a>
            </IconContext.Provider>
            <section ref={forgetContainer}  className="forget-section">

                    <div className="forget-text">
                        <h2>Recover Password</h2>
                        <hr/>
                        <p>Don't worry,happens to the best of us</p>
                    </div>
                    
                    <div  className="forget-input">
                        <p>Your Email</p>
                        <input  type="text" 
                                placeholder="example@gmail.com"
                                onChange={e=> setEmail(e.target.value)} />
                        <div ref={errorContainer} 
                             className="error-container">
                        </div>
                        
                        <input  type="button" 
                                defaultValue="email me a recovery Link"
                                onClick={onCommit}/>
                    </div>
            </section>
        </div>

    )
    
}

export default Forget;
