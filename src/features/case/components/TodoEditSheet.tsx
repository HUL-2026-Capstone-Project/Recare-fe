import { useState } from 'react';
import { Pressable, Text } from 'react-native';

import type { CreateTodoRequest, TodoPriority, TodoResponse, TodoStatus, UpdateTodoRequest } from '@/api/caseApi';
import { colors } from '@/shared/constants/colors';
import { useCaseProgressStore } from '@/store/caseProgressStore';
import { formDateToIso } from '../formMapper';
import { PRIORITY_OPTIONS, TODO_STATUS_OPTIONS, formatEventDate } from '../progressFormat';
import { DatePickerSheet } from './DatePickerSheet';
import { FormSheet } from './FormSheet';
import { ChipSegment, FieldBlock, SheetDateRow, SheetMultilineInput, SheetTextInput, lengthMessage } from './SheetFields';
import { TodoDeleteConfirm } from './TodoDeleteConfirm';

const TITLE_LIMIT = 150;
const DESCRIPTION_LIMIT = 255;

type Props = {
  caseId: number;
  // 있으면 수정(상태 칩과 삭제 버튼이 보임), 없으면 추가
  item: TodoResponse | null;
  onClose: () => void;
  // 삭제 요청이 실패했을 때(시트를 닫은 뒤 화면 토스트를 보여주기 위해)
  onDeleteFailed: () => void;
};

// 열 때마다 새로 마운트해서 쓴다. 입력값은 이 컴포넌트 state에만 있다.
export function TodoEditSheet({ caseId, item, onClose, onDeleteFailed }: Props) {
  const addTodo = useCaseProgressStore((state) => state.addTodo);
  const editTodo = useCaseProgressStore((state) => state.editTodo);
  const removeTodo = useCaseProgressStore((state) => state.removeTodo);

  const [title, setTitle] = useState(item?.title ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [priority, setPriority] = useState<TodoPriority>(item?.priority ?? 'MEDIUM');
  const [dueDate, setDueDate] = useState(formatEventDate(item?.dueDate));
  const [status, setStatus] = useState<TodoStatus>(item?.status ?? 'TODO');
  const [dateOpen, setDateOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  const titleOver = title.length > TITLE_LIMIT;
  const descriptionOver = description.length > DESCRIPTION_LIMIT;
  const canSubmit = title.trim() !== '' && !titleOver && !descriptionOver;

  const handleSubmit = async () => {
    if (!canSubmit || saving) return;
    const isoDue = formDateToIso(dueDate);

    let request: Promise<boolean>;
    if (item) {
      // 바뀐 항목만 보낸다. 설명을 비웠으면 ""를 보낸다. 마감일은 지우는 방식이 없어 값이 있을 때만 보낸다.
      const body: UpdateTodoRequest = {};
      if (title.trim() !== item.title.trim()) body.title = title.trim();
      if (description !== (item.description ?? '')) body.description = description;
      if (priority !== item.priority) body.priority = priority;
      if (isoDue && dueDate !== formatEventDate(item.dueDate)) body.dueDate = isoDue;
      if (status !== item.status) body.status = status;
      if (Object.keys(body).length === 0) {
        onClose();
        return;
      }
      request = editTodo(caseId, item.id, body);
    } else {
      const body: CreateTodoRequest = { title: title.trim(), priority };
      if (description.trim()) body.description = description;
      if (isoDue) body.dueDate = isoDue;
      request = addTodo(caseId, body);
    }

    setSaving(true);
    setFailed(false);
    const ok = await request;
    setSaving(false);
    if (ok) onClose();
    else setFailed(true);
  };

  const handleDelete = async () => {
    if (!item || deleting) return;
    setDeleting(true);
    const ok = await removeTodo(caseId, item.id);
    setDeleting(false);
    // 성공·실패 모두 시트를 닫는다(실패 토스트가 시트 뒤에 가려지지 않게).
    onClose();
    if (!ok) onDeleteFailed();
  };

  return (
    <FormSheet
      visible
      title={item ? '할 일 수정' : '할 일 추가'}
      submitLabel="저장"
      canSubmit={canSubmit}
      saving={saving}
      failureMessage={failed ? '저장하지 못했어요. 잠시 후 다시 시도해 주세요.' : null}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <FieldBlock label="제목" required counter={{ length: title.length, limit: TITLE_LIMIT }} error={titleOver ? lengthMessage(TITLE_LIMIT) : null}>
        <SheetTextInput value={title} onChangeText={setTitle} placeholder="할 일 제목" error={titleOver} />
      </FieldBlock>
      <FieldBlock label="설명" counter={{ length: description.length, limit: DESCRIPTION_LIMIT }} error={descriptionOver ? lengthMessage(DESCRIPTION_LIMIT) : null}>
        <SheetMultilineInput value={description} onChangeText={setDescription} minHeight={72} error={descriptionOver} />
      </FieldBlock>
      <FieldBlock label="우선순위">
        <ChipSegment options={PRIORITY_OPTIONS} value={priority} onChange={setPriority} />
      </FieldBlock>
      <FieldBlock label="마감일" isLast={!item}>
        <SheetDateRow value={dueDate} active={dateOpen} onPress={() => setDateOpen(true)} />
      </FieldBlock>
      {item && (
        <>
          <FieldBlock label="상태" isLast>
            <ChipSegment options={TODO_STATUS_OPTIONS} value={status} onChange={setStatus} />
          </FieldBlock>
          <Pressable onPress={() => setConfirmOpen(true)} className="items-center justify-center" style={{ height: 44, marginTop: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.danger }}>삭제하기</Text>
          </Pressable>
        </>
      )}
      <DatePickerSheet
        visible={dateOpen}
        title="마감일"
        value={dueDate}
        onClose={() => setDateOpen(false)}
        onConfirm={(value) => {
          setDueDate(value);
          setDateOpen(false);
        }}
      />
      {confirmOpen && <TodoDeleteConfirm deleting={deleting} onCancel={() => setConfirmOpen(false)} onConfirm={handleDelete} />}
    </FormSheet>
  );
}
