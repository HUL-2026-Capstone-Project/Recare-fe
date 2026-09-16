import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors } from '@/constants/colors';

type StepState = 'done' | 'current' | 'pending';

const TIMELINE: { label: string; date: string; desc: string; state: StepState }[] = [
  { label: '접수',    date: '11.22', desc: '재해 발생 접수 완료',  state: 'done'    },
  { label: '서류접수', date: '12.03', desc: '서류 제출 진행 중',   state: 'current' },
  { label: '재해조사', date: '—',    desc: '근로복지공단 조사',    state: 'pending' },
  { label: '심사',    date: '—',    desc: '심사 결과 대기',       state: 'pending' },
  { label: '종결',    date: '—',    desc: '처리 완료',           state: 'pending' },
];

const CHECKLIST = [
  { label: '주치의 의견서 발급 신청', sub: '직무 중 추락 사고 기재', done: true  },
  { label: '의료 서류 수령 및 첨부',  sub: '진단서 · 영수증 등',    done: false },
  { label: '경위서 작성 및 제출',    sub: '재해 상황 상세 기재',    done: false },
];

const DOCUMENTS = [
  {
    name: '산재 신청서',
    status: '제출완료',
    statusBg: colors.chip.greenBg,
    statusFg: colors.chip.greenFg,
    desc: '5장 · 2023.12.01',
    iconType: 'success',
  },
  {
    name: '재해 발생 경위서',
    status: '작성 중',
    statusBg: colors.chip.orangeBg,
    statusFg: colors.chip.orangeFg,
    desc: '작성 진행 80%',
    iconType: 'blue',
  },
  {
    name: '의료 서류',
    status: '첨부 필요',
    statusBg: colors.chip.redBg,
    statusFg: colors.chip.redFg,
    desc: '내담자 첨부 대기',
    iconType: 'danger',
  },
  {
    name: '의사 의견서 (3건)',
    status: '첨부 필요',
    statusBg: colors.chip.redBg,
    statusFg: colors.chip.redFg,
    desc: '정면 / 측면 / 사진',
    iconType: 'danger',
  },
];

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOpacity: 0.04,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
} as const;

function TimelineDot({ state }: { state: StepState }) {
  if (state === 'done') {
    return (
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: colors.success,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={require('../assets/icons/check-timeline.png')}
          style={{ width: 10, height: 10, tintColor: '#fff' }}
        />
      </View>
    );
  }
  if (state === 'current') {
    return (
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: colors.primaryLight,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: colors.primary }}
        />
      </View>
    );
  }
  return (
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: colors.border,
      }}
    />
  );
}

