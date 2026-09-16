import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors } from '@/constants/colors';

const TIMELINE = [
  { label: '발생',    date: '23.08.04', desc: '재해 발생일' },
  { label: '접수',    date: '23.09.12', desc: '서류 접수 완료' },
  { label: '재해조사', date: '23.11.20', desc: '근로복지공단 조사 완료' },
  { label: '승인',    date: '24.01.08', desc: '장해등급 6급 판정' },
  { label: '종결',    date: '24.02.15', desc: '일시금 지급 완료' },
];

const DOCUMENTS = [
  {
    name: '산재신청서',
    status: '제출완료',
    statusBg: colors.chip.greenBg,
    statusFg: colors.chip.greenFg,
    desc: '5장 · 2023.09.12',
  },
  {
    name: '의사 의견서',
    status: '제출완료',
    statusBg: colors.chip.greenBg,
    statusFg: colors.chip.greenFg,
    desc: '검토 완료',
  },
  {
    name: '진료비 영수증',
    status: '제출완료',
    statusBg: colors.chip.greenBg,
    statusFg: colors.chip.greenFg,
    desc: '내담자 첨부 완료',
  },
];

const SUBMITTED_DOCS = [
  { name: '산재재해 신청서', sub: '2023.09.12 제출' },
  { name: '의사 의견서',    sub: '뇌혈관 전문의 소견' },
  { name: '진료비 영수증',  sub: '입원 치료비 포함' },
  { name: '사진 증명서',    sub: '근무 13년 4개월' },
  { name: '장해진단서',     sub: '장해 6급 (우측 편마비)' },
];

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOpacity: 0.04,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
} as const;

