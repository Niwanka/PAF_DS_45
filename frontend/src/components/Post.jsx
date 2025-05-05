import React, { useState } from 'react';
import CommentList from './CommentList';
import './Post.css';

const Post = ({ post, currentUserProfile, onLike, onShare }) => {
    const [showComments, setShowComments] = useState(false);

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
                    <i className="fas fa-thumbs-up"></i> {post.likes || 0}
                </span>
                <span className="comments">
                    {post.comments?.length || 0} comments
                </span>
            </div>

            <div className="post-actions">
                <button 
                    className="action-button"
                    onClick={() => onLike(post.id)}
                >
                    <i className="far fa-thumbs-up"></i>
                    Like
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
                    onClick={() => onShare(post.id)}
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