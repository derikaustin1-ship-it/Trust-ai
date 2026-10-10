import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

interface Stage {
  stage: number;
  title: string;
  status: string;
  timestamp: string;
}

interface Props {
  stages: Stage[];
}

export const ProcessingTimeline: React.FC<Props> = ({ stages }) => {
  return (
    <div className="flex items-center gap-2 py-2 overflow-x-auto text-xs scrollbar-none border-b border-slate-100 dark:border-slate-800/80 mb-3">
      {stages.map((st, idx) => (
        <React.Fragment key={st.stage}>
          <div className="flex items-center gap-1.5 shrink-0 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full text-slate-700 dark:text-slate-300 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{st.title}</span>
          </div>
          {idx < stages.length - 1 && (
            <span className="text-slate-300 dark:text-slate-700">→</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
