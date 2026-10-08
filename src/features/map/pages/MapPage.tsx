import { useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NaverMapViewRef } from '@mj-studio/react-native-naver-map';

import { colors } from '@/shared/constants/colors';
import { MapBackground } from '../components/MapBackground';
import { MapSearchBar } from '../components/MapSearchBar';
import { MapFilterChips } from '../components/MapFilterChips';
import { MapBottomSheet } from '../components/MapBottomSheet';
import { filterChips, hospitals, mapMeta } from '../mocks';

export default function MapPage() {
  const { top } = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState(hospitals[0].id);
  const mapRef = useRef<NaverMapViewRef>(null);

  const handleSelectCard = (id: string) => {
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

        <MapSearchBar />
        <MapFilterChips chips={filterChips} />
        <MapBottomSheet
          hospitals={hospitals}
          radius={mapMeta.radius}
          total={mapMeta.total}
          selectedId={selectedId}
          onSelectCard={handleSelectCard}
        />
      </View>
    </View>
  );
}
