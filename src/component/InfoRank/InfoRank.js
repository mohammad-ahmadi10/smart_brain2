import React from "react";
import "./InfoRank.css";

const InfoRank = (props) =>{
    const {currentUser} = props;
    return(
        <div className="rankContainer">
            <div className="rank">
                <h5><span>Wellcome</span> {currentUser.username}, your Rank is</h5>
    <div className="rank-num">{currentUser.rank}</div>
            </div>
        </div>



    )

}

export default InfoRank;