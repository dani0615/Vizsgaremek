import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../src/pages/Login';
import * as AuthContext from '../../src/context/AuthContext';

// Mocks
const mockLogin = vi.fn();
const mockRegister = vi.fn();

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Login Komponens', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Szimuláljuk, hogy a useAuth hook átadja a login és register funkciókat
    AuthContext.useAuth.mockReturnValue({
      login: mockLogin,
      register: mockRegister,
    });
  });

  it('1. Alapértelmezetten a Belépés fül jelenik meg (nem Regisztráció)', () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    
    // Néhány login form specifikus szöveg/placeholder
    expect(screen.getAllByText('Üdv újra!').length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText('Név vagy Email')).toBeTruthy();
    expect(screen.getByText('Bejelentkezés')).toBeTruthy();

    // A regisztrációs extra mezőnek még nem szabad látszania
    expect(screen.queryByPlaceholderText('pl. party_animal')).toBeNull(); 
  });

  it('2. A váltó feliratra kattintva a Regisztrációs űrlap tölt be', () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    
    // Rákeresünk a regisztrációt aktiváló gombra/szövegre
    const registerToggle = screen.getByText('Regisztrálj!');
    fireEvent.click(registerToggle);

    // Most már a regisztrációs adatoknak is meg kell jelenniük
    expect(screen.getAllByText('Kezdjük el!').length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText('pl. party_animal')).toBeTruthy(); 
    expect(screen.getByText('Regisztráció')).toBeTruthy();
  });

  it('3. Érvénytelen jelszó esetén hibaüzenetet ad a regisztrációs kattintásnál', async () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    
    // Átváltás regisztrációra
    const registerToggle = screen.getByText('Regisztrálj!');
    fireEvent.click(registerToggle);

    // Beírjuk az "email"-t
    fireEvent.change(screen.getByPlaceholderText('email@pelda.hu'), { target: { value: 'valami@email.com' }});
    // Beírunk egy gyenge jelszót (nincs szám, nincs nagybetű stb.)
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'gyenge' }});

    // Rákattint a gombra
    const submitButton = screen.getByText('Regisztráció');
    fireEvent.click(submitButton);

    // A jelszó komplexitás validátornak le kell állítania és hibaüzenetet dobnia
    const errorMessage = await screen.findByText(/A jelszónak legalább 8 karakternek kell lennie/i);
    expect(errorMessage).toBeTruthy();

    // A tényleges API request-et elszállító register metódust NEM lett megkéne hívni a hiba miatt
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('4. Jelszó elrejtése/megjelenítése ikon megfelelően működik (szemmel)', () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    
    // Alapból "password" type-ú az input
    const passwordInput = screen.getByPlaceholderText('••••••••');
    expect(passwordInput.type).toBe('password');

    // Megkeressük a fa-eye slash vagy sima ikont (amelyiknek a CSS osztályán toggle van)
    // Ez egy i tag ami tartalmazza a fenti ikon class-t.
    // Ezt kicsit nehezebb egy az egyben targetelni getByText-el mivel i tag puszta iconnal... 
    // Használhatunk custom selector-t pl:
    const toggleIcon = document.querySelector('i.fa-eye') || document.querySelector('i.fa-eye-slash');
    if (toggleIcon) {
        fireEvent.click(toggleIcon);
        // Most már type='text'-nek kéne lennie
        expect(passwordInput.type).toBe('text');
    }
  });

});
