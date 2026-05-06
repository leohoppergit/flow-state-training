export const focusOptions = ["upper", "core", "lower", "balanced"] as const;
export const equipmentOptions = ["pull-up-bar", "dip-bars", "bench", "rings"] as const;

export type Focus = (typeof focusOptions)[number];
export type OptionalEquipment = (typeof equipmentOptions)[number];
export type Equipment = OptionalEquipment | "none";
export type ExerciseFocus = "upper" | "core" | "lower" | "full-body";
export type MovementPattern =
  | "push"
  | "pull"
  | "squat"
  | "lunge"
  | "hinge"
  | "static"
  | "rotation"
  | "flexion"
  | "extension"
  | "cardio";
export type Difficulty = "easy" | "moderate" | "hard";

export interface Exercise {
  id: string;
  name: string;
  primaryFocus: ExerciseFocus;
  focusTags: ExerciseFocus[];
  movementPatterns: MovementPattern[];
  difficulty: Difficulty;
  equipment: Equipment[];
  cue: string;
}

export interface WorkoutSettings {
  focus: Focus;
  exerciseCount: number;
  workSeconds: number;
  restSeconds: number;
  rounds: number;
  availableEquipment: OptionalEquipment[];
}

export interface GeneratedWorkout {
  exercises: Exercise[];
  settings: WorkoutSettings;
  totalWorkSeconds: number;
  totalRestSeconds: number;
  totalSeconds: number;
}

export interface WorkStep {
  id: string;
  kind: "work";
  seconds: number;
  round: number;
  exerciseIndex: number;
  exercise: Exercise;
}

export interface RestStep {
  id: string;
  kind: "rest";
  seconds: number;
  nextExercise: Exercise;
  nextRound: number;
}

export interface RoundBreakStep {
  id: string;
  kind: "round-break";
  nextRound: number;
  nextExercise: Exercise;
}

export type WorkoutStep = WorkStep | RestStep | RoundBreakStep;
