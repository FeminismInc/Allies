import SearchBar from "../search_bar/searchBar";
import "./topbar.css"

export default function Topbar() {
    return (
        <div className="topbarContainer">
            <div className="topbarLeft">
                <span className="logo">FEMINISM</span>
            </div>
            <div className="topbarCenter">
                <div className="searchbar"></div>
                <SearchBar/>
            </div>
        </div>
    )
}