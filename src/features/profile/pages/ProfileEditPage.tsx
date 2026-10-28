import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';
import { router } from 'expo-router';

import { colors } from '@/shared/constants/colors';
import { svgAssetUri } from '@/shared/lib/svgAsset';
import { CaseDetailHeader } from '@/features/case/components/CaseDetailHeader';
import { useProfileStore } from '@/store/profileStore';
import type { UserUpdateRequest } from '@/api/userApi';
import { AddressSearchModal } from '@/features/address/components/AddressSearchModal';
import { VerifiedCheckIcon } from '../components/icons';
import { NONE_LABEL, LANGUAGE_LABELS, formatDate, formatGender, formatPhone } from '../mocks';

// 서버 프로필(address)은 단일 문자열이고 상세 주소가 별도 필드로 없어(스웨거 UserResponse 확인됨),
// 시안의 기본/상세 주소 분리를 "마지막 ', ' 기준"으로 임시 근사한다. 실제 분리 규칙은 백엔드 확인 필요.
function splitAddress(address: string | null): [string, string] {
  if (!address) return ['', ''];
  const idx = address.lastIndexOf(', ');
  if (idx === -1) return [address, ''];
  return [address.slice(0, idx), address.slice(idx + 2)];
}

// splitAddress와 짝을 이루는 합치기 규칙 — 저장 시 이 문자열을 그대로 address로 보낸다.
function joinAddress(base: string, detail: string): string {
  const trimmedBase = base.trim();
  const trimmedDetail = detail.trim();
  return trimmedDetail ? `${trimmedBase}, ${trimmedDetail}` : trimmedBase;
}

function formatBirthGender(birthDate: string | null, gender: string | null) {
  const d = formatDate(birthDate);
  const g = formatGender(gender);
  if (!d && !g) return NONE_LABEL;
  return `${d ?? NONE_LABEL} · ${g ?? NONE_LABEL}`;
}

function formatCarrierPhone(carrier: string | null, phone: string | null) {
  const p = formatPhone(phone);
  if (!carrier && !p) return NONE_LABEL;
  return `${carrier ?? NONE_LABEL} · ${p ?? NONE_LABEL}`;
}

function FieldLabel({ children }: { children: string }) {
  return (
    <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text2, letterSpacing: -0.3, marginHorizontal: 2, marginBottom: 8 }}>
      {children}
    </Text>
  );
}

function LockedRow({ label, value, showBorder }: { label: string; value: string; showBorder: boolean }) {
  return (
    <View
      className="flex-row items-center justify-between"
      style={{
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: showBorder ? 1 : 0,
        borderBottomColor: colors.border,
      }}
    >
      <Text style={{ fontSize: 13, color: colors.text2, letterSpacing: -0.3 }}>{label}</Text>
      <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text2, letterSpacing: -0.3 }}>{value}</Text>
    </View>
  );
}

const LANGUAGE_CODES = ['KO', 'EN'] as const;

