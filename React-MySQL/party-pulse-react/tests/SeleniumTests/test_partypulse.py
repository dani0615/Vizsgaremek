import os
import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class PartyPulseTests(unittest.TestCase):
    def setUp(self):
        options = webdriver.ChromeOptions()
        # Headless is enabled by default for stability, but can be disabled to see the browser
        # To disable headless, uncomment the line below or remove it from the code
        # options.add_argument('--headless') 
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--window-size=1920,1080') # Ensure desktop view
        self.driver = webdriver.Chrome(options=options)
        self.driver.implicitly_wait(10)
        self.base_url = "https://partypulse-9ttm.onrender.com"
        
        # Ensure screenshot directory exists
        self.screenshot_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "screenshots")
        if not os.path.exists(self.screenshot_dir):
            os.makedirs(self.screenshot_dir)

    def take_screenshot(self, name):
        """Segédfüggvény képernyőkép készítéséhez"""
        filename = f"{name}_{int(time.time())}.png"
        filepath = os.path.join(self.screenshot_dir, filename)
        self.driver.save_screenshot(filepath)
        print(f"Képernyőkép mentve: {filepath}")

    def accept_age_gate(self):
        """Elfogadja a korhatár figyelmeztetést (AgeGate)"""
        try:
            print("Checking for Age Gate...")
            # Várunk a korhatár gombra (Elmúltam 16)
            accept_btn = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'Elmúltam 16')]"))
            )
            accept_btn.click()
            print("Age Gate accepted.")
            time.sleep(1) # Várunk az animációra
        except Exception as e:
            print("Age Gate not found or already accepted.")

    def test_full_navigation_and_screenshots(self):
        """Végigjárja az oldalakat és képeket készít"""
        self.driver.get(self.base_url)
        self.accept_age_gate()
        
        # 1. Homepage
        print("Testing homepage...")
        self.take_screenshot("1_homepage")
        
        # 2. Bulik (Events)
        print("Navigating to Bulik...")
        try:
            bulik_link = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.LINK_TEXT, "Bulik"))
            )
            bulik_link.click()
            time.sleep(2) # Várunk a betöltésre
            self.take_screenshot("2_bulik_page")
            # Ellenőrizzük, hogy van-e tartalom (pl. kereső vagy események)
            self.assertTrue("events" in self.driver.current_url.lower(), "Nem a Bulik oldalon vagyunk.")
        except Exception as e:
            print(f"Hiba a Bulik oldalra navigáláskor: {e}")
            self.fail("Nem sikerült megnyitni a Bulik oldalt.")

        # 3. Ranglista (Ranking)
        print("Navigating to Ranglista...")
        try:
            ranglista_link = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.LINK_TEXT, "Ranglista"))
            )
            ranglista_link.click()
            time.sleep(2)
            self.take_screenshot("3_ranglista_page")
            self.assertTrue("ranking" in self.driver.current_url.lower(), "Nem a Ranglista oldalon vagyunk.")
        except Exception as e:
            print(f"Hiba a Ranglista oldalra navigáláskor: {e}")
            self.fail("Nem sikerült megnyitni a Ranglista oldalt.")

        # 4. Login page
        print("Navigating to Login...")
        try:
            # Re-find the login button (Belépés)
            selectors = [
                (By.LINK_TEXT, "Belépés"),
                (By.CLASS_NAME, "btn-login-premium"),
                (By.XPATH, "//a[contains(@href, '/login')]")
            ]
            login_btn = None
            for by, val in selectors:
                try:
                    login_btn = self.driver.find_element(by, val)
                    if login_btn.is_displayed():
                        break
                except:
                    continue
            
            if login_btn:
                self.driver.execute_script("arguments[0].click();", login_btn)
                time.sleep(2)
                self.take_screenshot("4_login_page")
                self.assertTrue("login" in self.driver.current_url.lower(), "Nem a Login oldalon vagyunk.")
            else:
                self.fail("Nem található a Belépés gomb.")
        except Exception as e:
            print(f"Hiba a Login oldalra navigáláskor: {e}")
            self.fail("Nem sikerült megnyitni a Login oldalt.")

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
