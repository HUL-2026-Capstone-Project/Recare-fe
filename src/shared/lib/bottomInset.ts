// 하단 고정 UI의 기존 여백은 iOS 홈 인디케이터(inset 34)와 Android 제스처 내비게이션(34 이하)에서 이미 맞춰져 있다.
// inset이 이보다 큰 경우(Android 3버튼 내비게이션 등)에만 그 inset만큼 여백을 더해 시스템 바에 가려지지 않게 한다.
const COVERED_BY_EXISTING_LAYOUT = 34;

export function extraBottomInset(bottom: number): number {
  return bottom > COVERED_BY_EXISTING_LAYOUT ? bottom : 0;
}
