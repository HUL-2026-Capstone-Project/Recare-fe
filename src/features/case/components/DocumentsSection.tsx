import { Pressable, Text, View } from 'react-native';

import type { CaseDocumentResponse } from '@/api/documentApi';
import { colors } from '@/shared/constants/colors';
import type { Section } from '@/store/caseProgressStore';
import { Card } from '@/features/home/components/Card';
import { DOC_STATUS_INFO, DOC_TONE_COLORS, normalizeDocStatus } from '../documentFormat';
import { formatEventDate } from '../progressFormat';
import { Chip } from './CaseSectionParts';
import { DocumentIcon } from './DocumentIcon';

const ROW_DIVIDER = { borderBottomWidth: 1, borderBottomColor: colors.input } as const;

function Head({ count, onAdd }: { count: number | null; onAdd: () => void }) {
  return (
    <View className="flex-row items-center justify-between" style={{ marginBottom: 4 }}>
      <View className="flex-row items-center" style={{ gap: 6 }}>
        <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text1, letterSpacing: -0.3 }}>서류</Text>
        {count != null && <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text2, letterSpacing: -0.2 }}>{count}건</Text>}
      </View>
      <Pressable onPress={onAdd} className="flex-row items-center" style={{ height: 44, paddingHorizontal: 8, marginTop: -12, marginRight: -8, marginBottom: -12 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary, letterSpacing: -0.3 }}>추가</Text>
      </Pressable>
    </View>
  );
}

function Rows({ docs, onOpen }: { docs: CaseDocumentResponse[]; onOpen: (doc: CaseDocumentResponse) => void }) {
  return (
    <>
      {docs.map((doc, index) => {
        const info = DOC_STATUS_INFO[normalizeDocStatus(doc.status)];
        const tone = DOC_TONE_COLORS[info.tone];
        const date = formatEventDate(doc.uploadedAt);
        const sub = [doc.originalFileName, date].filter(Boolean).join(' · ');
        return (
          <Pressable
            key={doc.id}
            onPress={() => onOpen(doc)}
            className="flex-row items-center"
            style={{ minHeight: 60, paddingVertical: 10, gap: 12, ...(index < docs.length - 1 ? ROW_DIVIDER : null) }}
          >
            <DocumentIcon tone={info.tone} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text1, letterSpacing: -0.3 }}>{doc.documentTypeName}</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 11, color: colors.text3, marginTop: 2, letterSpacing: -0.2 }}>
                {sub}
              </Text>
            </View>
            <Chip label={info.label} bg={tone.bg} fg={tone.fg} />
          </Pressable>
        );
      })}
    </>
  );
}

function Skeleton() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <View key={i} className="flex-row items-center" style={{ height: 60, gap: 12, ...(i < 2 ? ROW_DIVIDER : null) }}>
          <View style={{ width: 28, height: 32, borderRadius: 5, backgroundColor: colors.input, flexShrink: 0 }} />
          <View style={{ flex: 1, gap: 8 }}>
            <View style={{ height: 14, width: '50%', borderRadius: 6, backgroundColor: colors.input }} />
            <View style={{ height: 12, width: '75%', borderRadius: 6, backgroundColor: colors.input }} />
          </View>
        </View>
      ))}
    </>
  );
}

type Props = {
  section: Section<CaseDocumentResponse>;
  onAdd: () => void;
  onRetry: () => void;
  onOpen: (doc: CaseDocumentResponse) => void;
};

// 시안의 서류 카드(padding 16, radius 20). 로딩/오류에서는 "N건"을 숨기고, 목록이 있거나 비어 있을 때만 보여준다.
export function DocumentsSection({ section, onAdd, onRetry, onOpen }: Props) {
  const loaded = section.status === 'loaded';
  return (
    <Card style={{ borderRadius: 20, padding: 16 }}>
      <Head count={loaded ? section.items.length : null} onAdd={onAdd} />
      {section.status === 'error' ? (
        <View className="items-center" style={{ paddingTop: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text3, letterSpacing: -0.3, marginTop: 4 }}>불러오지 못했어요</Text>
          <Pressable onPress={onRetry} className="items-center justify-center" style={{ height: 44, paddingHorizontal: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary, letterSpacing: -0.3 }}>다시 시도</Text>
          </Pressable>
        </View>
      ) : !loaded ? (
        <Skeleton />
      ) : section.items.length === 0 ? (
        <View className="items-center" style={{ paddingTop: 28, paddingBottom: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text3, letterSpacing: -0.3 }}>올린 서류가 없어요</Text>
          <Pressable onPress={onAdd} className="items-center justify-center" style={{ height: 44, paddingHorizontal: 20, marginTop: 16, borderRadius: 12, backgroundColor: colors.primary }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: -0.3 }}>서류 추가</Text>
          </Pressable>
        </View>
      ) : (
        <Rows docs={section.items} onOpen={onOpen} />
      )}
    </Card>
  );
}
