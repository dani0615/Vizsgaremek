import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../src/pages/Home';
import * as useEventsHook from '../../src/hooks/useEvents';

// Főbb gyerek-komponensek mockolása, hogy izoláltan csak a Home-ot teszteljük
vi.mock('../../src/components/EventCard', () => ({
  default: ({ event }) => <div data-testid="event-card">{event.name}</div>
}));

vi.mock('../../src/components/ReviewModal', () => ({
  default: () => <div data-testid="review-modal"></div>
}));

vi.mock('../../src/components/3d/PartyParticles', () => ({
  default: () => <div data-testid="party-particles"></div>
}));

// Framer-motion mock
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, onClick, style }) => <div className={className} onClick={onClick} style={style}>{children}</div>,
        h1: ({ children, className }) => <h1 className={className}>{children}</h1>,
        h2: ({ children, className }) => <h2 className={className}>{children}</h2>,
        p: ({ children, className }) => <p className={className}>{children}</p>
    }
}));

const mockEvents = [
  { id: 1, name: 'Buli 1', attendeeCount: 10 },
  { id: 2, name: 'Buli 2', attendeeCount: 20 },
  { id: 3, name: 'Buli 3', attendeeCount: 30 },
  { id: 4, name: 'Buli 4', attendeeCount: 5 }, // A Home komponens slice(0, 3)-al csak 3-at kéne hogy megjelenítsen a kiemeltekbe
];

describe('Home Komponens', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Sikeres állapot szimulálása alapból
        vi.spyOn(useEventsHook, 'useEvents').mockReturnValue({
            events: mockEvents,
            loading: false,
            error: null,
            fetchEvents: vi.fn(),
        });
    });

    it('1. Sikeresen rendereli a hero szekciót és a címeket', () => {
        render(<MemoryRouter><Home /></MemoryRouter>);
        
        expect(screen.getByText('Party Pulse')).toBeTruthy();
        expect(screen.getByText(/Találd meg a legjobb bulikat BAZ megyében!/i)).toBeTruthy();
        expect(screen.getByPlaceholderText(/Miskolc, Ózd, Mezőkövesd/i)).toBeTruthy();
    });

    it('2. Maximum 3 kiemelt eseményt renderel a főoldalon', () => {
        render(<MemoryRouter><Home /></MemoryRouter>);
        
        const eventCards = screen.getAllByTestId('event-card');
        expect(eventCards.length).toBe(3);
        expect(screen.getByText('Buli 1')).toBeTruthy();
        expect(screen.getByText('Buli 2')).toBeTruthy();
        expect(screen.getByText('Buli 3')).toBeTruthy();
        // "Buli 4" -nek nem szabad ott lennie
        expect(screen.queryByText('Buli 4')).toBeNull();
    });

    it('3. Töltés közben loading felirat jelenik meg, és nem mutat eseményt', () => {
        vi.spyOn(useEventsHook, 'useEvents').mockReturnValue({
            events: [],
            loading: true,
            error: null,
            fetchEvents: vi.fn(),
        });

        render(<MemoryRouter><Home /></MemoryRouter>);
        
        expect(screen.getByText(/Események betöltése\.\.\./i)).toBeTruthy();
        // Nincsenek esemény kártyák
        expect(screen.queryByTestId('event-card')).toBeNull();
    });

    it('4. Hiba esetén hibaüzenetet mutat', () => {
        vi.spyOn(useEventsHook, 'useEvents').mockReturnValue({
            events: [],
            loading: false,
            error: 'Valami hiba történt a hálózatban!',
            fetchEvents: vi.fn(),
        });

        render(<MemoryRouter><Home /></MemoryRouter>);
        
        expect(screen.getByText(/Nem sikerült betölteni az eseményeket./i)).toBeTruthy();
    });
});
