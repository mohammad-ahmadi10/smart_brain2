import  React,{useEffect, useRef} from 'react';
import "./PhotoRender.css";


const PhotoRender = ({photoUrl, boxes}) =>{
        const imageContainer = useRef(null);

        useEffect(() =>{
            imageContainer.current.innerHTML = "";
            if(photoUrl === "") return;
            imageContainer.current.innerHTML += ` <img id="imgUrl" 
                                             src= ${photoUrl} 
                                             alt=""
                                        />`
            for (var i = 0; i < boxes.length ; i++) {
                imageContainer.current.innerHTML += `<div class="bound_box"
                                                        style=
                                                        "
                                                            left:    ${boxes[i].left}px; 
                                                            right:   ${boxes[i].right}px;
                                                            top:     ${boxes[i].top}px; 
                                                            bottom:  ${boxes[i].bottom}px;
                                                        ">
                                                     </div>`;
            }


        },[photoUrl, boxes]);       

    return (
            <div id="photorender-container">   
                <div className="detection-section">
                    <div className="face-wrapper">
                        <div ref={imageContainer} id="img-wrapper">
                        </div>
                    </div>
                </div>      
            </div>
        
    ) 

    
}


export default PhotoRender;