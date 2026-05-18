import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../css/GlassSelect.css';

const GlassSelect = ({ label, value, options, onChange, placeholder = "Válassz..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openUp, setOpenUp] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            if (spaceBelow < 260) { // Options list max height is 250px
                setOpenUp(true);
            } else {
                setOpenUp(false);
            }
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange({ target: { value: optionValue } }); // Mimic native event
        setIsOpen(false);
    };

    return (
        <div className="glass-select-wrapper" ref={containerRef}>
            {label && <label className="glass-select-label">{label}</label>}
            <div 
                className={`glass-select-control ${isOpen ? 'active' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="glass-select-value">{displayText}</span>
                <i className={`fas fa-chevron-down glass-select-chevron ${isOpen ? 'rotate' : ''}`}></i>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className={`glass-select-dropdown glass-card ${openUp ? 'open-up' : ''}`}
                        initial={{ opacity: 0, y: openUp ? -10 : 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: openUp ? -10 : 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <div className="glass-select-options-list custom-scrollbar">
                            {options.map((option) => (
                                <div 
                                    key={option.value}
                                    className={`glass-select-option ${value === option.value ? 'selected' : ''}`}
                                    onClick={() => handleSelect(option.value)}
                                >
                                    {option.label}
                                    {value === option.value && <i className="fas fa-check"></i>}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GlassSelect;
