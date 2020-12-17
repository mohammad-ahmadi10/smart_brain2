import React,{useEffect, useRef} from 'react';

import './Login.css';
import { IconContext } from "react-icons";
import {MdEmail} from "react-icons/md";
import {RiLockPasswordFill} from "react-icons/ri";

import { Link } from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';



const Login = ({history}) =>{
    const emailErr = useRef(null);
    const passwordErr = useRef(null);

    useEffect(()=>{
        let html = document.getElementsByTagName("html");
        html[0].classList.add("backgroundImage");
    })
    const validationSchema = Yup.object().shape({
        email: Yup.string()
               .required('Email is required')
               .email('Email is invalid'),
        password: Yup.string()
                  .required('Password is required')
    })

    const {register, handleSubmit, reset, errors} = useForm({
        resolver: yupResolver(validationSchema)
    })

    const onSubmit = async (data) =>{
        const {email, password} = data;
        const lowerEmail = email.toLowerCase();

        const res = await fetch("https://murmuring-chamber-76782.herokuapp.com/signin", {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                email: lowerEmail,
                password
            })
        })
        const result = await res.json();
        
        if(result.user_id){
            sessionStorage.setItem("username", result.username);
            sessionStorage.setItem("rank", result.rank);
            sessionStorage.setItem("user_id", result.user_id);
            sessionStorage.setItem("email", result.email);
            sessionStorage.setItem("profile", result.profileImg)
            setTimeout(() =>{       history.push("/main")
            window.location.reload()}, 100)
     
        }else if(result === "invalid password"){
            emailErr.current.innerHTML = "";
            passwordErr.current.innerHTML = "invalid password";
        }else if(result === "invalid email"){
            passwordErr.current.innerHTML = "";
            emailErr.current.innerHTML = "this email is not registerd by us <br/> " +
                                                             "please give a valid email or click on sign up to be part of us";
        }
    }


    return (
           <div className="sign-page">
                <div className="container-fluid">
                    
                        <div className="container-login">
                            <div className="title-container">
                                <h3>Log in To Your Account</h3>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} onReset={reset} className="login-form"> 
                                    <div className="margin-b">
                                        <label htmlFor="email">EMAIL</label>
                                        <div className="inputs-section">
                                            <IconContext.Provider value={{ size:'1.9rem', className: 'react-icons' }}>
                                                <MdEmail/>
                                            </IconContext.Provider>
                                            <input name="email" 
                                                   className={`form-control login-inputs ${errors.email ? 'is-valid':''}`}
                                                   type="email" 
                                                   placeholder="example@gmail.com"
                                                   ref={register}
                                            />             
                                        </div>
                                        <div ref={emailErr} className="invalid-feedback" > 
                                                  {errors.email?.message}
                                        </div> 
                                    </div>            
                                
                                
                                    <div>
                                        <label htmlFor="password">PASSWORD</label>
                                        <div className="inputs-section">
                                            <IconContext.Provider value={{ size:'1.9rem', className: 'react-icons' }}>
                                                <RiLockPasswordFill/>
                                            </IconContext.Provider>
                                            <input name="password" 
                                                   className={`form-control login-inputs ${errors.password ? 'is-valid':''}`}
                                                   type="password" 
                                                   placeholder="************"
                                                   ref={register}
                                            />
                                            <i className="fa fa-eye-slash" aria-hidden="true"></i>             
                                        </div>
                                        <div ref={passwordErr} className="invalid-feedback"> 
                                                  {errors.password?.message}
                                        </div> 
                                    </div>            

                                    <div className="forget-password-container">
                                        <Link className="linkTag" to="/forgetPasword" >forget password?</Link>
                                    </div>

                                    <div className="margin"></div>
                                    <hr/>
                                    <div className="btn-container">
                                        <div className="btn-section">
                                        <button className="btn btn-default regbutton">Login</button>
                                        </div>
                                        <div >
                                            <p>Don't have a account ?  <Link className="linkTag" to="/register">Sign up</Link></p>         
                                        </div>          
                                    </div>    
                            </form>
                        </div>
                </div>
            </div>
            
        
        
        
        )


}

export default Login;