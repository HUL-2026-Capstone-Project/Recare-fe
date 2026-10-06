export const homeMock = {
  user: { name: '황형진' },
  period: {
    startDate: '2024.01.15',
    endDate: '2024.07.15',
    remainingDays: 42,
    progress: 0.7,
  },
  activeCase: {
    caseNumber: '2024-0312',
    statusLabel: '심사 중',
    title: '요추 추간판 탈출증 산재 신청',
    subtitle: '재해일 2024.01.15 · 자재 운반 중 허리 부상',
    currentStep: 3,
    totalSteps: 5,
  },
  claims: [
    {
      id: 'absence-benefit',
      title: '휴업급여 청구서',
      description: '근로 정지 기간 보상',
      badgeLabel: '추천',
      variant: 'primary' as const,
    },
    {
      id: 'medical-expense',
      title: '요양비 청구서',
      description: '치료비 지원 신청',
      badgeLabel: '제출 가능',
      variant: 'neutral' as const,
    },
  ],
  faqs: [
    { id: 'approval-time', question: '산재 승인까지 얼마나 걸리나요?' },
    { id: 'absence-benefit-calc', question: '휴업급여는 어떻게 계산되나요?' },
  ],
};
