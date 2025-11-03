import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Component for the Exit-Intent Modal
const ExitIntentModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // 1. Listen for the custom event dispatched by CTAform.tsx on successful submission
  useEffect(() => {
    const handleFormSuccess = () => {
      setFormSubmitted(true);
      setIsOpen(false); // Close modal if it's open upon success
    };
    
    // Listen for the form completion event (dispatched in CTAform's handleSubmit)
    window.addEventListener('discoveryFormSuccess', handleFormSuccess);

    return () => {
      window.removeEventListener('discoveryFormSuccess', handleFormSuccess);
    };
  }, []);

  // 2. Logic to detect exit intent
  useEffect(() => {
    if (formSubmitted) return; // Don't show if the form is already done

    const handleMouseLeave = (e: MouseEvent) => {
      // Check if the cursor is leaving the top boundary of the viewport
      if (e.clientY < 50 && !isOpen && !formSubmitted) {
        // Set a small delay to avoid false triggers
        setTimeout(() => {
          setIsOpen(true);
        }, 100);
      }
    };

    // Attach the event listener to the document
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isOpen, formSubmitted]);

  // Function to open the CTAform component
  const openDiscoveryForm = () => {
    setIsOpen(false);
    // Dispatch a custom event that CTAform is listening for
    const event = new CustomEvent('openDiscoveryForm');
    window.dispatchEvent(event);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
  };

  if (formSubmitted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={() => setIsOpen(false)} // Close on outside click
        >
          <motion.div
            key="modal"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            className="relative w-full max-w-lg p-8 rounded-xl shadow-2xl text-center border-4 border-yellow-400"
            style={{
                background: 'linear-gradient(145deg, #1e2a44, #0a0f1f)',
                color: 'white',
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors text-2xl"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h3 className="text-3xl font-extrabold text-yellow-400 mb-3">
              Hold On! Don't Miss Out! 🛑
            </h3>
            <p className="text-gray-300 mb-6 text-lg">
              It looks like you're leaving. Before you go, let's start the conversation about your project. It only takes a minute!
            </p>
            
            <button
              onClick={openDiscoveryForm}
              className="inline-flex items-center justify-center px-8 py-3 rounded-full font-bold text-black shadow-lg hover:bg-yellow-300 transition-colors duration-200"
              style={{ background: "#ffdd57" }}
            >
              <span className="mr-3 text-lg">Start Discovery Now</span>
              <span className="text-xl">🚀</span>
            </button>
            
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 block w-full text-center text-sm text-gray-400 hover:text-white transition-colors"
            >
              No, I'll return later
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentModal;