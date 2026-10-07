import { colors } from '@/shared/constants/colors';

export type TimelineStepState = 'done' | 'current' | 'pending';

export type TimelineStep = {
  label: string;
  desc: string;
  date: string;
  state: TimelineStepState;
};

export type DocumentStatus = 'done' | 'pending' | 'required';
export type DocumentIcon = 'doc' | 'check';
export type DocumentTrailing = 'chip' | 'arrow';

export type DocumentItem = {
  name: string;
  status: string;
  statusType: DocumentStatus;
  subtitle?: string;
  icon?: DocumentIcon;
  trailing?: DocumentTrailing;
};

export const DOCUMENT_STATUS_STYLE: Record<
  DocumentStatus,
  { chipBg: string; chipFg: string; iconBg: string; iconTint?: string; icon: number }
> = {
  done: {
    chipBg: colors.chip.greenBg,
    chipFg: colors.chip.greenFg,
    iconBg: colors.chip.greenBg,
    icon: require('@/shared/assets/icons/document-success.png'),
  },
  pending: {
    chipBg: colors.chip.orangeBg,
    chipFg: colors.chip.orangeFg,
    iconBg: colors.primaryLight,
    iconTint: colors.primary,
    icon: require('@/shared/assets/icons/document.png'),
  },
  required: {
    chipBg: colors.chip.redBg,
    chipFg: colors.chip.redFg,
    iconBg: colors.chip.redBg,
    icon: require('@/shared/assets/icons/document-danger.png'),
  },
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

export type CaseDetailData = {
  headerChevronDown?: boolean;
  summary: {
    caseNumber: string;
    status: string;
    statusBg: string;
    statusFg: string;
    title: string;
    info: { label: string; value: string }[];
    tags?: SummaryTag[];
  };
  banner?: { title: string; description: string };
  settlement?: SettlementData;
  timelineTitle?: string;
  timelineCaption?: string;
  timelineCaptionRight?: string;
  timeline: TimelineStep[];
  checklist?: ChecklistItem[];
  hearing?: HearingTestData;
  documentsTitle?: string;
  documents: DocumentItem[];
  actions?: BottomAction[];
  downloadLabel?: string;
};

const CASE_DETAILS: Record<string, CaseDetailData> = {
  '2024-0312': {
    summary: {
      caseNumber: '2024-0312',
      status: '심사 중',
      statusBg: colors.chip.orangeBg,
      statusFg: colors.chip.orangeFg,
      title: '요추 추간판 탈출증 산재 신청',
      info: [
        { label: '재해일자', value: '2024.01.15' },
        { label: '재해유형', value: '업무 중 부상' },
        { label: '발생장소', value: '경기도 화성시 작업장' },
      ],
      tags: [{ label: '자재 운반 · 제조업', bg: colors.primaryLight, fg: colors.primary }],
    },
    timelineCaption: '진행 중인 사건의 실시간 상황입니다',
    timeline: [
      { label: '발생', date: '01.15', desc: '재해 발생일', state: 'done' },
      { label: '접수', date: '01.20', desc: '서류 접수 완료', state: 'done' },
      { label: '심사 중', date: '02.04', desc: '근로복지공단 심사', state: 'current' },
      { label: '승인', date: '-', desc: '결과 통지 예정', state: 'pending' },
      { label: '종결', date: '-', desc: '보상금 지급 완료', state: 'pending' },
    ],
    documents: [
      { name: '산업재해 신청서', status: '제출완료', statusType: 'done' },
      { name: '의사 소견서', status: '검토중', statusType: 'pending' },
      { name: '진료비 영수증', status: '첨부 필요', statusType: 'required' },
    ],
  },
  '2024-0289': {
    summary: {
      caseNumber: '2024-0289',
      status: '접수 중',
      statusBg: colors.chip.blueBg,
      statusFg: colors.chip.blueFg,
      title: '우측 손목 골절 산재 신청',
      info: [
        { label: '재해일자', value: '2023.11.22' },
        { label: '재해유형', value: '업무 중 추락 사고' },
        { label: '발생장소', value: '인천광역시 남동공단 3-12' },
        { label: '진단 의료기관', value: '인하대학교병원' },
      ],
      tags: [
        { label: '건설업 · 자재 운반', bg: colors.primaryLight, fg: colors.primary },
        { label: '우측 요골 원위부', bg: colors.input, fg: colors.text2 },
      ],
    },
    banner: {
      title: '다음 단계 · 서류 첨부 필요',
      description: '의사 소견서와 엑스레이 영상 첨부 시 심사 단계로 진행됩니다',
    },
    timelineCaption: '접수 단계 · 7일 경과',
    timelineCaptionRight: '1 / 5 단계',
    timeline: [
      { label: '발생', date: '11.22', desc: '재해 발생일', state: 'done' },
      { label: '접수', date: '12.03', desc: '서류 접수 진행 중', state: 'current' },
      { label: '심사', date: '-', desc: '근로복지공단 심사', state: 'pending' },
      { label: '승인', date: '-', desc: '결과 통지 예정', state: 'pending' },
      { label: '종결', date: '-', desc: '보상금 지급 완료', state: 'pending' },
    ],
    checklist: [
      { label: '주치의 소견서 발급 요청', done: true },
      { label: '엑스레이 영상 자료 수령', done: false },
      { label: '경위서 작성 및 제출', done: false },
    ],
    documents: [
      {
        name: '산업재해 신청서',
        status: '제출완료',
        statusType: 'done',
        subtitle: '5장 · 2023.12.01',
      },
      {
        name: '재해 발생 경위서',
        status: '작성 중',
        statusType: 'pending',
        subtitle: '작성 진행 80%',
      },
      {
        name: '의사 소견서',
        status: '첨부 필요',
        statusType: 'required',
        subtitle: '담당의 첨부 대기',
      },
      {
        name: '엑스레이 영상 (3건)',
        status: '첨부 필요',
        statusType: 'required',
        subtitle: '정면 / 측면 / 사선',
      },
    ],
    actions: [
      { label: '경위서 작성', variant: 'outline' },
      { label: '서류 첨부하기', variant: 'filled' },
    ],
  },
  '2023-0871': {
    headerChevronDown: true,
    summary: {
      caseNumber: '2023-0871',
      status: '승인 · 종결',
      statusBg: colors.chip.greenBg,
      statusFg: colors.chip.greenFg,
      title: '소음성 난청 산재 인정',
      info: [
        { label: '재해유형', value: '직업성 질환 (소음성)' },
        { label: '진단일자', value: '2023.08.04' },
        { label: '소음 노출 기간', value: '12년 5개월' },
        { label: '진단 의료기관', value: '한양대학교병원' },
      ],
      tags: [
        { label: '제조업 · 금속 가공', bg: colors.chip.greenBg, fg: colors.chip.greenFg },
        { label: '양측 감각신경성', bg: colors.input, fg: colors.text2 },
      ],
    },
    settlement: {
      label: 'SETTLEMENT',
      description: '장해보상 일시금 지급 완료',
      amount: '38,420,000',
      stats: [
        { label: '장해등급', value: '6급 4호' },
        { label: '지급일', value: '2024.02.15' },
        { label: '처리기간', value: '195일' },
      ],
    },
    timelineTitle: '진행 이력',
    timeline: [
      { label: '발생', date: '23.08.04', desc: '직업성 질환 진단일', state: 'done' },
      { label: '접수', date: '23.09.12', desc: '서류 접수 완료', state: 'done' },
      { label: '심사', date: '23.11.20', desc: '근로복지공단 심사 완료', state: 'done' },
      { label: '승인', date: '24.01.08', desc: '장해등급 6급 확정', state: 'done' },
      { label: '종결', date: '24.02.15', desc: '일시금 지급 완료', state: 'done' },
    ],
    hearing: {
      frequencies: ['500Hz', '1kHz', '2kHz', '4kHz'],
      left: [65, 70, 80, 90],
      right: [60, 65, 75, 85],
      normalLabel: '정상 ≤ 25dB',
      verdictLabel: '판정',
      verdictText: '양측 70dB · 고도 난청 · 장해 6급',
    },
    documentsTitle: '제출 서류',
    documents: [
      {
        name: '산업재해 신청서',
        status: '',
        statusType: 'done',
        subtitle: '2023.09.12 제출',
        icon: 'check',
        trailing: 'arrow',
      },
      {
        name: '청력 검사 결과지',
        status: '',
        statusType: 'done',
        subtitle: '순음청력검사 / 어음청력',
        icon: 'check',
        trailing: 'arrow',
      },
      {
        name: '작업장 소음측정 기록',
        status: '',
        statusType: 'done',
        subtitle: '10년치 기록 첨부',
        icon: 'check',
        trailing: 'arrow',
      },
      {
        name: '재직 증명서',
        status: '',
        statusType: 'done',
        subtitle: '근속 13년 4개월',
        icon: 'check',
        trailing: 'arrow',
      },
      {
        name: '장해진단서',
        status: '',
        statusType: 'done',
        subtitle: '장해 6급 (양측 70dB)',
        icon: 'check',
        trailing: 'arrow',
      },
    ],
    downloadLabel: '결정문 다운로드 (PDF)',
  },
};

export function getCaseDetail(id: string | string[] | undefined): CaseDetailData {
  const key = Array.isArray(id) ? id[0] : id;
  return (key && CASE_DETAILS[key]) || CASE_DETAILS['2024-0312'];
}
