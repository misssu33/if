'use client';

import { SAMPLE_PROJECTS } from '../data/sample-projects';
import type { SampleProject } from '../types';
import { SampleProjectCard } from './sample-project-card';

type SampleProjectsGridProps = {
  onSelect: (project: SampleProject) => void;
};

export function SampleProjectsGrid({ onSelect }: SampleProjectsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {SAMPLE_PROJECTS.map((p) => (
        <SampleProjectCard key={p.id} project={p} onSelect={onSelect} />
      ))}
    </div>
  );
}
