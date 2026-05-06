import { useEffect, useState } from "react";
import {
  buildSessionTimeline,
  calculateWorkoutTotals,
  formatDuration,
  generateWorkout,
  getEligibleExercises
} from "./lib/generateWorkout";
import { equipmentOptions, focusOptions } from "./types";
import type { Focus, GeneratedWorkout, OptionalEquipment, WorkoutSettings, WorkoutStep } from "./types";

const storageKey = "flow-state-training-settings";

const focusLabels: Record<Focus, { title: string; subtitle: string }> = {
  upper: {
    title: "Oberkoerper",
    subtitle: "Push, Pull und Schulterfokus"
  },
  core: {
    title: "Core",
    subtitle: "Spannung, Kontrolle und Midline"
  },
  lower: {
    title: "Unterkoerper",
    subtitle: "Squat, Lunge und Posterior Chain"
  },
  balanced: {
    title: "Ausgewogen",
    subtitle: "Ein runder Mix fuer die ganze Session"
  }
};

const equipmentLabels: Record<OptionalEquipment, string> = {
  "pull-up-bar": "Klimmzugstange",
  "dip-bars": "Barren",
  bench: "Bank",
  rings: "Ringe"
};

const defaultSettings: WorkoutSettings = {
  focus: "balanced",
  exerciseCount: 5,
  workSeconds: 40,
  restSeconds: 20,
  rounds: 3,
  availableEquipment: ["pull-up-bar", "dip-bars"]
};

function loadStoredSettings() {
  if (typeof window === "undefined") {
    return defaultSettings;
  }

  const raw = window.localStorage.getItem(storageKey);

  if (!raw) {
    return defaultSettings;
  }

  try {
    return { ...defaultSettings, ...JSON.parse(raw) } as WorkoutSettings;
  } catch {
    return defaultSettings;
  }
}

