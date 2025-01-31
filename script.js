// Configurazione Particles.js
particlesJS('particles-js', {
    "particles": {
      "number": {
        "value": 50,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#FFF740"  // Rosa chiaro fiabesco
      },
      "shape": {
        "type": "star",
        "polygon": {
          "nb_sides": 5      // Poligono a 5 lati
        }
      },
      "opacity": {
        "value": 1.0,       // Aggiusta se vuoi più o meno opacità
        "random": true
      },
      "size": {
        "value": 5,
        "random": true      // Dimensioni casuali
      },
      "line_linked": {
        "enable": false     // Niente linee
      },
      "move": {
        "enable": true,
        "speed": 0.3,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "bubble"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 140,
          "line_linked": { "opacity": 1 }
        },
        "bubble": {
          "distance": 200,
          "size": 6,    // Quanto “ingrandirle” in hover
          "duration": 2,
          "opacity": 1,
          "speed": 3
        },
        "repulse": { "distance": 200, "duration": 0.4 },
        "push": { "particles_nb": 3 },
        "remove": { "particles_nb": 2 }
      }
    },
    "retina_detect": true
  });
  

// Elementi DOM
const menu = document.querySelector('.menu');
const diceRollMenu = document.querySelector('.dice-roll');
const game = document.querySelector('.game');
const startButton = document.getElementById('start-btn');
const rollButton = document.getElementById('roll-dice');
const diceResult = document.getElementById('dice-result');
const playerDice = document.getElementById('player-dice');
const aiDice = document.getElementById('ai-dice');
const turnMessage = document.getElementById('turn-message');
const gameTurnMessage = document.getElementById('game-turn-message');
const playerInput = document.getElementById('player-input');
const playerNumberInput = document.getElementById('player-number');
const submitButton = document.getElementById('submit-number');
const playerChoiceSpan = document.getElementById('player-choice');
const aiChoiceSpan = document.getElementById('ai-choice');
const totalSpan = document.getElementById('total');
const progressBar = document.getElementById('progress');

// Variabili di gioco
let isPlayerTurn = true;
let playerChoice = 0;
let aiChoice = 0;
let total = 0;

// GSAP Timeline per animazioni
const tl = gsap.timeline();

//====================//
// SEZIONE AUDIO
//====================//
const backgroundMusic = new Audio('backgroundMusic.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.2;

// Effetti sonori
const clickPlaySound = new Audio('clickPlay.wav');
const diceRollSound = new Audio('diceRoll.mp3');
const lostSound = new Audio('lost.wav');
const playerTurnSound = new Audio('playerTurn.wav');
const winSound = new Audio('win.wav');

// Event Listeners
startButton.addEventListener('click', () => {
  // Avviamo la musica di background
  // (In alcuni browser è necessario che l'utente interagisca prima col documento)
  backgroundMusic.play().catch(() => {
    console.log('Autoplay bloccato, la musica partirà dopo altra interazione');
  });

  clickPlaySound.play();
  showDiceRoll();
});

rollButton.addEventListener('click', rollDice);
submitButton.addEventListener('click', handlePlayerChoice);
playerNumberInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handlePlayerChoice();
    }
});

window.addEventListener('load', () => {
    // Anima il footer in entrata (fade in + movimento verso l’alto)
    gsap.from("#footer", {
      opacity: 0,
      y:-3,
      duration: 3,
      ease: "power2.out",
      delay: 1  // Aspetta un secondo prima di farlo apparire
    });
  
    // Effetto fluttuazione continua
    gsap.to("#footer", {
      y: 5,             // Si sposta verso il basso di 10px
      duration: 2,      // Durata dell’animazione
      ease: "power1.inOut",
      yoyo: true,         // Ritorna allo stato iniziale
      repeat: -1          // Ripete all’infinito
    });
  });

// Funzioni di gioco
function showDiceRoll() {
    gsap.to(menu, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => {
            menu.classList.add('hidden');
            diceRollMenu.classList.remove('hidden');
            gsap.from(diceRollMenu, {
                opacity: 0,
                y: 20,
                duration: 0.3
            });
        }
    });
}

function rollDice() {
  diceRollSound.play(); // Effetto sonoro lancio dado

  const playerRoll = Math.floor(Math.random() * 6) + 1;
  const aiRoll = Math.floor(Math.random() * 6) + 1;

  rollButton.disabled = true;

  tl.to(diceResult, {
      opacity: 0,
      y: -20,
      duration: 0.3
  })
  .call(() => {
      diceResult.classList.remove('hidden');
      playerDice.textContent = `Player: ${playerRoll}`;
      aiDice.textContent = `AI: ${aiRoll}`;
  })
  .to(diceResult, {
      opacity: 1,
      y: 0,
      duration: 0.3
  });

  // Se è pareggio
  if (playerRoll === aiRoll) {
      turnMessage.textContent = "it's a Tie! Roll again!";
      rollButton.disabled = false;
      return;
  }

  setTimeout(() => {
      if (playerRoll > aiRoll) {
          // Vince il giocatore
          isPlayerTurn = true;
          gsap.to(diceRollMenu, {
              opacity: 0,
              y: -20,
              duration: 0.3,
              onComplete: () => {
                  diceRollMenu.classList.add('hidden');
                  game.classList.remove('hidden');
                  gsap.from(game, {
                      opacity: 0,
                      y: 20,
                      duration: 0.3,
                      onComplete: () => {
                          startPlayerTurn();
                      }
                  });
              }
          });
      } else {
          // Vince l'AI
          isPlayerTurn = false;
          gsap.to(diceRollMenu, {
              opacity: 0,
              y: -20,
              duration: 0.3,
              onComplete: () => {
                  diceRollMenu.classList.add('hidden');
                  game.classList.remove('hidden');
                  gsap.from(game, {
                      opacity: 0,
                      y: 20,
                      duration: 0.3,
                      onComplete: () => {
                          // Turno dell'AI
                          playerInput.classList.add('hidden');
                          gameTurnMessage.textContent = "It's AI's turn...";
                          setTimeout(() => {
                              aiTurn();
                              checkWinner();
                              if (total < 100) {
                                  startPlayerTurn();
                              }
                          }, 1000);
                      }
                  });
              }
          });
      }
  }, 1500);
}

