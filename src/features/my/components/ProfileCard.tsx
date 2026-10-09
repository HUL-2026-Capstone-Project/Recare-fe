import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/shared/constants/colors';
import { ChevronRightWhite } from './icons';

export function ProfileCard({
  name,
  phone,
  email,
  onPress,
}: {
  name: string;
  phone: string;
  email: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          position: 'absolute',
          right: -40,
          bottom: -40,
          width: 140,
          height: 140,
          borderRadius: 70,
          backgroundColor: '#fff',
          opacity: 0.1,
        }}
      />

      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderWidth: 2,
          borderColor: 'rgba(255,255,255,0.35)',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: -0.5 }}>
          {name.charAt(0)}
        </Text>
      </View>

      <View style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: -0.4 }}>{name}</Text>
        <Text style={{ fontSize: 12, color: '#fff', opacity: 0.9, letterSpacing: -0.2, marginTop: 4 }}>
          {phone}
        </Text>
        <Text style={{ fontSize: 12, color: '#fff', opacity: 0.85, letterSpacing: -0.2, marginTop: 2 }}>
          {email}
        </Text>
      </View>

      <ChevronRightWhite size={20} />
    </LinearGradient>
    </Pressable>
  );
}
