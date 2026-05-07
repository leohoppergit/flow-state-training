import { useEffect, useState } from "react";
import {
  buildSessionTimeline,
  calculateWorkoutTotals,
  formatDuration,
  generateWorkout,
  getEligibleExercises
} from "./lib/generateWorkout";
import { exercises } from "./data/exercises";
import { equipmentOptions, focusOptions } from "./types";
import type {
  Difficulty,
  Equipment,
  ExerciseFocus,
  ExercisePreference,
  ExercisePreferences,
  Focus,
  GeneratedWorkout,
  OptionalEquipment,
  SkillLevel,
  WorkoutSettings,
  WorkoutStep
} from "./types";

const storageKey = "flow-state-training-settings";
const exercisePreferencesStorageKey = "flow-state-training-exercise-preferences";

type Language = "de" | "en";
type GeneratorTab = "workout" | "exercises";
type ExerciseFilter = "all" | ExerciseFocus;
type AppCopy = {
  focusLabels: Record<Focus, { title: string; subtitle: string }>;
  equipmentLabels: Record<OptionalEquipment, string>;
  exerciseFocusLabels: Record<ExerciseFocus, string>;
  difficultyLabels: Record<Difficulty, string>;
  skillLevelLabels: Record<SkillLevel, string>;
} & Record<string, unknown>;

