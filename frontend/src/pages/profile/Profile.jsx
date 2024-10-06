import React, {useEffect} from "react";
import Sidebar from '../../components/sidebar/Sidebar';
import './profile.css'
export default function Profile() {

    return (
      <div className="profileMainContent">
        <div className="sidebarContainer">
                <Sidebar/>
        </div>
        <div className = "homeContainer">
          <div class="row">
          <div class="col">
            <div class="username-box">Lex_the_cat</div>
            <div><p> </p></div>
            <img src={ require('./IMG_4628.jpg') } width={350} height={350}/>
          </div>
        </div>
        </div>
      </div>
    );
}

