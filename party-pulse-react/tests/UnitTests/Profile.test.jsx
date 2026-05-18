import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Profile from '../../src/pages/Profile';
import * as AuthContext from '../../src/context/AuthContext';
import * as useEventsHook from '../../src/hooks/useEvents';
import { apiClient } from '../../src/services/apiConfig';

// Mocks

// API mockolása
vi.mock('../../src/services/apiConfig', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
  API_BASE_URL: 'http://localhost:5000'
}));

// AuthContext mockolása
vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Alkomponensek mockolása, felesleges renderelés elkerülése végett
vi.mock('../../src/components/EventCard', () => ({
  default: ({ event }) => <div data-testid={`event-card-${event.id}`}>{event.name}</div>
}));

vi.mock('../../src/components/ReviewModal', () => ({
  default: () => <div data-testid="review-modal"></div>
}));

// useNavigate mockolása
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Tesztadatok
const mockProfileData = {
  username: 'test_laci',
  email: 'laci@pelda.hu',
  displayName: 'Teszt Laci',
  bio: 'Ez egy nagyon menő bio teszteléshez.',
  gender: 'male',
  birthDate: '1995-05-15T00:00:00',
  lookingFor: 'friends',
  role: 'Felhasználó',
  points: 150
};

const mockEvents = [
  { id: 1, name: 'Jövőbeli Buli', hasEnded: false, isAttending: true, isFavorite: false },
  { id: 2, name: 'Múltbeli Buli', hasEnded: true, isAttending: true, isFavorite: false },
  { id: 3, name: 'Kedvenc Esemény', hasEnded: false, isAttending: false, isFavorite: true },
];

describe('Profile Komponens', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        
        // Alapértelmezett bejelentkezett felhasználó mockolása
        AuthContext.useAuth.mockReturnValue({
            user: { id: 1, username: 'test_laci' },
            logout: vi.fn(),
            isAuthenticated: true,
            loading: false
        });

        // Események hook állapot mockolása
        vi.spyOn(useEventsHook, 'useEvents').mockReturnValue({
            events: mockEvents,
            loading: false,
            fetchEvents: vi.fn(),
        });

        // API válasz mockolása a GET /api/User/me végponthoz
        apiClient.get.mockResolvedValue({ data: mockProfileData });
    });

    it('1. Átirányít a /login oldalra, ha nem hitelesített', async () => {
        AuthContext.useAuth.mockReturnValue({
            isAuthenticated: false,
            loading: false
        });

        render(<MemoryRouter><Profile /></MemoryRouter>);

        // Ha nincs belépve, hívja meg a navigate('/login') függvényt
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('2. Sikeresen API-ról lekéri és megjeleníti a profil adatokat', async () => {
        render(<MemoryRouter><Profile /></MemoryRouter>);

        // Meg kell várnunk, amíg a "Profil betöltése..." felirat eltűnik a DOM-ból
        await waitFor(() => {
            expect(screen.queryByText(/Profil betöltése.../i)).toBeNull();
        });

        // API adatok ellenőrzése
        expect(screen.getByText('Teszt Laci')).toBeTruthy();
        expect(screen.getByText('laci@pelda.hu')).toBeTruthy();
        expect(screen.getByText(/150 pont/i)).toBeTruthy();
        expect(screen.getByText('Ez egy nagyon menő bio teszteléshez.')).toBeTruthy();
        expect(screen.getByText('Férfi')).toBeTruthy(); // a nem: male alapján
    });

    it('3. Sikeresen szétválogatja a Közelgő, Múltbeli és Kedvenc eseményeket', async () => {
        render(<MemoryRouter><Profile /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.queryByText(/Profil betöltése.../i)).toBeNull();
        });

        // A mockEvent tömbből pontosan azt kell leképeznie
        expect(screen.getByTestId('event-card-1')).toBeTruthy(); // isAttending, hasn't ended = Jövőbeli
        expect(screen.getByTestId('event-card-2')).toBeTruthy(); // isAttending, has ended = Múltbeli
        expect(screen.getByTestId('event-card-3')).toBeTruthy(); // isFavorite = Kedvenc
    });

    it('4. Gombra kattintva átvált szerkesztő módba és kitölti a formot', async () => {
        render(<MemoryRouter><Profile /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.getByText('Szerkesztés')).toBeTruthy();
        });

        // Szerkesztés gomb
        fireEvent.click(screen.getByText('Szerkesztés'));

        // Most űrlap jelenik meg "Változtatások mentése" gombbal
        expect(screen.getByText('Változtatások mentése')).toBeTruthy();
        
        // Az inputok értékének meg kell egyeznie a mockProfileData-val
        const emailInput = screen.getByDisplayValue('laci@pelda.hu');
        expect(emailInput).toBeTruthy();

        const bioInput = screen.getByDisplayValue('Ez egy nagyon menő bio teszteléshez.');
        expect(bioInput).toBeTruthy();
    });

    it('5. Szerkesztés elmentése sikeres API hívást indít', async () => {
        // Mockoljuk a put válaszát
        apiClient.put.mockResolvedValue({ data: { message: 'Sikeres mentés' }});
        
        render(<MemoryRouter><Profile /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.getByText('Szerkesztés')).toBeTruthy();
        });

        // 1. Megnyitjuk a szerkesztést
        fireEvent.click(screen.getByText('Szerkesztés'));

        // 2. Módosítjuk az email-t
        const emailInput = screen.getByDisplayValue('laci@pelda.hu');
        fireEvent.change(emailInput, { target: { value: 'ujemail@pelda.hu' } });

        // 3. Mentés gomb nyomása
        fireEvent.click(screen.getByText('Változtatások mentése'));

        // Várakozunk amíg eltűnik a szerkesztő nézet / sikeres üzenet jelenik meg
        await waitFor(() => {
            expect(apiClient.put).toHaveBeenCalledTimes(1);
        });

        // Megbizonyosodunk róla, hogy a PUT az új adatokat küldte
        expect(apiClient.put).toHaveBeenCalledWith('/api/User/profile', expect.objectContaining({
            email: 'ujemail@pelda.hu'
        }));
    });
});
