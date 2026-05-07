import { exercises } from "../data/exercises";
import type {
  Exercise,
  ExerciseFocus,
  ExercisePreferences,
  Focus,
  GeneratedWorkout,
  WorkoutSettings,
  WorkoutStep
} from "../types";

const focusPlanTemplates: Record<Focus, ExerciseFocus[]> = {
  upper: ["upper", "upper", "core", "lower", "full-body"],
  core: ["core", "core", "upper", "lower", "full-body"],
  lower: ["lower", "lower", "core", "upper", "full-body"],
  balanced: ["upper", "core", "lower", "full-body"]
};

function randomize<T>(items: T[]): T[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function supportsEquipment(exercise: Exercise, availableEquipment: WorkoutSettings["availableEquipment"]) {
  return exercise.equipment.every(
    (equipment) => equipment === "none" || availableEquipment.includes(equipment)
  );
}

function buildFocusPlan(focus: Focus, exerciseCount: number) {
  const template = randomize(focusPlanTemplates[focus]);

  return Array.from({ length: exerciseCount }, (_, index) => template[index % template.length]);
}

function getOverlapCount(first: Exercise, second: Exercise) {
  return first.movementPatterns.filter((pattern) => second.movementPatterns.includes(pattern)).length;
}

function getPreferenceScore(candidate: Exercise, preferences: ExercisePreferences) {
  const preference = preferences[candidate.id];

  if (!preference) {
    return 0;
  }

  const skillBonus = [0, 0.25, 0.75, 1.15][preference.skillLevel];
  const focusBonus = preference.isTrainingFocus ? 1.25 : 0;

  return skillBonus + focusBonus;
}

function scoreCandidate(
  candidate: Exercise,
  desiredFocus: ExerciseFocus,
  preferences: ExercisePreferences,
  previous?: Exercise
) {
  let score = Math.random();

  if (candidate.primaryFocus === desiredFocus) {
    score += 5;
  } else if (candidate.focusTags.includes(desiredFocus)) {
    score += 3.5;
  } else if (candidate.primaryFocus === "full-body") {
    score += 2.75;
  }

  if (previous) {
    if (candidate.primaryFocus === previous.primaryFocus) {
      score -= 1.25;
    }

    score -= getOverlapCount(candidate, previous) * 1.6;

    if (candidate.difficulty === previous.difficulty) {
      score -= 0.4;
    }
  }

  if (desiredFocus === "full-body" && candidate.primaryFocus !== "full-body") {
    score -= 1;
  }

  score += getPreferenceScore(candidate, preferences);

  return score;
}

function pickExercise(
  remaining: Exercise[],
  desiredFocus: ExerciseFocus,
  preferences: ExercisePreferences,
  previous?: Exercise
) {
  const ranked = remaining
    .map((exercise) => ({
      exercise,
      score: scoreCandidate(exercise, desiredFocus, preferences, previous)
    }))
    .sort((first, second) => second.score - first.score);

  const bestMatch = ranked.find(({ exercise }) =>
    exercise.primaryFocus === desiredFocus || exercise.focusTags.includes(desiredFocus)
  );

  return (bestMatch ?? ranked[0])?.exercise;
}

export function getEligibleExercises(settings: WorkoutSettings) {
  return exercises.filter((exercise) => supportsEquipment(exercise, settings.availableEquipment));
}

export function calculateWorkoutTotals(settings: WorkoutSettings) {
  const totalWorkBlocks = settings.exerciseCount * settings.rounds;
  const totalWorkSeconds = totalWorkBlocks * settings.workSeconds;
  const totalRestBlocks = Math.max(totalWorkBlocks - 1, 0);
  const totalRestSeconds = totalRestBlocks * settings.restSeconds;

  return {
    totalWorkSeconds,
    totalRestSeconds,
    totalSeconds: totalWorkSeconds + totalRestSeconds
  };
}

export function generateWorkout(settings: WorkoutSettings, preferences: ExercisePreferences = {}): GeneratedWorkout {
  const eligibleExercises = getEligibleExercises(settings);

  if (eligibleExercises.length < settings.exerciseCount) {
    throw new Error(
      `Mit der aktuellen Equipment-Auswahl gibt es nur ${eligibleExercises.length} passende Übungen.`
    );
  }

  const focusPlan = buildFocusPlan(settings.focus, settings.exerciseCount);
  const remaining = randomize(eligibleExercises);
  const selected: Exercise[] = [];

  focusPlan.forEach((desiredFocus) => {
    const previous = selected[selected.length - 1];
    const nextExercise = pickExercise(remaining, desiredFocus, preferences, previous);

    if (!nextExercise) {
      return;
    }

    selected.push(nextExercise);
    const remainingIndex = remaining.findIndex((exercise) => exercise.id === nextExercise.id);
    remaining.splice(remainingIndex, 1);
  });

  if (selected.length < settings.exerciseCount) {
    throw new Error("Das Workout konnte nicht vollständig generiert werden.");
  }

  return {
    exercises: selected,
    settings,
    ...calculateWorkoutTotals(settings)
  };
}

export function buildSessionTimeline(workout: GeneratedWorkout): WorkoutStep[] {
  const steps: WorkoutStep[] = [];

  for (let roundIndex = 0; roundIndex < workout.settings.rounds; roundIndex += 1) {
    for (let exerciseIndex = 0; exerciseIndex < workout.exercises.length; exerciseIndex += 1) {
      const exercise = workout.exercises[exerciseIndex];

      steps.push({
        id: `work-${roundIndex + 1}-${exerciseIndex + 1}`,
        kind: "work",
        seconds: workout.settings.workSeconds,
        round: roundIndex + 1,
        exerciseIndex: exerciseIndex + 1,
        exercise
      });

      const hasNextExercise = exerciseIndex < workout.exercises.length - 1;
      const hasNextRound = roundIndex < workout.settings.rounds - 1;

      if (hasNextExercise) {
        steps.push({
          id: `rest-${roundIndex + 1}-${exerciseIndex + 1}`,
          kind: "rest",
          seconds: workout.settings.restSeconds,
          nextExercise: workout.exercises[exerciseIndex + 1],
          nextRound: roundIndex + 1
        });
      }

      if (!hasNextExercise && hasNextRound) {
        steps.push({
          id: `round-break-${roundIndex + 1}`,
          kind: "round-break",
          nextExercise: workout.exercises[0],
          nextRound: roundIndex + 2
        });
      }
    }
  }

  return steps;
}

export function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}
