'use client';

import type { SampleProject } from '../types';

type SampleProjectCardProps = {
  project: SampleProject;
  onSelect: (project: SampleProject) => void;
};

/** 샘플 프로젝트 카드 */
export function SampleProjectCard({ project, onSelect }: SampleProjectCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(project)}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-left transition hover:border-violet-400 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div
        className={`h-20 bg-gradient-to-br ${project.accent} opacity-90 transition group-hover:opacity-100`}
      />
      <div className="flex flex-col gap-1 p-4">
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {project.title}
        </span>
        <span className="text-xs text-zinc-500">{project.description}</span>
        <span className="mt-2 text-xs text-violet-600 dark:text-violet-400">
          템플릿으로 시작 →
        </span>
      </div>
    </button>
  );
}
