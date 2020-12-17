import React from 'react';
import './Profile.css'
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'; 
import localImage from '../Nav/person-icon.png';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import {GiCrossMark} from "react-icons/gi";
import { IconContext } from "react-icons";

class Profile extends React.Component {

    constructor(props){
        super(props);
        this.state = {
           image : "",
           croppedImg: ""
        }

        this.onDrop = this.onDrop.bind(this) ;
        this.cropBtnOnClick = this.cropBtnOnClick.bind(this);
        
    }

    async cropBtnOnClick(){
        const {croppedImg} = this.state;
        if(this.state.image === "") return;
        axios.post("https://murmuring-chamber-76782.herokuapp.com/profile", {
                userId: this.props.userId,
                image: croppedImg
        })
        .then(respone => {
            const {userID} = respone.data;
            if(userID === this.props.userId){
                this.props.setProfileImg(croppedImg)
            }else{
                alert("bad responsed from server due to your ID");
            }
        })
        
    }
    
   

    _crop(){
        this.setState( {
            croppedImg : this.cropper.getCroppedCanvas().toDataURL()
        })

    }

    onCropperInit (cropper){
        this.cropper = cropper;
    }   

    async onDrop(files){
        const currFile = files[0];
        const image = await this.resizeFile(currFile);
        this.setState({image: image })
    }

    resizeFile = (file) => new Promise(resolve => {
        Resizer.imageFileResizer(file, 200, 200, 'JPEG', 100, 0,
        uri => {
          resolve(uri);
        },
        'base64'
        );
    });

    hideHtmlOverflow(val){
        document.getElementsByTagName("html")[0].style.overflowY = val;
    }
    

    render(){
        if(this.props.isProfileClicked === true){
            this.hideHtmlOverflow("hidden");
            return (
                <div id="out-section">
                <IconContext.Provider value={{ size:'1.9rem', className: 'cross-icon' }}>
                                <GiCrossMark onClick={() =>{ this.props.setIsProfileClicked(false);
                                                             this.setState({image: ""})
                                                      }}/>
                </IconContext.Provider>
                <div id="out-container">
                    <div id="dropzone-container">
                        <Dropzone onDrop={this.onDrop}>
                        {({getRootProps, getInputProps}) => (
                            <section className="dropzone-section">
                            <div {...getRootProps()} className="dropzone-inner-container">
                                <input {...getInputProps()} />
                                <span>Drop or drag your image</span>
                            </div>
                            </section>
                        )}
                        </Dropzone>
                    </div>                    
                    <div id="cropper-container">
                        <Cropper
                            style={{height: 300, width: '50%' ,borderRadius: '50%'}}
                            initialAspectRatio={1}
                            preview=".img-preview"
                            src={this.state.image === "" ? localImage : this.state.image}
                            viewMode={3}
                            guides={true}
                            minCropBoxHeight={45}
                            minCropBoxWidth={45}
                            background={false}
                            zoomable= {true}
                            zoomOnWheel={true}
                            movable={true}
                            autoCropArea={1}
                            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                            aspectRatio = {50/50}
                            onInitialized={this.onCropperInit.bind(this)}
                            crop={this._crop.bind(this)}
                            />

                    </div>
                    <div id="btn-section">
                            <input  type="button" 
                                    value="CROP" 
                                    className="btn btn-warning" 
                                    onClick={this.cropBtnOnClick}
                            />
                    </div>
                </div>
                
            </div>
            )
        }
        else {
            this.hideHtmlOverflow("auto");
            return(<div></div>)
        }     
        
    }
}

export default Profile;