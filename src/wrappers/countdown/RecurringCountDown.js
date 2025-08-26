import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import RecurringCountdownTimer from "../../components/countdown/recurring-countdown";

const RecurringCountDown = ({ 
  spaceTopClass, 
  spaceBottomClass, 
  cycleDays = 10 
}) => {
  // Premium design styles for perfect aesthetics
  const styles = {
    section: {
      background: 'linear-gradient(135deg, #fafbfc 0%, #ffffff 25%, #f8f9fa 50%, #ffffff 75%, #fafbfc 100%)',
      position: 'relative',
      padding: '120px 0',
      color: '#1a1a1a',
      textAlign: 'center',
      borderTop: '1px solid #e8eaed',
      borderBottom: '1px solid #e8eaed',
      overflow: 'hidden'
    },
    content: {
      position: 'relative',
      zIndex: 3,
      maxWidth: '900px',
      margin: '0 auto'
    },
    title: {
      fontSize: 'clamp(2.5rem, 6vw, 4rem)',
      fontWeight: '900',
      marginBottom: '1rem',
      color: '#1a1a1a',
      textTransform: 'uppercase',
      letterSpacing: '3px',
      lineHeight: '1.1',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    titleAccent: {
      color: '#daaa58',
      display: 'block',
      fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
      fontWeight: '500',
      marginTop: '0.8rem',
      letterSpacing: '4px',
      textTransform: 'uppercase',
      opacity: '0.9'
    },
    subtitle: {
      fontSize: 'clamp(1.1rem, 2.8vw, 1.3rem)',
      marginBottom: '3rem',
      color: '#666',
      fontWeight: '400',
      lineHeight: '1.7',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    accentLine: {
      width: '120px',
      height: '5px',
      background: 'linear-gradient(90deg, #daaa58, #f4d03f, #daaa58)',
      margin: '2rem auto',
      borderRadius: '3px',
      boxShadow: '0 2px 8px rgba(218, 170, 88, 0.3)'
    },
    timerContainer: {
      marginBottom: '3.5rem',
      padding: '2rem'
    },
    shopButton: {
      display: 'inline-block',
      background: 'linear-gradient(135deg, #daaa58 0%, #f4d03f 50%, #daaa58 100%)',
      color: 'white',
      padding: '20px 50px',
      borderRadius: '60px',
      textDecoration: 'none',
      fontWeight: '800',
      fontSize: '1.1rem',
      textTransform: 'uppercase',
      letterSpacing: '3px',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      boxShadow: '0 8px 30px rgba(218, 170, 88, 0.4)',
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    },
    decorativeCircle: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(218, 170, 88, 0.08) 0%, transparent 70%)',
      animation: 'float 12s ease-in-out infinite',
      pointerEvents: 'none',
      zIndex: 1
    },
    circle1: {
      width: '400px',
      height: '400px',
      top: '-200px',
      right: '-200px'
    },
    circle2: {
      width: '300px',
      height: '300px',
      bottom: '-150px',
      left: '-150px',
      animation: 'float 15s ease-in-out infinite reverse'
    },
    circle3: {
      width: '200px',
      height: '200px',
      top: '50%',
      left: '10%',
      animation: 'float 18s ease-in-out infinite'
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 20% 30%, rgba(218, 170, 88, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(218, 170, 88, 0.03) 0%, transparent 50%)',
      zIndex: 1,
      pointerEvents: 'none'
    }
  };

  // Premium CSS with perfect aesthetics
  const cssStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.7; }
      50% { transform: translateY(-30px) rotate(180deg) scale(1.05); opacity: 1; }
    }
    
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    
    .countdown-timer {
      display: flex;
      justify-content: center;
      gap: clamp(1rem, 3vw, 2rem);
      margin: 3rem 0;
      flex-wrap: wrap;
    }
    
    .countdown-item {
      background: linear-gradient(145deg, #ffffff, #f8f9fa);
      border-radius: 24px;
      padding: clamp(1.5rem, 4vw, 2.5rem) clamp(1.2rem, 3vw, 2rem);
      min-width: clamp(90px, 18vw, 130px);
      border: 2px solid #e8eaed;
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.08),
        0 2px 8px rgba(0, 0, 0, 0.04),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
      position: relative;
      overflow: hidden;
    }
    
    .countdown-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #daaa58, #f4d03f, #daaa58);
      background-size: 200% 100%;
      transform: scaleX(0);
      transition: transform 0.4s ease;
      animation: shimmer 2s infinite;
    }
    
    .countdown-item:hover {
      transform: translateY(-12px) scale(1.05);
      border-color: #daaa58;
      box-shadow: 
        0 20px 60px rgba(218, 170, 88, 0.25),
        0 8px 24px rgba(0, 0, 0, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }
    
    .countdown-item:hover::before {
      transform: scaleX(1);
    }
    
    .countdown-value {
      font-size: clamp(2.2rem, 5vw, 3.5rem);
      font-weight: 900;
      display: block;
      margin-bottom: 0.5rem;
      color: #1a1a1a;
      line-height: 1;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
      background: linear-gradient(135deg, #1a1a1a, #333);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .countdown-label {
      font-size: clamp(0.8rem, 1.8vw, 1rem);
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #666;
      font-weight: 700;
      margin-top: 0.5rem;
    }
    
    .shop-button-hover {
      transform: translateY(-4px) scale(1.05) !important;
      box-shadow: 0 15px 45px rgba(218, 170, 88, 0.5) !important;
      background: linear-gradient(135deg, #f4d03f 0%, #daaa58 50%, #f4d03f 100%) !important;
    }
    
    .shop-button-hover::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.5s;
      animation: shimmer 1.5s infinite;
    }
    
    @media (max-width: 768px) {
      .countdown-timer {
        gap: 1rem;
      }
      
      .countdown-item {
        min-width: 80px;
        padding: 1.5rem 1rem;
      }
    }
  `;

  const handleButtonHover = (e, isEntering) => {
    if (isEntering) {
      e.target.classList.add('shop-button-hover');
    } else {
      e.target.classList.remove('shop-button-hover');
    }
  };

  return (
    <div
      className={clsx("countdown-section", spaceTopClass, spaceBottomClass)}
      style={styles.section}
    >
      <style>{cssStyles}</style>
      
      {/* Premium decorative elements */}
      <div style={{...styles.decorativeCircle, ...styles.circle1}}></div>
      <div style={{...styles.decorativeCircle, ...styles.circle2}}></div>
      <div style={{...styles.decorativeCircle, ...styles.circle3}}></div>
      <div style={styles.overlay}></div>
      
      <div className="container">
        <div style={styles.content}>
          <h2 style={styles.title}>
            Deal of the Day
            <span style={styles.titleAccent}>Limited Time Offer</span>
          </h2>
          
          <div style={styles.accentLine}></div>
          
          <p style={styles.subtitle}>
            Experience premium quality at unbeatable prices. Don't miss this exclusive opportunity to elevate your style with our curated collection.
          </p>
          
          <div style={styles.timerContainer}>
            <RecurringCountdownTimer cycleDays={cycleDays} />
          </div>
          
          <Link 
            to={process.env.PUBLIC_URL + "/shop"}
            style={styles.shopButton}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

RecurringCountDown.propTypes = {
  cycleDays: PropTypes.number,
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default RecurringCountDown; 