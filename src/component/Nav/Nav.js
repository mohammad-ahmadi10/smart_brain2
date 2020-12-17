import React, { useRef, useEffect } from "react";
import ProfileCard from "../ProfileCard/ProfileCard.js";
import personIcon from "./person-icon.png";
import './Nav.css';


const Nav = (props) =>{
    const { setProActive, 
            isProActive , 
            onPageChange,
            currentUser,
            history,
            setIsProfileClicked,
            profileImg
           } = props;
    const forwardRef = useRef(null);
    const onClickImg = () =>{
        setProActive(!isProActive);    
    }
    
    useEffect(()=>{
        if(isProActive){
            forwardRef.current.classList.remove("profile-nav-section-deactive");
            forwardRef.current.classList.add("profile-nav-section-active");
        }else{
            forwardRef.current.classList.remove("profile-nav-section-active");
            forwardRef.current.classList.add("profile-nav-section-deactive");
        }
    },[isProActive])



    return (
        <div id="nav-container">
             <div className="proIcon">
                <h3>{currentUser.username}</h3>
                <img src={profileImg !== null? profileImg :  personIcon}
                     alt="profile icon" 
                     onClick={onClickImg}
                />
            </div>
            <ProfileCard profileImg={profileImg} 
                         personIcon={personIcon}
                         forwardRef={forwardRef} 
                         onPageChange={onPageChange} 
                         currentUser={currentUser}
                         history={history}
                         setIsProfileClicked={setIsProfileClicked}
            />
        </div>
    )
    
}



export default Nav;