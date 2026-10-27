import { Pressable, Text, View } from 'react-native';

import type { TodoResponse } from '@/api/caseApi';
import { colors } from '@/shared/constants/colors';
import type { Section } from '@/store/caseProgressStore';
import { PRIORITY_CHIPS, getDueInfo, todayLocalIso } from '../progressFormat';
import { TodoCheck } from './CheckMarks';
import { Chip, SectionCard, SectionEmpty, SectionError, SectionSkeleton, SectionTitle } from './CaseSectionParts';

function CheckCircle({ status, onPress }: { status: TodoResponse['status']; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={11}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: status === 'DONE' }}
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: status === 'DONE' ? colors.success : 'transparent',
        borderWidth: status === 'DONE' ? 0 : 1.5,
        borderColor: status === 'IN_PROGRESS' ? colors.primary : colors.text3,
      }}
    >
      {status === 'DONE' && <TodoCheck />}
      {status === 'IN_PROGRESS' && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary }} />}
    </Pressable>
  );
}

function TodoRow({ todo, isFirst, isLast, todayIso, onToggle }: { todo: TodoResponse; isFirst: boolean; isLast: boolean; todayIso: string; onToggle: () => void }) {
  const done = todo.status === 'DONE';
  const priority = PRIORITY_CHIPS[todo.priority];
  const due = getDueInfo(todo.dueDate, done, todayIso);

  return (
    <View
      className="flex-row items-start"
      style={{
        gap: 12,
        paddingTop: isFirst ? 0 : 12,
        paddingBottom: isLast ? 0 : 12,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.input,
      }}
    >
      <CheckCircle status={todo.status} onPress={onToggle} />
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{ fontSize: 14, lineHeight: 20, fontWeight: '600', letterSpacing: -0.3, color: done ? colors.text3 : colors.text1, textDecorationLine: done ? 'line-through' : 'none' }}
        >
          {todo.title}
        </Text>
        {!!todo.description && (
          <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginTop: 2, fontSize: 12, fontWeight: '500', color: colors.text2, letterSpacing: -0.2 }}>
            {todo.description}
          </Text>
        )}
        <View className="flex-row items-center" style={{ marginTop: 8, gap: 8 }}>
          {priority && <Chip label={priority.label} bg={done ? colors.chip.grayBg : priority.bg} fg={done ? colors.chip.grayFg : priority.fg} />}
          {due && <Text style={{ fontSize: 11, fontWeight: '500', letterSpacing: -0.2, color: due.color }}>{due.text}</Text>}
        </View>
      </View>
    </View>
  );
}

export function CaseTodoSection({ section, onToggle, onRetry }: { section: Section<TodoResponse>; onToggle: (todoId: number) => void; onRetry: () => void }) {
  const loaded = section.status === 'loaded';
  const doneCount = section.items.filter((todo) => todo.status === 'DONE').length;
  const todayIso = todayLocalIso();

  let content;
  if (section.status === 'error') {
    content = <SectionError onRetry={onRetry} />;
  } else if (!loaded) {
    content = <SectionSkeleton />;
  } else if (section.items.length === 0) {
    content = <SectionEmpty text="등록된 할 일이 없어요" />;
  } else {
    content = (
      <SectionCard>
        {section.items.map((todo, index) => (
          <TodoRow
            key={todo.id}
            todo={todo}
            isFirst={index === 0}
            isLast={index === section.items.length - 1}
            todayIso={todayIso}
            onToggle={() => onToggle(todo.id)}
          />
        ))}
      </SectionCard>
    );
  }

  return (
    <View>
      <SectionTitle title="할 일" right={loaded ? `${doneCount} / ${section.items.length}` : undefined} />
      {content}
    </View>
  );
}
