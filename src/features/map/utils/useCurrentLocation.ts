import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

// 위치 권한 거부·조회 실패·시간 초과 시에만 쓰는 대체 좌표(강남역 부근).
export const FALLBACK_LOCATION = { latitude: 37.4979, longitude: 127.0276 };

// 권한 팝업 응답 시간은 포함하지 않고, 권한 허용 이후 좌표를 얻는 데만 적용한다.
const LOCATION_TIMEOUT_MS = 3000;

type Coordinates = { latitude: number; longitude: number };
export type CurrentLocation = Coordinates & { isResolved: boolean };

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function resolveLocation(): Promise<Coordinates> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return FALLBACK_LOCATION;

    const position = await withTimeout(
      (async () =>
        (await Location.getLastKnownPositionAsync()) ??
        (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })))(),
      LOCATION_TIMEOUT_MS
    );
    if (!position) return FALLBACK_LOCATION;

    return { latitude: position.coords.latitude, longitude: position.coords.longitude };
  } catch {
    return FALLBACK_LOCATION;
  }
}

// 좌표는 메모리(state)에만 두고 저장하지 않는다. 마운트 시 한 번만 권한을 요청한다.
export function useCurrentLocation(): CurrentLocation {
  const [location, setLocation] = useState<CurrentLocation>({ ...FALLBACK_LOCATION, isResolved: false });

  useEffect(() => {
    let cancelled = false;
    resolveLocation().then((coords) => {
      if (!cancelled) setLocation({ ...coords, isResolved: true });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return location;
}
