import { motion, AnimatePresence } from "framer-motion";
import { pageTransition } from "../utils/animations";

/**
 * PageTransition Component
 * Wraps page content to provide smooth enter/exit animations
 * 
 * Usage:
 * <PageTransition>
 *   <YourPageContent />
 * </PageTransition>
 */
const PageTransition = ({ children }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
