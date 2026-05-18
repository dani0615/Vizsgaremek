import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="page-transition-wrapper"
            style={{ width: '100%', minHeight: '100%', overflow: 'visible' }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
