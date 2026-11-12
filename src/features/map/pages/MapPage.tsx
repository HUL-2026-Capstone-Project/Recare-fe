import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import type { NaverMapViewRef } from '@mj-studio/react-native-naver-map';

import { colors } from '@/shared/constants/colors';
import { useHospitalStore } from '@/store/hospitalStore';
import { MapBackground } from '../components/MapBackground';
import { MapSearchBar } from '../components/MapSearchBar';
import { MAP_TOP_OVERLAY_HEIGHT, MapFilterChips } from '../components/MapFilterChips';
import { MapBottomSheet } from '../components/MapBottomSheet';
import { HospitalDetailSheet } from '../components/HospitalDetailSheet';
import { toSearchFilter } from '../filters';
import { useCurrentLocation } from '../utils/useCurrentLocation';

const SEARCH_RADIUS_KM = 5;
const SEARCH_DEBOUNCE_MS = 400;
// Android는 prop이 사라져도 패딩을 되돌리지 않으므로 닫힌 상태도 0 값을 명시해서 전달한다.
const NO_MAP_PADDING = { top: 0, bottom: 0, left: 0, right: 0 };

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
  // 상세 시트의 측정 높이(어느 병원의 시트인지와 함께 저장). 선택이 바뀌면 시트가 새로 마운트되어 다시 측정된다.
  const [detailLayout, setDetailLayout] = useState<{ id: number; height: number } | null>(null);
  // 마커·목록 어느 쪽이든 병원을 누를 때마다 올려서, 같은 병원을 다시 눌러도 카메라가 다시 이동하게 한다.
  const [focusRequest, setFocusRequest] = useState(0);
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

  const selectHospital = (id: number) => {
    setSelectedId(id);
    setFocusRequest((count) => count + 1);
  };

  // 상세 시트가 떠 있고 높이를 측정한 동안에만 지도 위·아래를 그만큼 덮인 영역으로 알린다. 닫으면 0으로 되돌린다(카메라는 되돌리지 않는다).
  const detailHeight = selectedHospital && detailLayout?.id === selectedHospital.id ? detailLayout.height : null;
  const mapPadding = useMemo(
    () => (detailHeight === null ? NO_MAP_PADDING : { top: MAP_TOP_OVERLAY_HEIGHT, bottom: detailHeight, left: 0, right: 0 }),
    [detailHeight]
  );

  const selectedLatitude = selectedHospital?.latitude;
  const selectedLongitude = selectedHospital?.longitude;
  // 선택 병원으로 카메라를 옮긴다(줌은 그대로). 패딩이 반영된 뒤 이동해야 보이는 영역의 중앙에 온다.
  useEffect(() => {
    if (focusRequest === 0 || detailHeight === null || selectedLatitude === undefined || selectedLongitude === undefined) return;
    mapRef.current?.animateCameraTo({ latitude: selectedLatitude, longitude: selectedLongitude, duration: 400, easing: 'EaseOut' });
  }, [focusRequest, detailHeight, selectedLatitude, selectedLongitude]);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      <View className="flex-1" style={{ position: 'relative', overflow: 'hidden' }}>
        <MapBackground
          mapRef={mapRef}
          center={location.isResolved ? { latitude: location.latitude, longitude: location.longitude } : null}
          hospitals={hospitals}
          selectedId={selectedId}
          mapPadding={mapPadding}
          onSelectPin={selectHospital}
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
            <View
              key={selectedHospital.id}
              onLayout={(event) => setDetailLayout({ id: selectedHospital.id, height: event.nativeEvent.layout.height })}
            >
              <HospitalDetailSheet
                hospital={selectedHospital}
                origin={location.isResolved ? { latitude: location.latitude, longitude: location.longitude } : null}
                onClose={() => setSelectedId(null)}
              />
            </View>
          ) : (
            <MapBottomSheet
              hospitals={hospitals}
              radius={`${SEARCH_RADIUS_KM}km`}
              total={total}
              selectedId={selectedId}
              onSelectCard={selectHospital}
              onEndReached={loadMoreHospitals}
            />
          )}
        </View>
      </View>
    </View>
  );
}
