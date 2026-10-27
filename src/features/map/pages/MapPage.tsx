import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import type { NaverMapViewRef } from '@mj-studio/react-native-naver-map';

import { colors } from '@/shared/constants/colors';
import { useHospitalStore } from '@/store/hospitalStore';
import { MapBackground } from '../components/MapBackground';
import { MapSearchBar } from '../components/MapSearchBar';
import { MapFilterChips } from '../components/MapFilterChips';
import { MapBottomSheet } from '../components/MapBottomSheet';
import { HospitalDetailSheet } from '../components/HospitalDetailSheet';
import { toSearchFilter } from '../filters';
import { useCurrentLocation } from '../utils/useCurrentLocation';

const SEARCH_RADIUS_KM = 5;
const SEARCH_DEBOUNCE_MS = 400;

export default function MapPage() {
  const { top } = useSafeAreaInsets();
  const hospitals = useHospitalStore((state) => state.hospitals);
  const total = useHospitalStore((state) => state.total);
  const status = useHospitalStore((state) => state.status);
  const selectedFilters = useHospitalStore((state) => state.selectedFilters);
  const toggleFilter = useHospitalStore((state) => state.toggleFilter);
  const resetFilters = useHospitalStore((state) => state.resetFilters);
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
        ...toSearchFilter(selectedFilters),
      });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [keyword, selectedFilters, location.isResolved, location.latitude, location.longitude, searchHospitals]);

  // 검색 조건(필터·검색어)이 바뀌어 선택한 병원이 새 목록에 없으면 상세 시트를 닫는다.
  useEffect(() => {
    if (selectedId !== null && status === 'success' && !hospitals.some((h) => h.id === selectedId)) {
      setSelectedId(null);
    }
  }, [hospitals, selectedId, status]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (selectedId === null) return false;
        setSelectedId(null);
        return true;
      });
      return () => subscription.remove();
    }, [selectedId])
  );

  const selectedHospital = hospitals.find((h) => h.id === selectedId);
  const showEmptyNotice = selectedFilters.length > 0 && status === 'success' && hospitals.length === 0;

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
        <MapFilterChips selected={selectedFilters} onToggle={toggleFilter} onReset={resetFilters} />
        <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
          {showEmptyNotice && (
            <View pointerEvents="none" style={{ alignItems: 'center', marginBottom: 20 }}>
              <View
                style={{
                  height: 44,
                  paddingHorizontal: 20,
                  borderRadius: 22,
                  justifyContent: 'center',
                  backgroundColor: colors.text1,
                  shadowColor: '#000',
                  shadowOpacity: 0.18,
                  shadowRadius: 24,
                  shadowOffset: { width: 0, height: 8 },
                  elevation: 8,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff', letterSpacing: -0.3 }}>조건에 맞는 병원이 없어요</Text>
              </View>
            </View>
          )}
          {selectedHospital ? (
            <HospitalDetailSheet
              hospital={selectedHospital}
              origin={location.isResolved ? { latitude: location.latitude, longitude: location.longitude } : null}
              onClose={() => setSelectedId(null)}
            />
          ) : (
            <MapBottomSheet
              hospitals={hospitals}
              radius={`${SEARCH_RADIUS_KM}km`}
              total={total}
              selectedId={selectedId}
              onSelectCard={handleSelectCard}
              onEndReached={loadMoreHospitals}
            />
          )}
        </View>
      </View>
    </View>
  );
}
