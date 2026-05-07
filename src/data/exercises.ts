import type { Exercise } from "../types";

export const exercises: Exercise[] = [
  {
    id: "push-ups",
    name: "Push-ups",
    primaryFocus: "upper",
    focusTags: ["upper", "core"],
    movementPatterns: ["push", "static"],
    difficulty: "easy",
    equipment: ["none"],
    cue: "Spannung im Core halten und mit voller Range arbeiten."
  },
  {
    id: "decline-push-ups",
    name: "Decline Push-ups",
    primaryFocus: "upper",
    focusTags: ["upper", "core"],
    movementPatterns: ["push", "static"],
    difficulty: "moderate",
    equipment: ["bench"],
    cue: "Füße erhöhen und Schultern aktiv über die Hände bringen."
  },
  {
    id: "pike-push-ups",
    name: "Pike Push-ups",
    primaryFocus: "upper",
    focusTags: ["upper", "core"],
    movementPatterns: ["push", "hinge"],
    difficulty: "moderate",
    equipment: ["none"],
    cue: "Hüfte hoch lassen und den Kopf zwischen die Hände absenken."
  },
  {
    id: "bar-dips",
    name: "Bar Dips",
    primaryFocus: "upper",
    focusTags: ["upper", "core"],
    movementPatterns: ["push"],
    difficulty: "hard",
    equipment: ["dip-bars"],
    cue: "Schultern tief halten und kontrolliert aus dem Dip drücken."
  },
  {
    id: "bench-dips",
    name: "Bench Dips",
    primaryFocus: "upper",
    focusTags: ["upper"],
    movementPatterns: ["push"],
    difficulty: "easy",
    equipment: ["bench"],
    cue: "Brust offen halten und den Bewegungsradius sauber nutzen."
  },
  {
    id: "pull-ups",
    name: "Pull-ups",
    primaryFocus: "upper",
    focusTags: ["upper", "core"],
    movementPatterns: ["pull", "static"],
    difficulty: "hard",
    equipment: ["pull-up-bar"],
    cue: "Mit Spannung hängen und die Brust aktiv zur Stange ziehen."
  },
  {
    id: "chin-ups",
    name: "Chin-ups",
    primaryFocus: "upper",
    focusTags: ["upper", "core"],
    movementPatterns: ["pull", "static"],
    difficulty: "hard",
    equipment: ["pull-up-bar"],
    cue: "Untergriff nutzen und sauber aus dem vollen Hang arbeiten."
  },
  {
    id: "scapula-pull-ups",
    name: "Scapula Pull-ups",
    primaryFocus: "upper",
    focusTags: ["upper", "core"],
    movementPatterns: ["pull", "static"],
    difficulty: "easy",
    equipment: ["pull-up-bar"],
    cue: "Nur die Schulterblätter bewegen, Arme bleiben fast gestreckt."
  },
  {
    id: "ring-rows",
    name: "Ring Rows",
    primaryFocus: "upper",
    focusTags: ["upper", "core"],
    movementPatterns: ["pull", "static"],
    difficulty: "moderate",
    equipment: ["rings"],
    cue: "Körper als Brett halten und die Ringe Richtung Rippen ziehen."
  },
  {
    id: "support-hold",
    name: "Support Hold",
    primaryFocus: "upper",
    focusTags: ["upper", "core"],
    movementPatterns: ["static", "push"],
    difficulty: "moderate",
    equipment: ["dip-bars"],
    cue: "Arme lang lassen und dich aktiv aus den Schultern herausdrücken."
  },
  {
    id: "plank-shoulder-taps",
    name: "Plank Shoulder Taps",
    primaryFocus: "core",
    focusTags: ["core", "upper"],
    movementPatterns: ["static", "rotation"],
    difficulty: "easy",
    equipment: ["none"],
    cue: "Becken ruhig halten und das Gewicht nicht seitlich verlagern."
  },
  {
    id: "hollow-body-hold",
    name: "Hollow Body Hold",
    primaryFocus: "core",
    focusTags: ["core"],
    movementPatterns: ["static", "flexion"],
    difficulty: "moderate",
    equipment: ["none"],
    cue: "Lendenwirbelsäule in den Boden drücken und Spannung halten."
  },
  {
    id: "dead-bug",
    name: "Dead Bug",
    primaryFocus: "core",
    focusTags: ["core"],
    movementPatterns: ["flexion", "static"],
    difficulty: "easy",
    equipment: ["none"],
    cue: "Langsam arbeiten und die Rippen unten halten."
  },
  {
    id: "reverse-crunches",
    name: "Reverse Crunches",
    primaryFocus: "core",
    focusTags: ["core"],
    movementPatterns: ["flexion"],
    difficulty: "easy",
    equipment: ["none"],
    cue: "Nicht schwingen, sondern das Becken kontrolliert einrollen."
  },
  {
    id: "mountain-climbers",
    name: "Mountain Climbers",
    primaryFocus: "core",
    focusTags: ["core", "full-body"],
    movementPatterns: ["cardio", "flexion", "static"],
    difficulty: "moderate",
    equipment: ["none"],
    cue: "Schultern über den Händen halten und das Tempo sauber kontrollieren."
  },
  {
    id: "side-plank",
    name: "Side Plank",
    primaryFocus: "core",
    focusTags: ["core"],
    movementPatterns: ["static", "rotation"],
    difficulty: "easy",
    equipment: ["none"],
    cue: "Hüfte hoch halten und aktiv in den Unterarm drücken."
  },
  {
    id: "hanging-knee-raises",
    name: "Hanging Knee Raises",
    primaryFocus: "core",
    focusTags: ["core", "upper"],
    movementPatterns: ["flexion", "static"],
    difficulty: "moderate",
    equipment: ["pull-up-bar"],
    cue: "Beine kontrolliert anziehen und ohne Schwung wieder ablassen."
  },
  {
    id: "hanging-leg-raises",
    name: "Hanging Leg Raises",
    primaryFocus: "core",
    focusTags: ["core", "upper"],
    movementPatterns: ["flexion", "static"],
    difficulty: "hard",
    equipment: ["pull-up-bar"],
    cue: "Beine gestreckt führen und den Oberkörper stabil halten."
  },
  {
    id: "ring-knee-tucks",
    name: "Ring Knee Tucks",
    primaryFocus: "core",
    focusTags: ["core", "upper"],
    movementPatterns: ["flexion", "static"],
    difficulty: "hard",
    equipment: ["rings"],
    cue: "In ruhiger Ringposition bleiben und die Knie eng heranziehen."
  },
  {
    id: "bodyweight-squats",
    name: "Bodyweight Squats",
    primaryFocus: "lower",
    focusTags: ["lower"],
    movementPatterns: ["squat"],
    difficulty: "easy",
    equipment: ["none"],
    cue: "Fersen geerdet lassen und aktiv aus der Mitte heraus aufstehen."
  },
  {
    id: "jump-squats",
    name: "Squat-Jumps",
    primaryFocus: "lower",
    focusTags: ["lower", "full-body"],
    movementPatterns: ["squat", "cardio"],
    difficulty: "moderate",
    equipment: ["none"],
    cue: "Sanft landen und die Spannung direkt für den nächsten Sprung nutzen."
  },
  {
    id: "reverse-lunges",
    name: "Reverse Lunges",
    primaryFocus: "lower",
    focusTags: ["lower"],
    movementPatterns: ["lunge"],
    difficulty: "easy",
    equipment: ["none"],
    cue: "Mit langem Schritt nach hinten setzen und das vordere Knie stabil halten."
  },
  {
    id: "split-squats",
    name: "Split Squats",
    primaryFocus: "lower",
    focusTags: ["lower"],
    movementPatterns: ["lunge"],
    difficulty: "moderate",
    equipment: ["none"],
    cue: "Sauber senkrecht arbeiten und die Last im vorderen Fuß spüren."
  },
  {
    id: "step-ups",
    name: "Step-ups",
    primaryFocus: "lower",
    focusTags: ["lower", "core"],
    movementPatterns: ["lunge"],
    difficulty: "moderate",
    equipment: ["bench"],
    cue: "Dich bewusst über das Standbein hochdrücken statt abzustoßen."
  },
  {
    id: "glute-bridge",
    name: "Glute Bridge",
    primaryFocus: "lower",
    focusTags: ["lower", "core"],
    movementPatterns: ["hinge"],
    difficulty: "easy",
    equipment: ["none"],
    cue: "Oben kurz halten und die Hüfte komplett strecken."
  },
  {
    id: "single-leg-glute-bridge",
    name: "Single-leg Glute Bridge",
    primaryFocus: "lower",
    focusTags: ["lower", "core"],
    movementPatterns: ["hinge"],
    difficulty: "moderate",
    equipment: ["none"],
    cue: "Becken gerade halten und über die Ferse arbeiten."
  },
  {
    id: "wall-sit",
    name: "Wall Sit",
    primaryFocus: "lower",
    focusTags: ["lower"],
    movementPatterns: ["static", "squat"],
    difficulty: "easy",
    equipment: ["none"],
    cue: "Druck gleichmäßig über beide Füße verteilen und ruhig atmen."
  },
  {
    id: "calf-raise-pulses",
    name: "Calf Raise Pulses",
    primaryFocus: "lower",
    focusTags: ["lower"],
    movementPatterns: ["static"],
    difficulty: "easy",
    equipment: ["none"],
    cue: "Hüfte stabil halten und die Bewegung komplett aus dem Fußgelenk holen."
  },
  {
    id: "burpees",
    name: "Burpees",
    primaryFocus: "full-body",
    focusTags: ["upper", "core", "lower", "full-body"],
    movementPatterns: ["cardio", "push", "hinge"],
    difficulty: "hard",
    equipment: ["none"],
    cue: "Rhythmus finden und jeden Teil sauber verbinden statt hektisch werden."
  },
  {
    id: "bear-crawl",
    name: "Bear Crawl",
    primaryFocus: "full-body",
    focusTags: ["upper", "core", "lower", "full-body"],
    movementPatterns: ["cardio", "static"],
    difficulty: "moderate",
    equipment: ["none"],
    cue: "Knie tief halten und diagonal mit ruhigem Tempo arbeiten."
  },
  {
    id: "inchworm-to-push-up",
    name: "Inchworm to Push-up",
    primaryFocus: "full-body",
    focusTags: ["upper", "core", "lower", "full-body"],
    movementPatterns: ["hinge", "push", "static"],
    difficulty: "moderate",
    equipment: ["none"],
    cue: "Lang nach vorne laufen und die Rückwärtsbewegung kontrolliert halten."
  },
  {
    id: "toes-to-bar-taps",
    name: "Toes to Bar Taps",
    primaryFocus: "full-body",
    focusTags: ["upper", "core", "full-body"],
    movementPatterns: ["pull", "flexion", "cardio"],
    difficulty: "hard",
    equipment: ["pull-up-bar"],
    cue: "Mit Rhythmus arbeiten, aber die Schulterposition aktiv halten."
  }
];