export default function CaseDetail0871Screen() {
  const { top } = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: top }}>
      {/* NavBar */}
      <View
        className="h-[52px] px-3 flex-row items-center justify-between bg-white"
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <TouchableOpacity
          className="w-10 items-center justify-center"
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Image source={require('../assets/icons/chevron-left.png')} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
        <Text className="text-[17px] font-bold text-text1" style={{ letterSpacing: -0.3 }}>케이스 상세</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: colors.bg }}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      >
        {/* ─── 사건 정보 카드 ─── */}
        <View className="bg-white rounded-2xl p-4 mb-2.5" style={CARD_SHADOW}>
          <View className="flex-row justify-between items-center mb-1.5">
            <Text className="text-[11px] font-semibold" style={{ color: colors.text3, letterSpacing: 0.3 }}>
              CASE · 2023-0871
            </Text>
            <View className="px-3 py-1 rounded-full" style={{ backgroundColor: colors.chip.greenBg }}>
              <Text className="text-[12px] font-semibold" style={{ color: colors.chip.greenFg, letterSpacing: -0.2 }}>
                승인·종결
              </Text>
            </View>
          </View>

          <Text className="text-[17px] font-extrabold text-text1 mb-3" style={{ letterSpacing: -0.4 }}>
            업무상 뇌출혈 손해 신청
          </Text>

          <View className="gap-2 mb-3">
            {[
              { label: '재해유형', value: '업무 중 발병' },
              { label: '진단일자', value: '2023.08.04' },
              { label: '발생장소', value: '경기도 화성시 소재지' },
            ].map(row => (
              <View key={row.label} className="flex-row justify-between">
                <Text className="text-[12px]" style={{ color: colors.text2, letterSpacing: -0.2 }}>{row.label}</Text>
                <Text className="text-[12px] font-semibold text-text1" style={{ letterSpacing: -0.3 }}>{row.value}</Text>
              </View>
            ))}
          </View>

          <View className="flex-row gap-1.5 mb-4">
            <View className="px-2.5 py-1 rounded-full" style={{ backgroundColor: colors.chip.greenBg }}>
              <Text className="text-[11px] font-semibold" style={{ color: colors.chip.greenFg, letterSpacing: -0.2 }}>
                제조업 · 금속 가공
              </Text>
            </View>
            <View className="px-2.5 py-1 rounded-full" style={{ backgroundColor: colors.chip.grayBg }}>
              <Text className="text-[11px] font-semibold" style={{ color: colors.chip.grayFg, letterSpacing: -0.2 }}>
                업무상 뇌출혈
              </Text>
            </View>
          </View>

          {/* 정산 카드 */}
          <View style={{ borderRadius: 18, overflow: 'hidden', backgroundColor: colors.success }}>
            <View
              style={{
                position: 'absolute',
                right: -50,
                top: -50,
                width: 180,
                height: 180,
                borderRadius: 90,
                backgroundColor: 'rgba(255,255,255,0.12)',
              }}
            />
            <View style={{ padding: 18 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff', letterSpacing: 1.2, opacity: 0.85, marginBottom: 4 }}>
                SETTLEMENT
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff', letterSpacing: -0.3, opacity: 0.95, marginBottom: 10 }}>
                장해보상 일시금 지급 완료
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10 }}>
                <Text style={{ fontSize: 17, fontWeight: '700', color: '#fff', opacity: 0.9, marginRight: 4 }}>₩</Text>
                <Text style={{ fontSize: 30, fontWeight: '800', color: '#fff', letterSpacing: -1.2, lineHeight: 30 }}>
                  38,420,000
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: 10,
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(255,255,255,0.25)',
                }}
              >
                <View>
                  <Text style={{ fontSize: 10, color: '#fff', opacity: 0.8, letterSpacing: 0.4, marginBottom: 2 }}>장해등급</Text>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: -0.3 }}>6급 4호</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 10, color: '#fff', opacity: 0.8, letterSpacing: 0.4, marginBottom: 2 }}>지급일</Text>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: -0.3 }}>2024.02.15</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 10, color: '#fff', opacity: 0.8, letterSpacing: 0.4, marginBottom: 2 }}>처리기간</Text>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: -0.3 }}>195일</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ─── 진행 이력 ─── */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-[17px] font-bold text-text1" style={{ letterSpacing: -0.3 }}>진행 이력</Text>
        </View>

        <View className="bg-white rounded-2xl p-4 mb-2.5" style={CARD_SHADOW}>
          {TIMELINE.map((step, i) => {
            const isLast = i === TIMELINE.length - 1;
            return (
              <View key={step.label} style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ width: 28, alignItems: 'center', paddingTop: 2 }}>
                  <View
                    style={{
                      width: 20, height: 20, borderRadius: 10,
                      backgroundColor: colors.success,
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Image
                      source={require('../assets/icons/check-timeline.png')}
                      style={{ width: 10, height: 10, tintColor: '#fff' }}
                    />
                  </View>
                  {!isLast && (
                    <View style={{ flex: 1, width: 2, backgroundColor: colors.success, marginTop: 3 }} />
                  )}
                </View>
                <View style={{ flex: 1, paddingBottom: isLast ? 0 : 16 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text1, letterSpacing: -0.3 }}>
                      {step.label}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.text3, letterSpacing: -0.2 }}>{step.date}</Text>
                  </View>
                  <Text style={{ fontSize: 11, marginTop: 2, color: colors.text2, letterSpacing: -0.2 }}>{step.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* ─── 서류 목록 ─── */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-[17px] font-bold text-text1" style={{ letterSpacing: -0.3 }}>서류 목록</Text>
          <Text className="text-[12px]" style={{ color: colors.text2, letterSpacing: -0.2 }}>
            {'3건 · '}
            <Text style={{ color: colors.success, fontWeight: '700' }}>전체 처리</Text>
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-4 mb-2.5" style={CARD_SHADOW}>
          <View className="gap-3">
            {DOCUMENTS.map((doc, i) => (
              <View key={i} className="flex-row items-center gap-3">
                <View
                  style={{
                    width: 34, height: 38, borderRadius: 7,
                    backgroundColor: colors.chip.greenBg,
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Image source={require('../assets/icons/document-success.png')} style={{ width: 20, height: 20 }} />
                </View>
                <View className="flex-1">
                  <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text1, letterSpacing: -0.3 }}>
                    {doc.name}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.text2, marginTop: 2, letterSpacing: -0.2 }}>
                    {doc.desc}
                  </Text>
                </View>
                <View className="px-2.5 py-1 rounded-full" style={{ backgroundColor: doc.statusBg }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: doc.statusFg, letterSpacing: -0.2 }}>
                    {doc.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ─── 제출 서류 ─── */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-[17px] font-bold text-text1" style={{ letterSpacing: -0.3 }}>제출 서류</Text>
          <Text className="text-[12px]" style={{ color: colors.text2, letterSpacing: -0.2 }}>5건 · 전체 서류</Text>
        </View>

        <View className="bg-white rounded-2xl overflow-hidden mb-4" style={CARD_SHADOW}>
          {SUBMITTED_DOCS.map((doc, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.7}
              className="flex-row items-center px-4 gap-3"
              style={{
                height: 52,
                borderBottomWidth: i < SUBMITTED_DOCS.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
              }}
            >
              <View
                style={{
                  width: 26, height: 30, borderRadius: 5,
                  backgroundColor: colors.chip.greenBg,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Image source={require('../assets/icons/document-success.png')} style={{ width: 14, height: 14 }} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text1, letterSpacing: -0.3 }}>
                  {doc.name}
                </Text>
                <Text style={{ fontSize: 11, color: colors.text3, marginTop: 1, letterSpacing: -0.2 }}>
                  {doc.sub}
                </Text>
              </View>
              <Image
                source={require('../assets/icons/chevron-right.png')}
                style={{ width: 14, height: 14, tintColor: colors.text3 }}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── 결정문 다운로드 ─── */}
        <TouchableOpacity
          className="h-12 rounded-xl items-center justify-center flex-row gap-2"
          style={{ borderWidth: 1.5, borderColor: colors.border, backgroundColor: '#fff' }}
          activeOpacity={0.8}
        >
          <Image
            source={require('../assets/icons/download.png')}
            style={{ width: 16, height: 16, tintColor: colors.text1 }}
          />
          <Text className="text-[14px] font-bold text-text1" style={{ letterSpacing: -0.3 }}>
            결정문 다운로드 (PDF)
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
