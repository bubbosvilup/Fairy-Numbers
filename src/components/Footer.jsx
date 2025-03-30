// src/components/Footer.jsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Footer = () => {
  const footerRef = useRef(null);
  
  useEffect(() => {
    // Initial animation
    gsap.from(footerRef.current, {
      opacity: 0,
      y: 20, // Changed from -3 to 20 to animate from below
      duration: 1.5,
      ease: 'power2.out',
      delay: 1
    });
    
    // Continuous floating animation - more subtle
    gsap.to(footerRef.current, {
      y: 3, // Reduced from 5 to 3 for more subtle movement
      duration: 2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1
    });
  }, []);
  
  return (
    <footer 
      ref={footerRef}
      id="footer"
    >
      <p>
        codedBy: <span>Bubbo</span>
      </p>
    </footer>
  );
};

export default Footer;