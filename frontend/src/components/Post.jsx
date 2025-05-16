import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import CommentList from './CommentList';
import { sharePost } from '../utils/shareUtils';
import '../styles/Post.css';


const Post = ({ post, currentUserProfile, onPostUpdate }) => {
    const [showComments, setShowComments] = useState(false);
    const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUserProfile?.sub));
    const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
    const [isLoading, setIsLoading] = useState(false);
    const [authorPicture, setAuthorPicture] = useState(null);
    const [commentCount, setCommentCount] = useState(0);

    const handleLike = async () => {
        if (!currentUserProfile) {
            toast.error('Please log in to like posts');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                `http://localhost:9090/api/posts/${post.id}/like?userId=${currentUserProfile.sub}`,
                {},
                { withCredentials: true }
            );

            const updatedPost = response.data;
            const hasLiked = updatedPost.likes?.includes(currentUserProfile.sub);
            
            setIsLiked(hasLiked);
            setLikeCount(updatedPost.likes?.length || 0);
            onPostUpdate(updatedPost);

            toast.success(hasLiked ? 'Post liked!' : 'Post unliked', {
                position: "bottom-right",
                autoClose: 2000
            });
        } catch (error) {
            toast.error('Failed to like post');
            console.error('Error liking post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = async () => {
        const result = await sharePost(post);
        
        if (result === true) {
            toast.success('Post shared successfully!');
        } else if (result === 'copied') {
            toast.success('Link copied to clipboard!');
        } else {
            toast.error('Failed to share post');
        }
    };

    const fetchCommentCount = async () => {
        try {
            const response = await axios.get(
                `http://localhost:9090/api/comments/post/${post.id}/count`,
                { withCredentials: true }
            );
            setCommentCount(response.data);
        } catch (err) {
            console.error('Error fetching comment count:', err);
        }
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                console.log('Post data:', {
                    userId: post.userId,
                    authorName: post.authorName,
                    title: post.title
                });
    
                if (!post.userId) {
                    console.warn('No userId available for post:', post.title);
                    return;
                }
    
                const allUsers = await axios.get(
                    'http://localhost:9090/api/profile/all',
                    { 
                        withCredentials: true,
                        headers: {
                            'Accept': 'application/json'
                        }
                    }
                );
    
                console.log('All users:', allUsers.data);
    
                // Find the matching user using the sub field instead of userId
                const userProfile = allUsers.data.find(user => user.sub === post.userId);
    
                if (userProfile) {
                    if (userProfile.picture) {
                        setAuthorPicture(userProfile.picture);
                    } else {
                        setAuthorPicture(`https://ui-avatars.com/api/?name=${post.authorName || 'User'}&background=random`);
                    }
                } else {
                    console.warn('User not found in profiles. Searching for sub:', post.userId);
                    setAuthorPicture(`https://ui-avatars.com/api/?name=${post.authorName || 'User'}&background=random`);
                }
    
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setAuthorPicture(`https://ui-avatars.com/api/?name=${post.authorName || 'User'}&background=random`);
            }
        };
    
        if (post.userId) {
            fetchUserProfile();
        }
        fetchCommentCount();
    }, [post.userId, post.id]);

    const handleCommentClick = () => {
        setShowComments(!showComments);
        if (!showComments) {
            fetchCommentCount();
        }
    };

    return (
        <article className="post-card">
            <div className="post-header">
                <div className="post-author">
                <img 
                    src={authorPicture || `https://ui-avatars.com/api/?name=${post.userName || 'User'}`}
                    alt={post.userName || 'User'}
                    className="author-avatar"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${post.userName || 'User'}`;
                    }}
                />
                    <div className="author-info">
                        <h4>{post.authorName}</h4>
                        <p className="post-meta">
                            {post.authorTitle}
                            <span className="post-time">
                                • {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                        </p>
                    </div>
                </div>
                {currentUserProfile?.sub === post.userId && (
                    <div className="post-actions-menu">
                        <button className="action-button">
                            <i className="fas fa-ellipsis-h"></i>
                        </button>
                    </div>
                )}
            </div>

            <div className="post-content">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-text">{post.content}</p>
                {/* Add tags section */}
                {post.tags?.length > 0 && (
                    <div className="post-tags">
                        {post.tags.map((tag, index) => (
                            <span key={`${post.id}-tag-${index}`} className="tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Replace existing image check with mediaUrls check */}
                {post.mediaUrls?.length > 0 && (
                <div className={`post-media-grid media-count-${post.mediaUrls.length}`}>
                    {post.mediaUrls.slice(0, 3).map((mediaUrl, index) => (
                        <div key={`${post.id}-media-${index}`} className="media-item">
                            {(mediaUrl.match(/\.(mp4|webm|mov|avi)$/i) || 
                            mediaUrl.includes('video') ||
                            mediaUrl.includes('firebase') && mediaUrl.includes('.mp4')) ? (
                                <div className="video-container">
                                    <video 
                                        controls
                                        className="post-video"
                                        preload="metadata"
                                        playsInline
                                    >
                                        <source 
                                            src={mediaUrl} 
                                            type={
                                                mediaUrl.match(/\.webm$/i) ? 'video/webm' :
                                                mediaUrl.match(/\.mov$/i) ? 'video/quicktime' :
                                                'video/mp4'
                                            } 
                                        />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            ) : (
                                <img 
                                    src={mediaUrl} 
                                    alt={`Media ${index + 1} for ${post.title}`} 
                                    className="post-image"
                                    loading="lazy"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
            </div>

            <div className="post-stats">
                <span className="likes">
                    <i className={`fas fa-thumbs-up ${isLiked ? 'liked' : ''}`}></i>
                    {likeCount}
                </span>
                <span className="comments" onClick={handleCommentClick}>
                    {commentCount} comments
                </span>
            </div>

            <div className="post-actions">
                <button 
                    className={`action-button ${isLiked ? 'liked' : ''} ${isLoading ? 'loading' : ''}`}
                    onClick={handleLike}
                    disabled={isLoading}
                >
                    <i className={`${isLiked ? 'fas' : 'far'} fa-thumbs-up`}></i>
                    {isLiked ? 'Liked' : 'Like'}
                </button>
                <button 
                    className="action-button"
                    onClick={handleCommentClick}
                >
                    <i className="far fa-comment"></i>
                    Comment
                </button>
                <button 
                    className="action-button"
                    onClick={handleShare}
                >
                    <i className="far fa-share-square"></i>
                    Share
                </button>
            </div>

            {showComments && (
                <CommentList 
                    postId={post.id} 
                    currentUserProfile={currentUserProfile}
                />
            )}
        </article>
    );
};

export default Post;