const copy = {
  de: {
    heroTitle: "Calisthenics-Workouts in weniger als einer Minute startklar.",
    heroCopy:
      "Fokus wählen, Equipment angeben, Zeiten setzen und direkt ein strukturiertes Workout bekommen, das dich sauber durch Work, Rest und Runden führt.",
    welcomeAction: "Loslegen",
    workoutTab: "Workout",
    exercisesTab: "Übungen",
    focus: "Fokus",
    totalTime: "Gesamtzeit",
    matchingPool: "Passender Pool",
    exercises: "Übungen",
    buildWorkout: "Workout generieren",
    exerciseCount: "Anzahl Übungen",
    workPerExercise: "Arbeitszeit pro Übung",
    restBetweenExercises: "Pause zwischen Übungen",
    perExercise: "pro Übung",
    betweenExercises: "zwischen Übungen",
    rounds: "Runden",
    equipmentQuestion: "Was ist am Spot verfügbar?",
    workoutSlots: "Übungen gesamt",
    slotsHint: "Übungsslots über alle Runden",
    activeTime: "Aktive Zeit",
    activeTimeHint: "Nur reine Work-Phasen",
    restTime: "Pausenzeit",
    noCooldown: "Ohne extra Cooldown",
    availablePool: "Verfügbarer Pool",
    poolHint: "Passende Übungen mit deinem Equipment",
    exerciseLibraryTitle: "Übungen verwalten",
    exerciseLibraryNote: "Lege pro Übung dein Skill-Level fest und markiere Übungen, die du öfter trainieren möchtest.",
    filterLabel: "Filter",
    filterAll: "Alle",
    skillLevel: "Skill-Level",
    trainingFocus: "Öfter trainieren",
    bodyweight: "Bodyweight",
    generate: "Workout generieren",
    mixHint: "Die Auswahl mischt Fokus, Schwierigkeit und Bewegungsmuster automatisch.",
    generateError: "Workout konnte nicht generiert werden.",
    progress: "Fortschritt",
    remix: "Neu mischen",
    round: "Runde",
    of: "von",
    after: "Danach",
    roundBreak: "Rundenpause",
    roundBreakHint: "Nimm dir so viel Zeit, wie du für die nächste Runde brauchst.",
    readyForRound: "Bereit für Runde",
    lastRound: "Letzte Runde",
    nextRound: "Nächste Runde",
    pauseClock: "Pause Uhr",
    startPauseClock: "Pause Uhr starten",
    done: "Fertig",
    completed: "Workout abgeschlossen",
    generatedFromSelection: "Auf Basis deiner Auswahl generiert",
    rhythmHint: "Konstanter Rhythmus durch die Session",
    bodyweightOnly: "Nur Bodyweight",
    bodyweightHint: "Bodyweight-Übungen bleiben immer verfügbar",
    adjustSetup: "Setup anpassen",
    repeatWorkout: "Gleiches Workout erneut",
    newWorkout: "Neues Workout",
    focusLabels: {
      upper: { title: "Oberkörper", subtitle: "Push, Pull und Schulterfokus" },
      core: { title: "Core", subtitle: "Spannung, Kontrolle und Midline" },
      lower: { title: "Unterkörper", subtitle: "Squat, Lunge und Posterior Chain" },
      balanced: { title: "Ausgewogen", subtitle: "Ein runder Mix für die ganze Session" }
    },
    equipmentLabels: {
      "pull-up-bar": "Klimmzugstange",
      "dip-bars": "Barren",
      bench: "Bank",
      rings: "Ringe"
    },
    exerciseFocusLabels: {
      upper: "Oberkörper",
      core: "Core",
      lower: "Unterkörper",
      "full-body": "Full Body"
    },
    difficultyLabels: {
      easy: "Leicht",
      moderate: "Mittel",
      hard: "Schwer"
    },
    skillLevelLabels: {
      0: "Keine Auswahl",
      1: "Beginner",
      2: "Intermediate",
      3: "Profi"
    }
  },
  en: {
    heroTitle: "Calisthenics workouts ready in less than a minute.",
    heroCopy:
      "Choose a focus, set your equipment and timing, then jump into a structured workout that guides you through work, rest, and rounds.",
    welcomeAction: "Get started",
    workoutTab: "Workout",
    exercisesTab: "Exercises",
    focus: "Focus",
    totalTime: "Total time",
    matchingPool: "Matching pool",
    exercises: "Exercises",
    buildWorkout: "Generate workout",
    exerciseCount: "Number of exercises",
    workPerExercise: "Work time per exercise",
    restBetweenExercises: "Rest between exercises",
    perExercise: "per exercise",
    betweenExercises: "between exercises",
    rounds: "Rounds",
    equipmentQuestion: "What equipment is available?",
    workoutSlots: "Workout slots",
    slotsHint: "Exercise slots across all rounds",
    activeTime: "Active time",
    activeTimeHint: "Work phases only",
    restTime: "Rest time",
    noCooldown: "No extra cooldown",
    availablePool: "Available pool",
    poolHint: "Matching exercises for your equipment",
    exerciseLibraryTitle: "Manage exercises",
    exerciseLibraryNote: "Set your skill level per exercise and mark movements you want to train more often.",
    filterLabel: "Filter",
    filterAll: "All",
    skillLevel: "Skill level",
    trainingFocus: "Train more often",
    bodyweight: "Bodyweight",
    generate: "Generate workout",
    mixHint: "The generator balances focus, difficulty, and movement patterns instead of picking blindly.",
    generateError: "Workout could not be generated.",
    progress: "Progress",
    remix: "Remix",
    round: "Round",
    of: "of",
    after: "Next up",
    roundBreak: "Round break",
    roundBreakHint: "Take as much time as you need before the next round.",
    readyForRound: "Ready for round",
    lastRound: "Last round",
    nextRound: "Next round",
    pauseClock: "Pause clock",
    startPauseClock: "Start break clock",
    done: "Done",
    completed: "Workout complete",
    generatedFromSelection: "Generated from your setup",
    rhythmHint: "Steady rhythm through the session",
    bodyweightOnly: "Bodyweight only",
    bodyweightHint: "Bodyweight exercises are always available",
    adjustSetup: "Adjust setup",
    repeatWorkout: "Repeat workout",
    newWorkout: "New workout",
    focusLabels: {
      upper: { title: "Upper body", subtitle: "Push, pull, and shoulder focus" },
      core: { title: "Core", subtitle: "Tension, control, and midline" },
      lower: { title: "Lower body", subtitle: "Squat, lunge, and posterior chain" },
      balanced: { title: "Balanced", subtitle: "A rounded mix for the whole session" }
    },
    equipmentLabels: {
      "pull-up-bar": "Pull-up bar",
      "dip-bars": "Dip bars",
      bench: "Bench",
      rings: "Rings"
    },
    exerciseFocusLabels: {
      upper: "Upper body",
      core: "Core",
      lower: "Lower body",
      "full-body": "Full body"
    },
    difficultyLabels: {
      easy: "Easy",
      moderate: "Moderate",
      hard: "Hard"
    },
    skillLevelLabels: {
      0: "No selection",
      1: "Beginner",
      2: "Intermediate",
      3: "Mastered"
    }
  }
} satisfies Record<Language, AppCopy>;