function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function clampValue(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getStepSeconds(step: WorkoutStep | undefined) {
  if (!step || step.kind === "round-break") {
    return 0;
  }

  return step.seconds;
}

export default function App() {
  const [settings, setSettings] = useState<WorkoutSettings>(loadStoredSettings);
  const [workout, setWorkout] = useState<GeneratedWorkout | null>(null);
  const [timeline, setTimeline] = useState<WorkoutStep[]>([]);
  const [mode, setMode] = useState<"setup" | "session" | "complete">("setup");
  const [stepIndex, setStepIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [roundBreakSeconds, setRoundBreakSeconds] = useState(0);

  const eligibleExercises = getEligibleExercises(settings);
  const totals = calculateWorkoutTotals(settings);
  const currentStep = timeline[stepIndex];
  const currentWorkStep = currentStep?.kind === "work" ? currentStep : undefined;
  const currentRoundBreak = currentStep?.kind === "round-break" ? currentStep : undefined;
  const completedSteps = timeline.slice(0, stepIndex).filter((step) => step.kind === "work").length;
  const totalWorkBlocks = settings.exerciseCount * settings.rounds;
  const progressPercent = totalWorkBlocks === 0 ? 0 : (completedSteps / totalWorkBlocks) * 100;

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (mode !== "session" || !isRunning || currentStep?.kind === "round-break") {
      return;
    }

    if (remainingSeconds <= 0) {
      const nextIndex = stepIndex + 1;

      if (nextIndex >= timeline.length) {
        setMode("complete");
        setIsRunning(false);
        return;
      }

      setStepIndex(nextIndex);
      setRemainingSeconds(getStepSeconds(timeline[nextIndex]));
      setRoundBreakSeconds(0);
      return;
    }

    const timer = window.setTimeout(() => {
      setRemainingSeconds((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [currentStep?.kind, isRunning, mode, remainingSeconds, stepIndex, timeline]);

  useEffect(() => {
    if (mode !== "session" || !isRunning || currentStep?.kind !== "round-break") {
      return;
    }

    const timer = window.setTimeout(() => {
      setRoundBreakSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [currentStep?.kind, isRunning, mode, roundBreakSeconds]);

  function updateSetting<Key extends keyof WorkoutSettings>(key: Key, value: WorkoutSettings[Key]) {
    setSettings((current) => ({
      ...current,
      [key]: value
    }));
  }

  function adjustNumberSetting<Key extends keyof WorkoutSettings>(
    key: Key,
    delta: number,
    min: number,
    max: number
  ) {
    setSettings((current) => ({
      ...current,
      [key]: clampValue(Number(current[key]) + delta, min, max)
    }));
  }

  function toggleEquipment(option: OptionalEquipment) {
    setSettings((current) => {
      const exists = current.availableEquipment.includes(option);

      return {
        ...current,
        availableEquipment: exists
          ? current.availableEquipment.filter((equipment) => equipment !== option)
          : [...current.availableEquipment, option]
      };
    });
  }

  function startNewWorkout(nextWorkout: GeneratedWorkout) {
    const nextTimeline = buildSessionTimeline(nextWorkout);

    setWorkout(nextWorkout);
    setTimeline(nextTimeline);
    setStepIndex(0);
    setRemainingSeconds(getStepSeconds(nextTimeline[0]));
    setRoundBreakSeconds(0);
    setIsRunning(false);
    setMode("session");
  }

  function handleGenerateWorkout() {
    try {
      const nextWorkout = generateWorkout(settings);
      startNewWorkout(nextWorkout);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Workout konnte nicht generiert werden.");
    }
  }

  function handleRemixWorkout() {
    handleGenerateWorkout();
  }

  function handleResetSession() {
    setStepIndex(0);
    setRemainingSeconds(getStepSeconds(timeline[0]));
    setRoundBreakSeconds(0);
    setIsRunning(false);
    setMode("session");
  }

  function handleSkipStep() {
    const nextIndex = stepIndex + 1;

    if (nextIndex >= timeline.length) {
      setMode("complete");
      setIsRunning(false);
      return;
    }

    setStepIndex(nextIndex);
    setRemainingSeconds(getStepSeconds(timeline[nextIndex]));
    setRoundBreakSeconds(0);
  }

  function handleNextRound() {
    const nextIndex = stepIndex + 1;

    if (nextIndex >= timeline.length) {
      setMode("complete");
      setIsRunning(false);
      return;
    }

    setStepIndex(nextIndex);
    setRemainingSeconds(getStepSeconds(timeline[nextIndex]));
    setRoundBreakSeconds(0);
  }

  function handleBackToSetup() {
    setIsRunning(false);
    setMode("setup");
  }

  return (
    <div className="app-shell">
      <div className="backdrop-grid" />
      <main className="app">
        <section className="hero">
          <p className="eyebrow">Flow State Training</p>
          <h1>Calisthenics-Workouts in weniger als einer Minute startklar.</h1>
          <p className="hero-copy">
            Fokus waehlen, Equipment angeben, Zeiten setzen und direkt ein strukturiertes Workout
            bekommen, das dich sauber durch Work, Rest und Runden fuehrt.
          </p>
          <div className="hero-metrics">
            <div className="metric">
              <span>Fokus</span>
              <strong>{focusLabels[settings.focus].title}</strong>
            </div>
            <div className="metric">
              <span>Gesamtzeit</span>
              <strong>{formatDuration(totals.totalSeconds)}</strong>
            </div>
            <div className="metric">
              <span>Passender Pool</span>
              <strong>{eligibleExercises.length} Uebungen</strong>
            </div>
          </div>
        </section>

        {mode === "setup" && (
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="section-kicker">Setup</p>
                <h2>Baue dein Workout</h2>
              </div>
              <p className="panel-note">Ohne extra Rundenpause. Die letzte Uebung endet direkt.</p>
            </div>

            <div className="focus-grid">
              {focusOptions.map((focus) => {
                const isActive = settings.focus === focus;

                return (
                  <button
                    key={focus}
                    className={`focus-card ${isActive ? "active" : ""}`}
                    onClick={() => updateSetting("focus", focus)}
                    type="button"
                  >
                    <span>{focusLabels[focus].title}</span>
                    <small>{focusLabels[focus].subtitle}</small>
                  </button>
                );
              })}
            </div>

            <div className="control-grid">
              <div className="control-card">
                <div className="control-head">
                  <span>Anzahl Uebungen</span>
                  <strong>{settings.exerciseCount}</strong>
                </div>
                <div className="stepper" role="group" aria-label="Anzahl Uebungen">
                  <button
                    className="stepper-button"
                    onClick={() => adjustNumberSetting("exerciseCount", -1, 3, 8)}
                    type="button"
                  >
                    -
                  </button>
                  <div className="stepper-value">
                    <strong>{settings.exerciseCount}</strong>
                    <small>Uebungen</small>
                  </div>
                  <button
                    className="stepper-button"
                    onClick={() => adjustNumberSetting("exerciseCount", 1, 3, 8)}
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="control-card">
                <div className="control-head">
                  <span>Arbeitszeit pro Uebung</span>
                  <strong>{settings.workSeconds}s</strong>
                </div>
                <div className="stepper" role="group" aria-label="Arbeitszeit pro Uebung">
                  <button
                    className="stepper-button"
                    onClick={() => adjustNumberSetting("workSeconds", -5, 20, 60)}
                    type="button"
                  >
                    -
                  </button>
                  <div className="stepper-value">
                    <strong>{settings.workSeconds}s</strong>
                    <small>pro Uebung</small>
                  </div>
                  <button
                    className="stepper-button"
                    onClick={() => adjustNumberSetting("workSeconds", 5, 20, 60)}
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="control-card">
                <div className="control-head">
                  <span>Pause zwischen Uebungen</span>
                  <strong>{settings.restSeconds}s</strong>
                </div>
                <div className="stepper" role="group" aria-label="Pause zwischen Uebungen">
                  <button
                    className="stepper-button"
                    onClick={() => adjustNumberSetting("restSeconds", -5, 10, 40)}
                    type="button"
                  >
                    -
                  </button>
                  <div className="stepper-value">
                    <strong>{settings.restSeconds}s</strong>
                    <small>zwischen Uebungen</small>
                  </div>
                  <button
                    className="stepper-button"
                    onClick={() => adjustNumberSetting("restSeconds", 5, 10, 40)}
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="control-card">
                <div className="control-head">
                  <span>Runden</span>
                  <strong>{settings.rounds}</strong>
                </div>
                <div className="stepper" role="group" aria-label="Runden">
                  <button
                    className="stepper-button"
                    onClick={() => adjustNumberSetting("rounds", -1, 1, 20)}
                    type="button"
                  >
                    -
                  </button>
                  <div className="stepper-value">
                    <strong>{settings.rounds}</strong>
                    <small>Runden</small>
                  </div>
                  <button
                    className="stepper-button"
                    onClick={() => adjustNumberSetting("rounds", 1, 1, 20)}
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="equipment-block">
              <div className="panel-header compact">
                <div>
                  <p className="section-kicker">Equipment</p>
                  <h3>Was ist am Spot verfuegbar?</h3>
                </div>
              </div>
              <div className="chip-row">
                {equipmentOptions.map((option) => {
                  const isActive = settings.availableEquipment.includes(option);

                  return (
                    <button
                      key={option}
                      className={`chip ${isActive ? "active" : ""}`}
                      onClick={() => toggleEquipment(option)}
                      type="button"
                    >
                      {equipmentLabels[option]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="summary-grid">
              <article className="summary-card">
                <span>Workout-Slots</span>
                <strong>{settings.exerciseCount * settings.rounds}</strong>
                <small>Uebungsslots ueber alle Runden</small>
              </article>
              <article className="summary-card">
                <span>Aktive Zeit</span>
                <strong>{formatDuration(totals.totalWorkSeconds)}</strong>
                <small>Nur reine Work-Phasen</small>
              </article>
              <article className="summary-card">
                <span>Pausenzeit</span>
                <strong>{formatDuration(totals.totalRestSeconds)}</strong>
                <small>Ohne extra Cooldown</small>
              </article>
              <article className="summary-card">
                <span>Verfuegbarer Pool</span>
                <strong>{eligibleExercises.length}</strong>
                <small>Passende Uebungen mit deinem Equipment</small>
              </article>
            </div>

            {errorMessage && <p className="error-banner">{errorMessage}</p>}

            <div className="action-row">
              <button
                className="primary-button"
                disabled={eligibleExercises.length < settings.exerciseCount}
                onClick={handleGenerateWorkout}
                type="button"
              >
                Workout generieren
              </button>
              <p className="muted-copy">
                Die Auswahl mischt Fokus, Schwierigkeit und Bewegungsmuster statt nur blind random zu
                ziehen.
              </p>
            </div>
          </section>
        )}

        {mode === "session" && workout && currentStep && (
          <section className={`panel session-panel ${currentStep.kind}`}>
            <div className="session-topline">
              <button className="ghost-button" onClick={handleBackToSetup} type="button">
                Setup
              </button>
              <div className="session-status">
                <span>Fortschritt</span>
                <strong>
                  {completedSteps}/{totalWorkBlocks} Work-Slots
                </strong>
              </div>
              <button className="ghost-button" onClick={handleRemixWorkout} type="button">
                Neu mischen
              </button>
            </div>

            <div className="progress-rail">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>

            <div className="timer-card">
              <p className="phase-label">
                {currentStep.kind === "work"
                  ? "WORK"
                  : currentStep.kind === "rest"
                    ? "REST"
                    : "ROUND BREAK"}
              </p>
              <h2>{formatClock(currentStep.kind === "round-break" ? roundBreakSeconds : remainingSeconds)}</h2>
              {currentStep.kind === "work" ? (
                <>
                  <h3>{currentStep.exercise.name}</h3>
                  <p className="session-meta">
                    Runde {currentStep.round} von {settings.rounds} · Uebung {currentStep.exerciseIndex} von{" "}
                    {workout.exercises.length}
                  </p>
                  <p className="cue-text">{currentStep.exercise.cue}</p>
                </>
              ) : currentStep.kind === "rest" ? (
                <>
                  <h3>REST</h3>
                  <p className="session-meta">Danach</p>
                  <p className="next-exercise-name">{currentStep.nextExercise.name}</p>
                  <p className="session-meta">Runde {currentStep.nextRound}</p>
                </>
              ) : (
                <>
                  <h3>Rundenpause</h3>
                  <p className="session-meta">Nimm dir so viel Zeit, wie du fuer die naechste Runde brauchst.</p>
                  <p className="next-exercise-name">{currentStep.nextExercise.name}</p>
                  <p className="session-meta">Bereit fuer Runde {currentStep.nextRound}</p>
                </>
              )}
            </div>

            <div className="session-controls">
              {currentRoundBreak ? (
                <>
                  <button className="secondary-button" onClick={handleResetSession} type="button">
                    Reset
                  </button>
                  <button
                    className="primary-button large"
                    onClick={handleNextRound}
                    type="button"
                  >
                    {currentRoundBreak.nextRound === settings.rounds ? "Letzte Runde" : "Naechste Runde"}
                  </button>
                  <button className="secondary-button" onClick={() => setIsRunning((value) => !value)} type="button">
                    {isRunning ? "Pause Uhr" : "Pause Uhr starten"}
                  </button>
                </>
              ) : (
                <>
                  <button className="secondary-button" onClick={handleResetSession} type="button">
                    Reset
                  </button>
                  <button
                    className="primary-button large"
                    onClick={() => setIsRunning((value) => !value)}
                    type="button"
                  >
                    {isRunning ? "Pause" : "Start"}
                  </button>
                  <button className="secondary-button" onClick={handleSkipStep} type="button">
                    Skip
                  </button>
                </>
              )}
            </div>

            <div className="exercise-strip">
              {workout.exercises.map((exercise, index) => {
                const isCurrent = currentWorkStep?.exercise.id === exercise.id;

                return (
                  <article key={exercise.id} className={`exercise-chip ${isCurrent ? "current" : ""}`}>
                    <span>{index + 1}</span>
                    <strong>{exercise.name}</strong>
                    <small>{exercise.primaryFocus}</small>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {mode === "complete" && workout && (
          <section className="panel complete-panel">
            <div className="panel-header">
              <div>
                <p className="section-kicker">Fertig</p>
                <h2>Workout abgeschlossen</h2>
              </div>
              <p className="panel-note">{formatDuration(workout.totalSeconds)} Gesamtzeit ohne Cooldown</p>
            </div>

            <div className="summary-grid">
              <article className="summary-card">
                <span>Fokus</span>
                <strong>{focusLabels[workout.settings.focus].title}</strong>
                <small>Auf Basis deiner Auswahl generiert</small>
              </article>
              <article className="summary-card">
                <span>Runden</span>
                <strong>{workout.settings.rounds}</strong>
                <small>{workout.exercises.length} Uebungen pro Runde</small>
              </article>
              <article className="summary-card">
                <span>Work / Rest</span>
                <strong>
                  {workout.settings.workSeconds}s / {workout.settings.restSeconds}s
                </strong>
                <small>Konstanter Rhythmus durch die Session</small>
              </article>
              <article className="summary-card">
                <span>Equipment</span>
                <strong>
                  {workout.settings.availableEquipment.length > 0
                    ? workout.settings.availableEquipment.map((item) => equipmentLabels[item]).join(", ")
                    : "Nur Bodyweight"}
                </strong>
                <small>Bodyweight-Uebungen bleiben immer verfuegbar</small>
              </article>
            </div>

            <div className="complete-list">
              {workout.exercises.map((exercise, index) => (
                <article key={exercise.id} className="complete-item">
                  <span>{index + 1}</span>
                  <div>
                    <strong>{exercise.name}</strong>
                    <p>{exercise.cue}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="session-controls">
              <button className="secondary-button" onClick={handleBackToSetup} type="button">
                Setup anpassen
              </button>
              <button className="secondary-button" onClick={handleResetSession} type="button">
                Gleiches Workout erneut
              </button>
              <button className="primary-button" onClick={handleRemixWorkout} type="button">
                Neues Workout
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