function aiTurn() {
  aiChoice = 0;
  const keyNumbers = [23, 34, 45, 56, 67, 78, 89];
  let aiNumber;

  // Determina il prossimo numero chiave da raggiungere
  const nextTarget = keyNumbers.find(num => num > total);

  if (nextTarget) {
      // Calcola quanto manca per raggiungere il target
      const neededNumber = nextTarget - total;
      if (neededNumber <= 10) {
          aiNumber = neededNumber;
      } else {
          const maxAllowedTotal = nextTarget - 11;
          const numberToReachMax = maxAllowedTotal - total;
          if (numberToReachMax > 0 && numberToReachMax <= 10) {
              aiNumber = numberToReachMax;
          } else {
              aiNumber = Math.min(10, Math.max(1, 11 - playerChoice));
          }
      }
  } else {
      // Oltre i numeri chiave, puntiamo a 100
      const remainingToWin = 100 - total;
      if (remainingToWin <= 10) {
          aiNumber = remainingToWin;
      } else {
          aiNumber = Math.min(10, Math.max(1, 11 - playerChoice));
      }
  }

  // Assicuriamoci che il numero sia valido
  aiNumber = Math.min(10, Math.max(1, aiNumber));

  aiChoice = aiNumber;
  total += aiNumber;

  aiChoiceSpan.textContent = aiNumber;
  totalSpan.textContent = total;

  const progressPercentage = total > 100 ? 100 : total;
  progressBar.style.width = `${progressPercentage}%`;

  gameTurnMessage.textContent = `IA chooses ${aiNumber}`;

  gsap.from(aiChoiceSpan, {
    textContent: 0,
    duration: 1,
    snap: { textContent: 1 },
    ease: "power1.out"
  });

  updateScores();
}

function updateScores() {
  playerChoiceSpan.textContent = playerChoice;
  aiChoiceSpan.textContent = aiChoice;
  totalSpan.textContent = total;
  const progressPercentage = total > 100 ? 100 : total;
  progressBar.style.width = `${progressPercentage}%`;
}

function startAITurn() {
  playerInput.classList.add('hidden');
  gameTurnMessage.textContent = "it's Ai's turn...";

  setTimeout(() => {
    aiTurn();
    checkWinner();
    if (total < 100) {
        startPlayerTurn();
    }
  }, 1000);
}

function startPlayerTurn() {
  // Effetto sonoro quando il turno passa al giocatore
  playerTurnSound.play();

  isPlayerTurn = true;
  gameTurnMessage.textContent = "it's your turn!, choose a number between 1 and 10"; //need to center the message with tailwind
  gameTurnMessage.classList.add('text-center');
  playerInput.classList.remove('hidden');
}

function handlePlayerChoice() {
  if (!isPlayerTurn) return;

  const inputVal = parseInt(playerNumberInput.value);
  if (isNaN(inputVal) || inputVal < 1 || inputVal > 10) {
      alert("insert a valid number between 1 and 10");
      return;
  }

  playerChoice = inputVal;
  total += playerChoice;
  updateScores();
  playerNumberInput.value = '';

  checkWinner();

  if (total < 100) {
      isPlayerTurn = false;
      startAITurn();
  }
}

function checkWinner() {
  if (total >= 100) {
    const winner = isPlayerTurn ? "you won!" : "AI won!";

    // Se vince il giocatore
    if (isPlayerTurn) {
      winSound.play();
    } else {
      lostSound.play();
    }

    setTimeout(() => {
      tl.to(game, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(game, {
        scale: 1,
        duration: 0.3,
        ease: "power2.in"
      })
      .to(game, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => {
          gameTurnMessage.textContent = winner;
          alert(winner);
          resetGame();
          game.classList.add('hidden');
          menu.classList.remove('hidden');
          gsap.from(menu, {
            opacity: 0,
            y: 20,
            duration: 0.3
          });
        }
      });
    }, 1000);
  }
}

function resetGame() {
  isPlayerTurn = true;
  playerChoice = 0;
  aiChoice = 0;
  total = 0;
  updateScores();
  playerNumberInput.value = '';
  gameTurnMessage.textContent = "press Play to start the game!";
  gsap.set(progressBar, {
    width: "0%"
  });
}

// Animazione iniziale al caricamento della pagina
window.addEventListener('load', () => {
  gsap.from('.container', {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: "power2.out"
  });

  gsap.from('.game-title', {
    opacity: 0,
    scale: 0.5,
    duration: 1,
    delay: 0.3,
    ease: "back.out(1.7)"
  });
});
