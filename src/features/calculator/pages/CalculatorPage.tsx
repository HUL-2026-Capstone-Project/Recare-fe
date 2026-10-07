import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';
import { CaseDetailHeader } from '@/features/case/components/CaseDetailHeader';
import { SectionHeader } from '@/features/home/components/SectionHeader';
import { homeMock } from '@/features/home/components/mocks';
import { EstimatedAmountCard } from '@/features/calculator/components/EstimatedAmountCard';
import { CalculationInfoCard } from '@/features/calculator/components/CalculationInfoCard';
import { CalculationHistoryCard } from '@/features/calculator/components/CalculationHistoryCard';
import { calculatorMock } from '@/features/calculator/mocks';
import { digitsToDate, diffInclusiveDays } from '@/features/calculator/utils/date';

const toDigits = (value: string) => value.replace(/\D/g, '');

export default function CalculatorScreen() {
  const { top, bottom } = useSafeAreaInsets();

  const [averageWageDigits, setAverageWageDigits] = useState(toDigits(calculatorMock.averageWage));
  const [careStartDigits, setCareStartDigits] = useState(toDigits(homeMock.period.startDate));
  const [careEndDigits, setCareEndDigits] = useState(toDigits(homeMock.period.endDate));
  const [excludedDaysDigits, setExcludedDaysDigits] = useState(toDigits(calculatorMock.excludedDays));

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
            <EstimatedAmountCard
              name={homeMock.user.name}
              amount={calculatorMock.amount}
              ratioLabel={calculatorMock.ratioLabel}
            />

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
              // 계산 규칙이 시안에 없어 스텁 처리 (TODO)
              onPress={() => {}}
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
