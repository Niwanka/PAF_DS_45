import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBox.css';

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
        <div className="search-container" ref={searchRef}>
            <div className="search-input-container">
                <i className="fas fa-search" style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    color: '#666',
                    fontSize: '14px'
                }}></i>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="search-input"
                    style={{ paddingLeft: '35px' }}
                />
                {isLoading && <div className="search-spinner"></div>}
            </div>
            
            {showResults && searchResults.length > 0 && (
                <div className="search-results">
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