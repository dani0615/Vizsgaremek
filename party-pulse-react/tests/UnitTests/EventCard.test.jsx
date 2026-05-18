import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import EventCard from '../../src/components/EventCard';
import { AuthProvider } from '../../src/context/AuthContext';

// Felülírjuk az auth contextet a tesztekhez, hogy bejelentkezett felhasználót mutassunk
vi.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: true }),
  AuthProvider: ({ children }) => <div>{children}</div>
}));

// Framer-motion mockolása, hogy ne legyen gond az animációkkal a tesztek alatt (jsdom-al nem mindig megy jól)
vi.mock('framer-motion', () => ({
  motion: {
      div: ({ children, className, onClick, style }) => (
        <div className={className} onClick={onClick} style={style}>{children}</div>
      ),
      button: ({ children, className, onClick, disabled }) => (
        <button className={className} onClick={onClick} disabled={disabled}>{children}</button>
      )
  },
  AnimatePresence: ({ children }) => <>{children}</>
}));

// API kliens mock, hogy ne induljon el valódi hálózati kérés
vi.mock('../../src/services/apiConfig', () => ({
  apiClient: {
    post: vi.fn(),
  }
}));

const mockEvent = {
  id: 1,
  name: 'Teszt Buli Név',
  desc: 'Ez egy nagyon szuper teszt esemény leírása.',
  city: 'Budapest',
  place: 'Egyetem Klub',
  displayDate: '2026. Július 15.',
  img: 'test.jpg',
  type: 'Buli',
  hasEnded: false,
  isReviewed: false
};

describe('EventCard React Komponens', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Alaphelyzetbe állít minden mockolt függvényt
  });

  it('1. Sikeresen rendereli az esemény alapinformációit', () => {
    render(<EventCard event={mockEvent} />);
    
    // Név, Dátum, Helyszín és leírás meglétének ellenőrzése
    expect(screen.getByText('Teszt Buli Név')).toBeTruthy();
    expect(screen.getByText(/Budapest, Egyetem Klub/i)).toBeTruthy();
    expect(screen.getByText(/2026. Július 15./i)).toBeTruthy();
    expect(screen.getByText('Ez egy nagyon szuper teszt esemény leírása.')).toBeTruthy();
  });

  it('2. Megjeleníti a résztvevők számát pontosan', () => {
    // Adunk át random résztvevő számot
    render(<EventCard event={mockEvent} attendeeCount={42} isAttending={false} />);
    
    // A komponens kiírja, hogy "42 fő megy"
    expect(screen.getByText(/42 fő megy/i)).toBeTruthy();
  });

  it('3. Sikeresen meghívja a jelentkezés gombot ha nincs lejárva az esemény', () => {
    render(<EventCard event={mockEvent} attendeeCount={0} isAttending={false} />);
    
    // Mivel hasEnded false, keresünk egy gombot a "Ott leszek!" szöveggel.
    const attendButton = screen.getByText(/Ott leszek!/i);
    expect(attendButton).toBeTruthy();
    
    // Szimulaturk egy kattintást, bár az API hívás mockolva van. Hiba nem szabad hogy jöjjön
    fireEvent.click(attendButton);
  });

  it('4. Adminisztrátor esetén megjelenik a szerkesztés és törlés ikon', () => {
    const onEditMock = vi.fn();
    const onDeleteMock = vi.fn();

    render(
      <EventCard 
        event={mockEvent} 
        canEdit={true} 
        canDelete={true} 
        onEdit={onEditMock} 
        onDelete={onDeleteMock} 
      />
    );

    // Kikeressük az admin gombokat (szerkesztés / törlés) - HTML title tag alapján
    const editBtn = screen.getByTitle('Szerkesztés');
    const deleteBtn = screen.getByTitle('Törlés');

    expect(editBtn).toBeTruthy();
    expect(deleteBtn).toBeTruthy();

    // Rákattintunk
    fireEvent.click(editBtn);
    expect(onEditMock).toHaveBeenCalledTimes(1);

    fireEvent.click(deleteBtn);
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });

  it('5. Lejárt esemény esetén "Befejeződött" feliratot mutat, és ott leszek gomb nincs jelen', () => {
    const endedEvent = { ...mockEvent, hasEnded: true };
    render(<EventCard event={endedEvent} />);

    // Meg kell, hogy jelenjen a flag-checkered Befejeződött felirat
    expect(screen.getByText(/Befejeződött/i)).toBeTruthy();

    // Az "Ott leszek!" szövegnek pedig nem szabad megjelennie, mivel feltételhez kötött
    const attendButton = screen.queryByText(/Ott leszek!/i);
    expect(attendButton).toBeNull();
  });
});
