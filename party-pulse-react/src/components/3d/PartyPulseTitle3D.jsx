import React, { useRef, useEffect, useCallback } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import './PartyPulseTitle3D.css';

// Memoized letter — csak a szükséges spring value-kat kapja, nem újrarenderel feleslegesen
const AnimatedLetter = React.memo(({ char, index, total, mouseX, mouseY }) => {
    const progress = index / Math.max(total - 1, 1);
    const depthOffset = (progress - 0.5) * 2;

    const rotateY = useTransform(mouseX, [-1, 1], [-28, 28]);
    const rotateX = useTransform(mouseY, [-1, 1], [10 * depthOffset, -10 * depthOffset]);

    // Lazább spring = kevesebb CPU az animáció végén
    const springCfg = { stiffness: 100, damping: 25, mass: 0.8 };
    const sRotateY = useSpring(rotateY, springCfg);
    const sRotateX = useSpring(rotateX, springCfg);

    if (char === ' ') return <span className="title-space" />;

    return (
        <motion.span
            className="title-letter"
            style={{
                rotateX: isMobile ? 0 : sRotateX,
                rotateY: isMobile ? 0 : sRotateY,
                display: 'inline-block',
                transformStyle: isMobile ? 'flat' : 'preserve-3d',
            }}
            initial={{ opacity: 0, y: 50, rotateX: -30 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{
                duration: 0.8,
                delay: index * 0.045,
                ease: [0.215, 0.61, 0.355, 1.0],
            }}
            whileHover={{
                scale: 1.18,
                z: 20,
                transition: { duration: 0.12, ease: 'easeOut' },
            }}
        >
            {/* Egész span a hit-area — nincsenek felette abszolút rétegek */}
            <span className="letter-face" aria-hidden="false">{char}</span>

            {/* Csökkentett depth rétegek: 3 elég a 3D hatáshoz, 6 helyett */}
            {[1, 2, 3].map((d) => (
                <span
                    key={d}
                    className="letter-depth"
                    style={{
                        transform: `translateZ(-${d * 4}px)`,
                        opacity: 0.5 - d * 0.12,
                    }}
                    aria-hidden="true"
                >
                    {char}
                </span>
            ))}

            <span className="letter-shine" aria-hidden="true">{char}</span>
        </motion.span>
    );
});

AnimatedLetter.displayName = 'AnimatedLetter';

const AnimatedWord = React.memo(({ word, wordIndex, letterOffset, totalLetters, mouseX, mouseY }) => (
    <span className="title-word">
        {word.split('').map((char, i) => (
            <AnimatedLetter
                key={`${wordIndex}-${i}`}
                char={char}
                index={letterOffset + i}
                total={totalLetters}
                mouseX={mouseX}
                mouseY={mouseY}
            />
        ))}
    </span>
));

AnimatedWord.displayName = 'AnimatedWord';

// Mobil detektálás — telefonon kikapcsoljuk a 3D tracking-et
const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

const PartyPulseTitle3D = () => {
    const containerRef = useRef(null);
    const rafRef = useRef(null);

    // Egy pár spring az egész containernek — nem betűnként
    const mouseX = useSpring(0, { stiffness: 70, damping: 24, mass: 1 });
    const mouseY = useSpring(0, { stiffness: 70, damping: 24, mass: 1 });

    // rAF-alapú throttling: csak 1 frame-enként frissül, nem mousemove-onként
    const handleMouseMove = useCallback((e) => {
        if (rafRef.current) return; // kihagyja ha még fut az előző frame
        rafRef.current = requestAnimationFrame(() => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
                mouseX.set(x);
                mouseY.set(y);
            }
            rafRef.current = null;
        });
    }, [mouseX, mouseY]);

    const handleMouseLeave = useCallback(() => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        mouseX.set(0);
        mouseY.set(0);
    }, [mouseX, mouseY]);

    useEffect(() => {
        if (isMobile) return; // telefonon nem kell mousemove
        const el = containerRef.current;
        if (!el) return;
        const hero = el.closest('.hero') || el;
        hero.addEventListener('mousemove', handleMouseMove, { passive: true });
        hero.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            hero.removeEventListener('mousemove', handleMouseMove);
            hero.removeEventListener('mouseleave', handleMouseLeave);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [handleMouseMove, handleMouseLeave]);

    const title = 'Party Pulse';
    const words = title.split(' ');
    let letterOffset = 0;
    const totalLetters = title.replace(/ /g, '').length;

    const containerRotateX = useTransform(mouseY, [-1, 1], [5, -5]);
    const containerRotateY = useTransform(mouseX, [-1, 1], [-7, 7]);
    const sContainerRotateX = useSpring(containerRotateX, { stiffness: 50, damping: 20 });
    const sContainerRotateY = useSpring(containerRotateY, { stiffness: 50, damping: 20 });

    return (
        <div ref={containerRef} className="party-pulse-title-wrapper">
            {/* Glow orbs — csak CSS animáció, nincs JS overhead */}
            <div className="title-glow-orb title-glow-orb--purple" aria-hidden="true" />
            <div className="title-glow-orb title-glow-orb--cyan" aria-hidden="true" />
            <div className="title-glow-orb title-glow-orb--pink" aria-hidden="true" />

            <motion.div
                className="title-3d-stage"
                style={{
                    rotateX: isMobile ? 0 : sContainerRotateX,
                    rotateY: isMobile ? 0 : sContainerRotateY,
                    transformStyle: isMobile ? 'flat' : 'preserve-3d',
                    transformPerspective: isMobile ? 'none' : 900,
                }}
            >
                <h1 className="title-heading" aria-label={title}>
                    {words.map((word, wi) => {
                        const node = (
                            <React.Fragment key={wi}>
                                {wi > 0 && <span className="title-space" />}
                                <AnimatedWord
                                    word={word}
                                    wordIndex={wi}
                                    letterOffset={letterOffset}
                                    totalLetters={totalLetters}
                                    mouseX={mouseX}
                                    mouseY={mouseY}
                                />
                            </React.Fragment>
                        );
                        letterOffset += word.length;
                        return node;
                    })}
                </h1>

                <div className="title-scan-line" aria-hidden="true" />
            </motion.div>

            {/* Sparks: mobilon kevesebb */}
            <div className="title-sparks" aria-hidden="true">
                {[...Array(isMobile ? 6 : 12)].map((_, i) => (
                    <span
                        key={i}
                        className="title-spark"
                        style={{
                            '--delay': `${(i * 0.4) % 3}s`,
                            '--x': `${10 + (i * 73) % 80}%`,
                            '--size': `${3 + (i * 17) % 4}px`,
                            '--duration': `${2.5 + (i * 0.3) % 2}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default PartyPulseTitle3D;
