import { useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { CalendarIcon } from './SheetIcons';

export const lengthMessage = (limit: number) => `${limit}자 이하로 입력해 주세요`;

type FieldBlockProps = {
  label: string;
  required?: boolean;
  counter?: { length: number; limit: number };
  error?: string | null;
  isLast?: boolean;
  children: ReactNode;
};

// 라벨 줄(필수 표시, 글자 수) + 입력 + 오류 문구. 한도를 넘으면 글자 수가 danger 600이 된다.
export function FieldBlock({ label, required, counter, error, isLast, children }: FieldBlockProps) {
  const over = counter != null && counter.length > counter.limit;
  return (
    <View style={{ marginBottom: isLast ? 0 : 20 }}>
      <View className="flex-row items-center justify-between" style={{ marginBottom: 8, marginHorizontal: 2 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text2, letterSpacing: -0.3 }}>
          {label}
          {required && <Text style={{ color: colors.primary }}>{' *'}</Text>}
        </Text>
        {counter && (
          <Text style={{ fontSize: 12, fontWeight: over ? '600' : '500', color: over ? colors.danger : colors.text3, letterSpacing: -0.2 }}>
            {counter.length}/{counter.limit}
          </Text>
        )}
      </View>
      {children}
      {!!error && <Text style={{ fontSize: 12, lineHeight: 12 * 1.4, fontWeight: '500', color: colors.danger, letterSpacing: -0.2, marginTop: 6 }}>{error}</Text>}
    </View>
  );
}

function OptionChip({ label, selected, onPress, style }: { label: string; selected: boolean; onPress: () => void; style?: object }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        backgroundColor: selected ? colors.primaryLight : colors.input,
        borderColor: selected ? colors.primary : 'transparent',
        ...style,
      }}
    >
      <Text numberOfLines={1} style={{ fontSize: 14, letterSpacing: -0.3, fontWeight: selected ? '700' : '500', color: selected ? colors.primary : colors.text2 }}>
        {label}
      </Text>
    </Pressable>
  );
}

type Option<T extends string> = { value: T; label: string };

// 종류처럼 칩이 많을 때: 3열 격자
export function ChipGrid<T extends string>({ options, value, onChange }: { options: Option<T>[]; value: T | null; onChange: (value: T) => void }) {
  return (
    <View className="flex-row flex-wrap" style={{ gap: 8 }}>
      {options.map((option) => (
        <OptionChip
          key={option.value}
          label={option.label}
          selected={value === option.value}
          onPress={() => onChange(option.value)}
          style={{ flexBasis: '30%', flexGrow: 1, flexShrink: 0 }}
        />
      ))}
    </View>
  );
}

// 상태·우선순위처럼 칩이 적을 때: 한 줄 세그먼트
export function ChipSegment<T extends string>({ options, value, onChange }: { options: Option<T>[]; value: T; onChange: (value: T) => void }) {
  return (
    <View className="flex-row" style={{ gap: 8 }}>
      {options.map((option) => (
        <OptionChip key={option.value} label={option.label} selected={value === option.value} onPress={() => onChange(option.value)} style={{ flex: 1 }} />
      ))}
    </View>
  );
}

const inputBox = (focused: boolean, error: boolean) => ({
  backgroundColor: focused ? '#fff' : colors.input,
  borderWidth: 1.5,
  borderColor: error ? colors.danger : focused ? colors.primary : 'transparent',
});

export function SheetTextInput({ value, onChangeText, placeholder, error }: { value: string; onChangeText: (text: string) => void; placeholder: string; error?: boolean }) {
  const [focused, setFocused] = useState(false);
  return (
    <View className="justify-center" style={{ height: 52, borderRadius: 12, paddingHorizontal: 16, ...inputBox(focused, !!error) }}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text3}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ fontSize: 15, fontWeight: '500', color: colors.text1, letterSpacing: -0.3, padding: 0 }}
      />
    </View>
  );
}

export function SheetMultilineInput({ value, onChangeText, minHeight, error }: { value: string; onChangeText: (text: string) => void; minHeight: number; error?: boolean }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ minHeight, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16, ...inputBox(focused, !!error) }}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="메모를 남겨 보세요"
        placeholderTextColor={colors.text3}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        multiline
        textAlignVertical="top"
        style={{ fontSize: 15, lineHeight: 15 * 1.5, fontWeight: '500', color: colors.text1, letterSpacing: -0.3, padding: 0, minHeight: minHeight - 28 - 3 }}
      />
    </View>
  );
}

// 날짜 시트가 열려 있는 동안(active) 포커스 스타일. 날짜를 지우는 동작은 없다(날짜 시트도 지우기를 제공하지 않는다).
export function SheetDateRow({ value, active, onPress }: { value: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center" style={{ height: 52, borderRadius: 12, paddingHorizontal: 16, gap: 10, ...inputBox(active, false) }}>
      <Text numberOfLines={1} style={{ flex: 1, fontSize: 15, letterSpacing: -0.3, fontWeight: value ? '500' : '400', color: value ? colors.text1 : colors.text3 }}>
        {value || '날짜 선택'}
      </Text>
      <CalendarIcon size={20} />
    </Pressable>
  );
}
