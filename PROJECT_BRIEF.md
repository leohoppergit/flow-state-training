# Workout Generator Webapp

## Produktziel

Die App soll in wenigen Sekunden ein sinnvolles Bodyweight- oder Calisthenics-Workout zusammenstellen. Statt vor jedem Training neu zu ueberlegen, welche Uebungen heute dran sind, waehlt der Nutzer ein paar Parameter aus und bekommt direkt ein strukturiertes Workout mit Timer, Pausen und Runden.

## Kernversprechen

- Schnell vom Start zur fertigen Session
- Keine lange Entscheidungsphase vor dem Workout
- Zufall ja, aber nicht chaotisch
- Mobile-first, damit die App direkt waehrend des Trainings nutzbar ist

## Nutzerfluss

1. Nutzer waehlt einen Fokus:
   - Oberkoerper
   - Core
   - Unterkoerper
   - Ausgewogen
2. Nutzer stellt das Workout ein:
   - Anzahl an Uebungen
   - Arbeitszeit pro Uebung oder Gesamtdauer des Workouts
   - Pausendauer
   - Anzahl an Runden
3. Die App waehlt zufaellig passende Uebungen aus einem definierten Uebungspool aus.
4. Die App fuehrt durch das Workout:
   - aktuelle Uebung
   - Restzeit
   - Pause
   - naechste Uebung
   - aktuelle Runde
5. Am Ende sieht der Nutzer eine kurze Zusammenfassung und kann das Workout neu mischen oder erneut starten.

## Wichtigste Produktlogik

Die Random-Auswahl sollte nicht nur blind aus dem Pool ziehen. Sonst fuehlt sich die App schnell beliebig oder unausgewogen an.

Sinnvolle Regeln fuer das MVP:

- Keine exakten Duplikate in einem Workout
- Keine zu aehnlichen Uebungen direkt hintereinander
- Fokus bestimmt die Gewichtung der Uebungen
- Bei "Ausgewogen" muessen Oberkoerper, Core und Unterkoerper sinnvoll vertreten sein
- Schwierige Uebungen sollten mit leichteren oder statischeren Uebungen gemischt werden
- Einseitige Uebungen muessen klar markiert werden, falls sie spaeter unterstuetzt werden

## Vorschlag fuer Uebungskategorien

Damit die App spaeter gute Zufalls-Workouts bauen kann, sollte jede Uebung Tags bekommen:

- Fokus: Oberkoerper, Core, Unterkoerper, Full Body
- Bewegungsmuster: Push, Pull, Squat, Lunge, Hinge, Static Hold, Rotation, Flexion
- Schwierigkeit: leicht, mittel, schwer
- Modus: zeitbasiert oder wiederholungsbasiert
- Equipment: none, pull-up bar, dip bars, bands

## MVP-Umfang

Fuer Version 1 wuerde ich es bewusst schlank halten:

- Ein Bildschirm fuer die Workout-Konfiguration
- Ein definierter Uebungspool von ca. 25 bis 40 Uebungen
- Zufallslogik mit einfachen Regeln
- Ein Session-Screen mit grossen Timern und klaren Zustandswechseln
- Pause, Skip, Restart und Re-roll
- Speicherung der letzten Einstellungen im Browser

## Was ich fuer spaeter einplanen wuerde

- Schwierigkeitsfilter
- Equipment-Filter
- Favoriten oder Blocklist fuer unbeliebte Uebungen
- Eigene Uebungen anlegen
- Trainingshistorie
- Vorgefertigte Modi wie "EMOM", "AMRAP", "Tabata" oder "Skill Day"

## Produkt- und UX-Hinweise

- Die App sollte eher wie ein Trainingswerkzeug als wie ein Formular wirken
- Waehlt der Nutzer zu viele Einstellungen auf einmal, verliert man den Zeitvorteil
- Der Session-Screen muss extrem klar sein: grosse Schrift, starke Kontraste, wenig Ablenkung
- Audio- oder Vibrationssignale waeren spaeter sehr wertvoll

## Technischer Vorschlag fuer den Start

Ich wuerde fuer den MVP eine rein clientseitige Webapp bauen:

- React
- TypeScript
- Vite
- einfache lokale JSON-Datei fuer den Uebungspool
- lokaler State statt Backend
- Speicherung ueber localStorage

Warum so:

- schnell startbar
- kein Backend noetig
- gut mobil nutzbar
- spaeter problemlos erweiterbar

## Erste Architekturidee

- `src/data/exercises.ts`
  - definierter Pool mit Metadaten
- `src/lib/generateWorkout.ts`
  - Regelwerk fuer die Auswahl
- `src/components/setup/*`
  - Konfiguration des Workouts
- `src/components/session/*`
  - Timer, Uebungskarte, Fortschritt
- `src/pages` oder ein einfacher Single-Page-Flow
  - Setup -> Session -> Summary

## Wichtigste offene Fragen

Diese Punkte sind inzwischen entschieden:

1. "Trainingsdauer" meint die Arbeitszeit pro Uebung, zum Beispiel 30s, 40s oder 50s.
2. V1 ist komplett zeitbasiert, nicht rep-basiert.
3. Equipment an Calisthenics-Spots soll direkt mitgedacht werden, zum Beispiel Klimmzugstange, Barren, Bank oder Ringe.

Hinweis zur Dauerberechnung fuer den MVP:

- Die App berechnet die Session aus Work- und Rest-Phasen ueber alle Slots.
- Es gibt keine zusaetzliche separate Rundenpause.
- Die letzte Uebung endet direkt ohne eine abschliessende Extra-Pause.

## Meine Empfehlung fuer den naechsten Schritt

Wenn du willst, bauen wir jetzt direkt den MVP mit diesen Annahmen:

- nur zeitbasierte Workouts
- nur bodyweight ohne Equipment
- Fokus, Uebungsanzahl, Arbeitszeit, Pause und Runden als Eingaben
- mobile-first Single-Page-Webapp

Dann kann ich im naechsten Schritt sofort das Projekt scaffolden und die erste lauffaehige Version anlegen.
