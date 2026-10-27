import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import type { Hospital } from '../mocks';
import { openNaverRoute, openPhone } from '../utils/linking';
import { CheckGreenIcon, CloseIcon, DepartmentIcon, DirectionIcon, LocationPinIcon, PhoneOutlineIcon } from './icons';

const MAX_SPECIALTY_CHIPS = 9;
const EARTH_RADIUS_KM = 6371;

type Coordinates = { latitude: number; longitude: number };

// 서버가 거리를 주지 않을 때만 쓰는 직선 거리(하버사인).
function straightDistanceKm(a: Coordinates, b: Coordinates) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

// 스웨거 specialty는 문자열 하나라 쉼표로 나눈다(구분 방식은 백엔드 확인 전의 가정).
function parseSpecialties(specialty: string | null) {
  return (specialty ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function InfoRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <View className="flex-row items-start" style={{ gap: 12 }}>
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.input, alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </View>
      <View style={{ flex: 1, minHeight: 44 }}>
        <Text style={{ fontSize: 12, fontWeight: '500', color: colors.text2, letterSpacing: -0.2, lineHeight: 16, marginTop: 1 }}>{label}</Text>
        <View style={{ marginTop: 2 }}>{children}</View>
      </View>
    </View>
  );
}

const valueStyle = { fontSize: 14, fontWeight: '500', color: colors.text1, letterSpacing: -0.3, lineHeight: 14 * 1.45 } as const;

function SpecialtyChip({ label, extra }: { label: string; extra?: boolean }) {
  return (
    <View style={{ paddingVertical: 4, paddingHorizontal: 8, borderRadius: 50, backgroundColor: extra ? colors.primaryLight : colors.input }}>
      <Text style={{ fontSize: 11, fontWeight: '600', letterSpacing: -0.2, color: extra ? colors.primary : colors.text2 }}>{label}</Text>
    </View>
  );
}

export function HospitalDetailSheet({ hospital, origin, onClose }: { hospital: Hospital; origin: Coordinates | null; onClose: () => void }) {
  const specialties = parseSpecialties(hospital.specialty);
  const hiddenCount = specialties.length - MAX_SPECIALTY_CHIPS;
  const distanceKm = hospital.distanceKm ?? (origin ? straightDistanceKm(origin, hospital) : null);
  const hasPhone = !!hospital.phone;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 12,
        paddingHorizontal: 20,
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: -4 },
        elevation: 8,
      }}
    >
      <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 10 }} />

      <View className="flex-row items-start" style={{ gap: 8 }}>
        <Text numberOfLines={2} ellipsizeMode="tail" style={{ flex: 1, paddingTop: 10, fontSize: 20, fontWeight: '800', color: colors.text1, letterSpacing: -0.5, lineHeight: 20 * 1.35 }}>
          {hospital.name}
        </Text>
        <Pressable onPress={onClose} accessibilityLabel="닫기" style={{ width: 44, height: 44, marginRight: -10, alignItems: 'center', justifyContent: 'center' }}>
          <CloseIcon size={22} />
        </Pressable>
      </View>

      <View
        className="flex-row items-center self-start"
        style={{ marginTop: 6, marginBottom: 18, gap: 4, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 50, backgroundColor: hospital.designated ? colors.chip.greenBg : colors.input }}
      >
        {hospital.designated && <CheckGreenIcon size={12} />}
        <Text style={{ fontSize: 12, fontWeight: '600', letterSpacing: -0.2, color: hospital.designated ? colors.success : colors.text2 }}>
          {hospital.designated ? '산재 지정 병원' : '일반 병원'}
        </Text>
      </View>

      <View style={{ gap: 14 }}>
        <InfoRow icon={<LocationPinIcon />} label="주소">
          <Text numberOfLines={2} ellipsizeMode="tail" style={valueStyle}>
            {hospital.address}
          </Text>
        </InfoRow>
        <InfoRow icon={<PhoneOutlineIcon />} label="전화번호">
          <Text style={hasPhone ? valueStyle : { ...valueStyle, color: colors.text3 }}>{hospital.phone || '정보 없음'}</Text>
        </InfoRow>
        {specialties.length > 0 && (
          <InfoRow icon={<DepartmentIcon />} label="진료과목">
            <View className="flex-row flex-wrap" style={{ gap: 6, maxHeight: 68, overflow: 'hidden' }}>
              {specialties.slice(0, MAX_SPECIALTY_CHIPS).map((item) => (
                <SpecialtyChip key={item} label={item} />
              ))}
              {hiddenCount > 0 && <SpecialtyChip label={`+${hiddenCount}`} extra />}
            </View>
          </InfoRow>
        )}
        {distanceKm != null && (
          <InfoRow icon={<DirectionIcon />} label="현재 위치로부터 거리">
            <Text style={valueStyle}>{distanceKm.toFixed(1)}km</Text>
          </InfoRow>
        )}
      </View>

      <View className="flex-row" style={{ gap: 8, marginTop: 20 }}>
        <Pressable
          disabled={!hasPhone}
          onPress={() => openPhone(hospital.phone)}
          className="flex-row items-center justify-center"
          style={{ flex: 1, height: 52, borderRadius: 12, backgroundColor: colors.input, gap: 6, opacity: hasPhone ? 1 : 0.6 }}
        >
          <PhoneOutlineIcon size={16} strokeWidth={1.6} color={hasPhone ? colors.text1 : colors.text3} />
          <Text style={{ fontSize: 15, fontWeight: '700', letterSpacing: -0.3, color: hasPhone ? colors.text1 : colors.text3 }}>전화하기</Text>
        </Pressable>
        <Pressable
          onPress={() => openNaverRoute({ latitude: hospital.latitude, longitude: hospital.longitude, name: hospital.name, fallbackToStore: false })}
          className="items-center justify-center"
          style={{ flex: 1.4, height: 52, borderRadius: 12, backgroundColor: colors.primary }}
        >
          <Text style={{ fontSize: 15, fontWeight: '700', letterSpacing: -0.3, color: '#fff' }}>길찾기</Text>
        </Pressable>
      </View>
    </View>
  );
}
