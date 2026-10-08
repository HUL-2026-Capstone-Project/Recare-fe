import type { Ref } from 'react';
import { Text, View } from 'react-native';
import { NaverMapMarkerOverlay, NaverMapView, type NaverMapViewRef } from '@mj-studio/react-native-naver-map';

import { colors } from '@/shared/constants/colors';
import { env } from '@/config/env';
import type { Hospital } from '../mocks';
import { MapMarkerIcon } from './icons';

// 강남역 부근, 인근 병원 mock 5곳이 한 화면에 들어오는 수준의 줌(근사치).
const GANGNAM_STATION = { latitude: 37.4979, longitude: 127.0276 };

// 커스텀 마커는 라이브러리가 뷰를 고정 크기 비트맵으로 스냅샷하는 방식이라
// 라벨 길이가 제각각이어도 모두 같은 바운딩 박스(140×40) 안에 하단 정렬해 배치한다.
const MARKER_WIDTH = 140;
const MARKER_HEIGHT = 40;

function MapMarkerPill({ label, active }: { label: string; active?: boolean }) {
  const bg = active ? colors.primaryDark : colors.primary;

  return (
    <View collapsable={false} style={{ width: MARKER_WIDTH, height: MARKER_HEIGHT, alignItems: 'center', justifyContent: 'flex-end' }}>
      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 24,
            paddingHorizontal: 10,
            borderRadius: 12,
            backgroundColor: bg,
            gap: 5,
            shadowColor: colors.primary,
            shadowOpacity: 0.3,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
          }}
        >
          <MapMarkerIcon active={active} size={10} />
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{label}</Text>
        </View>
        <View style={{ width: 8, height: 8, marginTop: -4, backgroundColor: bg, transform: [{ rotate: '45deg' }] }} />
      </View>
    </View>
  );
}

export function MapBackground({
  mapRef,
  hospitals,
  selectedId,
  onSelectPin,
}: {
  mapRef: Ref<NaverMapViewRef>;
  hospitals: Hospital[];
  selectedId: string;
  onSelectPin: (id: string) => void;
}) {
  if (!env.naverMapClientId) {
    // Client ID가 없으면 네이티브 지도를 아예 마운트하지 않아 초기화 실패로 인한 크래시를 방지한다.
    return <View style={{ flex: 1, backgroundColor: '#E8F0FA' }} />;
  }

  return (
    <NaverMapView ref={mapRef} style={{ flex: 1 }} initialCamera={{ ...GANGNAM_STATION, zoom: 15 }}>
      {hospitals.map((hospital) => (
        <NaverMapMarkerOverlay
          key={hospital.id}
          latitude={hospital.latitude}
          longitude={hospital.longitude}
          width={MARKER_WIDTH}
          height={MARKER_HEIGHT}
          anchor={{ x: 0.5, y: 1 }}
          onTap={() => onSelectPin(hospital.id)}
        >
          <MapMarkerPill label={hospital.shortLabel} active={hospital.id === selectedId} />
        </NaverMapMarkerOverlay>
      ))}
    </NaverMapView>
  );
}
