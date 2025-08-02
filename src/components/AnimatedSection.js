import React from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// Animated Section Wrapper
export const AnimatedSection = ({ children, className, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// Animated Text Component
export const AnimatedText = ({ children, className, delay = 0, type = "h2" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: "easeOut"
      }
    }
  };

  const Component = type;

  return (
    <motion.div
      ref={ref}
      variants={textVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <Component className={className}>{children}</Component>
    </motion.div>
  );
};

// Animated Button Component
export const AnimatedButton = ({ children, className, onClick, delay = 0 }) => {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

// Parallax Background Component
export const ParallaxBackground = ({ children, speed = 0.5 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className="parallax-background"
    >
      {children}
    </motion.div>
  );
};

// Floating Animation Component
export const FloatingElement = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{
        y: -5,
        transition: { duration: 0.3 }
      }}
    >
      {children}
    </motion.div>
  );
};

// Staggered Grid Animation
export const StaggeredGrid = ({ children, className, staggerDelay = 0.1 }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Gradient Text Animation
export const GradientText = ({ children, className, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, backgroundPosition: "200% 0%" }}
      animate={isInView ? { 
        opacity: 1, 
        backgroundPosition: "0% 0%",
        transition: {
          opacity: { duration: 0.8, delay },
          backgroundPosition: { duration: 1.5, delay: delay + 0.3, ease: "easeInOut" }
        }
      } : { opacity: 0, backgroundPosition: "200% 0%" }}
      style={{
        background: "linear-gradient(90deg, #2c3e50, #495057, #667eea, #2c3e50)",
        backgroundSize: "300% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text"
      }}
    >
      {children}
    </motion.div>
  );
};

// Scroll Triggered Animation
export const ScrollTriggeredAnimation = ({ children, className, threshold = 0.1 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    amount: threshold 
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// Hover Card Animation
export const HoverCard = ({ children, className }) => {
  return (
    <motion.div
      className={className}
      whileHover={{ 
        y: -10,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// Loading Spinner Animation
export const LoadingSpinner = ({ size = 50, color = "#667eea" }) => {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        border: `3px solid ${color}20`,
        borderTop: `3px solid ${color}`,
        borderRadius: "50%"
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

// Fade In On Scroll
export const FadeInOnScroll = ({ children, className, direction = "up", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const getInitialPosition = () => {
    switch (direction) {
      case "up": return { y: 50 };
      case "down": return { y: -50 };
      case "left": return { x: 50 };
      case "right": return { x: -50 };
      default: return { y: 50 };
    }
  };

  const getAnimatePosition = () => {
    switch (direction) {
      case "up": return { y: 0 };
      case "down": return { y: 0 };
      case "left": return { x: 0 };
      case "right": return { x: 0 };
      default: return { y: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={isInView ? { 
        opacity: 1, 
        ...getAnimatePosition(),
        transition: { duration: 0.8, delay, ease: "easeOut" }
      } : { opacity: 0, ...getInitialPosition() }}
    >
      {children}
    </motion.div>
  );
};

// Scale In Animation
export const ScaleIn = ({ children, className, delay = 0, scale = 0.8 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale }}
      animate={isInView ? { 
        opacity: 1, 
        scale: 1,
        transition: { duration: 0.6, delay, ease: "easeOut" }
      } : { opacity: 0, scale }}
    >
      {children}
    </motion.div>
  );
};

export default {
  AnimatedSection,
  AnimatedText,
  AnimatedButton,
  ParallaxBackground,
  FloatingElement,
  StaggeredGrid,
  GradientText,
  ScrollTriggeredAnimation,
  HoverCard,
  LoadingSpinner,
  FadeInOnScroll,
  ScaleIn
};