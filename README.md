# Count Your Calories

## Współautorzy:
- Tomasz Mol - [tomaszmol](https://github.com/USERNAME)
- Bartosz Ludwin - [FalcO0O](https://github.com/FalcO0O)
- Dominik Kozimor - [Elemental-afk](https://github.com/Elemental-afk)


## Opis projektu

WDAI_Projekt to aplikacja internetowa stworzona w ramach zajęć z Wstępu do Aplikacji Internetowych. Aplikacja umożliwia użytkownikom zarządzanie posiłkami, w tym przeglądanie historii spożywanych posiłków, liczenie zapotrzebowania kalorycznego oraz BMI, przeglądanie przepisów.

## Funkcje

- **Rejestracja i logowanie użytkowników**: Użytkownicy mogą tworzyć konta oraz logować się do aplikacji.
- **Historia posiłków**: Przeglądanie historii spożywanych posiłków z podziałem na dni.
- **Panel administracyjny**: Dostęp dla administratorów do zarządzania użytkownikami i treściami. TODO

## Wymagania systemowe

- Node.js w wersji 14.x lub nowszej
- npm w wersji 6.x lub nowszej
- SQLite jako baza danych

## Instalacja

1. **Klonowanie repozytorium**

   ```bash
   git clone https://github.com/FalcO0O/WDAI_Projekt.git
   cd WDAI_Projekt
   ```

2. **Instalacja zależności**

   ```bash
   npm run install-all
   ```

3. **Uruchomienie aplikacji**

   ```bash
   npm run start-all
   ```

   Aplikacja będzie dostępna pod adresem `http://localhost:3000`.

   Nie mylic z `npm install` i `npm start`.
   W naszym podejsciu instalujemy wszystkie zależności za pomoca skryptów i jednocześnie uruchamiamy backend i frontend.

## Użycie

Po uruchomieniu aplikacji:

- **Rejestracja**: Utwórz nowe konto, podając wymagane dane.
- **Logowanie**: Zaloguj się, używając wcześniej utworzonych danych.
- **Historia posiłków**: Sprawdź historię spożywanych posiłków w odpowiedniej sekcji.
- **Panel administracyjny**: Jeśli jesteś administratorem, uzyskasz dostęp do panelu administracyjnego, gdzie możesz zarządzać użytkownikami i treściami.


## Wizualizacja

### Strona główna
![Opis zdjęcia](images/1.png)

### Przewijanie strony głównej
![Opis zdjęcia](images/2.png)  
![Opis zdjęcia](images/3.png)

### Strona kalkulatora BMI
![Opis zdjęcia](images/4.png)

### Strona rejestracji
![Opis zdjęcia](images/5.png)

### Strona rejestracji - wprowadzone dane
![Opis zdjęcia](images/6.png)

### Strona rejestracji - rejestracja pomyślna
![Opis zdjęcia](images/7.png)

### Strona logowania
![Opis zdjęcia](images/8.png)

### Strona kalkulatora kalorii
![Opis zdjęcia](images/9.png)

### Strona kalkulatora kalorii - przeliczenie kalorii
![Opis zdjęcia](images/10.png)

### Strona "Zaplanuj posiłek"
![Opis zdjęcia](images/11.png)

### Strona "Zaplanuj posiłek" - wprowadzanie posiłku
![Opis zdjęcia](images/12.png)

### Strona "Zaplanuj posiłek" - zaktualizowany widok
![Opis zdjęcia](images/13.png)

### Strona "Zaplanuj posiłek" - zmiana daty
![Opis zdjęcia](images/14.png)

### Strona "Przepisy"
![Opis zdjęcia](images/15.png)

### Strona "Przepisy" - widok opisu przepisu
![Opis zdjęcia](images/16.png)

## Licencja

Ten projekt jest licencjonowany na podstawie licencji MIT. Szczegóły znajdują się w pliku [LICENSE](./LICENSE).
