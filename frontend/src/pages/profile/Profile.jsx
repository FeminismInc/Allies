import React, {useEffect} from "react";
import './sidebar.css'
import './Sidebar'
import Sidebar from "./Sidebar";
import './profile.css'
export default function Profile() {

    return (
      <div>
        <div class="row">
          <div className="sidebar"><Sidebar /></div>
          <div class="col">
            <div class="username-box">Lex_the_cat</div>
            <div><p> </p></div>
            <img src={ require('./IMG_4628.jpg') } width={350} height={350}/>
          </div>
        </div>
      </div>
    );
}

