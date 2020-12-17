import React,{useState, useEffect, useRef} from 'react';
import axios from 'axios';
import Particles from "react-tsparticles";
import './Main.css';

import Nav from '../Nav/Nav.js';
import Icon from '../Icon/Icon.js';
import InfoRank from '../InfoRank/InfoRank.js';
import Input from '../Input/Input.js';
import PhotoRender from '../PhotoRender/PhotoRender.js';
import badFile from "../badfile.png";
import Profile from "../Profile/Profile.js";

import urlExists from 'url-exists';


const colors = ["#fff",
"#FFD700", 
"#D2691E",
"#48D1CC",
"#4682B4",
"#DA70D6",
"#663399",
"#778899"
]


const Main = ({history}) =>{
    const [isProActive, setProActive] = useState(false);
    const [photoUrl, setPhotoUrl] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [boxes , SetBoxes] = useState([]);
    const [isImageDetected, setIsImageDetected] = useState(false);
    const [rank, setRank] = useState(0);
    const [userId, setUserId] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");   
    const [isProfileClicked, setIsProfileClicked] = useState(false);
    const [profileImg , setProfileImg] = useState("");

    const goButtonForward = useRef(null);

    let url = inputValue;
    let numOfFaces = 0;
    let faces = [];

    const costumParticles = {
      fpsLimit: 25,
      interactivity:{
       
        events:{
          onClick:{
            enable: true,
            mode: "push"
          },
          onHover:{
            enable: true,
            mode: ["repulse"]
          },
          resize: true
        },
        modes:{
          repulse:{
            distance: 100,
            duration: 2,
            opacity: 0.8,
            size: 100,
            
          },
          push:{
            quantity: 2
          },
          grap:{
            distance: 100
          }
          
        }
      },
      particles:{
        color:{
          value: colors
        },
        links:{
          color: {
            value: colors[0]
          },
          distance: 150,
          enable: true,
          opacity: 0.3,
          width: 1
        },
        collisions:{
          enable: true
        },
        move:{
          direction: "none",
          enable: true,
          outMode: "bounce",
          random: true,
          speed: 4,
        },
        number:{
          density: {
            enable: true,
            value_area: 800,
          },
          value: 50
        },
        opacity: {
          value: 0.52,
          random: false,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 4,
          random: true,
          anim: {
            enable: true,
            speed: 12,
            size_min: 0.1,
            sync: true
          }
        }
      },
      detectRetina: true
  
  }

    const showGoButton = (right, translate, visibility, opacity, zIndex, goButtonForward) =>{
      const button = goButtonForward.current;
      button.style.position = "absolute";
      button.style.right= right;
      button.style.transform = translate;
      button.style.visibility = visibility;
      button.style.opacity = opacity;
      button.style.zIndex= zIndex;
  }

  //load from session the storeged Info about current User
  const getUserStorage = () =>{
    return {
      userId:  sessionStorage.getItem("user_id"),
      username: sessionStorage.getItem("username"),
      email:  sessionStorage.getItem("email"),
      rank:  sessionStorage.getItem("rank"),
      profile: sessionStorage.getItem("profile")
    }
  }

  useEffect(()=>{
    let html = document.getElementsByTagName("html");
    html[0].classList.remove("backgroundImage");
    html[0].style.backgroundColor = "crimson";

    setRank(getUserStorage().rank);
    setEmail(getUserStorage().email);
    setUsername(getUserStorage().username);
    setUserId(getUserStorage().userId);
    setProfileImg(getUserStorage().profile)
  },[])

  const calculateCorners = (result) =>{
    const img = document.getElementById("imgUrl");
    const width = Number( img.width);
    const height = Number(img.height);
    

        for(let i=0; i < numOfFaces; i++){
             
             let clarifaiFace =  result[i].region_info.bounding_box;
          
             let box = {
              left: (clarifaiFace.left_col * width),
              right: width - clarifaiFace.right_col * width,
              top: clarifaiFace.top_row * height,
              bottom: (height*1.009) - (clarifaiFace.bottom_row * height)
              };
             faces.push(box);          
        }
      return faces;
    }



  function  removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
  }
  
  useEffect(()=>{
    faces.slice(0, faces.length)
    removeElementsByClass("bound_box");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[photoUrl])

  
  

  const onSumit = async () =>{
    
        setTimeout( async ()=>{
          setPhotoUrl("");
          setPhotoUrl(url);
          axios.post('https://murmuring-chamber-76782.herokuapp.com/rank', {
              userId: getUserStorage().userId,
              imageUrl: url
          })
          .then(response => {
                const {rank} = response.data;
                sessionStorage.setItem('rank', rank); 
                setRank(rank);   
                numOfFaces =  response.data.regions.length;
                SetBoxes(calculateCorners(response.data.regions));
          })
        }, 300);
        setPhotoUrl(badFile);
 
    document.getElementById("urlInput").value = "";
    document.getElementsByClassName("chooseFileButton")[0].classList.remove("deaktive-image-uploader");
    showGoButton("22%", "translate(0, 0)", "hidden", "0","-1", goButtonForward);
    setIsImageDetected(true);
    setTimeout( async () => setIsImageDetected(false), 50);
  }
  

    if(userId){
      return(
        <div id="default-section" onClick={(event) => {
              if (event.target.className === "tsparticles-canvas-el")
              setProActive(false); 
              }}>
              <Profile 
                    userId={userId} 
                    isProfileClicked={isProfileClicked} 
                    setIsProfileClicked={setIsProfileClicked}
                    setProfileImg={setProfileImg}
                    profileImg={profileImg}
              />
              <Nav isProActive={isProActive} 
                   setProActive={setProActive} 
                   currentUser={{ email, username }}
                   history={history}
                   setIsProfileClicked={setIsProfileClicked}
                   profileImg={profileImg}
              /> 
              <PhotoRender photoUrl={photoUrl} 
                           boxes={boxes} 
                           isImageDetected={isImageDetected}
              />     
              <Input onSumit={onSumit}  
                     setInputValue={setInputValue} 
                     showGoButton={showGoButton}
                     goButtonForward={goButtonForward}
              />   
              <InfoRank currentUser={{ username, rank }}
              />
              <Icon/>
              <Particles 
                id="tsparticles"
                options={costumParticles}
              />
        </div>
      )
    }else return (<p>Not found </p>)
   
  
}

export default Main;