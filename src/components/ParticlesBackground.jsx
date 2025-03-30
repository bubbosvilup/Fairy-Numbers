// src/components/ParticlesBackground.jsx
import React from "react";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // Using slim version instead

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine); // Using loadSlim instead of loadFull
  }, []);

  return (
    <Particles
      id="particles-js"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: 0
        },
        particles: {
          number: {
            value: 50, // Increased number of particles
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: "#FFF740",
          },
          shape: {
            type: "star",
            polygon: {
              nb_sides: 5,
            },
          },
          opacity: {
            value: 0.9, // Increased opacity
            random: true,
          },
          size: {
            value: 5,
            random: true,
          },
          line_linked: {
            enable: false,
          },
          move: {
            enable: true,
            speed: 0.8, // Slightly faster movement
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "bubble",
            },
            onclick: {
              enable: true,
              mode: "push",
            },
            resize: true,
          },
          modes: {
            bubble: {
              distance: 200,
              size: 6,
              duration: 2,
              opacity: 0.8,
              speed: 3,
            },
            push: { particles_nb: 3 },
          },
        },
        retina_detect: true,
        background: {
          color: "#6b46c1", // Purple background color
          image: "",
          position: "50% 50%",
          repeat: "no-repeat",
          size: "cover",
        },
      }}
    />
  );
};

export default ParticlesBackground;
