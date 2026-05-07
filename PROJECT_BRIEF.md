# Workout Generator Webapp

## Produktziel

Die App soll in wenigen Sekunden ein sinnvolles Bodyweight- oder Calisthenics-Workout zusammenstellen. Statt vor jedem Training neu zu überlegen, welche Übungen heute dran sind, wählt der Nutzer ein paar Parameter aus und bekommt direkt ein strukturiertes Workout mit Timer, Pausen und Runden.

## Kernversprechen

- Schnell vom Start zur fertigen Session
- Keine lange Entscheidungsphase vor dem Workout
- Zufall ja, aber nicht chaotisch
- Mobile-first, damit die App direkt während des Trainings nutzbar ist

## Nutzerfluss

1. Nutzer wählt einen Fokus:
   - Oberkörper
   - Core
   - Unterkörper
   - Ausgewogen
2. Nutzer stellt das Workout ein:
   - Anzahl an Übungen
   - Arbeitszeit pro Übung oder Gesamtdaür des Workouts
   - Pausendaür
   - Anzahl an Runden
3. Die App wählt zufällig passende Übungen aus einem definierten Übungspool aus.
4. Die App führt durch das Workout:
   - aktuelle Übung
   - Restzeit
   - Pause
   - nächste Übung
   - aktuelle Runde
5. Am Ende sieht der Nutzer eine kurze Zusammenfassung und kann das Workout neu mischen oder erneut starten.

## Wichtigste Produktlogik

Die Random-Auswahl sollte nicht nur blind aus dem Pool ziehen. Sonst fühlt sich die App schnell beliebig oder unausgewogen an.

Sinnvolle Regeln für das MVP:

- Keine exakten Duplikate in einem Workout
- Keine zu ähnlichen Übungen direkt hintereinander
- Fokus bestimmt die Gewichtung der Übungen
- Bei "Ausgewogen" müssen Oberkörper, Core und Unterkörper sinnvoll vertreten sein
- Schwierige Übungen sollten mit leichteren oder statischeren Übungen gemischt werden
- Einseitige Übungen müssen klar markiert werden, falls sie später unterstützt werden

## Vorschlag für Übungskategorien

Damit die App später gute Zufalls-Workouts baün kann, sollte jede Übung Tags bekommen:

- Fokus: Oberkörper, Core, Unterkörper, Full Body
- Bewegungsmuster: Push, Pull, Squat, Lunge, Hinge, Static Hold, Rotation, Flexion
- Schwierigkeit: leicht, mittel, schwer
- Modus: zeitbasiert oder wiederholungsbasiert
- Equipment: none, pull-up bar, dip bars, bands

## MVP-Umfang

Für Version 1 würde ich es bewusst schlank halten:

- Ein Bildschirm für die Workout-Konfiguration
- Ein definierter Übungspool von ca. 25 bis 40 Übungen
- Zufallslogik mit einfachen Regeln
- Ein Session-Screen mit grossen Timern und klaren Zustandswechseln
- Pause, Skip, Restart und Re-roll
- Speicherung der letzten Einstellungen im Browser

## Was ich für später einplanen würde

- Schwierigkeitsfilter
- Equipment-Filter
- Favoriten oder Blocklist für unbeliebte Übungen
- Eigene Übungen anlegen
- Trainingshistorie
- Vorgefertigte Modi wie "EMOM", "AMRAP", "Tabata" oder "Skill Day"

## Produkt- und UX-Hinweise

- Die App sollte eher wie ein Trainingswerkzeug als wie ein Formular wirken
- Wählt der Nutzer zu viele Einstellungen auf einmal, verliert man den Zeitvorteil
- Der Session-Screen muss extrem klar sein: grosse Schrift, starke Kontraste, wenig Ablenkung
- Audio- oder Vibrationssignale wären später sehr wertvoll

## Technischer Vorschlag für den Start

Ich würde für den MVP eine rein clientseitige Webapp baün:

- React
- TypeScript
- Vite
- einfache lokale JSON-Datei für den Übungspool
- lokaler State statt Backend
- Speicherung über localStorage

Warum so:

- schnell startbar
- kein Backend nötig
- gut mobil nutzbar
- später problemlos erweiterbar

## Erste Architekturidee

- `src/data/exercises.ts`
  - definierter Pool mit Metadaten
- `src/lib/generateWorkout.ts`
  - Regelwerk für die Auswahl
- `src/components/setup/*`
  - Konfiguration des Workouts
- `src/components/session/*`
  - Timer, Übungskarte, Fortschritt
- `src/pages` oder ein einfacher Single-Page-Flow
  - Setup -> Session -> Summary

## Wichtigste offene Fragen

Diese Punkte sind inzwischen entschieden:

1. "Trainingsdaür" meint die Arbeitszeit pro Übung, zum Beispiel 30s, 40s oder 50s.
2. V1 ist komplett zeitbasiert, nicht rep-basiert.
3. Equipment an Calisthenics-Spots soll direkt mitgedacht werden, zum Beispiel Klimmzugstange, Barren, Bank oder Ringe.

Hinweis zur Daürberechnung für den MVP:

- Die App berechnet die Session aus Work- und Rest-Phasen über alle Slots.
- Es gibt keine zusätzliche separate Rundenpause.
- Die letzte Übung endet direkt ohne eine abschliessende Extra-Pause.

## Meine Empfehlung für den nächsten Schritt

Wenn du willst, baün wir jetzt direkt den MVP mit diesen Annahmen:

- nur zeitbasierte Workouts
- nur bodyweight ohne Equipment
- Fokus, Übungsanzahl, Arbeitszeit, Pause und Runden als Eingaben
- mobile-first Single-Page-Webapp

Dann kann ich im nächsten Schritt sofort das Projekt scaffolden und die erste lauffähige Version anlegen.
