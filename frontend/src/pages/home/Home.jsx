import Data_Button from "../../components/data_button/data_button";
import "./home.css"
import Sidebar from '../../components/sidebar/Sidebar';

export default function Home() {
    return (
        <div>
            <div className="homeMainContent">
            <div className="sidebarContainer">
                <Sidebar/>
            </div>
            <div className="dataContainer">
                <Data_Button />
            </div>
            </div>
        </div>
               

    )
}