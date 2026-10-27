import { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';
import { useBenefitStore } from '@/store/benefitStore';
import { useCaseStore } from '@/store/caseStore';
import { isClosedStatus } from '@/features/case/statusMapper';
import { CaseDetailHeader } from '@/features/case/components/CaseDetailHeader';
import { SectionHeader } from '@/features/home/components/SectionHeader';
import { homeMock } from '@/features/home/components/mocks';
import { EstimatedAmountCard } from '@/features/calculator/components/EstimatedAmountCard';
import { CalculationInfoCard } from '@/features/calculator/components/CalculationInfoCard';
import { CalculationHistoryCard } from '@/features/calculator/components/CalculationHistoryCard';
import { calculatorMock } from '@/features/calculator/mocks';
import { digitsToDate, diffInclusiveDays } from '@/features/calculator/utils/date';
import { buildBenefitRequest, formatWon, isBenefitRequestReady, isoDateToDigits } from '@/features/calculator/benefitMapper';

const toDigits = (value: string) => value.replace(/\D/g, '');

export default function CalculatorScreen() {
  const { top, bottom } = useSafeAreaInsets();

  // 임금·제외일수는 사용자가 입력하는 값이라 목 기본값을 채우지 않는다. 요양기간은 대표 케이스에서 채운다.
  const [averageWageDigits, setAverageWageDigits] = useState('');
  const [careStartDigits, setCareStartDigits] = useState('');
  const [careEndDigits, setCareEndDigits] = useState('');
  const [excludedDaysDigits, setExcludedDaysDigits] = useState('');

  // 대표 케이스(CLOSED가 아닌 첫 번째)의 요양기간. 홈과 같은 기준이며 caseStore에 이미 있으면 그대로 쓴다.
  const cases = useCaseStore((state) => state.cases);
  const details = useCaseStore((state) => state.details);
  const fetchCases = useCaseStore((state) => state.fetchCases);
  const fetchCase = useCaseStore((state) => state.fetchCase);
  const activeCaseId = cases.find((c) => !isClosedStatus(c.status))?.id;
  const activeDetail = activeCaseId != null ? details[activeCaseId] : undefined;

  const result = useBenefitStore((state) => state.result);
  const status = useBenefitStore((state) => state.status);
  const preview = useBenefitStore((state) => state.preview);

  useEffect(() => {
    if (useCaseStore.getState().cases.length === 0) fetchCases();
  }, [fetchCases]);

  useEffect(() => {
    if (activeCaseId != null && !activeDetail) fetchCase(activeCaseId);
  }, [activeCaseId, activeDetail, fetchCase]);

  // 사용자가 아직 요양기간을 건드리지 않았을 때만 케이스 값으로 채운다.
  useEffect(() => {
    if (activeDetail && careStartDigits === '' && careEndDigits === '') {
      setCareStartDigits(isoDateToDigits(activeDetail.treatmentStartDate));
      setCareEndDigits(isoDateToDigits(activeDetail.treatmentEndDate));
    }
  }, [activeDetail, careStartDigits, careEndDigits]);

  // 금융 정보라 화면을 벗어나면 결과를 메모리에서 비운다.
  useEffect(() => {
    return () => useBenefitStore.getState().reset();
  }, []);

  const careStartDate = digitsToDate(careStartDigits);
  const careEndDate = digitsToDate(careEndDigits);

  const dateError =
    careStartDigits.length === 8 && !careStartDate
      ? '올바른 날짜를 입력해 주세요'
      : careEndDigits.length === 8 && !careEndDate
        ? '올바른 날짜를 입력해 주세요'
        : careStartDate && careEndDate && careStartDate.getTime() > careEndDate.getTime()
          ? '시작일이 종료일보다 늦어요'
          : undefined;

  const excludedDaysError =
    careStartDate && careEndDate && careStartDate.getTime() <= careEndDate.getTime() && excludedDaysDigits !== ''
      ? Number(excludedDaysDigits) > diffInclusiveDays(careStartDate, careEndDate)
        ? '제외일수가 요양기간을 초과했어요'
        : undefined
      : undefined;

  const handleCalculate = () => {
    if (status === 'loading' || dateError || excludedDaysError) return;
    const request = buildBenefitRequest({ averageWageDigits, careStartDigits, careEndDigits, excludedDaysDigits });
    // 필수 값(임금, 요양 시작/종료일)이 없으면 호출하지 않는다. 대표 케이스나 요양기간이 없으면 칸이 비어 여기서 멈춘다.
    if (!isBenefitRequestReady(request)) return;
    preview(request);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      <CaseDetailHeader title="예상 휴업급여 보상금액" />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            className="flex-1 px-5"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{ paddingTop: 4, paddingBottom: Math.max(bottom, 32) }}
          >
            {result?.estimatedAmount != null && (
              <EstimatedAmountCard
                name={homeMock.user.name}
                amount={formatWon(result.estimatedAmount)}
                ratioLabel={result.headlineRule?.label ?? undefined}
              />
            )}

            <CalculationInfoCard
              averageWageDigits={averageWageDigits}
              onChangeAverageWageDigits={setAverageWageDigits}
              careStartDigits={careStartDigits}
              onChangeCareStartDigits={setCareStartDigits}
              careEndDigits={careEndDigits}
              onChangeCareEndDigits={setCareEndDigits}
              excludedDaysDigits={excludedDaysDigits}
              onChangeExcludedDaysDigits={setExcludedDaysDigits}
              dateError={dateError}
              excludedDaysError={excludedDaysError}
            />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleCalculate}
              className="items-center justify-center"
              style={{ height: 52, borderRadius: 14, backgroundColor: colors.primary }}
            >
              <Text className="text-white" style={{ fontSize: 16, fontWeight: '700', letterSpacing: -0.3 }}>
                예상 수령액 확인
              </Text>
            </TouchableOpacity>

            <View style={{ height: 12 }} />

            <SectionHeader
              title="계산 이력 조회"
              actionLabel="전체보기 ›"
              // 이동 대상이 시안에 없어 스텁 처리 (TODO)
              onPressAction={() => {}}
            />
            <CalculationHistoryCard items={calculatorMock.history} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
