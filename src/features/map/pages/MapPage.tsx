import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NaverMapViewRef } from '@mj-studio/react-native-naver-map';

import { colors } from '@/shared/constants/colors';
import { useHospitalStore } from '@/store/hospitalStore';
import { MapBackground } from '../components/MapBackground';
import { MapSearchBar } from '../components/MapSearchBar';
import { MapFilterChips } from '../components/MapFilterChips';
import { MapBottomSheet } from '../components/MapBottomSheet';
import { filterChips } from '../mocks';
import { useCurrentLocation } from '../utils/useCurrentLocation';

const SEARCH_RADIUS_KM = 5;
const SEARCH_DEBOUNCE_MS = 400;

export default function MapPage() {
  const { top } = useSafeAreaInsets();
  const hospitals = useHospitalStore((state) => state.hospitals);
  const total = useHospitalStore((state) => state.total);
  const searchHospitals = useHospitalStore((state) => state.searchHospitals);
  const loadMoreHospitals = useHospitalStore((state) => state.loadMoreHospitals);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [keyword, setKeyword] = useState('');
  const mapRef = useRef<NaverMapViewRef>(null);
  const location = useCurrentLocation();

  useEffect(() => {
    // 위치가 확정되기 전에는 검색하지 않는다 — 대체 좌표로 먼저 검색했다가 다시 검색하는 중복을 막는다.
    if (!location.isResolved) return;
    const timer = setTimeout(() => {
      // 새 검색(검색어 변경)은 항상 첫 페이지부터 — store의 searchHospitals가 page:0으로 교체한다.
      searchHospitals({
        keyword: keyword.trim() || undefined,
        lat: location.latitude,
        lng: location.longitude,
        radiusKm: SEARCH_RADIUS_KM,
      });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [keyword, location.isResolved, location.latitude, location.longitude, searchHospitals]);

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
        <MapBackground
          mapRef={mapRef}
          center={location.isResolved ? { latitude: location.latitude, longitude: location.longitude } : null}
          hospitals={hospitals}
          selectedId={selectedId}
          onSelectPin={setSelectedId}
        />

        <MapSearchBar value={keyword} onChangeText={setKeyword} />
        <MapFilterChips chips={filterChips} />
        <MapBottomSheet
          hospitals={hospitals}
          radius={`${SEARCH_RADIUS_KM}km`}
          total={total}
          selectedId={selectedId}
          onSelectCard={handleSelectCard}
          onEndReached={loadMoreHospitals}
        />
      </View>
    </View>
  );
}
