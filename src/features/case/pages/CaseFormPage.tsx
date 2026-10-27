import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';

import type { CaseResponse } from '@/api/caseApi';
import { colors } from '@/shared/constants/colors';
import { svgAssetUri } from '@/shared/lib/svgAsset';
import { ToggleSwitch } from '@/features/notification-settings/components/ToggleSwitch';
import { useCaseStore } from '@/store/caseStore';
import { CaseDetailHeader } from '../components/CaseDetailHeader';
import {
  FormDateField,
  FormMultilineField,
  FormSection,
  FormTextField,
  FormTypeSegments,
  useFieldLayouts,
} from '../components/CaseFormFields';
import { DatePickerSheet } from '../components/DatePickerSheet';
import { LeaveConfirmModal } from '../components/LeaveConfirmModal';
import {
  CASE_FORM_LIMITS,
  EMPTY_CASE_FORM,
  fromCase,
  hasUpdateChanges,
  toCreateRequest,
  toUpdateRequest,
} from '../formMapper';
import type { CaseFormValues } from '../formMapper';
import { CASE_FORM_MESSAGES, hasFormErrors, validateCaseForm } from '../formValidation';
import type { CaseFormErrors } from '../formValidation';

type DateKey = 'date' | 'careStart' | 'careEnd' | 'dxDate';

const DATE_LABELS: Record<DateKey, string> = {
  date: '재해일자',
  careStart: '요양 시작일',
  careEnd: '요양 종료일',
  dxDate: '진단일자',
};

// 오류가 난 필드로 스크롤할 때 쓰는 (섹션, 필드) 위치. 위에서부터의 순서이기도 하다.
const ERROR_ORDER: { key: keyof CaseFormErrors; section: string }[] = [
  { key: 'title', section: 'basic' },
  { key: 'type', section: 'basic' },
  { key: 'date', section: 'basic' },
  { key: 'subtype', section: 'basic' },
  { key: 'work', section: 'basic' },
  { key: 'careEnd', section: 'care' },
];

// 등록과 수정이 같이 쓰는 화면. 입력값은 이 화면의 상태로만 두고 화면을 벗어나면 사라진다(저장소·로그에 남기지 않는다).
export default function CaseFormScreen() {
  const { mode, id } = useLocalSearchParams<{ mode?: string; id?: string }>();
  const { top } = useSafeAreaInsets();
  const isEdit = mode === 'edit';
  const caseId = Number(id);
  const detail = useCaseStore((state) => state.details[caseId]);
  const fetchCase = useCaseStore((state) => state.fetchCase);

  useEffect(() => {
    if (isEdit && Number.isFinite(caseId) && !detail) fetchCase(caseId);
  }, [isEdit, caseId, detail, fetchCase]);

  // TODO(디자인 필요): 수정 화면에서 상세를 불러오는 동안의 로딩 UI가 시안에 없어 헤더만 보여준다.
  if (isEdit && !detail) {
    return (
      <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
        <CaseDetailHeader title="케이스 수정" />
      </View>
    );
  }

  return <CaseForm original={isEdit ? detail : null} />;
}

