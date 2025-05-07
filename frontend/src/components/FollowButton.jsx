import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './FollowButton.css';

const FollowButton = ({ userId, isFollowing: initialIsFollowing, onFollowChange, disabled }) => {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isLoading, setIsLoading] = useState(false);

    const handleFollowClick = async () => {
        setIsLoading(true);
        try {
            const endpoint = isFollowing ? 'unfollow' : 'follow';
            const response = await axios.post(
                `http://localhost:9090/api/profile/${userId}/${endpoint}`,
                {},
                { withCredentials: true }
            );

            setIsFollowing(!isFollowing);
            if (onFollowChange) {
                onFollowChange(!isFollowing);
            }

            toast.success(isFollowing ? 'Unfollowed successfully' : 'Following successfully');
        } catch (error) {
            toast.error('Failed to update follow status');
            console.error('Follow error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            className={`follow-button ${isFollowing ? 'following' : ''} ${isLoading ? 'loading' : ''}`}
            onClick={handleFollowClick}
            disabled={isLoading || disabled}
        >
            {isLoading ? (
                <span className="loading-spinner"></span>
            ) : (
                <span>{isFollowing ? 'Following' : 'Follow'}</span>
            )}
        </button>
    );
};

export default FollowButton;