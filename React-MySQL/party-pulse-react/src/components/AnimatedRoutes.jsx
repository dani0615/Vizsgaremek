import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from '../pages/Home';
import Events from '../pages/Events';
import Ranking from '../pages/Ranking';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import ConfirmEmail from '../pages/ConfirmEmail';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import About from '../pages/About';
import SubmitEvent from '../pages/SubmitEvent';
import Contact from '../pages/Contact';
import Partners from '../pages/Partners';
import Terms from '../pages/Terms';
import Privacy from '../pages/Privacy';
import Cookies from '../pages/Cookies';
import Disclaimer from '../pages/Disclaimer';
import Buddies from '../pages/Buddies';
import Messages from '../pages/Messages';
import Chat from '../pages/Chat';
import PageTransition from './PageTransition';

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
                <Route path="/ranking" element={<PageTransition><Ranking /></PageTransition>} />
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
                <Route path="/confirm-email" element={<PageTransition><ConfirmEmail /></PageTransition>} />
                <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
                <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
                
                {/* Matching & Chat */}
                <Route path="/buddies" element={<PageTransition><Buddies /></PageTransition>} />
                <Route path="/messages" element={<PageTransition><Messages /></PageTransition>} />
                <Route path="/chat/:matchId" element={<PageTransition><Chat /></PageTransition>} />
                
                {/* Info & Legal Routes */}
                <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                <Route path="/submit-event" element={<PageTransition><SubmitEvent /></PageTransition>} />
                <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                <Route path="/partners" element={<PageTransition><Partners /></PageTransition>} />
                <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
                <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
                <Route path="/cookies" element={<PageTransition><Cookies /></PageTransition>} />
                <Route path="/disclaimer" element={<PageTransition><Disclaimer /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;
