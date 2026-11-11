// 지도 필터 칩. 칩 → 병원 검색 파라미터(스웨거 GET /hospitals) 매핑은 여기서만 정한다. 값은 GET /hospitals/filters의 값과 같다.
// - 산재 지정 → isDesignated=true
// - 정형외과/신경외과/재활의학과 → specialty (같은 이름으로 반복 전송, 여러 개면 하나라도 맞는 병원)
// - 종합병원 → hospitalType=종합병원&hospitalType=상급종합 (값은 HOSPITAL_TYPE_VALUES, 여러 개면 하나라도 맞는 병원)
export type MapFilterKey = 'designated' | '정형외과' | '신경외과' | '재활의학과' | 'general';

// 진료과 칩을 화면에 보일지 정하는 스위치. 진료과목·종별 데이터가 들어와 켜 둔 상태다.
export const SPECIALTY_FILTERS_ENABLED = true;

const ALL_FILTER_CHIPS: { key: MapFilterKey; label: string }[] = [
  { key: 'designated', label: '산재 지정' },
  { key: '정형외과', label: '정형외과' },
  { key: '신경외과', label: '신경외과' },
  { key: '재활의학과', label: '재활의학과' },
  { key: 'general', label: '종합병원' },
];

const SPECIALTY_KEYS: MapFilterKey[] = ['정형외과', '신경외과', '재활의학과'];

// "종합병원" 칩이 보내는 hospitalType 값. 서버에는 "상급종합"이 별도 값이라 둘을 함께 보낸다.
const HOSPITAL_TYPE_VALUES = ['종합병원', '상급종합'];

export const MAP_FILTER_CHIPS = ALL_FILTER_CHIPS.filter((chip) => SPECIALTY_FILTERS_ENABLED || !SPECIALTY_KEYS.includes(chip.key));

export function toggleFilterKey(selected: MapFilterKey[], key: MapFilterKey): MapFilterKey[] {
  if (!SPECIALTY_FILTERS_ENABLED && SPECIALTY_KEYS.includes(key)) return selected;
  return selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key];
}

// 진료과끼리는 OR(배열로 전송), 산재 지정·종합병원은 나머지와 AND(서버가 파라미터끼리 AND로 처리).
export function toSearchFilter(selected: MapFilterKey[]): { isDesignated?: boolean; specialty?: string[]; hospitalType?: string[] } {
  const specialty = SPECIALTY_FILTERS_ENABLED ? SPECIALTY_KEYS.filter((k) => selected.includes(k)) : [];
  return {
    isDesignated: selected.includes('designated') ? true : undefined,
    specialty: specialty.length > 0 ? specialty : undefined,
    hospitalType: selected.includes('general') ? HOSPITAL_TYPE_VALUES : undefined,
  };
}
