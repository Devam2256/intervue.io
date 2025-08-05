import './ShinyText.css';
import { useNavigate } from 'react-router-dom';

const ShinyText = ({ text, disabled = false, speed = 5, className = '', isLink = true }) => {
  const navigate = useNavigate();
  const animationDuration = `${speed}s`;

  const handleClick = () => {
    if (isLink && !disabled) {
      navigate('/');
    }
  };

  return (
    <div
      className={`shiny-text ${disabled ? 'disabled' : ''} ${className} ${isLink ? 'cursor-pointer' : ''}`}
      style={{ animationDuration }}
      onClick={handleClick}
      role={isLink ? 'button' : undefined}
      tabIndex={isLink ? 0 : undefined}
      onKeyDown={(e) => {
        if (isLink && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {text}
    </div>
  );
};
export default ShinyText;