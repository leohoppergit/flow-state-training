# Flow State Training

Eine mobile-first Webapp, die aus wenigen Eingaben ein zeitbasiertes Bodyweight- oder Calisthenics-Workout generiert.

## Enthalten im MVP

- Fokuswahl fuer Oberkoerper, Core, Unterkoerper oder Ausgewogen
- Zeitbasierte Session mit Work- und Rest-Timer
- Uebungspool mit Equipment-Tags fuer Calisthenics-Spots
- Zufallsgenerator mit einfachen Regeln statt blindem Shuffle
- Session-Ansicht mit Fortschritt, Reset, Skip und Re-roll
- Speicherung der letzten Einstellungen im Browser

## Lokaler Start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Projektstruktur

- `src/data/exercises.ts` definiert den Uebungspool
- `src/lib/generateWorkout.ts` enthaelt Auswahl- und Sessionlogik
- `src/App.tsx` bildet Setup, Workout-Session und Summary ab
- `src/styles.css` enthaelt das mobile-first UI
