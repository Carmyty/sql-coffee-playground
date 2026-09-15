import { EXERCISES } from "@/data/exercises/part1";
import { EXERCISES_PART2 } from "@/data/exercises/part2";
import { EXERCISES_PART3 } from "@/data/exercises/part3";
import { LEARNING_MODULES } from "@/data/modules";
import type { Exercise } from "@/data/types";

export const ALL_EXERCISES: Exercise[] = [...EXERCISES, ...EXERCISES_PART2, ...EXERCISES_PART3];

export function getExercise(id: string) {
  return ALL_EXERCISES.find((exercise) => exercise.id === id);
}

export function getModuleExercises(moduleId: string) {
  return ALL_EXERCISES.filter((exercise) => exercise.moduleId === moduleId).sort(
    (a, b) => a.order - b.order
  );
}

export function getNextExercise(currentId: string) {
  const current = getExercise(currentId);
  if (!current) return ALL_EXERCISES[0];
  const inModule = getModuleExercises(current.moduleId);
  const index = inModule.findIndex((exercise) => exercise.id === currentId);
  if (index >= 0 && index < inModule.length - 1) return inModule[index + 1];
  const moduleIndex = LEARNING_MODULES.findIndex((module) => module.id === current.moduleId);
  const nextModule = LEARNING_MODULES[moduleIndex + 1];
  if (!nextModule) return undefined;
  return getModuleExercises(nextModule.id)[0];
}

export function getPreviousExercise(currentId: string) {
  const current = getExercise(currentId);
  if (!current) return undefined;
  const inModule = getModuleExercises(current.moduleId);
  const index = inModule.findIndex((exercise) => exercise.id === currentId);
  if (index > 0) return inModule[index - 1];
  const moduleIndex = LEARNING_MODULES.findIndex((module) => module.id === current.moduleId);
  const prevModule = LEARNING_MODULES[moduleIndex - 1];
  if (!prevModule) return undefined;
  const prevExercises = getModuleExercises(prevModule.id);
  return prevExercises[prevExercises.length - 1];
}
