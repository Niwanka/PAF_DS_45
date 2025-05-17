import React from 'react';

const ProgressBar = ({ skillLevel, type }) => {
  // Convert skill level to percentage
  const getProgressPercentage = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 33;
      case 'intermediate':
        return 66;
      case 'advanced':
        return 100;
      default:
        return 0;
    }
  };

  // Get color based on template type
  const getProgressColor = () => {
    switch (type) {
      case 'tutorial':
        return 'progress-bar-blue';
      case 'skill':
        return 'progress-bar-green';
      case 'milestone':
        return 'progress-bar-orange';
      case 'project':
        return 'progress-bar-purple';
      case 'workshop':
        return 'progress-bar-pink';
      default:
        return 'progress-bar-gray';
    }
  };

  const percentage = getProgressPercentage(skillLevel);
  const progressColor = getProgressColor();

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-wrapper">
        <div
          className={`progress-bar-fill ${progressColor}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="progress-bar-labels">
        <span className={`progress-label ${skillLevel.toLowerCase() === 'beginner' ? 'font-semibold' : ''}`}>
          Beginner
        </span>
        <span className={`progress-label ${skillLevel.toLowerCase() === 'intermediate' ? 'font-semibold' : ''}`}>
          Intermediate
        </span>
        <span className={`progress-label ${skillLevel.toLowerCase() === 'advanced' ? 'font-semibold' : ''}`}>
          Advanced
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;