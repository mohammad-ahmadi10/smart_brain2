import React, { useCallback, useEffect } from 'react';

import './Register.css';
import Tilt from 'react-tilt';
import axios from 'axios';
import {GoDiffRenamed} from "react-icons/go";
import { IconContext } from "react-icons";
import { navigate } from 'hookrouter';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';    
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {MdEmail} from "react-icons/md";
import {RiLockPasswordFill} from "react-icons/ri";

const validationSchema = Yup.object().shape({
    username : Yup.string().required('username is required'),
    email : Yup.string().required("Email is Valid").email("Email is invalid"),
    password: Yup.string().min(6, 'Password must be at least 6 Characters').required('Password is required'),
    confirmPassword : Yup.string().oneOf([Yup.ref('password'), null], 'Password must match').required('Confirm Password is required'),
    acceptTerms : Yup.bool().oneOf([true], 'Accept Ts & Cs is required')
});


const iconsOptions= {
	reverse:        true,  // reverse the tilt direction
	max:            2.5,     // max tilt rotation (degrees)
	perspective:    1000,   // Transform perspective, the lower the more extreme the tilt gets.
	scale:          1.02,      // 2 = 200%, 1.5 = 150%, etc..
	speed:          10000,    // Speed of the enter/exit transition
	transition:     true,   // Set a transition on enter/exit.
	axis:           null,   // What axis should be disabled. Can be X or Y.
	reset:          true,    // If the tilt effect has to be reset on exit.
	/* easing:         "cubic-bezier(.03,.98,.52,.99)" */   // Easing on enter/exit.
}


const setSessionStorage = (username, rank, user_id, email) =>{
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("rank", rank);
    sessionStorage.setItem("user_id",user_id);
    sessionStorage.setItem("email", email);
}
const Register = ({history}) =>{
    
    useEffect(()=>{
        let html = document.getElementsByTagName("html");
        html[0].classList.add("backgroundImage");
    },[])
    
    // functions to build form returned by useForm() hook
    const {register, handleSubmit, reset, errors} = useForm({
        resolver : yupResolver(validationSchema)
    })

    const  onSubmit = useCallback(async (data) => {
        const {username, password, email} = data;
        const lowerEmail = email.toLowerCase();
        axios.post('https://murmuring-chamber-76782.herokuapp.com/register', {
            
                username, 
                email: lowerEmail, 
                password
        }).then(res =>{
            const {username, rank, user_id, email} = res.data;
            if(user_id){
                setTimeout(()=> {
                    setSessionStorage(username, rank, user_id , email)
                    navigate('/main');  
                    history.push("/main");
                    window.location.reload(); 
                }, 1000) 
            }else{
                alert("couldn't register, please inter a valid Email and password")
            }
        })
    }, [history]);
    

    return (
           <div className="sign-page">
                <div className="container-fluid-register">
                        <Tilt className="tilt" options={iconsOptions} >
                        <div className="container-register">
                            <div className="title-container-register">
                                <h3>Register your Account</h3>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} onReset={reset} className="register-form"> 
                                    <div className="margin-b">
                                        <label htmlFor="username">USERNAME</label>
                                        <div className="inputs-section">
                                            <IconContext.Provider value={{ size:'1.9rem', className: 'react-icons-register' }}>
                                                <GoDiffRenamed/>
                                            </IconContext.Provider>
                                            <input name="username" 
                                                   className={`form-control reigster-inputs ${errors.username ? 'is-valid': ''}`} 
                                                   type="text"
                                                   placeholder="your username"
                                                   ref={register}
                                            />
                                        </div>
                                        <div className="invalid-feedback"> 
                                                  {errors.username?.message}
                                        </div>           
                                    </div>     
       
                            
                                
                                    <div className="margin-b">
                                        <label htmlFor="email">EMAIL</label>
                                        <div className="inputs-section">
                                            <IconContext.Provider value={{ size:'1.9rem', className: 'react-icons-register' }}>
                                                <MdEmail/>
                                            </IconContext.Provider>
                                            <input name="email" 
                                                   className={`form-control reigster-inputs ${errors.email ? 'is-valid': ''}`} 
                                                   type="email"
                                                   placeholder="example@gamil.com"
                                                   ref= {register}       
                                            />
                                        </div>
                                        <div className="invalid-feedback"> 
                                                  {errors.email?.message}
                                        </div>
                                    </div>            
                                
                                
                                    <div className="margin-b">
                                        <label htmlFor="password">PASSWORD</label>
                                        <div className="inputs-section">
                                            <IconContext.Provider value={{ size:'1.9rem', className: 'react-icons-register' }}>
                                                <RiLockPasswordFill/>
                                            </IconContext.Provider>
                                            <input name="password" 
                                                   className={`form-control reigster-inputs ${errors.password ? 'is-valid': ''}`}
                                                   type="password"
                                                   placeholder="********"
                                                   ref={register}/>  
                                            <i className="fa fa-eye-slash" aria-hidden="true"></i>        
                                        </div>
                                        <div className="invalid-feedback"> 
                                                  {errors.password?.message}
                                        </div>   
                                        
                                    </div>            

                                    <div>
                                    <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
                                        <div className="inputs-section">
                                            <IconContext.Provider value={{ size:'1.9rem', className: 'react-icons-register' }}>
                                                <RiLockPasswordFill/>
                                            </IconContext.Provider>
                                            <input name="confirmPassword" 
                                                   className={`form-control reigster-inputs ${errors.confirmPassword ? 'is-valid': ''}`}
                                                   type="password"
                                                   placeholder="********"
                                                   ref={register}
                                            />  
                                            <i className="fa fa-eye-slash" aria-hidden="true"></i>            
                                        </div>
                                        <div className="invalid-feedback"> 
                                                  {errors.confirmPassword?.message}
                                        </div>   
                                        
                                    </div>            
                                
                                    <hr/>
                                    <label>
                                        <input type="checkbox"  name="acceptTerms" style={{marginRight:"5px"}}
                                               ref={register}   className={`${errors.acceptTerms ? 'is-valid': ''}`}
                                        /> 
                                            I agree with the <Link className="linkTag" to="/TermsAndConditions">Terms and Conditions</Link>.
                                    </label>
                                    <div className="invalid-feedback">{errors.acceptTerms?.message}
                                    </div>

                                    <div className="btn-container-register">
                                        <div className="btn-section">
                                        <button type="sumit" className="btn btn-default regbutton" >Register</button>
                                        </div>
                                        <div>
                                            <p>Already have a Account  <Link className="linkTag" to="/login">Sign in</Link></p>         
                                        </div>          
                                    </div>    
                            </form>
                        </div>
                    </Tilt>
                </div>
            </div>
            
            
        
        
        
        )


}

export default Register;