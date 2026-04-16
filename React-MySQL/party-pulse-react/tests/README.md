# PartyPulse Tesztek

Ez a mappa két fajta tesztet tartalmaz: React komponens (egység) teszteket és Python Selenium End-to-End teszteket. A projekt többi részétől teljesen elkülönített, vagyis nem zavarja be a futást!

---

## 1. Selenium End-to-End Tesztek (Python)

A `SeleniumTests` mappában található egy Python script (`test_partypulse.py`), amivel végigkattogtathatsz alapvető funkciókat az online oldalon: `https://partypulse-9ttm.onrender.com`.

### Futtatási feltételek
1. **Python 3+** telepítve legyen a gépeden.
2. Selenium csomag telepítése:
   ```cmd
   pip install selenium
   ```
3. A teszt indítása terminalból a projekt könyvtárából:
   ```cmd
   python tests/SeleniumTests/test_partypulse.py
   ```
A teszt automatikusan megnyitja a Chrome böngészőt háttérben/előtérben, megpróbál belépni a kezdőlapra és megnézni a gombokat. Ezt kedvedre bővítheted!

---

## 2. React Egységtesztek (Vitest)

A `UnitTests` mappában található a frontendhez írt egységtesztünk, egyelőre az rendkívül fontos `EventCard.jsx` komponensünket fedi le.

Mivel a projekt Vite-ra épül, a tesztek futtatására a **Vitest** és a **React Testing Library** a legalkalmasabb.

### Egyszeri beállítás / Telepítés a frontend mappában
Oda navigálj a terminálban, ahol a `package.json` van (a `party-pulse-react` root), és futtasd ezt:
```cmd
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react
```
*(Ha bun-t használsz: `bun add -D vitest jsdom @testing-library/react` stb.)*

### Konfiguráció
Egy gyors `test` parancsot kell adni a `package.json` file `scripts` szekciójához, például így:
```json
"scripts": {
  "test": "vitest run tests/UnitTests",
  "test:watch": "vitest tests/UnitTests"
}
```

A `vite.config.js`-ben pedig megadhatod a `test` property-t:
```js
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true
  }
});
```

### Futtatás
Ezután az alábbi paranccsal hívhatod meg a teszteket:
```cmd
npm run test
```
*(Vagy ha módosítás nélkül, csak "kézzel" szeretnéd: `npx vitest tests/UnitTests`)*

Látni fogod a teszt outputját a terminálon belül, ami jelzi az esemény kártya működését, az admin ikonokat, és azt, hogy hogyan mutat a résztvevők számára stb.