export default function ProfileEditScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const profile = useProfileStore((state) => state.profile);

  const [initialBase, initialDetail] = splitAddress(profile?.address ?? null);
  const [email, setEmail] = useState(profile?.email ?? '');
  const [emailFocused, setEmailFocused] = useState(false);
  const [addressBase, setAddressBase] = useState(initialBase);
  const [addressSearchOpen, setAddressSearchOpen] = useState(false);
  const [addressDetail, setAddressDetail] = useState(initialDetail);
  const [addressDetailFocused, setAddressDetailFocused] = useState(false);
  const [language, setLanguage] = useState(profile?.language ?? 'KO');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!profile) router.back();
  }, [profile]);

  if (!profile) return null;

  // 시안에 없는 UI(검증 오류, 로딩 표시, 토스트)는 만들지 않는다.
  const handleAddressSearch = () => setAddressSearchOpen(true);

  const handleSave = async () => {
    if (isSaving) return;

    // 바뀐 필드만, 빈 값은 보내지 않는다(빈 문자열로 지우기가 서버에서 가능한지 명세로 확인 안 됨).
    const payload: UserUpdateRequest = {};
    const trimmedEmail = email.trim();
    if (trimmedEmail && trimmedEmail !== (profile.email ?? '')) {
      payload.email = trimmedEmail;
    }
    const nextAddress = joinAddress(addressBase, addressDetail);
    if (nextAddress && nextAddress !== (profile.address ?? '')) {
      payload.address = nextAddress;
    }
    if (language && language !== (profile.language ?? '')) {
      payload.language = language;
    }

    if (Object.keys(payload).length === 0) {
      router.back();
      return;
    }

    setIsSaving(true);
    try {
      await useProfileStore.getState().updateProfile(payload);
      router.back();
    } catch {
      // TODO(디자인 필요): 실패 시 보여줄 공통 오류 UI가 없어(기존 화면에도 토스트/Alert 패턴 없음) 화면에 머무는 것 외엔 처리하지 않는다.
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ paddingTop: top }}
    >
      <CaseDetailHeader title="프로필 정보 수정" />

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 8, paddingHorizontal: 20, paddingBottom: 24 }}
      >
        <View
          className="flex-row items-center"
          style={{ backgroundColor: colors.primaryLight, borderRadius: 12, paddingVertical: 11, paddingHorizontal: 14, gap: 8, marginBottom: 20 }}
        >
          <View style={{ flexShrink: 0 }}>
            <SvgUri uri={svgAssetUri(require('@/shared/assets/icons-svg/info-circle-blue.svg'))} width={16} height={16} />
          </View>
          <Text style={{ flex: 1, fontSize: 12, fontWeight: '500', color: colors.primaryDark, letterSpacing: -0.3, lineHeight: 17.4 }}>
            본인인증으로 확인된 정보는 수정할 수 없어요
          </Text>
        </View>

        <FieldLabel>본인인증 정보</FieldLabel>
        <View style={{ backgroundColor: colors.input, borderRadius: 12, overflow: 'hidden', marginBottom: 22 }}>
          <View className="flex-row items-center justify-between" style={{ paddingTop: 10, paddingHorizontal: 14, paddingBottom: 2 }}>
            <View
              className="flex-row items-center"
              style={{ gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50, backgroundColor: colors.chip.greenBg }}
            >
              <VerifiedCheckIcon size={11} />
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.chip.greenFg }}>본인인증 완료</Text>
            </View>
            <SvgUri uri={svgAssetUri(require('@/shared/assets/icons-svg/my-lock.svg'))} width={14} height={14} />
          </View>
          <LockedRow label="이름" value={profile.name || NONE_LABEL} showBorder />
          <LockedRow label="생년월일 · 성별" value={formatBirthGender(profile.birthDate, profile.gender)} showBorder />
          <LockedRow label="휴대폰 번호" value={formatCarrierPhone(profile.carrier, profile.phone)} showBorder={false} />
        </View>

        <View style={{ marginBottom: 18 }}>
          <FieldLabel>아이디</FieldLabel>
          <View className="flex-row items-center" style={{ height: 52, borderRadius: 12, backgroundColor: colors.input, paddingHorizontal: 16, gap: 10 }}>
            <Text style={{ flex: 1, fontSize: 15, fontWeight: '500', color: colors.text2, letterSpacing: -0.3 }}>{profile.loginId}</Text>
            <SvgUri uri={svgAssetUri(require('@/shared/assets/icons-svg/my-lock.svg'))} width={14} height={14} />
          </View>
        </View>

        <View style={{ marginBottom: 18 }}>
          <FieldLabel>이메일</FieldLabel>
          <View
            className="flex-row items-center"
            style={{
              height: 52,
              borderRadius: 12,
              paddingHorizontal: 16,
              gap: 10,
              backgroundColor: emailFocused ? '#fff' : colors.input,
              borderWidth: emailFocused ? 1.5 : 0,
              borderColor: colors.primary,
            }}
          >
            <TextInput
              className="flex-1"
              style={{ fontSize: 15, fontWeight: '500', color: colors.text1, letterSpacing: -0.3 }}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={colors.text3}
            />
            {emailFocused && email !== '' && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setEmail('')}
                style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: colors.text3, alignItems: 'center', justifyContent: 'center' }}
              >
                <SvgUri uri={svgAssetUri(require('@/shared/assets/icons-svg/close.svg'))} width={8} height={8} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={{ marginBottom: 18 }}>
          <FieldLabel>주소</FieldLabel>
          <View className="flex-row items-center" style={{ gap: 8, marginBottom: 8 }}>
            {/* 가입 화면의 주소 칸과 같은 읽기 전용 칸: 눌러서 검색을 연다. */}
            <TouchableOpacity
              className="flex-1 h-[52px] bg-input rounded-xl px-4 justify-center"
              activeOpacity={0.7}
              onPress={handleAddressSearch}
            >
              <Text
                className="text-[15px]"
                style={{ color: addressBase ? colors.text1 : colors.text3, letterSpacing: -0.3, fontWeight: addressBase ? '500' : '400' }}
              >
                {addressBase || '주소를 검색해 주세요'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleAddressSearch}
              style={{ height: 52, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1.5, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.primary, letterSpacing: -0.3 }}>주소 검색</Text>
            </TouchableOpacity>
          </View>
          <View
            className="flex-row items-center"
            style={{
              height: 52,
              borderRadius: 12,
              paddingHorizontal: 16,
              backgroundColor: addressDetailFocused ? '#fff' : colors.input,
              borderWidth: addressDetailFocused ? 1.5 : 0,
              borderColor: colors.primary,
            }}
          >
            <TextInput
              className="flex-1"
              style={{ fontSize: 15, fontWeight: '500', color: colors.text1, letterSpacing: -0.3 }}
              placeholder="상세 주소 입력"
              placeholderTextColor={colors.text3}
              value={addressDetail}
              onChangeText={setAddressDetail}
              onFocus={() => setAddressDetailFocused(true)}
              onBlur={() => setAddressDetailFocused(false)}
            />
          </View>
        </View>

        <View style={{ marginBottom: 18 }}>
          <FieldLabel>언어</FieldLabel>
          <View className="flex-row" style={{ gap: 8 }}>
            {LANGUAGE_CODES.map((code) => {
              const on = language === code;
              return (
                <TouchableOpacity
                  key={code}
                  activeOpacity={0.85}
                  onPress={() => setLanguage(code)}
                  style={{
                    flex: 1,
                    height: 48,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: on ? colors.primaryLight : colors.input,
                    borderWidth: 1.5,
                    borderColor: on ? colors.primary : 'transparent',
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: on ? '700' : '500', color: on ? colors.primary : colors.text2, letterSpacing: -0.3 }}>
                    {LANGUAGE_LABELS[code]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View className="bg-white flex-row" style={{ gap: 8, paddingTop: 8, paddingHorizontal: 20, paddingBottom: Math.max(bottom, 12) }}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.back()}
          style={{ flex: 1, height: 52, borderRadius: 12, borderWidth: 1.5, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.primary, letterSpacing: -0.3 }}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSave}
          style={{ flex: 2, height: 52, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: -0.3 }}>저장하기</Text>
        </TouchableOpacity>
      </View>

      <AddressSearchModal visible={addressSearchOpen} onClose={() => setAddressSearchOpen(false)} onSelect={setAddressBase} />
    </KeyboardAvoidingView>
  );
}
