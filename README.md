# Kochrezepte App

Mobile Rezept-App fuer das Modul **Entwicklung mobiler Applikationen**.

Die App wurde mit **Ionic React**, **TypeScript**, **Capacitor** und **Supabase** umgesetzt. Sie unterstuetzt das Suchen, Erstellen, Bewerten und Planen von Rezepten. Aus geplanten Rezepten kann automatisch eine Einkaufsliste erzeugt werden.

## Inhaltsverzeichnis

- [Projektueberblick](#projektueberblick)
- [Hauptfunktionen und Seiten](#hauptfunktionen-und-seiten)
- [Technologien](#technologien)
- [Projekt starten](#projekt-starten)
- [Supabase einrichten](#supabase-einrichten)
- [Android starten](#android-starten)
- [Projektstruktur](#projektstruktur)
- [Datenbank](#datenbank)

## Projektueberblick

Die Kochrezepte App ist eine mobile Anwendung zur Verwaltung und Planung von Rezepten. Nutzer koennen Rezepte durchsuchen, eigene Rezepte erstellen, Favoriten speichern, Bewertungen abgeben und Kommentare schreiben.

Ein besonderer Teil der App ist der Wochenplaner: Rezepte koennen einzelnen Wochentagen zugeordnet werden. Aus diesen geplanten Rezepten wird anschliessend eine Einkaufsliste erzeugt.

Die App bietet zwei Nutzungsarten:

| Modus | Beschreibung |
| --- | --- |
| Gastmodus | Rezepte ansehen und suchen ohne Anmeldung |
| Angemeldeter Nutzer | Rezepte erstellen, Favoriten speichern, bewerten, kommentieren und planen |

Der Gastmodus ist fuer Nutzer gedacht, die die App ohne Registrierung ausprobieren moechten. Sobald Daten dauerhaft gespeichert werden sollen, wird ein angemeldeter Nutzer benoetigt. Dadurch koennen Favoriten, Bewertungen, Kommentare und Wochenplaene eindeutig einem Benutzerkonto zugeordnet werden.

## Hauptfunktionen und Seiten

### Startseite

| Route | Beschreibung |
| --- | --- |
| `http://localhost:8100/home` | Uebersicht mit Rezeptkarten und Kategorien |

Auf der Startseite werden Rezepte als Karten angezeigt. Jede Karte zeigt Rezeptbild, Titel, Kategorie, Dauer, Bewertung sowie Buttons fuer Favoriten und Teilen.

Die Kategorien helfen dabei, Rezepte schnell nach Typ zu filtern, zum Beispiel Vegan, Dessert, Pasta oder Hauptgericht.

Die Startseite dient damit als zentrale Uebersicht der App. Von dort aus gelangt der Nutzer direkt zu den Rezeptdetails oder kann ueber die Suche gezielter nach passenden Rezepten suchen.

### Suche

| Route | Beschreibung |
| --- | --- |
| `http://localhost:8100/search` | Suche nach Rezepten, Beschreibungen und Zutaten |

Die Suche unterstuetzt zwei Modi:

- Suche nach Rezeptnamen oder Beschreibung
- Suche nach Zutaten

Zusaetzlich kann die Suche mit Kategorien kombiniert werden.

Die Zutatensuche ist besonders nuetzlich, wenn bereits bestimmte Lebensmittel vorhanden sind und passende Rezepte dazu gefunden werden sollen.

### Rezeptdetails

| Route | Beschreibung |
| --- | --- |
| `http://localhost:8100/recipes/:id` | Detailansicht eines einzelnen Rezepts |

Die Rezeptdetailseite zeigt alle wichtigen Informationen:

- Bild, Titel und Beschreibung
- Kategorie und Zubereitungszeit
- Durchschnittsbewertung
- Zutatenliste
- Zubereitungsschritte
- Bewertungsbereich
- Kommentare

Die Portionsanzahl kann angepasst werden. Die Zutatenmengen werden passend dazu neu berechnet.

Auf dieser Seite befinden sich auch die interaktiven Funktionen zu einem Rezept. Nutzer koennen eine Bewertung abgeben, Kommentare lesen oder schreiben und den Rezeptlink teilen.

### Rezept erstellen

| Route | Beschreibung |
| --- | --- |
| `http://localhost:8100/recipes/new` | Formular zum Erstellen eines neuen Rezepts |

Angemeldete Nutzer koennen eigene Rezepte erstellen. Das Formular speichert Grunddaten, Bild, Zutaten, Mengen, Einheiten und Zubereitungsschritte.

Beim Speichern wird das Rezept strukturiert in Supabase abgelegt. Allgemeine Rezeptdaten werden in `recipes` gespeichert, Zutaten in `recipe_ingredients` und Zubereitungsschritte in `recipe_steps`.

### Rezept bearbeiten

| Route | Beschreibung |
| --- | --- |
| `http://localhost:8100/recipes/:id/edit` | Formular zum Bearbeiten eigener Rezepte |

Nur der Ersteller eines Rezepts darf dieses Rezept bearbeiten oder loeschen. Beispielrezepte und Rezepte anderer Nutzer bleiben geschuetzt.

Diese Einschraenkung wird nicht nur in der Benutzeroberflaeche beruecksichtigt, sondern auch ueber Supabase Row Level Security abgesichert.

### Favoriten

| Route | Beschreibung |
| --- | --- |
| `http://localhost:8100/favorites` | Liste gespeicherter Lieblingsrezepte |

Favoriten werden nutzerbezogen gespeichert. Jeder angemeldete Nutzer sieht nur seine eigenen Favoriten.

So kann jeder Nutzer eine eigene Sammlung von Lieblingsrezepten aufbauen, ohne dass diese Daten mit anderen Nutzern vermischt werden.

### Bewertungen

| Route | Beschreibung |
| --- | --- |
| `http://localhost:8100/recipes/:id` | Bewertungen werden auf der Rezeptdetailseite abgegeben |

Pro Nutzer und Rezept wird eine Bewertung gespeichert. Die Datenbank fuehrt automatisch zwei Werte am Rezept:

| Feld | Bedeutung |
| --- | --- |
| `rating` | Durchschnittliche Bewertung |
| `rating_count` | Anzahl der Bewertungen |

### Kommentare

| Route | Beschreibung |
| --- | --- |
| `http://localhost:8100/recipes/:id` | Kommentare befinden sich auf der Rezeptdetailseite |

Angemeldete Nutzer koennen Kommentare schreiben. Eigene Kommentare koennen wieder geloescht werden.

Technische Fehler werden fuer Nutzer vereinfacht angezeigt. Detaillierte Fehlermeldungen werden nur in der Entwicklerkonsole geloggt.

### Wochenplaner

| Route | Beschreibung |
| --- | --- |
| `http://localhost:8100/planner` | Rezepte Wochentagen zuordnen |

Im Wochenplaner werden Rezepte einzelnen Tagen zugeordnet. Diese Daten werden in Supabase gespeichert und gehoeren zum jeweiligen Nutzer.

Der Wochenplaner ist die Grundlage fuer die Einkaufsliste. Nur Rezepte, die im Planer eingetragen sind, werden fuer die Einkaufsliste beruecksichtigt.

### Einkaufsliste

| Route | Beschreibung |
| --- | --- |
| `http://localhost:8100/shopping-list` | Einkaufsliste aus geplanten Rezepten |

Die Einkaufsliste wird aus den Zutaten der geplanten Rezepte generiert. Abgehakte Eintraege koennen je nach Einstellung lokal gespeichert werden.

Dadurch kann aus der Wochenplanung direkt eine praktische Liste fuer den Einkauf erstellt werden. Die Zutaten bleiben nachvollziehbar, weil sie aus den geplanten Rezepten stammen.

### Login, Registrierung und Profil

| Route | Beschreibung |
| --- | --- |
| `http://localhost:8100/login` | Login, Profil und Logout |
| `http://localhost:8100/register` | Registrierung |

Die App unterstuetzt Login, Registrierung und Gastzugriff. Der Gastmodus erlaubt das Anzeigen und Suchen von Rezepten, sperrt aber nutzerbezogene Funktionen.

Nach erfolgreichem Login verwendet die App die Supabase-Session, um nutzerbezogene Daten zu laden. Dazu gehoeren Favoriten, Bewertungen, Kommentare und Wochenplaner-Eintraege.

### Einstellungen

| Route | Beschreibung |
| --- | --- |
| `http://localhost:8100/settings` | App-Einstellungen |

In den Einstellungen koennen Darstellungs- und Einkaufslistenoptionen angepasst werden.

Die Einstellungen werden lokal gespeichert und beim naechsten Start der App wieder geladen.

## Technologien

| Technologie | Zweck |
| --- | --- |
| Ionic React | Mobile UI-Komponenten |
| React | Komponenten und State Management |
| TypeScript | Typisierte Entwicklung |
| Vite | Entwicklungsserver und Build |
| Capacitor | Android-Integration |
| Supabase | Datenbank, Authentifizierung und Storage |
| Swiper | Slider auf der Home-Seite |
| Cypress | Einfache End-to-End-Tests |

## Projekt starten

### Voraussetzungen

- Node.js und npm
- Ionic CLI
- Supabase-Projekt mit URL und Anon Key

Falls die Ionic CLI noch nicht installiert ist, kann sie global installiert werden:

```bash
npm install -g @ionic/cli
```

### Installation

```bash
npm install
```

Falls Swiper noch nicht installiert ist:

```bash
npm install swiper
```

### App starten

```bash
ionic serve
```

Die App ist danach normalerweise erreichbar unter:

```text
http://localhost:8100
```

Alternativ kann der Vite-Dev-Server verwendet werden:

```bash
npm run dev
```

Fuer die normale Entwicklung und Vorfuehrung reicht `ionic serve`, weil die App damit direkt im Browser gestartet wird.

## Supabase einrichten

Lokal muss eine `.env` Datei mit den Supabase-Zugangsdaten angelegt werden:

```text
VITE_SUPABASE_URL=https://stdwyicbjnozagmgimpy.supabase.co/
VITE_SUPABASE_ANON_KEY=sb_publishable_pHyTEUfnNQz4ZsmvTphnVA_Ubm5TNWc
```

## Android starten

Web-Build erstellen:

```bash
npm run build
```

Capacitor synchronisieren:

```bash
npx cap sync android
```

Android Studio oeffnen:

```bash
npx cap open android
```

Danach kann die App in Android Studio auf einem Emulator oder echten Geraet gestartet werden.

Wenn sich der Web-Code aendert, muss vor einem erneuten Android-Test wieder ein Build erstellt und Capacitor synchronisiert werden.

## Projektstruktur

```text
src/
  assets/          Bilder und statische Dateien
  components/      Wiederverwendbare UI-Komponenten
  hooks/           React Hooks
  lib/             Supabase Client
  mappers/         Mapping zwischen Datenbank und App
  models/          TypeScript Modelle
  pages/           App-Seiten
  repositories/    Datenzugriff auf Supabase
  theme/           Globale Styles
  utils/           Hilfsfunktionen
  App.tsx          Routing, Navigation und Auth-Zugriff
  main.tsx         Einstiegspunkt

supabase/
  schema.sql       Datenbankschema
  rls.sql          Sicherheitsregeln
  seed.sql         Beispielrezepte

android/           Capacitor Android-Projekt
cypress/           Cypress Tests
```

## Datenbank

Die wichtigsten Tabellen:

| Tabelle | Zweck |
| --- | --- |
| `profiles` | Nutzerprofile |
| `recipe_categories` | Kategorien |
| `recipes` | Hauptdaten der Rezepte |
| `recipe_ingredients` | Zutaten |
| `recipe_steps` | Zubereitungsschritte |
| `favorites` | Favoriten pro Nutzer |
| `ratings` | Bewertungen |
| `comments` | Kommentare |
| `weekly_planner` | Wochenplaner-Eintraege |

Der Datenzugriff ist in Repository-Dateien gekapselt:

```text
src/repositories/recipeRepository.ts
src/repositories/favoriteRepository.ts
src/repositories/ratingRepository.ts
src/repositories/commentRepository.ts
src/repositories/plannerRepository.ts
```

Die Seiten greifen dadurch nicht direkt auf Supabase zu. Datenbanklogik, Fehlerbehandlung und Mapping bleiben zentral in den Repository- und Mapper-Dateien organisiert.

## Vorhandene Routen

```text
/welcome              Welcome-Seite
/onboarding           Onboarding
/login                Login und Profil
/register             Registrierung
/home                 Startseite
/search               Suche
/favorites            Favoriten
/settings             Einstellungen
/planner              Wochenplaner
/shopping-list        Einkaufsliste
/recipes              Rezeptliste
/recipes/new          Neues Rezept erstellen
/recipes/:id          Rezeptdetails
/recipes/:id/edit     Rezept bearbeiten
```