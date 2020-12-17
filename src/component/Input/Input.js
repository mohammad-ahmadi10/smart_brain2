import React,{useCallback, useRef, useState} from 'react';
import "./Input.css";
import ImageUploader from 'react-images-upload';
import firebase from "./firebase";

// eslint-disable-next-line no-useless-escape
const urlRegEx = new RegExp(/(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg))/);


const  Input  = (props) =>  {
    

const UploaderStyle = {width:"60%",
height:"100%",
minWidth:"200px",
margin:"0", 
borderRadius: "30px", 
flexDirection:"row", 
justifyContent:"center", 
backgroundImage:"linear-gradient(to bottom,#ED872D 2%,#C32148 98%)", 
boxShadow: "0px 0px 20px 10px rgba(194, 179, 43, 0.293)",
}

const {
        onSumit,
        setInputValue, 
        showGoButton,
        goButtonForward,
    } = props;
    
   const urlInputRef =useRef(null);
   const putContainerRef = useRef(null);
   const putButtonRef = useRef(null);
   const [pic, setPic] = useState("");

   const onDrop = (picture) =>{
        if(picture.length < 1) return;
        setPic(picture);
        uploadImage(picture);
    }

    const changeImageOnInputChange = useCallback(()=>{
        const urlInput = urlInputRef.current;
        let chooseAndUploadBtn = document.getElementsByClassName("chooseFileButton")[0]; 
        //visibility the Button by entering value 
        if(urlRegEx.test(urlInput.value)){
            showGoButton("15%", "translate(55%, 0)", "visible", "1","1",goButtonForward);
            chooseAndUploadBtn.classList.add("deaktive-image-uploader");
        }else{
            showGoButton("8%", "translate(55%, 0)", "hidden", "0","-1",goButtonForward);
            if(chooseAndUploadBtn.classList.contains("deaktive-image-uploader")){
                chooseAndUploadBtn.classList.remove("deaktive-image-uploader");
            }
        }
    }, [goButtonForward, showGoButton]);

    const uploadImage = (picture) =>{
        if(typeof picture[0].name === 'undefined')return;
        let bucetName = "images";
        let pictures = picture[0];
        let storageRef = firebase.storage().ref(`${bucetName}/${pictures.name}`);
        let uploadTask = storageRef.put(pictures);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, 
            () =>{
                // eslint-disable-next-line no-unused-vars
                let donwloadURL = uploadTask.snapshot.donwloadURL;
            }); 
            
            let putButtonWrapper = putContainerRef.current;
            let putButton = putButtonRef.current;
        
        if (putButton.classList.contains("deaktive-put-putton")) {
                putButton.classList.remove("deaktive-put-putton");
              }
        if (putButtonWrapper.classList.contains("deaktive-put-putton")) {
            putButtonWrapper.classList.remove("deaktive-put-putton");
            putButtonWrapper.classList.add("active-background")
          }        
    }

    
    const putURL = useCallback(() => {
        setTimeout(async ()=>{
            let storageRef = firebase.storage().ref();
            storageRef.child('images/' + pic[0].name);
            storageRef.child('images/' + pic[0].name).getDownloadURL().then(url => {
                let inputText = urlInputRef.current;
                inputText.innerHTML = "";
                inputText.innerHTML = url;
                inputText.value = url;
                setInputValue(url);
                changeImageOnInputChange();
            });
        }, 1000);
        let putButtonWrapper = putContainerRef.current;
        let putButton = document.querySelector("#put-button");
        putButtonWrapper.classList.add("deaktive-put-putton");
        putButton.classList.add("deaktive-put-putton");
        
    },[changeImageOnInputChange, pic, setInputValue])

    const onInputChange = useCallback( (event) =>{
        const {value} = event.target;
        setInputValue(value);
        changeImageOnInputChange();
    },[changeImageOnInputChange, setInputValue]);
    

    return (
        <div className="container">
            <div id="inputs-wrapper">               
                <div className="input-container"> 
                    <input type="text" 
                           id="urlInput" 
                           name="fname" 
                           placeholder="enter your URL"
                           onChange={onInputChange}
                           accept="png,.jpg,.jpeg"
                           ref={urlInputRef}
                    />
                    <input id="go-button" 
                            type="button" 
                            value="Go" 
                            onClick={onSumit}
                            ref={goButtonForward}
                    />
                </div>
                {/* ImageUploader */}
                <div id="imageUploader-wrapper">
                    <ImageUploader
                                className="uploader"
                                withIcon={true}
                                 fileContainerStyle={UploaderStyle}
                                buttonText="choose & Upload"
                                onChange={onDrop}
                                withLabel= {false}
                                imgExtension={['.jpg', '.png', 'jpeg']}
                                maxFileSize={5242880}
                                singleImage=  {true}
                                buttonStyles={{fontFamily:"Arial"}}
                                errorClass= "unsoportedFile"
                    />
                </div>
            </div>
            
            {/* End ImageUploader */}
            <div ref={putContainerRef} id="button-put-container-wrapper" className="deaktive-put-putton">
                <div id="button-put-container">
                    <label>
                        <p><span>Uploaded Successfully!</span>Put the URL, Click on Button GO</p>
                    </label>
                    <input ref={putButtonRef} id="put-button" 
                        className="" 
                        value="put" 
                        type="button" 
                        onClick={putURL}/>
                </div>
            </div>
        </div> 
    )
}


export default Input;