function CaseForm({ original }: { original: CaseResponse | null }) {
  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation();
  const createCase = useCaseStore((state) => state.createCase);
  const updateCase = useCaseStore((state) => state.updateCase);
  const saving = useCaseStore((state) => state.saveStatus === 'saving');

  // 화면이 열린 시점의 원본과 초기값을 고정해 두고, 변경 여부와 수정 요청의 비교 기준으로 쓴다.
  const [snapshot] = useState(original);
  const [initial] = useState<CaseFormValues>(() => (original ? fromCase(original) : EMPTY_CASE_FORM));
  const [values, setValues] = useState<CaseFormValues>(initial);
  const [submitErrors, setSubmitErrors] = useState<CaseFormErrors>({});
  const [saveFailed, setSaveFailed] = useState(false);
  const [dateTarget, setDateTarget] = useState<DateKey | null>(null);
  const [leaveVisible, setLeaveVisible] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const layouts = useFieldLayouts();

  const dirty = (Object.keys(initial) as (keyof CaseFormValues)[]).some((key) => values[key] !== initial[key]);
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  const savingRef = useRef(saving);
  savingRef.current = saving;
  const allowExit = useRef(false);
  const pendingAction = useRef<Parameters<typeof navigation.dispatch>[0] | null>(null);

  // 헤더 뒤로가기·하드웨어 뒤로가기·iOS 스와이프가 모두 여기를 지난다. 저장 중에는 나갈 수 없고, 변경이 있을 때만 확인 모달을 띄운다.
  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (allowExit.current) return;
        if (savingRef.current) {
          e.preventDefault();
          return;
        }
        if (!dirtyRef.current) return;
        e.preventDefault();
        pendingAction.current = e.data.action;
        setLeaveVisible(true);
      }),
    [navigation]
  );

  const leave = () => {
    allowExit.current = true;
    setLeaveVisible(false);
    if (pendingAction.current) navigation.dispatch(pendingAction.current);
  };

  const setField = <K extends keyof CaseFormValues>(key: K, value: CaseFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // 고친 필드의 오류부터 지운다. 요양 종료일 오류는 시작일을 고쳐도 지운다.
    const errorKey = (key === 'careStart' ? 'careEnd' : key) as keyof CaseFormErrors;
    setSubmitErrors((prev) => {
      if (!(errorKey in prev)) return prev;
      const { [errorKey]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const scrollToField = (section: string, field?: string) => {
    scrollRef.current?.scrollTo({ y: Math.max(0, layouts.offsetOf(section, field) - 16), animated: true });
  };
  // 키보드가 올라와 화면이 줄어든 뒤에 맞춰야 해서 잠시 기다린다.
  const scrollAfterKeyboard = (section: string, field: string) => () => {
    setTimeout(() => scrollToField(section, field), 250);
  };

  const openDateSheet = (key: DateKey) => {
    Keyboard.dismiss();
    setDateTarget(key);
  };

  const handleSave = async () => {
    if (saving) return;
    Keyboard.dismiss();

    const errors = validateCaseForm(values);
    setSubmitErrors(errors);
    if (hasFormErrors(errors)) {
      const first = ERROR_ORDER.find((item) => errors[item.key]);
      if (first) scrollToField(first.section, first.key);
      return;
    }

    setSaveFailed(false);
    let saved: CaseResponse | null;
    if (snapshot) {
      const request = toUpdateRequest(values, snapshot);
      if (!hasUpdateChanges(request)) {
        allowExit.current = true;
        router.back();
        return;
      }
      saved = await updateCase(snapshot.id, request);
    } else {
      saved = await createCase(toCreateRequest(values));
    }

    if (!saved) {
      setSaveFailed(true);
      return;
    }
    allowExit.current = true;
    router.back();
  };

  // 글자 수 한도 오류(세부 유형, 업종·작업)는 입력하는 즉시 보이고, 나머지 오류는 저장을 눌렀을 때만 보인다.
  const liveErrors = validateCaseForm(values);
  const errors: CaseFormErrors = { ...submitErrors, subtype: liveErrors.subtype, work: liveErrors.work };

  const saveControl = saving ? (
    <View className="flex-row items-center" style={{ gap: 6 }}>
      <ActivityIndicator size="small" color={colors.primary} />
      <Text style={{ fontSize: 13, color: colors.text3 }}>저장 중</Text>
    </View>
  ) : (
    <TouchableOpacity activeOpacity={0.7} onPress={handleSave}>
      <Text style={{ fontSize: 15, fontWeight: '700', color: colors.primary, letterSpacing: -0.3 }}>저장</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ backgroundColor: colors.bg, paddingTop: top }}
    >
      <CaseDetailHeader title={snapshot ? '케이스 수정' : '케이스 등록'} right={saveControl} />

      {saveFailed && (
        <View className="flex-row items-center" style={{ backgroundColor: colors.chip.redBg, paddingHorizontal: 20, paddingVertical: 12, gap: 8 }}>
          <Text style={{ flex: 1, fontSize: 13, fontWeight: '600', color: colors.danger, letterSpacing: -0.3 }}>
            {CASE_FORM_MESSAGES.saveFailed}
          </Text>
          <TouchableOpacity activeOpacity={0.7} hitSlop={8} onPress={() => setSaveFailed(false)}>
            <SvgUri uri={svgAssetUri(require('@/shared/assets/icons-svg/close.svg'))} width={14} height={14} />
          </TouchableOpacity>
        </View>
      )}

      <View className="flex-1" style={{ opacity: saving ? 0.6 : 1 }} pointerEvents={saving ? 'none' : 'auto'}>
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 12, paddingHorizontal: 20, paddingBottom: Math.max(bottom, 24) + 24, gap: 12 }}
        >
          <FormSection title="기본 정보" onLayout={layouts.sectionLayout('basic')}>
            <FormTextField
              label="케이스 제목"
              required
              placeholder="예: 우측 손목 골절 산재 신청"
              value={values.title}
              onChangeText={(text) => setField('title', text)}
              maxLength={CASE_FORM_LIMITS.title}
              error={errors.title}
              onLayout={layouts.fieldLayout('title')}
              onFocusField={scrollAfterKeyboard('basic', 'title')}
            />
            <FormTypeSegments
              label="재해유형"
              required
              value={values.type}
              onChange={(type) => setField('type', type)}
              error={errors.type}
              onLayout={layouts.fieldLayout('type')}
            />
            <FormTextField
              label="세부 유형"
              placeholder="추락, 소음성 난청"
              value={values.subtype}
              onChangeText={(text) => setField('subtype', text)}
              counterLimit={CASE_FORM_LIMITS.subtype}
              error={errors.subtype}
              onLayout={layouts.fieldLayout('subtype')}
              onFocusField={scrollAfterKeyboard('basic', 'subtype')}
            />
            <FormDateField
              label="재해일자"
              required
              value={values.date}
              active={dateTarget === 'date'}
              onPress={() => openDateSheet('date')}
              error={errors.date}
              onLayout={layouts.fieldLayout('date')}
            />
            <FormTextField
              label="발생 장소"
              placeholder="사고가 난 장소"
              value={values.place}
              onChangeText={(text) => setField('place', text)}
              maxLength={CASE_FORM_LIMITS.place}
              onLayout={layouts.fieldLayout('place')}
              onFocusField={scrollAfterKeyboard('basic', 'place')}
            />
            <FormTextField
              label="업종 · 작업"
              placeholder="건설업 · 철골 작업"
              value={values.work}
              onChangeText={(text) => setField('work', text)}
              counterLimit={CASE_FORM_LIMITS.work}
              error={errors.work}
              onLayout={layouts.fieldLayout('work')}
              onFocusField={scrollAfterKeyboard('basic', 'work')}
            />
            <View className="flex-row items-center justify-between">
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text1, letterSpacing: -0.3 }}>현재 휴업 중</Text>
              <ToggleSwitch on={values.paused} onToggle={() => setField('paused', !values.paused)} />
            </View>
          </FormSection>

          <FormSection title="사고 경위" onLayout={layouts.sectionLayout('story')}>
            <FormMultilineField
              placeholder="사고가 어떻게 일어났는지 순서대로 적어 주세요"
              value={values.story}
              onChangeText={(text) => setField('story', text)}
              maxLength={CASE_FORM_LIMITS.story}
              onFocusField={scrollAfterKeyboard('story', '')}
            />
          </FormSection>

          <FormSection title="요양 정보" onLayout={layouts.sectionLayout('care')}>
            <FormDateField
              label="요양 시작일"
              value={values.careStart}
              active={dateTarget === 'careStart'}
              onPress={() => openDateSheet('careStart')}
            />
            <FormDateField
              label="요양 종료일"
              value={values.careEnd}
              active={dateTarget === 'careEnd'}
              onPress={() => openDateSheet('careEnd')}
              error={errors.careEnd}
              onLayout={layouts.fieldLayout('careEnd')}
            />
          </FormSection>

          <FormSection title="진단 정보" onLayout={layouts.sectionLayout('diagnosis')}>
            <FormTextField
              label="진단명"
              placeholder="진단서에 적힌 병명"
              value={values.dx}
              onChangeText={(text) => setField('dx', text)}
              maxLength={CASE_FORM_LIMITS.dx}
              onLayout={layouts.fieldLayout('dx')}
              onFocusField={scrollAfterKeyboard('diagnosis', 'dx')}
            />
            <FormTextField
              label="부상 부위"
              placeholder="예: 우측 손목"
              value={values.part}
              onChangeText={(text) => setField('part', text)}
              maxLength={CASE_FORM_LIMITS.part}
              onLayout={layouts.fieldLayout('part')}
              onFocusField={scrollAfterKeyboard('diagnosis', 'part')}
            />
            <FormDateField
              label="진단일자"
              value={values.dxDate}
              active={dateTarget === 'dxDate'}
              onPress={() => openDateSheet('dxDate')}
            />
            <FormTextField
              label="진단 의료기관"
              placeholder="병원 이름 직접 입력"
              value={values.hospital}
              onChangeText={(text) => setField('hospital', text)}
              maxLength={CASE_FORM_LIMITS.hospital}
              onLayout={layouts.fieldLayout('hospital')}
              onFocusField={scrollAfterKeyboard('diagnosis', 'hospital')}
            />
          </FormSection>

          {snapshot && (
            <FormSection title="접수번호" onLayout={layouts.sectionLayout('receipt')}>
              <View>
                <FormTextField
                  label="근로복지공단 접수번호"
                  placeholder="접수번호 입력"
                  value={values.receipt}
                  onChangeText={(text) => setField('receipt', text)}
                  maxLength={CASE_FORM_LIMITS.receipt}
                  onLayout={layouts.fieldLayout('receipt')}
                  onFocusField={scrollAfterKeyboard('receipt', 'receipt')}
                />
                <Text style={{ fontSize: 12, color: colors.text3, marginTop: 6, marginHorizontal: 2 }}>
                  접수 후 받은 번호를 입력하세요. 입력 전에는 비어 있어요.
                </Text>
              </View>
            </FormSection>
          )}
        </ScrollView>
      </View>

      <DatePickerSheet
        visible={dateTarget !== null}
        title={dateTarget ? DATE_LABELS[dateTarget] : ''}
        value={dateTarget ? values[dateTarget] : ''}
        onClose={() => setDateTarget(null)}
        onConfirm={(value) => {
          if (dateTarget) setField(dateTarget, value);
          setDateTarget(null);
        }}
      />

      <LeaveConfirmModal visible={leaveVisible} onCancel={() => setLeaveVisible(false)} onLeave={leave} />
    </KeyboardAvoidingView>
  );
}
