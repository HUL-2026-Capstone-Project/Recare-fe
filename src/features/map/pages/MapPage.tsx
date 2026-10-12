import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NaverMapViewRef } from '@mj-studio/react-native-naver-map';

import { colors } from '@/shared/constants/colors';
import { useHospitalStore } from '@/store/hospitalStore';
import { MapBackground, GANGNAM_STATION } from '../components/MapBackground';
import { MapSearchBar } from '../components/MapSearchBar';
import { MapFilterChips } from '../components/MapFilterChips';
import { MapBottomSheet } from '../components/MapBottomSheet';
import { filterChips } from '../mocks';

// 실제 위치 권한 연동 전까지, 기존에 쓰던 지도 중심 좌표를 검색 기준 위치로도 쓴다.
const SEARCH_RADIUS_KM = 5;
const SEARCH_DEBOUNCE_MS = 400;

export default function MapPage() {
  const { top } = useSafeAreaInsets();
  const hospitals = useHospitalStore((state) => state.hospitals);
  const total = useHospitalStore((state) => state.total);
  const searchHospitals = useHospitalStore((state) => state.searchHospitals);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [keyword, setKeyword] = useState('');
  const mapRef = useRef<NaverMapViewRef>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      // 더 보기/무한 스크롤 UI가 시안에 없어 첫 페이지(기본 size)만 가져온다.
      searchHospitals({
        keyword: keyword.trim() || undefined,
        lat: GANGNAM_STATION.latitude,
        lng: GANGNAM_STATION.longitude,
        radiusKm: SEARCH_RADIUS_KM,
      });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [keyword, searchHospitals]);

  useEffect(() => {
    if (selectedId === null && hospitals.length > 0) {
      setSelectedId(hospitals[0].id);
    }
  }, [hospitals, selectedId]);

  const handleSelectCard = (id: number) => {
    setSelectedId(id);
    const hospital = hospitals.find((h) => h.id === id);
    if (hospital) {
      mapRef.current?.animateCameraTo({
        latitude: hospital.latitude,
        longitude: hospital.longitude,
        duration: 400,
        easing: 'EaseOut',
      });
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      <View className="flex-1" style={{ position: 'relative', overflow: 'hidden' }}>
        <MapBackground mapRef={mapRef} hospitals={hospitals} selectedId={selectedId} onSelectPin={setSelectedId} />

        <MapSearchBar value={keyword} onChangeText={setKeyword} />
        <MapFilterChips chips={filterChips} />
        <MapBottomSheet
          hospitals={hospitals}
          radius={`${SEARCH_RADIUS_KM}km`}
          total={total}
          selectedId={selectedId}
          onSelectCard={handleSelectCard}
        />
      </View>
    </View>
  );
}
