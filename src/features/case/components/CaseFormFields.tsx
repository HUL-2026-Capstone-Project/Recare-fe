import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { CalendarGlyph } from '@/features/calculator/components/CalculationInfoCard';
import { CARD_SHADOW } from '@/features/case/constants';
import type { CaseFormType } from '@/features/case/formMapper';

const INPUT_TEXT_STYLE = { fontSize: 15, fontWeight: '500', color: colors.text1, letterSpacing: -0.3, padding: 0 } as const;

export function formatLimit(limit: number) {
  return String(limit).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function FormSection({ title, onLayout, children }: { title: string; onLayout?: (e: LayoutChangeEvent) => void; children: ReactNode }) {
  return (
    <View onLayout={onLayout} style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 20, gap: 16, ...CARD_SHADOW }}>
      <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text1, letterSpacing: -0.4 }}>{title}</Text>
      {children}
    </View>
  );
}

function FieldLabel({ children, required }: { children: string; required?: boolean }) {
  return (
    <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text2, letterSpacing: -0.3, marginHorizontal: 2, marginBottom: 8 }}>
      {children}
      {required && <Text style={{ color: colors.primary }}> *</Text>}
    </Text>
  );
}

function ErrorText({ children }: { children?: string }) {
  if (!children) return null;
  return <Text style={{ fontSize: 12, color: colors.danger, marginTop: 6, marginHorizontal: 2 }}>{children}</Text>;
}

function FieldBox({ focused, error, children }: { focused: boolean; error?: string; children: ReactNode }) {
  return (
    <View
      className="flex-row items-center"
      style={{
        height: 52,
        borderRadius: 12,
        paddingHorizontal: 16,
        gap: 10,
        backgroundColor: focused ? '#fff' : colors.input,
        borderWidth: 1.5,
        borderColor: error ? colors.danger : focused ? colors.primary : 'transparent',
      }}
    >
      {children}
    </View>
  );
}

type FieldCommon = {
  label: string;
  required?: boolean;
  error?: string;
  onLayout?: (e: LayoutChangeEvent) => void;
  onFocusField?: () => void;
};

type TextFieldProps = FieldCommon & {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  // 화면에서 입력 자체를 막는 한도. 100자 오류 처리 필드는 넘기지 않는다.
  maxLength?: number;
  // 넘기면 오른쪽에 "n/limit" 카운터를 보여주고 limit을 넘으면 위험색으로 바꾼다(입력은 막지 않는다).
  counterLimit?: number;
};

export function FormTextField({ label, required, error, onLayout, onFocusField, value, onChangeText, placeholder, maxLength, counterLimit }: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const over = counterLimit != null && value.length > counterLimit;
  // 포커스가 없을 때 긴 값은 말줄임표로 보이게, 같은 위치에 Text를 겹쳐 그린다(입력은 아래 TextInput이 그대로 받는다).
  const showEllipsis = !focused && value !== '';

  return (
    <View onLayout={onLayout}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <FieldBox focused={focused} error={error}>
        <View style={{ flex: 1, height: '100%', justifyContent: 'center' }}>
          <TextInput
            style={{ ...INPUT_TEXT_STYLE, color: showEllipsis ? 'transparent' : colors.text1 }}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => {
              setFocused(true);
              onFocusField?.();
            }}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            placeholderTextColor={colors.text3}
            maxLength={maxLength}
          />
          {showEllipsis && (
            <Text pointerEvents="none" numberOfLines={1} ellipsizeMode="tail" style={{ ...INPUT_TEXT_STYLE, position: 'absolute', left: 0, right: 0 }}>
              {value}
            </Text>
          )}
        </View>
        {counterLimit != null && (
          <Text style={{ fontSize: 12, fontWeight: over ? '700' : '500', color: over ? colors.danger : colors.text3 }}>
            {value.length}/{counterLimit}
          </Text>
        )}
      </FieldBox>
      <ErrorText>{error}</ErrorText>
    </View>
  );
}

export function FormMultilineField({ onLayout, onFocusField, value, onChangeText, placeholder, maxLength }: Omit<TextFieldProps, 'label' | 'counterLimit' | 'required' | 'error'>) {
  const [focused, setFocused] = useState(false);

  return (
    <View onLayout={onLayout}>
      <View
        style={{
          borderRadius: 12,
          padding: 14,
          backgroundColor: focused ? '#fff' : colors.input,
          borderWidth: 1.5,
          borderColor: focused ? colors.primary : 'transparent',
        }}
      >
        <TextInput
          style={{ ...INPUT_TEXT_STYLE, minHeight: 132 - 28 - 3, textAlignVertical: 'top', lineHeight: 22 }}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => {
            setFocused(true);
            onFocusField?.();
          }}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={colors.text3}
          maxLength={maxLength}
          multiline
        />
      </View>
      {maxLength != null && (
        <Text style={{ fontSize: 12, color: colors.text3, textAlign: 'right', marginTop: 6, marginHorizontal: 2 }}>
          {value.length} / {formatLimit(maxLength)}
        </Text>
      )}
    </View>
  );
}

const TYPE_OPTIONS: { key: CaseFormType; label: string }[] = [
  { key: 'accident', label: '업무상 사고' },
  { key: 'disease', label: '업무상 질병' },
  { key: 'commute', label: '출퇴근 재해' },
];

export function FormTypeSegments({ label, required, error, onLayout, value, onChange }: FieldCommon & { value: CaseFormType | ''; onChange: (type: CaseFormType) => void }) {
  return (
    <View onLayout={onLayout}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <View className="flex-row" style={{ gap: 8 }}>
        {TYPE_OPTIONS.map((option) => {
          const on = value === option.key;
          return (
            <Pressable
              key={option.key}
              onPress={() => onChange(option.key)}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: on ? colors.primaryLight : colors.input,
                borderWidth: 1.5,
                borderColor: on ? colors.primary : error ? colors.danger : 'transparent',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: on ? '700' : '500', color: on ? colors.primary : colors.text2, letterSpacing: -0.3 }}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <ErrorText>{error}</ErrorText>
    </View>
  );
}

// 시트가 열려 있는 동안(active) 포커스 스타일을 쓴다.
export function FormDateField({ label, required, error, onLayout, value, active, onPress }: FieldCommon & { value: string; active: boolean; onPress: () => void }) {
  return (
    <View onLayout={onLayout}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <Pressable onPress={onPress}>
        <FieldBox focused={active} error={error}>
          <Text numberOfLines={1} style={{ ...INPUT_TEXT_STYLE, flex: 1, color: value ? colors.text1 : colors.text3 }}>
            {value || '날짜 선택'}
          </Text>
          <CalendarGlyph />
        </FieldBox>
      </Pressable>
      <ErrorText>{error}</ErrorText>
    </View>
  );
}

export function useFieldLayouts() {
  const sections = useRef<Record<string, number>>({});
  const fields = useRef<Record<string, number>>({});
  return {
    sectionLayout: (key: string) => (e: LayoutChangeEvent) => {
      sections.current[key] = e.nativeEvent.layout.y;
    },
    fieldLayout: (key: string) => (e: LayoutChangeEvent) => {
      fields.current[key] = e.nativeEvent.layout.y;
    },
    offsetOf: (sectionKey: string, fieldKey?: string) => (sections.current[sectionKey] ?? 0) + (fieldKey ? (fields.current[fieldKey] ?? 0) : 0),
  };
}
