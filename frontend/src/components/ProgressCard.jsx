import React from 'react';
import { Calendar, Edit, Trash2, BookOpen, Code, Award, LightbulbIcon, Users } from 'lucide-react';
import ProgressBar from './ProgressBar';

const ProgressCard = ({ update, onEdit, onDeleteConfirm }) => {
  const getCardTypeClass = () => {
    switch (update.type) {
      case 'tutorial':
        return 'card-tutorial';
      case 'skill':
        return 'card-skill';
      case 'milestone':
        return 'card-milestone';
      case 'project':
        return 'card-project';
      case 'workshop':
        return 'card-workshop';
      default:
        return 'card-default';
    }
  };

  const getTypeIcon = () => {
    switch (update.type) {
      case 'tutorial':
        return <BookOpen className="icon icon-blue" />;
      case 'skill':
        return <LightbulbIcon className="icon icon-green" />;
      case 'milestone':
        return <Award className="icon icon-orange" />;
      case 'project':
        return <Code className="icon icon-purple" />;
      case 'workshop':
        return <Users className="icon icon-indigo" />;
      default:
        return <BookOpen className="icon icon-gray" />;
    }
  };

  const getFormattedDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getBadgeClass = () => {
    switch (update.type) {
      case 'tutorial':
        return 'skill-badge-tutorial';
      case 'skill':
        return 'skill-badge-skill';
      case 'milestone':
        return 'skill-badge-milestone';
      case 'project':
        return 'skill-badge-project';
      case 'workshop':
        return 'skill-badge-workshop';
      default:
        return '';
    }
  };

  return (
    <div className={`card ${getCardTypeClass()}`}>
      <div className="card-actions">
        <button 
          className="action-button edit-button" 
          onClick={() => onEdit(update)}
          aria-label="Edit update"
        >
          <Edit className="icon-small" />
        </button>
        <button 
          className="action-button delete-button" 
          onClick={() => onDeleteConfirm(update.id)}
          aria-label="Delete update"
        >
          <Trash2 className="icon-small" />
        </button>
      </div>
      
      <div className="card-header">
        <div className="type-icon">
          {getTypeIcon()}
        </div>
        <div className="type-info">
          <span className="type-label">{update.type}</span>
          <span className="date-info">
            <Calendar className="icon-tiny" />
            {getFormattedDate(update.createdAt)}
          </span>
        </div>
      </div>
      
      <h3 className="card-title">{update.title}</h3>
      
      {update.description && (
        <p className="card-description">{update.description}</p>
      )}
      
      {/* Progress Bar - Now passing type prop */}
      <div className="card-progress">
        <ProgressBar skillLevel={update.skillLevel} type={update.type} />
      </div>
      
      <div className="card-footer">
        <span className={`skill-badge ${getBadgeClass()}`}>{update.skillLevel}</span>
        
        {(update.resourceLink || update.projectLink) && (
          <a 
            href={update.resourceLink || update.projectLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="link-button"
          >
            View {update.type === 'tutorial' || update.type === 'skill' ? 'Resource' : 'Project'}
          </a>
        )}
      </div>
    </div>
  );
};

export default ProgressCard;