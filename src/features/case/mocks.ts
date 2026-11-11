export type TimelineStepState = 'done' | 'current' | 'pending';

export type TimelineStep = {
  label: string;
  desc: string;
  date: string;
  state: TimelineStepState;
};

export type SummaryTag = { label: string; bg: string; fg: string };

export type ChecklistItem = { label: string; done: boolean };

export type BottomAction = { label: string; variant: 'outline' | 'filled' };

export type SettlementStat = { label: string; value: string };

export type SettlementData = {
  label: string;
  description: string;
  amount: string;
  stats: SettlementStat[];
};

export type HearingTestData = {
  frequencies: string[];
  left: number[];
  right: number[];
  normalLabel: string;
  verdictLabel: string;
  verdictText: string;
};
