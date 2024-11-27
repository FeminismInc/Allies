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
                const searchResponse = await axios.post(`${uri}/users/search`, { username: query });
                const searchResults = searchResponse.data;
                const followResponse = await axios.get(`${uri}/users/followers/${current_username.data.username}`);
                console.log(followResponse);
                console.log(followResponse.data);
                const followRequestResponse = await axios.get(`${uri}/users/followRequests/${current_username.data.username}`);
                const updatedResults = await Promise.all(
                    searchResults.map(async user => {
                        const isFollowing = followResponse.data.follower_accounts.some(follower =>{
                            console.log(`Comparing requested ID: ${follower._id} with user ID: ${user._id}`);
                            return follower._id === user._id;
                        });
                        console.log(followRequestResponse.data.requested_accounts);
                        const isRequested = followRequestResponse.data.requested_accounts.some(requested => {
                            console.log(`Comparing requested ID: ${requested} with user ID: ${user._id}`);
                            return requested === user._id;
                        });
                        console.log(isRequested);
                        return { ...user, isFollowing, isRequested };
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
        <div className='searchPage-container'>
            <Sidebar />
            <div className='search-mainContent'>
                <div className='searchbar'>
                    <SearchBar setSearchQuery={setSearchQuery} fetchResults={fetchResults} />
                    <div className='landing'>
                        {results.map((result, index) => (
                            <SearchResults key={index} username={result.username} handle={result.handle} isFollowing={result.isFollowing} isRequested={result.isRequested}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}