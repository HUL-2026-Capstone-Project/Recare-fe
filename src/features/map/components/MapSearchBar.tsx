import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { FilterIcon, SearchIcon } from './icons';

export function MapSearchBar() {
  const [value, setValue] = useState('');

  return (
    <View
      style={{
        position: 'absolute',
        top: 12,
        left: 20,
        right: 20,
        height: 48,
        backgroundColor: colors.surface,
        borderRadius: 50,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      }}
    >
      <SearchIcon size={20} />
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="병원, 지역명으로 검색"
        placeholderTextColor={colors.text3}
        style={{ flex: 1, fontSize: 14, color: colors.text1, letterSpacing: -0.3 }}
      />
      <Pressable
        // 필터 바텀시트/화면이 시안에 없어 스텁 처리 (TODO)
        onPress={() => {}}
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: colors.primaryLight,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FilterIcon size={14} />
      </Pressable>
    </View>
  );
}
