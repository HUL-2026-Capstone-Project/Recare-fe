import { Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import type { MapPinData } from '../mocks';
import { MapMarkerIcon } from './icons';

export function MapPin({ pin }: { pin: MapPinData }) {
  const bg = pin.active ? colors.primaryDark : colors.primary;

  return (
    <View
      // 핀 탭 동작이 시안에 없어 스텁 처리 (TODO)
      style={{ position: 'absolute', left: `${pin.x}%`, top: `${pin.y}%` }}
    >
      <View style={{ alignItems: 'center', transform: [{ translateX: '-50%' }, { translateY: '-100%' }] }}>
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
          <MapMarkerIcon active={pin.active} size={10} />
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{pin.label}</Text>
        </View>
        <View style={{ width: 8, height: 8, marginTop: -4, backgroundColor: bg, transform: [{ rotate: '45deg' }] }} />
      </View>
    </View>
  );
}
