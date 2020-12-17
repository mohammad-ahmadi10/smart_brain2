import React,{ useRef} from 'react';
import "./ProfileCard.css";
import { Link } from 'react-router-dom';

const ProfileCard = (props) =>{
        const { profileImg, 
                forwardRef, 
                currentUser,
                setIsProfileClicked,
                personIcon
            } = props;

        const editSpan = useRef(null);

        const addEdit = () =>{
            editSpan.current.classList.remove("deactive-edit-span");
            editSpan.current.classList.add("active-edit-span");
        }
        const removeEdit = ()=>{
            editSpan.current.classList.remove("active-edit-span");
            editSpan.current.classList.add("deactive-edit-span");
        }

        const onChangeProfile = () =>{
            setIsProfileClicked(true)
        }
        return(
            <div id="profile-nav-section" className="profile-nav-section-deactive" ref={forwardRef}>
                 <div className="profile-container">
                            <div className="profile-image-container" onClick={onChangeProfile} onMouseEnter={addEdit} onMouseOut={removeEdit}>
                                <img src={profileImg !== null ? profileImg :  personIcon}
                                        alt="profile icon"
                                        
                                />
                                <div id="edit-container"><span ref={editSpan} className="deactive-edit-span">Edit</span></div>
                            </div>
                        
                        
                        <div className="profile-texts">
                            <p className="profile-username">{currentUser.username}</p>
                            <p className="profile-email">{currentUser.email}</p>
                            <Link className="profile-signOut" to="/login" onClick={() => sessionStorage.clear()}>Sign out</Link>
                        </div>
                </div> 
            </div>
           
        )
}


export default ProfileCard;

