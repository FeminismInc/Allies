import React, {useEffect} from "react";
import Sidebar from '../../components/sidebar/Sidebar';
import './profile.css'
import ProfileTabs from './ProfileTabs';

//NTS: Changes to data in mongoDB: User Barbie is the author of 2 posts

export default function Profile() {
  
  //const username = "matthew500"; //change this to username from sessionStorage 
  const [username, setUsername] = useState('');
  const uri = 'http://localhost:5050/api';

  useEffect(() => {

    axios.get(`${uri}/users/findUser`, { withCredentials: true }) 
      .then(response => {
        setUsername(response.data.username); 
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        
      });
  }, []); 

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

