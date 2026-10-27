import { useState } from 'react';

import type { CreateTimelineRequest, TimelineResponse, TimelineStepStatus, TimelineStepType, UpdateTimelineRequest } from '@/api/caseApi';
import { useCaseProgressStore } from '@/store/caseProgressStore';
import { formDateToIso } from '../formMapper';
import { STEP_STATUS_OPTIONS, STEP_TYPE_OPTIONS, formatEventDate } from '../progressFormat';
import { DatePickerSheet } from './DatePickerSheet';
import { FormSheet } from './FormSheet';
import { ChipGrid, ChipSegment, FieldBlock, SheetDateRow, SheetMultilineInput, SheetTextInput, lengthMessage } from './SheetFields';

const TITLE_LIMIT = 100;
const DESCRIPTION_LIMIT = 255;

type Props = {
  caseId: number;
  // 있으면 수정, 없으면 추가
  item: TimelineResponse | null;
  onClose: () => void;
};

// 열 때마다 새로 마운트해서 쓴다(입력값이 이 컴포넌트 state에만 있고 닫으면 사라진다). 수정은 현재 값으로 채운다.
export function TimelineEditSheet({ caseId, item, onClose }: Props) {
  const addTimeline = useCaseProgressStore((state) => state.addTimeline);
  const editTimeline = useCaseProgressStore((state) => state.editTimeline);

  const [stepType, setStepType] = useState<TimelineStepType | null>(item?.stepType ?? null);
  const [title, setTitle] = useState(item?.title ?? '');
  const [stepStatus, setStepStatus] = useState<TimelineStepStatus>(item?.stepStatus ?? 'PENDING');
  const [date, setDate] = useState(formatEventDate(item?.eventDate));
  const [description, setDescription] = useState(item?.description ?? '');
  const [dateOpen, setDateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  const titleOver = title.length > TITLE_LIMIT;
  const descriptionOver = description.length > DESCRIPTION_LIMIT;
  const canSubmit = !!stepType && title.trim() !== '' && !titleOver && !descriptionOver;

  const handleSubmit = async () => {
    if (!canSubmit || saving || !stepType) return;
    const isoDate = formDateToIso(date);

    let request: Promise<boolean>;
    if (item) {
      // 바뀐 항목만 보낸다. 설명을 비웠으면 ""를 보낸다. 날짜는 지우는 방식이 없어 값이 있을 때만 보낸다.
      const body: UpdateTimelineRequest = {};
      if (stepType !== item.stepType) body.stepType = stepType;
      if (title.trim() !== item.title.trim()) body.title = title.trim();
      if (stepStatus !== item.stepStatus) body.stepStatus = stepStatus;
      if (description !== (item.description ?? '')) body.description = description;
      if (isoDate && date !== formatEventDate(item.eventDate)) body.eventDate = isoDate;
      if (Object.keys(body).length === 0) {
        onClose();
        return;
      }
      request = editTimeline(caseId, item.id, body);
    } else {
      // sortOrder는 보내지 않는다(서버가 맨 뒤에 붙인다).
      const body: CreateTimelineRequest = { stepType, title: title.trim(), stepStatus };
      if (description.trim()) body.description = description;
      if (isoDate) body.eventDate = isoDate;
      request = addTimeline(caseId, body);
    }

    setSaving(true);
    setFailed(false);
    const ok = await request;
    setSaving(false);
    if (ok) onClose();
    else setFailed(true);
  };

  return (
    <FormSheet
      visible
      title={item ? '단계 수정' : '단계 추가'}
      submitLabel="저장"
      canSubmit={canSubmit}
      saving={saving}
      failureMessage={failed ? '저장하지 못했어요. 잠시 후 다시 시도해 주세요.' : null}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <FieldBlock label="종류" required>
        <ChipGrid options={STEP_TYPE_OPTIONS} value={stepType} onChange={setStepType} />
      </FieldBlock>
      <FieldBlock label="제목" required counter={{ length: title.length, limit: TITLE_LIMIT }} error={titleOver ? lengthMessage(TITLE_LIMIT) : null}>
        <SheetTextInput value={title} onChangeText={setTitle} placeholder="단계 제목" error={titleOver} />
      </FieldBlock>
      <FieldBlock label="상태">
        <ChipSegment options={STEP_STATUS_OPTIONS} value={stepStatus} onChange={setStepStatus} />
      </FieldBlock>
      <FieldBlock label="날짜">
        <SheetDateRow value={date} active={dateOpen} onPress={() => setDateOpen(true)} />
      </FieldBlock>
      <FieldBlock
        label="설명"
        isLast
        counter={{ length: description.length, limit: DESCRIPTION_LIMIT }}
        error={descriptionOver ? lengthMessage(DESCRIPTION_LIMIT) : null}
      >
        <SheetMultilineInput value={description} onChangeText={setDescription} minHeight={96} error={descriptionOver} />
      </FieldBlock>
      {/* 시트 위에 시트: 날짜 시트는 이 시트의 Modal 안에서 연다(iOS에서 Modal 위에 형제 Modal을 띄우면 표시되지 않을 수 있다). */}
      <DatePickerSheet
        visible={dateOpen}
        title="날짜"
        value={date}
        onClose={() => setDateOpen(false)}
        onConfirm={(value) => {
          setDate(value);
          setDateOpen(false);
        }}
      />
    </FormSheet>
  );
}
