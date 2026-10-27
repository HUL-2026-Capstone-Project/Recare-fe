import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import type { CaseStatus } from '@/api/caseApi';
import { colors } from '@/shared/constants/colors';
import { useCaseStore } from '@/store/caseStore';
import { CASE_STATUS_OPTIONS } from '../progressFormat';
import { FormSheet } from './FormSheet';

function Radio({ selected }: { selected: boolean }) {
  return (
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: selected ? colors.primary : '#fff',
        borderWidth: selected ? 0 : 1.5,
        borderColor: colors.text3,
      }}
    >
      {selected && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' }} />}
    </View>
  );
}

// 열 때마다 새로 마운트해서 쓴다. 열면 현재 상태가 선택돼 있다.
export function CaseStatusSheet({ caseId, current, onClose }: { caseId: number; current: CaseStatus; onClose: () => void }) {
  const changeStatus = useCaseStore((state) => state.changeStatus);
  const [selected, setSelected] = useState<CaseStatus>(current);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleSubmit = async () => {
    if (selected === current || saving) return;
    setSaving(true);
    setFailed(false);
    const ok = await changeStatus(caseId, selected);
    setSaving(false);
    if (ok) onClose();
    else setFailed(true);
  };

  return (
    <FormSheet
      visible
      title="케이스 상태 변경"
      submitLabel="변경하기"
      canSubmit={selected !== current}
      saving={saving}
      failureMessage={failed ? '변경하지 못했어요. 잠시 후 다시 시도해 주세요.' : null}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      {CASE_STATUS_OPTIONS.map((option, index) => {
        const on = selected === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => setSelected(option.value)}
            className="flex-row items-center justify-between"
            style={{ height: 52, borderBottomWidth: index < CASE_STATUS_OPTIONS.length - 1 ? 1 : 0, borderBottomColor: colors.input }}
          >
            <Text style={{ fontSize: 15, letterSpacing: -0.3, fontWeight: on ? '700' : '500', color: on ? colors.primary : colors.text1 }}>{option.label}</Text>
            <Radio selected={on} />
          </Pressable>
        );
      })}
      <Text style={{ fontSize: 12, fontWeight: '500', color: colors.text3, letterSpacing: -0.2, marginTop: 12 }}>상태를 바꾸면 진행 단계도 함께 바뀌어요</Text>
    </FormSheet>
  );
}