const englishExerciseCues: Record<string, string> = {
  "push-ups": "Keep your core tight and move through the full range.",
  "decline-push-ups": "Elevate your feet and keep the shoulders active over the hands.",
  "pike-push-ups": "Keep the hips high and lower your head between your hands.",
  "bar-dips": "Keep shoulders low and press out of the dip with control.",
  "bench-dips": "Keep the chest open and use a clean range of motion.",
  "pull-ups": "Hang with tension and pull your chest actively toward the bar.",
  "chin-ups": "Use an underhand grip and move cleanly from a full hang.",
  "scapula-pull-ups": "Move only the shoulder blades while the arms stay nearly straight.",
  "ring-rows": "Hold your body like a plank and pull the rings toward your ribs.",
  "support-hold": "Keep the arms long and push actively out of the shoulders.",
  "plank-shoulder-taps": "Keep your pelvis quiet and avoid shifting side to side.",
  "hollow-body-hold": "Press the lower back into the floor and hold tension.",
  "dead-bug": "Move slowly and keep the ribs down.",
  "reverse-crunches": "Do not swing; roll the pelvis up with control.",
  "mountain-climbers": "Keep shoulders over hands and control the pace.",
  "side-plank": "Keep the hip high and press actively into the forearm.",
  "hanging-knee-raises": "Pull the legs up with control and lower without swinging.",
  "hanging-leg-raises": "Keep the legs straight and the upper body stable.",
  "ring-knee-tucks": "Stay steady in the rings and pull the knees in tight.",
  "bodyweight-squats": "Keep heels grounded and stand up from the center.",
  "jump-squats": "Land softly and reuse the tension for the next jump.",
  "reverse-lunges": "Step back long and keep the front knee stable.",
  "split-squats": "Move vertically with control and feel the load in the front foot.",
  "step-ups": "Drive through the standing leg instead of pushing off the floor.",
  "glute-bridge": "Pause at the top and fully extend the hips.",
  "single-leg-glute-bridge": "Keep the pelvis level and drive through the heel.",
  "wall-sit": "Spread pressure evenly through both feet and breathe calmly.",
  "calf-raise-pulses": "Keep the hips stable and move from the ankle.",
  burpees: "Find a rhythm and connect each part cleanly instead of rushing.",
  "bear-crawl": "Keep knees low and move diagonally at a calm pace.",
  "inchworm-to-push-up": "Walk out long and keep the return movement controlled.",
  "toes-to-bar-taps": "Use rhythm while keeping an active shoulder position."
};

const defaultSettings: WorkoutSettings = {
  focus: "balanced",
  exerciseCount: 5,
  workSeconds: 40,
  restSeconds: 20,
  rounds: 3,
  availableEquipment: ["pull-up-bar", "dip-bars"]
};
const defaultExercisePreference: ExercisePreference = {
  skillLevel: 0,
  isTrainingFocus: false
};
const skillLevels = [0, 1, 2, 3] as const;
const exerciseFilterOptions = ["all", "upper", "core", "lower", "full-body"] as const;

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

function normalizeSkillLevel(value: unknown): SkillLevel {
  return value === 1 || value === 2 || value === 3 ? value : 0;
}

function loadStoredExercisePreferences(): ExercisePreferences {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(exercisePreferencesStorageKey);

  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, Partial<ExercisePreference>>;

    return Object.fromEntries(
      Object.entries(parsed).map(([id, preference]) => [
        id,
        {
          skillLevel: normalizeSkillLevel(preference.skillLevel),
          isTrainingFocus: Boolean(preference.isTrainingFocus)
        }
      ])
    );
  } catch {
    return {};
  }
}

function detectDeviceLanguage(): Language {
  if (typeof window === "undefined") {
    return "de";
  }

  const languages = navigator.languages.length > 0 ? navigator.languages : [navigator.language];
  const germanRegions = new Set(["de-DE", "de-AT", "de-CH"]);

  return languages.some((language) => germanRegions.has(language)) ? "de" : "en";
}

function getExerciseCue(language: Language, id: string, fallback: string) {
  return language === "en" ? englishExerciseCues[id] ?? fallback : fallback;
}

