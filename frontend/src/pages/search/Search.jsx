import axios from 'axios';
import React, { useState, useEffect } from "react";
import Sidebar from '../../components/sidebar/Sidebar';
import './search.css';
import SearchBar from "../../components/search/searchBar";
import SearchResults from '../../components/search/SearchResults';
export default function SearchPage() {

return (
    <body id="search">     
        <div className='searchPage-container'>
            <Sidebar/>
            <div className='landing'>
                <div className='searchbar'>
                    <SearchBar/>
                </div>
                <SearchResults/>
                <SearchResults/>
                <SearchResults/>
            </div>
        </div>
    </body>


    );
}