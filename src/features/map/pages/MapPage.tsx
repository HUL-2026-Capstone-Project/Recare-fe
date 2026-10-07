import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';
import { MapBackground } from '../components/MapBackground';
import { MapPin } from '../components/MapPin';
import { MapSearchBar } from '../components/MapSearchBar';
import { MapFilterChips } from '../components/MapFilterChips';
import { MapBottomSheet } from '../components/MapBottomSheet';
import { filterChips, hospitals, mapMeta, mapPins } from '../mocks';

export default function MapPage() {
  const { top } = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      <View className="flex-1" style={{ position: 'relative', overflow: 'hidden' }}>
        <MapBackground />

        {mapPins.map((pin) => (
          <MapPin key={pin.id} pin={pin} />
        ))}

        <MapSearchBar />
        <MapFilterChips chips={filterChips} />
        <MapBottomSheet hospitals={hospitals} radius={mapMeta.radius} total={mapMeta.total} />
      </View>
    </View>
  );
}
