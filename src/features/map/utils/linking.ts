import { Linking, Platform } from 'react-native';

// 네이티브 설정(LSApplicationQueriesSchemes 등)을 건드리지 않으므로 canOpenURL 대신
// openURL을 바로 시도하고 실패(catch)로 앱 미설치를 판단한다.

const APP_PACKAGE_ID = 'com.recare.app';

// 나중에 도보/대중교통으로 바꾸기 쉽도록 이동 수단을 상수로 분리한다.
const NAVER_ROUTE_MODE = 'car';

const NAVER_MAP_STORE_URL = Platform.select({
  ios: 'https://apps.apple.com/kr/app/id311867728',
  android: 'market://details?id=com.nhn.android.nmap',
});

function sanitizePhoneForTel(phone: string): string {
  const hasLeadingPlus = phone.trim().startsWith('+');
  const digits = phone.replace(/\D/g, '');
  return hasLeadingPlus ? `+${digits}` : digits;
}

export function openPhone(phone: string | null) {
  if (!phone) return; // 전화번호가 없으면 아무 동작도 하지 않는다 (실패 안내 UI는 시안 필요)

  const sanitized = sanitizePhoneForTel(phone);
  if (!sanitized || sanitized === '+') return;

  Linking.openURL(`tel:${sanitized}`).catch(() => {
    // TODO: 전화 연결 실패 안내 UI는 시안 필요
  });
}

export function openNaverRoute({
  latitude,
  longitude,
  name,
  fallbackToStore = true,
}: {
  latitude: number | null;
  longitude: number | null;
  name: string;
  // false면 네이버 지도 앱을 열지 못해도 스토어로 보내지 않고 아무 것도 하지 않는다.
  fallbackToStore?: boolean;
}) {
  if (latitude == null || longitude == null) return;

  const url = `nmap://route/${NAVER_ROUTE_MODE}?dlat=${latitude}&dlng=${longitude}&dname=${encodeURIComponent(name)}&appname=${APP_PACKAGE_ID}`;

  Linking.openURL(url).catch(() => {
    if (!fallbackToStore || !NAVER_MAP_STORE_URL) return;
    Linking.openURL(NAVER_MAP_STORE_URL).catch(() => {
      // TODO: 스토어 이동까지 실패했을 때의 안내 UI는 시안 필요
    });
  });
}
