export type OptionalTutorRequest = {
  kind: "explain" | "hint";
  sql: string;
  exerciseId?: string;
};

export type OptionalTutor = {
  enabled: boolean;
  explain?: (request: OptionalTutorRequest) => Promise<string>;
};

/**
 * Tutoría de IA opcional. La app funciona sin esta pieza.
 * Más adelante puedes implementar `explain` con un proveedor externo
 * leyendo OPENAI_API_KEY u otra variable, sin cambiar las pantallas.
 */
export function getOptionalTutor(): OptionalTutor {
  const enabled = process.env.AI_TUTOR_ENABLED === "true" && Boolean(process.env.OPENAI_API_KEY);
  return { enabled };
}
