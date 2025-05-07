import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import CommentList from './CommentList';
import { sharePost } from '../utils/shareUtils';
import './Post.css';

const Post = ({ post, currentUserProfile, onPostUpdate }) => {
    const [showComments, setShowComments] = useState(false);
    const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUserProfile?.sub));
    const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
    const [isLoading, setIsLoading] = useState(false);

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

    return (
        <article className="post-card">
            <div className="post-header">
                <div className="post-author">
                    <img 
                        src={post.authorPicture || `https://ui-avatars.com/api/?name=${post.authorName}`}
                        alt={post.authorName}
                        className="author-avatar"
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
                {post.image && (
                    <div className="post-media">
                        <img src={post.image} alt="Post content" />
                    </div>
                )}
            </div>

            <div className="post-stats">
                <span className="likes">
                    <i className={`fas fa-thumbs-up ${isLiked ? 'liked' : ''}`}></i>
                    {likeCount}
                </span>
                <span className="comments">
                    {post.comments?.length || 0} comments
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
                    onClick={() => setShowComments(!showComments)}
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