
// ============================================
// ACCESSIBILITY & PERFORMANCE
// ============================================

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation duration based on user preferences
 * @param {number} defaultDuration - Default duration in seconds
 * @returns {number} - Adjusted duration
 */
export const getAnimationDuration = (defaultDuration = 0.6) => {
  return prefersReducedMotion() ? 0 : defaultDuration;
};

/**
 * Get easing function based on type
 * @param {string} type - 'easeIn' | 'easeOut' | 'easeInOut' | 'spring'
 * @returns {array|string}
 */
export const getEasing = (type = 'easeOut') => {
  if (prefersReducedMotion()) return 'linear';
  
  const easings = {
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    spring: { type: 'spring', stiffness: 300, damping: 30 },
  };
  
  return easings[type] || easings.easeOut;
};

// ============================================
// FRAMER MOTION VARIANTS
// ============================================

/**
 * Fade animation variants
 */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: getAnimationDuration(0.6),
      ease: getEasing('easeOut'),
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: getAnimationDuration(0.3),
      ease: getEasing('easeIn'),
    },
  },
};

/**
 * Slide animation variants
 * @param {string} direction - 'up' | 'down' | 'left' | 'right'
 * @param {number} distance - Distance in pixels
 */
export const slideIn = (direction = 'up', distance = 50) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return {
    hidden: {
      opacity: 0,
      ...directions[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: getAnimationDuration(0.6),
        ease: getEasing('easeOut'),
      },
    },
    exit: {
      opacity: 0,
      ...directions[direction],
      transition: {
        duration: getAnimationDuration(0.3),
        ease: getEasing('easeIn'),
      },
    },
  };
};

/**
 * Scale animation variants
 */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: getAnimationDuration(0.4),
      ease: getEasing('easeOut'),
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: getAnimationDuration(0.3),
      ease: getEasing('easeIn'),
    },
  },
};

/**
 * Stagger container for children animations
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: getAnimationDuration(0.1),
      delayChildren: getAnimationDuration(0.2),
    },
  },
};

/**
 * Stagger item for use within staggerContainer
 */
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: getAnimationDuration(0.5),
      ease: getEasing('easeOut'),
    },
  },
};

/**
 * Modal animation variants
 */
export const modalAnimation = {
  backdrop: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: getAnimationDuration(0.3) },
    },
    exit: {
      opacity: 0,
      transition: { duration: getAnimationDuration(0.2) },
    },
  },
  modal: {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: getAnimationDuration(0.4),
        ease: getEasing('easeOut'),
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: {
        duration: getAnimationDuration(0.3),
        ease: getEasing('easeIn'),
      },
    },
  },
};

/**
 * Button hover variants
 */
export const buttonHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: getAnimationDuration(0.2),
      ease: getEasing('easeOut'),
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: getAnimationDuration(0.1),
    },
  },
};

/**
 * Page transition variants
 */
export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: getAnimationDuration(0.5),
      ease: getEasing('easeOut'),
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: getAnimationDuration(0.3),
      ease: getEasing('easeIn'),
    },
  },
};

// ============================================
// GSAP ANIMATION FUNCTIONS
// ============================================

/**
 * Scroll-triggered fade in animation
 * @param {string|Element} target - Selector or element
 * @param {object} options - GSAP options
 */
export const scrollFadeIn = (target, options = {}) => {
  if (prefersReducedMotion()) return null;
  
  // Dynamic import to avoid SSR issues
  import('gsap').then(({ gsap }) => {
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      
      gsap.from(target, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: target,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
          ...options.scrollTrigger,
        },
        ...options,
      });
    });
  });
};

/**
 * Scroll-triggered slide in animation
 * @param {string|Element} target - Selector or element
 * @param {string} direction - 'left' | 'right' | 'up' | 'down'
 * @param {object} options - GSAP options
 */
export const scrollSlideIn = (target, direction = 'up', options = {}) => {
  if (prefersReducedMotion()) return null;
  
  const directions = {
    up: { y: 100 },
    down: { y: -100 },
    left: { x: 100 },
    right: { x: -100 },
  };

  import('gsap').then(({ gsap }) => {
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      
      gsap.from(target, {
        opacity: 0,
        ...directions[direction],
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: target,
          start: 'top 80%',
          toggleActions: 'play none none none',
          ...options.scrollTrigger,
        },
        ...options,
      });
    });
  });
};

/**
 * Stagger reveal multiple elements on scroll
 * @param {string|Element} container - Container selector
 * @param {string} children - Children selector
 * @param {object} options - GSAP options
 */
export const staggerReveal = (container, children, options = {}) => {
  if (prefersReducedMotion()) return null;
  
  import('gsap').then(({ gsap }) => {
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      
      gsap.from(children, {
        opacity: 0,
        y: 50,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          toggleActions: 'play none none none',
          ...options.scrollTrigger,
        },
        ...options,
      });
    });
  });
};

/**
 * Parallax scroll effect
 * @param {string|Element} target - Element to animate
 * @param {number} speed - Parallax speed (0.5 = half speed)
 */
export const parallax = (target, speed = 0.5) => {
  if (prefersReducedMotion()) return null;
  
  import('gsap').then(({ gsap }) => {
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      
      gsap.to(target, {
        y: (i, el) => (1 - speed) * ScrollTrigger.maxScroll(window),
        ease: 'none',
        scrollTrigger: {
          start: 0,
          end: 'max',
          invalidateOnRefresh: true,
          scrub: 0,
        },
      });
    });
  });
};

/**
 * Counter animation (count up)
 * @param {string|Element} target - Element containing number
 * @param {number} endValue - Final number
 * @param {object} options - GSAP options
 */
export const counterAnimation = (target, endValue, options = {}) => {
  if (prefersReducedMotion()) {
    // Instantly show final value
    if (typeof target === 'string') {
      document.querySelector(target).textContent = endValue;
    } else {
      target.textContent = endValue;
    }
    return null;
  }
  
  import('gsap').then(({ gsap }) => {
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      
      const obj = { value: 0 };
      const element = typeof target === 'string' ? document.querySelector(target) : target;
      
      gsap.to(obj, {
        value: endValue,
        duration: 2,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          toggleActions: 'play none none none',
          ...options.scrollTrigger,
        },
        onUpdate: () => {
          element.textContent = Math.floor(obj.value);
        },
        ...options,
      });
    });
  });
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Cleanup ScrollTrigger instances
 * Useful for component unmount
 */
export const cleanupScrollTriggers = () => {
  import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  });
};

/**
 * Refresh ScrollTrigger
 * Useful after content changes
 */
export const refreshScrollTriggers = () => {
  import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
    ScrollTrigger.refresh();
  });
};