function getExercisePreference(preferences: ExercisePreferences, id: string) {
  return preferences[id] ?? defaultExercisePreference;
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
  const language = detectDeviceLanguage();
  const [hasEnteredGenerator, setHasEnteredGenerator] = useState(false);
  const [generatorTab, setGeneratorTab] = useState<GeneratorTab>("workout");
  const [exerciseFilter, setExerciseFilter] = useState<ExerciseFilter>("all");
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [settings, setSettings] = useState<WorkoutSettings>(loadStoredSettings);
  const [exercisePreferences, setExercisePreferences] = useState<ExercisePreferences>(
    loadStoredExercisePreferences
  );
  const [workout, setWorkout] = useState<GeneratedWorkout | null>(null);
  const [timeline, setTimeline] = useState<WorkoutStep[]>([]);
  const [mode, setMode] = useState<"generator" | "session" | "complete">("generator");
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
  const t = copy[language];
  const focusLabels = t.focusLabels;
  const equipmentLabels = t.equipmentLabels;
  const exerciseFocusLabels = t.exerciseFocusLabels;
  const difficultyLabels = t.difficultyLabels;
  const skillLevelLabels = t.skillLevelLabels;
  const filteredExercises =
    exerciseFilter === "all"
      ? exercises
      : exercises.filter(
          (exercise) =>
            exercise.primaryFocus === exerciseFilter || exercise.focusTags.includes(exerciseFilter)
        );

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    window.localStorage.setItem(exercisePreferencesStorageKey, JSON.stringify(exercisePreferences));
  }, [exercisePreferences]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

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

  function updateExercisePreference(id: string, preference: Partial<ExercisePreference>) {
    setExercisePreferences((current) => ({
      ...current,
      [id]: {
        ...defaultExercisePreference,
        ...current[id],
        ...preference
      }
    }));
  }

  function formatExerciseEquipment(equipment: Equipment[]) {
    const optionalEquipment = equipment.filter((item): item is OptionalEquipment => item !== "none");

    if (optionalEquipment.length === 0) {
      return t.bodyweight;
    }

    return optionalEquipment.map((item) => equipmentLabels[item]).join(", ");
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
      const nextWorkout = generateWorkout(settings, exercisePreferences);
      startNewWorkout(nextWorkout);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(language === "de" && error instanceof Error ? error.message : t.generateError);
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
    setHasEnteredGenerator(true);
    setMode("generator");
  }

  return (
    <div className="app-shell">
      <div className="backdrop-grid" />
      <main className="app">
        {mode === "generator" && !hasEnteredGenerator && (
          <section className="welcome-screen">
            <p className="eyebrow">Flow State Training</p>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroCopy}</p>
            <div className="welcome-actions">
              <button className="primary-button welcome-button" onClick={() => setHasEnteredGenerator(true)} type="button">
                {t.welcomeAction}
              </button>
            </div>
          </section>
        )}

        {mode === "generator" && hasEnteredGenerator && (
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="section-kicker">{language === "de" ? "Generator" : "Generator"}</p>
                <h2>{generatorTab === "workout" ? t.buildWorkout : t.exerciseLibraryTitle}</h2>
              </div>
            </div>

            <div className="tab-bar" role="tablist" aria-label={language === "de" ? "Generator-Bereiche" : "Generator sections"}>
              <button
                className={generatorTab === "workout" ? "active" : ""}
                onClick={() => setGeneratorTab("workout")}
                role="tab"
                type="button"
              >
                {t.workoutTab}
              </button>
              <button
                className={generatorTab === "exercises" ? "active" : ""}
                onClick={() => setGeneratorTab("exercises")}
                role="tab"
                type="button"
              >
                {t.exercisesTab}
              </button>
            </div>

            {generatorTab === "workout" ? (
              <>
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
                  <span>{t.exerciseCount}</span>
                </div>
                <div className="stepper" role="group" aria-label={t.exerciseCount}>
                  <button
                    className="stepper-button"
                    onClick={() => adjustNumberSetting("exerciseCount", -1, 3, 8)}
                    type="button"
                  >
                    -
                  </button>
                  <div className="stepper-value">
                    <strong>{settings.exerciseCount}</strong>
                    <small>{t.exercises}</small>
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
                  <span>{t.workPerExercise}</span>
                </div>
                <div className="stepper" role="group" aria-label={t.workPerExercise}>
                  <button
                    className="stepper-button"
                    onClick={() => adjustNumberSetting("workSeconds", -5, 20, 60)}
                    type="button"
                  >
                    -
                  </button>
                  <div className="stepper-value">
                    <strong>{settings.workSeconds}s</strong>
                    <small>{t.perExercise}</small>
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
                  <span>{t.restBetweenExercises}</span>
                </div>
                <div className="stepper" role="group" aria-label={t.restBetweenExercises}>
                  <button
                    className="stepper-button"
                    onClick={() => adjustNumberSetting("restSeconds", -5, 10, 40)}
                    type="button"
                  >
                    -
                  </button>
                  <div className="stepper-value">
                    <strong>{settings.restSeconds}s</strong>
                    <small>{t.betweenExercises}</small>
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
                  <span>{t.rounds}</span>
                </div>
                <div className="stepper" role="group" aria-label={t.rounds}>
                  <button
                    className="stepper-button"
                    onClick={() => adjustNumberSetting("rounds", -1, 1, 20)}
                    type="button"
                  >
                    -
                  </button>
                  <div className="stepper-value">
                    <strong>{settings.rounds}</strong>
                    <small>{t.rounds}</small>
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
                  <h3>{t.equipmentQuestion}</h3>
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
              <article className="pool-card">
                <span>{t.availablePool}</span>
                <strong>
                  {eligibleExercises.length} {t.exercises}
                </strong>
                <small>{t.poolHint}</small>
              </article>
            </div>

            <div className="summary-grid">
              <article className="summary-card">
                <span>{t.totalTime}</span>
                <strong>{formatDuration(totals.totalSeconds)}</strong>
                <small>{language === "de" ? "Work plus Pausenzeit" : "Work plus rest time"}</small>
              </article>
              <article className="summary-card">
                <span>{t.activeTime}</span>
                <strong>{formatDuration(totals.totalWorkSeconds)}</strong>
                <small>{t.activeTimeHint}</small>
              </article>
              <article className="summary-card">
                <span>{t.workoutSlots}</span>
                <strong>{settings.exerciseCount * settings.rounds}</strong>
                <small>{t.slotsHint}</small>
              </article>
              <article className="summary-card">
                <span>{t.restTime}</span>
                <strong>{formatDuration(totals.totalRestSeconds)}</strong>
                <small>{t.noCooldown}</small>
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
                {t.generate}
              </button>
              <p className="muted-copy">{t.mixHint}</p>
            </div>
              </>
            ) : (
              <div className="exercise-library">
                <div className="library-header">
                  <p>{t.exerciseLibraryNote}</p>
                </div>

                <div className="exercise-filter-row" aria-label={t.filterLabel}>
                  {exerciseFilterOptions.map((filter) => (
                    <button
                      className={exerciseFilter === filter ? "active" : ""}
                      key={filter}
                      onClick={() => {
                        setExerciseFilter(filter);
                        setExpandedExerciseId(null);
                      }}
                      type="button"
                    >
                      {filter === "all" ? t.filterAll : exerciseFocusLabels[filter]}
                    </button>
                  ))}
                  <span>
                    {filteredExercises.length} {t.exercises}
                  </span>
                </div>

                <div className="exercise-library-grid">
                  {filteredExercises.map((exercise) => {
                    const preference = getExercisePreference(exercisePreferences, exercise.id);
                    const isExpanded = expandedExerciseId === exercise.id;

                    return (
                      <article
                        className={`library-card ${preference.isTrainingFocus ? "training-focus" : ""} ${
                          isExpanded ? "expanded" : ""
                        }`}
                        key={exercise.id}
                      >
                        <button
                          className="library-card-summary"
                          onClick={() => setExpandedExerciseId(isExpanded ? null : exercise.id)}
                          type="button"
                        >
                          <div>
                            <strong>{exercise.name}</strong>
                            <small>
                              {exerciseFocusLabels[exercise.primaryFocus]} · {difficultyLabels[exercise.difficulty]}
                            </small>
                          </div>
                          <div className="library-status">
                            {preference.isTrainingFocus && <span>{t.trainingFocus}</span>}
                            <span>{skillLevelLabels[preference.skillLevel]}</span>
                            <b>{isExpanded ? "−" : "+"}</b>
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="library-card-details">
                            <p>{getExerciseCue(language, exercise.id, exercise.cue)}</p>

                            <div className="library-meta">
                              <span>{formatExerciseEquipment(exercise.equipment)}</span>
                            </div>

                            <button
                              aria-pressed={preference.isTrainingFocus}
                              className={`focus-toggle ${preference.isTrainingFocus ? "active" : ""}`}
                              onClick={() =>
                                updateExercisePreference(exercise.id, {
                                  isTrainingFocus: !preference.isTrainingFocus
                                })
                              }
                              type="button"
                            >
                              {t.trainingFocus}
                            </button>

                            <div className="skill-row">
                              <span>{t.skillLevel}</span>
                              <div className="skill-buttons" role="group" aria-label={`${exercise.name} ${t.skillLevel}`}>
                                {skillLevels.filter((level) => level > 0).map((level) => (
                                  <button
                                    className={`skill-button ${preference.skillLevel === level ? "active" : ""}`}
                                    key={level}
                                    onClick={() => updateExercisePreference(exercise.id, { skillLevel: level })}
                                    title={skillLevelLabels[level]}
                                    type="button"
                                  >
                                    <span className="skill-stars">{"★".repeat(level)}</span>
                                    <span>{skillLevelLabels[level]}</span>
                                  </button>
                                ))}
                                <button
                                  className={`skill-button no-selection ${
                                    preference.skillLevel === 0 ? "active" : ""
                                  }`}
                                  onClick={() => updateExercisePreference(exercise.id, { skillLevel: 0 })}
                                  type="button"
                                >
                                  {skillLevelLabels[0]}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {mode === "session" && workout && currentStep && (
          <section className={`panel session-panel ${currentStep.kind}`}>
            <div className="session-topline">
              <button className="ghost-button" onClick={handleBackToSetup} type="button">
                Setup
              </button>
              <div className="session-status">
                <span>{t.progress}</span>
                <strong>
                  {completedSteps}/{totalWorkBlocks} Work-Slots
                </strong>
              </div>
              <button className="ghost-button" onClick={handleRemixWorkout} type="button">
                {t.remix}
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
                    {t.round} {currentStep.round} {t.of} {settings.rounds} · {t.exercises}{" "}
                    {currentStep.exerciseIndex} {t.of} {workout.exercises.length}
                  </p>
                  <p className="cue-text">
                    {getExerciseCue(language, currentStep.exercise.id, currentStep.exercise.cue)}
                  </p>
                </>
              ) : currentStep.kind === "rest" ? (
                <>
                  <h3>REST</h3>
                  <p className="session-meta">{t.after}</p>
                  <p className="next-exercise-name">{currentStep.nextExercise.name}</p>
                  <p className="session-meta">
                    {t.round} {currentStep.nextRound}
                  </p>
                </>
              ) : (
                <>
                  <h3>{t.roundBreak}</h3>
                  <p className="session-meta">{t.roundBreakHint}</p>
                  <p className="next-exercise-name">{currentStep.nextExercise.name}</p>
                  <p className="session-meta">
                    {t.readyForRound} {currentStep.nextRound}
                  </p>
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
                    {currentRoundBreak.nextRound === settings.rounds ? t.lastRound : t.nextRound}
                  </button>
                  <button className="secondary-button" onClick={() => setIsRunning((value) => !value)} type="button">
                    {isRunning ? t.pauseClock : t.startPauseClock}
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
                <p className="section-kicker">{t.done}</p>
                <h2>{t.completed}</h2>
              </div>
              <p className="panel-note">
                {formatDuration(workout.totalSeconds)} {t.totalTime.toLowerCase()} {t.noCooldown.toLowerCase()}
              </p>
            </div>

            <div className="summary-grid">
              <article className="summary-card">
                <span>{t.focus}</span>
                <strong>{focusLabels[workout.settings.focus].title}</strong>
                <small>{t.generatedFromSelection}</small>
              </article>
              <article className="summary-card">
                <span>{t.rounds}</span>
                <strong>{workout.settings.rounds}</strong>
                <small>
                  {workout.exercises.length} {t.exercises} {language === "de" ? "pro Runde" : "per round"}
                </small>
              </article>
              <article className="summary-card">
                <span>Work / Rest</span>
                <strong>
                  {workout.settings.workSeconds}s / {workout.settings.restSeconds}s
                </strong>
                <small>{t.rhythmHint}</small>
              </article>
              <article className="summary-card">
                <span>Equipment</span>
                <strong>
                  {workout.settings.availableEquipment.length > 0
                    ? workout.settings.availableEquipment.map((item) => equipmentLabels[item]).join(", ")
                    : t.bodyweightOnly}
                </strong>
                <small>{t.bodyweightHint}</small>
              </article>
            </div>

            <div className="complete-list">
              {workout.exercises.map((exercise, index) => (
                <article key={exercise.id} className="complete-item">
                  <span>{index + 1}</span>
                  <div>
                    <strong>{exercise.name}</strong>
                    <p>{getExerciseCue(language, exercise.id, exercise.cue)}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="session-controls">
              <button className="secondary-button" onClick={handleBackToSetup} type="button">
                {t.adjustSetup}
              </button>
              <button className="secondary-button" onClick={handleResetSession} type="button">
                {t.repeatWorkout}
              </button>
              <button className="primary-button" onClick={handleRemixWorkout} type="button">
                {t.newWorkout}
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
