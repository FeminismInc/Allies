import axios from 'axios';
import React, { useState, useEffect } from "react";
import Sidebar from '../../components/sidebar/Sidebar';
import './search.css';
import SearchBar from "../../components/search/searchBar";
import SearchResults from '../../components/search/SearchResults';

export default function SearchPage() {

    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);

    const uri = "http://localhost:5050/api"; 

    const fetchResults = async (query) => {
        if (query) {
            try {
                const current_username = await axios.get(`${uri}/users/findUser`)
                console.log(current_username.data.username)
                const searchResponse = await axios.post(`${uri}/users/search`, { username: query });
                const searchResults = searchResponse.data;
                const followResponse = await axios.get(`${uri}/users/followers/${current_username.data.username}`);
                console.log(followResponse.data.follower_accounts)
                const updatedResults = await Promise.all(
                    searchResults.map(async user => {
                        const isFollowing = followResponse.data.follower_accounts.some(follower => 
                            follower._id === user._id 
                        );
                        return { ...user, isFollowing }; 
                    })
                );
                console.log(updatedResults);
                setResults(updatedResults); 
            } catch (error) {
                console.error("Error fetching search results or follow status", error);
            }
        } else {
            setResults([]); 
        }
    };

    return (
        <body id="search">
            <div className='searchPage-container'>
                <Sidebar />
                <div className='search-mainContent'>
                    <div className='searchbar'>
                        <SearchBar setSearchQuery={setSearchQuery} fetchResults={fetchResults} />
                        <div className='landing'>
                            {results.map((result, index) => (
                                <SearchResults key={index} username={result.username} handle={result.handle} isFollowing={result.isFollowing} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </body>


    );
}