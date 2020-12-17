import React, { useCallback, useRef, useState } from 'react';
import "./PasswordReset.css";
import axios  from "axios";
import {useParams} from 'react-router-dom';
import * as Yup from 'yup';     
import {RiLockPasswordFill} from "react-icons/ri";
import { IconContext } from "react-icons";
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

const PasswordReset = ({history})=>{
    const [password, setPassword] = useState("");
    const resetSection = useRef(null);
    const {token} = useParams();
    

    const validationSchema = Yup.object().shape({
        password: Yup.string().min(8, 'Password must be at least 8 Characters').required('Password is required'),
        confirmPassword : Yup.string().oneOf([Yup.ref('password'), null], 'Password must match').required('Confirm Password is required'),
    });
    
    // functions to build form returned by useForm() hook
    const {register, handleSubmit, reset, errors} = useForm({
        resolver : yupResolver(validationSchema)
    })

    const onCommit = useCallback(async ()=>{
         axios.post("https://murmuring-chamber-76782.herokuapp.com/resetPassword",{
             password:password,
             tokenID:token,
         })
         .then(response =>{
             const {result} = response.data;

             if(response.status === 200){
                switch(result){
                    case "changed":
                        alert("Successfully changend")
                        setTimeout(() =>{       history.push("/")
                        window.location.reload()}, 200)
                    break;
                    case "token": 
                        resetSection.current.innerHTML = 
                            `<div id="not-macht-url">
                                    you have to be on the URL that we sent to your Email, 
                                    please check your Email or click on 
                                    <a class="link-to-forget" href="/forgetPasword">Link</a>
                                    if you want to reset your Password!
                            </div>`
                   break;
                   case "same pass":
                       alert("Sie haben das gleiche Pass eingeben");
                       break;
                   default: alert("etwas aussergewonliches passiert");  
                }
             }else{ 
                alert("server probleme aufgetreten");
             }
                       
             
         })
    },[history, password, token]);

    return(
        <div  id="reset-container">        
        <section ref={resetSection} className="reset-section">
                <div className="reset-text">
                    <h2>Reset Password</h2>
                    <hr/>
                    <p>Your password musst be atleast eight charackters long.</p>
                </div>
                <form onSubmit={handleSubmit(onCommit)} onReset={reset} className="reset-form"> 

                    <div className="margin-a">
                            <label htmlFor="password">PASSWORD</label>
                            <div className="inputs-section">
                                <IconContext.Provider value={{ size:'1.9rem', className: 'react-icons-reset' }}>
                                    <RiLockPasswordFill/>
                                </IconContext.Provider>
                                <input name="password" 
                                        className={`form-control reset-inputs ${errors.password ? 'is-valid': ''}`}
                                        type="password"
                                        placeholder="********"
                                        ref={register}/>  
                                <i className="fa fa-eye-slash" aria-hidden="true"></i>        
                            </div>
                            <div className="invalid-feedback-reset"> 
                                        {errors.password?.message}
                            </div>   
                                            
                    </div>            

                    <div className="margin-b">
                        <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
                            <div className="inputs-section">
                                <IconContext.Provider value={{ size:'1.9rem', className: 'react-icons-reset' }}>
                                    <RiLockPasswordFill/>
                                </IconContext.Provider>
                                <input name="confirmPassword" 
                                        className={`form-control reset-inputs ${errors.confirmPassword ? 'is-valid': ''}`}
                                        type="password"
                                        placeholder="********"
                                        ref={register}
                                        onChange={e => setPassword(e.target.value)}

                                />  
                                <i className="fa fa-eye-slash" aria-hidden="true"></i>            
                            </div>
                            <div className="invalid-feedback-reset"> 
                                        {errors.confirmPassword?.message}
                            </div> 
                             
                    </div> 
                    <div className="btn-section">
                        <button type="sumit" className="btn primary" >Reset password</button>
                    </div> 

                </form>           
        </section>
    </div>

    )
    
}

export default PasswordReset;