function DocIcon({ type }: { type: string }) {
  if (type === 'success') {
    return (
      <View
        style={{
          width: 34,
          height: 38,
          borderRadius: 7,
          backgroundColor: colors.chip.greenBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={require('../assets/icons/document-success.png')}
          style={{ width: 20, height: 20 }}
        />
      </View>
    );
  }
  if (type === 'danger') {
    return (
      <View
        style={{
          width: 34,
          height: 38,
          borderRadius: 7,
          backgroundColor: colors.chip.redBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={require('../assets/icons/document-danger.png')}
          style={{ width: 20, height: 20 }}
        />
      </View>
    );
  }
  return (
    <View
      style={{
        width: 34,
        height: 38,
        borderRadius: 7,
        backgroundColor: colors.chip.blueBg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        source={require('../assets/icons/document.png')}
        style={{ width: 20, height: 20, tintColor: colors.primary }}
      />
    </View>
  );
}

export default function CaseDetailScreen() {
  const { top, bottom } = useSafeAreaInsets();

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
          <Image
            source={require('../assets/icons/chevron-left.png')}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        <Text
          className="text-[17px] font-bold text-text1"
          style={{ letterSpacing: -0.3 }}
        >
          케이스 상세
        </Text>
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
          {/* CASE ID + 상태 */}
          <View className="flex-row justify-between items-center mb-1.5">
            <Text
              className="text-[11px] font-semibold"
              style={{ color: colors.text3, letterSpacing: 0.3 }}
            >
              CASE · 2024-0289
            </Text>
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: colors.chip.blueBg }}
            >
              <Text
                className="text-[12px] font-semibold"
                style={{ color: colors.chip.blueFg, letterSpacing: -0.2 }}
              >
                접수 중
              </Text>
            </View>
          </View>

          {/* 제목 */}
          <Text
            className="text-[17px] font-extrabold text-text1 mb-3"
            style={{ letterSpacing: -0.4 }}
          >
            우측 어깨 골절 손해 신청
          </Text>

          {/* 정보 행 */}
          <View className="gap-2 mb-3">
            {[
              { label: '사고일자',     value: '2023.11.22' },
              { label: '재해유형',     value: '작업 중 추락 사고' },
              { label: '발생장소',     value: '인천광역시 남구 공단로 3-12' },
              { label: '진단 의료기관', value: '인하대학교병원' },
            ].map(row => (
              <View key={row.label} className="flex-row justify-between">
                <Text
                  className="text-[12px]"
                  style={{ color: colors.text2, letterSpacing: -0.2 }}
                >
                  {row.label}
                </Text>
                <Text
                  className="text-[12px] font-semibold text-text1"
                  style={{ letterSpacing: -0.3 }}
                >
                  {row.value}
                </Text>
              </View>
            ))}
          </View>

          {/* 태그 */}
          <View className="flex-row gap-1.5 mb-3">
            {['건설업 · 이사반', '우측 어깨 골절'].map(tag => (
              <View
                key={tag}
                className="px-2.5 py-1 rounded-full"
                style={{ backgroundColor: colors.chip.grayBg }}
              >
                <Text
                  className="text-[11px] font-semibold"
                  style={{ color: colors.chip.grayFg, letterSpacing: -0.2 }}
                >
                  {tag}
                </Text>
              </View>
            ))}
          </View>

          {/* 콜아웃 */}
          <View
            className="flex-row gap-2.5 rounded-xl p-3"
            style={{ backgroundColor: colors.primaryLight }}
          >
            <Image
              source={require('../assets/icons/check-callout.png')}
              style={{ width: 18, height: 18, marginTop: 1 }}
            />
            <View className="flex-1">
              <Text
                className="text-[13px] font-bold mb-0.5"
                style={{ color: colors.primary, letterSpacing: -0.3 }}
              >
                다음 단계 · 서류 첨부 필요
              </Text>
              <Text
                className="text-[12px]"
                style={{ color: colors.primary, opacity: 0.75, letterSpacing: -0.2 }}
              >
                의사 의견서 첨부 시 다음 단계로 진행됩니다
              </Text>
            </View>
          </View>
        </View>

        {/* ─── 진행 상황 카드 ─── */}
        <View className="bg-white rounded-2xl p-4 mb-2.5" style={CARD_SHADOW}>
          <View className="flex-row justify-between items-center mb-4">
            <Text
              className="text-[15px] font-bold text-text1"
              style={{ letterSpacing: -0.3 }}
            >
              진행 상황
            </Text>
            <Text
              className="text-[13px] font-semibold"
              style={{ color: colors.primary, letterSpacing: -0.2 }}
            >
              1 / 5 단계
            </Text>
          </View>

          <View>
            {TIMELINE.map((step, i) => {
              const isLast = i === TIMELINE.length - 1;
              const lineColor =
                step.state === 'done'
                  ? colors.success
                  : step.state === 'current'
                  ? colors.primary
                  : colors.border;
              return (
                <View
                  key={step.label}
                  style={{ flexDirection: 'row', gap: 12 }}
                >
                  {/* 점 + 연결선 */}
                  <View style={{ width: 28, alignItems: 'center', paddingTop: 2 }}>
                    <TimelineDot state={step.state} />
                    {!isLast && (
                      <View
                        style={{
                          flex: 1,
                          width: 2,
                          backgroundColor: lineColor,
                          marginTop: 3,
                        }}
                      />
                    )}
                  </View>

                  {/* 텍스트 */}
                  <View style={{ flex: 1, paddingBottom: isLast ? 0 : 20 }}>
                    <View className="flex-row justify-between items-baseline">
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: step.state === 'pending' ? '500' : '700',
                          color:
                            step.state === 'pending' ? colors.text3 : colors.text1,
                          letterSpacing: -0.3,
                        }}
                      >
                        {step.label}
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          color: colors.text3,
                          letterSpacing: -0.2,
                        }}
                      >
                        {step.date}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 11,
                        marginTop: 2,
                        color:
                          step.state === 'pending' ? colors.text3 : colors.text2,
                        letterSpacing: -0.2,
                      }}
                    >
                      {step.desc}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* ─── 체크리스트 카드 ─── */}
        <View className="bg-white rounded-2xl p-4 mb-2.5" style={CARD_SHADOW}>
          <View className="flex-row justify-between items-center mb-4">
            <Text
              className="text-[15px] font-bold text-text1"
              style={{ letterSpacing: -0.3 }}
            >
              접수 체크리스트
            </Text>
            <Text
              className="text-[13px] font-semibold"
              style={{ color: colors.primary, letterSpacing: -0.2 }}
            >
              1 / 3
            </Text>
          </View>

          <View className="gap-3">
            {CHECKLIST.map((item, i) => (
              <View key={i} className="flex-row gap-3 items-start">
                <View style={{ marginTop: 1 }}>
                  {item.done ? (
                    <Image
                      source={require('../assets/icons/check-circle-success.png')}
                      style={{ width: 20, height: 20 }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: colors.border,
                        backgroundColor: '#fff',
                      }}
                    />
                  )}
                </View>
                <View className="flex-1">
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: item.done ? colors.text3 : colors.text1,
                      letterSpacing: -0.3,
                      textDecorationLine: item.done ? 'line-through' : 'none',
                    }}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: colors.text3,
                      marginTop: 2,
                      letterSpacing: -0.2,
                    }}
                  >
                    {item.sub}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ─── 서류 목록 카드 ─── */}
        <View className="bg-white rounded-2xl p-4" style={CARD_SHADOW}>
          <View className="flex-row justify-between items-center mb-4">
            <Text
              className="text-[15px] font-bold text-text1"
              style={{ letterSpacing: -0.3 }}
            >
              서류 목록
            </Text>
            <Text
              className="text-[12px]"
              style={{ color: colors.text2, letterSpacing: -0.2 }}
            >
              {'4건 · '}
              <Text style={{ color: colors.success, fontWeight: '700' }}>
                2건 처리
              </Text>
            </Text>
          </View>

          <View className="gap-3">
            {DOCUMENTS.map((doc, i) => (
              <View key={i} className="flex-row items-center gap-3">
                <DocIcon type={doc.iconType} />
                <View className="flex-1">
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: colors.text1,
                      letterSpacing: -0.3,
                    }}
                  >
                    {doc.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: colors.text2,
                      marginTop: 2,
                      letterSpacing: -0.2,
                    }}
                  >
                    {doc.desc}
                  </Text>
                </View>
                <View
                  className="px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: doc.statusBg }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: doc.statusFg,
                      letterSpacing: -0.2,
                    }}
                  >
                    {doc.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ─── 하단 버튼 ─── */}
      <View
        className="bg-white px-4 pt-3 flex-row gap-2.5"
        style={{
          paddingBottom: bottom > 0 ? bottom : 20,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <TouchableOpacity
          className="flex-1 h-12 rounded-xl items-center justify-center"
          style={{ borderWidth: 1.5, borderColor: colors.primary }}
          activeOpacity={0.8}
        >
          <Text
            className="text-[14px] font-bold"
            style={{ color: colors.primary, letterSpacing: -0.3 }}
          >
            경위서 작성
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 h-12 rounded-xl items-center justify-center"
          style={{ backgroundColor: colors.primary }}
          activeOpacity={0.85}
        >
          <Text
            className="text-white text-[14px] font-bold"
            style={{ letterSpacing: -0.3 }}
          >
            서류 첨부하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
