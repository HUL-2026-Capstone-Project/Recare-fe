import { useState } from 'react';
import { Modal, Platform, Pressable, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { colors } from '@/shared/constants/colors';
import { Card } from '@/features/home/components/Card';
import { dateToDigits, digitsToDate, formatDigitsWithDots } from '@/features/calculator/utils/date';

function FieldLabel({ children }: { children: string }) {
  return (
    <Text className="mb-1.5" style={{ fontSize: 12, fontWeight: '600', color: colors.text2, letterSpacing: -0.2 }}>
      {children}
    </Text>
  );
}

function ErrorText({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <Text style={{ fontSize: 11, fontWeight: '400', color: colors.danger, marginTop: 6 }}>{children}</Text>
  );
}

function InputBox({
  focused,
  children,
}: {
  focused: boolean;
  children: React.ReactNode;
}) {
  return (
    <View
      className="flex-row items-center justify-between px-4"
      style={{
        height: 52,
        borderRadius: 14,
        backgroundColor: colors.input,
        borderWidth: focused ? 1 : 0,
        borderColor: colors.primary,
      }}
    >
      {children}
    </View>
  );
}

function AmountInputField({
  digits,
  onChangeDigits,
  suffix,
  maxDigits,
  focused,
  onFocus,
  onBlur,
}: {
  digits: string;
  onChangeDigits: (digits: string) => void;
  suffix?: string;
  maxDigits: number;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  const display = suffix === '원' ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : digits;

  return (
    <InputBox focused={focused}>
      <TextInput
        value={display}
        onChangeText={(text) => onChangeDigits(text.replace(/\D/g, '').slice(0, maxDigits))}
        onFocus={onFocus}
        onBlur={onBlur}
        keyboardType="number-pad"
        style={{ flex: 1, fontSize: 15, fontWeight: '500', color: colors.text1, letterSpacing: -0.3, padding: 0 }}
      />
      {suffix && <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text2 }}>{suffix}</Text>}
    </InputBox>
  );
}

function CalendarGlyph() {
  return (
    <View style={{ width: 16, height: 16 }}>
      <View style={{ position: 'absolute', top: 0, left: 3, width: 2, height: 4, borderRadius: 1, backgroundColor: colors.text3 }} />
      <View style={{ position: 'absolute', top: 0, right: 3, width: 2, height: 4, borderRadius: 1, backgroundColor: colors.text3 }} />
      <View style={{ position: 'absolute', top: 3, left: 0, width: 16, height: 13, borderRadius: 2, borderWidth: 1.3, borderColor: colors.text3 }} />
      <View style={{ position: 'absolute', top: 6, left: 1, width: 14, height: 1.3, backgroundColor: colors.text3 }} />
    </View>
  );
}

