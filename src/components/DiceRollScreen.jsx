// src/components/DiceRollScreen.jsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const DiceRollScreen = ({ onRollDice, diceResult, showResult }) => {
  const diceResultRef = useRef(null);
  const buttonRef = useRef(null);
  
  useEffect(() => {
    if (showResult && diceResultRef.current) {
      gsap.fromTo(
        diceResultRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3 }
      );
    }
    
    // Add animation to the button
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [showResult]);
  
  return (
    <div className="dice-roll">
      <button 
        ref={buttonRef}
        id="roll-dice" 
        className="primary-button" 
        onClick={onRollDice} 
        disabled={showResult && diceResult.message === ''}
      >
        <span className="material-icons">casino</span>
        Roll the dice!
      </button>
      
      {showResult && (
        <div ref={diceResultRef} id="dice-result" className="dice-result">
          <p id="player-dice" className="dice-number">Player: {diceResult.player}</p>
          <p id="ai-dice" className="dice-number">AI: {diceResult.ai}</p>
          <p id="turn-message">{diceResult.message}</p>
        </div>
      )}
    </div>
  );
};

export default DiceRollScreen;