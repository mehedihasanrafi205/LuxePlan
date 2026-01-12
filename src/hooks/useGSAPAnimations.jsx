import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useGSAPAnimations = () => {
  // Fade Up Animation (Standard Reveal)
  const fadeUp = (selector, delay = 0) => {
    useEffect(() => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) return;

      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: delay,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: elements[0],
            start: "top 85%", // Start when top of element hits 85% of viewport height
            toggleActions: "play none none reverse",
          },
        }
      );
    }, [selector, delay]);
  };

  // Parallax Effect for Images
  const parallax = (selector, speed = 20) => {
    useEffect(() => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return;
  
        elements.forEach((el) => {
          gsap.to(el, {
            y: -speed, // Move up slightly as we scroll down
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      }, [selector, speed]);
  }

  // Text Reveal (Character by Character or Line)
  // Note: For simple implementation without SplitText (paid plugin), we'll do standard opacity/y stagger
  const textReveal = (selector) => {
    useEffect(() => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return;

        gsap.fromTo(elements, 
            { opacity: 0, y: 30, scale: 0.95 },
            { 
               opacity: 1, 
               y: 0, 
               scale: 1,
               duration: 1.2,
               stagger: 0.1,
               ease: "power4.out",
               scrollTrigger: {
                   trigger: elements[0],
                   start: "top 80%",
               }
            }
        )
    }, [selector]);
  };

  return { fadeUp, parallax, textReveal };
};

export default useGSAPAnimations;