function DateInputField({
  digits,
  onChangeDigits,
  minDate,
  maxDate,
  focused,
  onFocus,
  onBlur,
}: {
  digits: string;
  onChangeDigits: (digits: string) => void;
  minDate?: Date;
  maxDate?: Date;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  const [pickerVisible, setPickerVisible] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(() => digitsToDate(digits) ?? new Date());
  const { width: windowWidth } = useWindowDimensions();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const sheetHorizontalPadding = 16;
  const pickerWidth = windowWidth - sheetHorizontalPadding * 2;

  function openPicker() {
    setTempDate(digitsToDate(digits) ?? maxDate ?? minDate ?? new Date());
    setPickerVisible(true);
  }

  function handleAndroidChange(event: DateTimePickerEvent, selectedDate?: Date) {
    setPickerVisible(false);
    if (event.type === 'set' && selectedDate) {
      onChangeDigits(dateToDigits(selectedDate));
    }
  }

  function handleIosChange(_event: DateTimePickerEvent, selectedDate?: Date) {
    if (selectedDate) setTempDate(selectedDate);
  }

  function confirmIos() {
    onChangeDigits(dateToDigits(tempDate));
    setPickerVisible(false);
  }

  return (
    <View style={{ flex: 1 }}>
      <InputBox focused={focused}>
        <TextInput
          value={formatDigitsWithDots(digits)}
          onChangeText={(text) => onChangeDigits(text.replace(/\D/g, '').slice(0, 8))}
          onFocus={onFocus}
          onBlur={onBlur}
          keyboardType="number-pad"
          style={{ flex: 1, fontSize: 15, fontWeight: '500', color: colors.text1, letterSpacing: -0.3, padding: 0 }}
        />
        {/* 달력 선택 — 시안에 없는 최소 추가 */}
        <Pressable onPress={openPicker} hitSlop={8}>
          <CalendarGlyph />
        </Pressable>
      </InputBox>

      {Platform.OS === 'android' && pickerVisible && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          locale="ko"
          minimumDate={minDate}
          maximumDate={maxDate}
          onChange={handleAndroidChange}
        />
      )}

      {Platform.OS === 'ios' && (
        <Modal visible={pickerVisible} transparent animationType="slide" onRequestClose={() => setPickerVisible(false)}>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Pressable
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)' }}
              onPress={() => setPickerVisible(false)}
            />
            <View style={{ backgroundColor: colors.surface, borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: Math.max(bottomInset, 24) }}>
              <View
                className="flex-row items-center justify-between px-4"
                style={{ height: 48, borderBottomWidth: 1, borderBottomColor: colors.border }}
              >
                <Pressable onPress={() => setPickerVisible(false)}>
                  <Text style={{ fontSize: 15, color: colors.text2 }}>취소</Text>
                </Pressable>
                <Pressable onPress={confirmIos}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: colors.primary }}>확인</Text>
                </Pressable>
              </View>
              <View style={{ alignItems: 'center', paddingHorizontal: sheetHorizontalPadding, paddingTop: 8 }}>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="inline"
                  locale="ko"
                  minimumDate={minDate}
                  maximumDate={maxDate}
                  onChange={handleIosChange}
                  style={{ width: pickerWidth }}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

type CalculationInfoCardProps = {
  averageWageDigits: string;
  onChangeAverageWageDigits: (digits: string) => void;
  careStartDigits: string;
  onChangeCareStartDigits: (digits: string) => void;
  careEndDigits: string;
  onChangeCareEndDigits: (digits: string) => void;
  excludedDaysDigits: string;
  onChangeExcludedDaysDigits: (digits: string) => void;
  dateError?: string;
  excludedDaysError?: string;
};

export function CalculationInfoCard({
  averageWageDigits,
  onChangeAverageWageDigits,
  careStartDigits,
  onChangeCareStartDigits,
  careEndDigits,
  onChangeCareEndDigits,
  excludedDaysDigits,
  onChangeExcludedDaysDigits,
  dateError,
  excludedDaysError,
}: CalculationInfoCardProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const careStartDate = digitsToDate(careStartDigits);
  const careEndDate = digitsToDate(careEndDigits);

  return (
    <Card className="p-3.5" style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text1, letterSpacing: -0.3, marginBottom: 12 }}>
        계산 정보
      </Text>
      <View style={{ gap: 10 }}>
        <View>
          <FieldLabel>평균 임금</FieldLabel>
          <AmountInputField
            digits={averageWageDigits}
            onChangeDigits={onChangeAverageWageDigits}
            suffix="원"
            maxDigits={9}
            focused={focusedField === 'averageWage'}
            onFocus={() => setFocusedField('averageWage')}
            onBlur={() => setFocusedField(null)}
          />
        </View>
        <View>
          <FieldLabel>요양기간</FieldLabel>
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <DateInputField
              digits={careStartDigits}
              onChangeDigits={onChangeCareStartDigits}
              maxDate={careEndDate ?? undefined}
              focused={focusedField === 'careStart'}
              onFocus={() => setFocusedField('careStart')}
              onBlur={() => setFocusedField(null)}
            />
            <Text style={{ fontSize: 16, color: colors.text3 }}>~</Text>
            <DateInputField
              digits={careEndDigits}
              onChangeDigits={onChangeCareEndDigits}
              minDate={careStartDate ?? undefined}
              focused={focusedField === 'careEnd'}
              onFocus={() => setFocusedField('careEnd')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
          <ErrorText>{dateError}</ErrorText>
        </View>
        <View>
          <FieldLabel>제외일수</FieldLabel>
          <AmountInputField
            digits={excludedDaysDigits}
            onChangeDigits={onChangeExcludedDaysDigits}
            suffix="일"
            maxDigits={3}
            focused={focusedField === 'excludedDays'}
            onFocus={() => setFocusedField('excludedDays')}
            onBlur={() => setFocusedField(null)}
          />
          <ErrorText>{excludedDaysError}</ErrorText>
        </View>
      </View>
    </Card>
  );
}
