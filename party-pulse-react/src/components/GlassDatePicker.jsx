import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../css/GlassDatePicker.css';

const GlassDatePicker = ({ label, value, onChange, maxDate, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openUp, setOpenUp] = useState(false);
    const [view, setView] = useState('days'); // 'days', 'months', 'years'
    const containerRef = useRef(null);

    // Current selection or today
    const selectedDate = value ? new Date(value) : null;
    const [viewDate, setViewDate] = useState(selectedDate || new Date());

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const months = [
        "Január", "Február", "Március", "Április", "Május", "Június",
        "Július", "Augusztus", "Szeptember", "Október", "November", "December"
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    const handleDateSelect = (day) => {
        const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        const isoString = date.toISOString().split('T')[0];
        onChange({ target: { value: isoString } });
        setIsOpen(false);
    };

    const handleMonthSelect = (monthIdx) => {
        setViewDate(new Date(viewDate.getFullYear(), monthIdx, 1));
        setView('days');
    };

    const handleYearSelect = (year) => {
        setViewDate(new Date(year, viewDate.getMonth(), 1));
        setView('months');
    };

    const changeMonth = (offset) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
    };

    useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            if (spaceBelow < 400) {
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
                setView('days');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const renderCalendar = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const days = daysInMonth(year, month);
        const firstDay = firstDayOfMonth(year, month);
        const startingDay = firstDay === 0 ? 6 : firstDay - 1; 

        const calendarDays = [];
        for (let i = 0; i < startingDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        for (let day = 1; day <= days; day++) {
            const dateObj = new Date(year, month, day);
            const isToday = new Date().toDateString() === dateObj.toDateString();
            const isSelected = selectedDate && selectedDate.toDateString() === dateObj.toDateString();
            const isFuture = maxDate && dateObj > new Date(maxDate);

            calendarDays.push(
                <div 
                    key={day} 
                    className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isFuture ? 'disabled' : ''}`}
                    onClick={() => !isFuture && handleDateSelect(day)}
                >
                    {day}
                </div>
            );
        }

        return calendarDays;
    };

    const formattedValue = selectedDate 
        ? selectedDate.toLocaleDateString('hu-HU', { year: 'numeric', month: '2-digit', day: '2-digit' })
        : 'Éééé. hh. nn.';

    return (
        <div className="glass-datepicker-wrapper" ref={containerRef}>
            {label && <label className="glass-datepicker-label">{label}</label>}
            <div 
                className={`glass-datepicker-control ${isOpen ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <i className="far fa-calendar-alt glass-datepicker-icon"></i>
                <span className="glass-datepicker-value">{formattedValue}</span>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className={`glass-datepicker-dropdown glass-card shadow-premium ${openUp ? 'open-up' : ''}`}
                        initial={{ opacity: 0, y: openUp ? -10 : 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: openUp ? -10 : 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="calendar-header">
                            <button onClick={() => changeMonth(-1)} type="button"><i className="fas fa-chevron-left"></i></button>
                            <div className="calendar-title">
                                <span onClick={() => setView('months')}>{months[viewDate.getMonth()]}</span>
                                <span onClick={() => setView('years')}>{viewDate.getFullYear()}</span>
                            </div>
                            <button onClick={() => changeMonth(1)} type="button"><i className="fas fa-chevron-right"></i></button>
                        </div>

                        {view === 'days' && (
                            <>
                                <div className="calendar-weekdays">
                                    {['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'].map(d => <div key={d}>{d}</div>)}
                                </div>
                                <div className="calendar-grid">
                                    {renderCalendar()}
                                </div>
                            </>
                        )}

                        {view === 'months' && (
                            <div className="calendar-selector-grid">
                                {months.map((m, idx) => (
                                    <div 
                                        key={m} 
                                        className={`selector-item ${viewDate.getMonth() === idx ? 'active' : ''}`}
                                        onClick={() => handleMonthSelect(idx)}
                                    >
                                        {m.substring(0, 3)}
                                    </div>
                                ))}
                            </div>
                        )}

                        {view === 'years' && (
                            <div className="calendar-selector-grid calendar-years-grid custom-scrollbar">
                                {years.map(y => (
                                    <div 
                                        key={y} 
                                        className={`selector-item ${viewDate.getFullYear() === y ? 'active' : ''}`}
                                        onClick={() => handleYearSelect(y)}
                                    >
                                        {y}
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GlassDatePicker;
