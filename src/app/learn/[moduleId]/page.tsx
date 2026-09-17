import { notFound } from "next/navigation";
import { LEARNING_MODULES } from "@/data/modules";
import { getModuleExercises } from "@/data/exercises";
import { ModulePageClient } from "@/components/learn/module-page-client";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const learningModule = LEARNING_MODULES.find((item) => item.id === moduleId);
  if (!learningModule) notFound();
  const exercises = getModuleExercises(learningModule.id);

  return <ModulePageClient learningModule={learningModule} exercises={exercises} />;
}
