// 지도 필터 칩. 칩 → 병원 검색 파라미터(스웨거 GET /hospitals) 매핑은 여기서만 정한다.
// - 산재 지정 → isDesignated=true
// - 정형외과/신경외과/재활의학과 → specialty(스웨거에서 문자열 하나만 받는다. 허용 값은 백엔드 답변 전이라 칩 라벨을 그대로 보낸다)
// - "종합병원"은 대응하는 파라미터가 없어 칩을 만들지 않는다.
export type MapFilterKey = 'designated' | '정형외과' | '신경외과' | '재활의학과';

// 진료과 칩(정형외과/신경외과/재활의학과)을 화면에 보일지 정하는 스위치.
// 진료과목·종별 데이터(심평원 데이터 병합)가 백엔드에 들어오고 진료과 여러 개 필터 지원 여부가 정해지면 true로 켠다.
// false인 동안은 칩이 보이지 않고, 진료과 선택 상태와 specialty 요청 파라미터도 만들어지지 않는다.
export const SPECIALTY_FILTERS_ENABLED = false;

const ALL_FILTER_CHIPS: { key: MapFilterKey; label: string }[] = [
  { key: 'designated', label: '산재 지정' },
  { key: '정형외과', label: '정형외과' },
  { key: '신경외과', label: '신경외과' },
  { key: '재활의학과', label: '재활의학과' },
];

const SPECIALTY_KEYS: MapFilterKey[] = ['정형외과', '신경외과', '재활의학과'];

export const MAP_FILTER_CHIPS = ALL_FILTER_CHIPS.filter((chip) => SPECIALTY_FILTERS_ENABLED || !SPECIALTY_KEYS.includes(chip.key));

// specialty가 문자열 하나라서 진료과 칩끼리는 하나만 고를 수 있다(다른 진료과를 누르면 바뀐다).
export function toggleFilterKey(selected: MapFilterKey[], key: MapFilterKey): MapFilterKey[] {
  if (!SPECIALTY_FILTERS_ENABLED && SPECIALTY_KEYS.includes(key)) return selected;
  if (selected.includes(key)) return selected.filter((k) => k !== key);
  if (SPECIALTY_KEYS.includes(key)) return [...selected.filter((k) => !SPECIALTY_KEYS.includes(k)), key];
  return [...selected, key];
}

export function toSearchFilter(selected: MapFilterKey[]): { isDesignated?: boolean; specialty?: string } {
  return {
    isDesignated: selected.includes('designated') ? true : undefined,
    specialty: SPECIALTY_FILTERS_ENABLED ? selected.find((k) => SPECIALTY_KEYS.includes(k)) : undefined,
  };
}
