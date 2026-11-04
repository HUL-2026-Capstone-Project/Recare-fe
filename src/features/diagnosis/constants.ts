// 서버로 보내는 값과 질문 문구를 한곳에 모았다. 질문 키의 의미, 값(YES/NO, INJURY_TYPE 3종), PURPOSE 고정 전송, entryPoint "APP"은 백엔드가 확인했다.
export const DIAGNOSIS_ENTRY_POINT = 'APP';
// 확인 대기: answerType "CHOICE"는 백엔드가 아직 확인하지 않았다.
export const DIAGNOSIS_ANSWER_TYPE = 'CHOICE';

// 화면에서 묻지 않고 항상 먼저 보내는 답변
export const DIAGNOSIS_PURPOSE = { questionKey: 'PURPOSE', answerValue: '일하다 다쳤어요' } as const;

export type DiagnosisOption = { title: string; description?: string; value: string };
export type DiagnosisQuestion = { questionKey: string; title: string; description?: string; options: DiagnosisOption[] };

const YES_NO: DiagnosisOption[] = [
  { title: '예', value: 'YES' },
  { title: '아니요', value: 'NO' },
];

export const DIAGNOSIS_QUESTIONS: DiagnosisQuestion[] = [
  {
    questionKey: 'INJURY_TYPE',
    title: '어떤 일로 몸이 불편하세요?',
    options: [
      { title: '사고로 다쳤어요', description: '넘어짐, 끼임, 추락 등', value: 'TRAUMA' },
      { title: '일하다 생긴 병이에요', description: '근골격계 질환, 난청, 진폐 등', value: 'OCCUPATIONAL_DISEASE' },
      { title: '마음이 힘들어요', description: '우울, 불안, 외상 후 스트레스 등', value: 'MENTAL' },
    ],
  },
  { questionKey: 'APPROVED', title: '산재 승인을 이미 받으셨나요?', options: YES_NO },
  {
    questionKey: 'STOPPED_WORK',
    title: '지금 일을 쉬고 있나요?',
    description: "치료 때문에 일을 못 하고 있다면 '예'를 골라 주세요",
    options: YES_NO,
  },
  {
    questionKey: 'TREATMENT_ENDED',
    title: '치료가 끝났나요?',
    description: "더 이상 치료가 필요 없다는 진단을 받았다면 '예'를 골라 주세요",
    options: YES_NO,
  },
];
