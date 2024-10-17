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
                <Sidebar />
                <div className='search-mainContent'>
                    <div className='searchbar'>
                        <SearchBar />
                        <div className='landing'>

                            {/* testing purposes */}
                            <SearchResults />
                            <SearchResults />
                            <SearchResults />
                            <SearchResults />
                        </div>
                    </div>
                </div>
            </div>
        </body>


    );
}