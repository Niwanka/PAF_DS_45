import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBox.css';

const SearchBox = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchQuery) {
                handleSearch();
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch(
                `http://localhost:9090/api/profile/search?query=${encodeURIComponent(searchQuery)}`,
                { credentials: 'include' }
            );
            
            if (!response.ok) throw new Error('Search failed');
            
            const data = await response.json();
            setSearchResults(data);
            setShowResults(true);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectUser = (userId) => {
        setShowResults(false);
        setSearchQuery('');
        console.log(userId)
        navigate(`/Userprofile/${userId}`);
    };

    return (
        <div className="relative w-full" ref={searchRef}>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search for knowledge"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {showResults && searchResults.length > 0 && (
                <div className="absolute mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                    {searchResults.map((user) => (
                        <div
                            key={user.id}
                            className="search-result-item"
                            onClick={() => handleSelectUser(user.id)}
                        >
                            <img
                                src={user.picture || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="search-result-avatar"
                            />
                            <div className="search-result-info">
                                <div className="search-result-name">
                                    {user.firstName} {user.lastName}
                                </div>
                                <div className="search-result-username">
                                    {user.profileName || user.profession || 'User'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBox;