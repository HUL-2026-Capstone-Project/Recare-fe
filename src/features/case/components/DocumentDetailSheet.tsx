import { useState } from 'react';
import { Text, View } from 'react-native';

import type { CaseDocumentResponse } from '@/api/documentApi';
import { colors } from '@/shared/constants/colors';
import { formatEventDate } from '../progressFormat';
import { DOC_NOTES, DOC_STATUS_INFO, DOC_TONE_COLORS, canDelete, canRequestReview, formatFileSize, normalizeDocStatus } from '../documentFormat';
import { BtnDel, BtnOutline, BtnPrimary } from './DocButtons';
import { DocSheet } from './DocSheet';

type Props = {
  doc: CaseDocumentResponse;
  onClose: () => void;
  // 성공이면 true. 시트를 닫고 실패 토스트를 보여주는 일은 호출한 쪽이 한다.
  onDownload: () => Promise<boolean>;
  onReview: () => Promise<boolean>;
  onDelete: () => void;
};

export function DocumentDetailSheet({ doc, onClose, onDownload, onReview, onDelete }: Props) {
  const [busy, setBusy] = useState<'download' | 'review' | null>(null);
  const status = normalizeDocStatus(doc.status);
  const info = DOC_STATUS_INFO[status];
  const tone = DOC_TONE_COLORS[info.tone];
  const note = DOC_NOTES[status];

  const rows: [string, string][] = [
    ['파일 이름', doc.originalFileName || '-'],
    ['파일 크기', formatFileSize(doc.fileSizeBytes)],
    ['업로드한 날짜', formatEventDate(doc.uploadedAt)],
  ];

  const run = async (kind: 'download' | 'review', action: () => Promise<boolean>) => {
    if (busy) return;
    setBusy(kind);
    await action();
    setBusy(null);
  };

  return (
    <DocSheet title={doc.documentTypeName} chip={{ label: info.label, bg: tone.bg, fg: tone.fg }} onClose={onClose}>
      <View style={{ marginBottom: note ? 12 : 20 }}>
        {rows.map(([key, value], index) => (
          <View
            key={key}
            className="flex-row items-center justify-between"
            style={{ height: 44, borderBottomWidth: index < rows.length - 1 ? 1 : 0, borderBottomColor: colors.input }}
          >
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.text2, letterSpacing: -0.2, flexShrink: 0 }}>{key}</Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{ flexShrink: 1, fontSize: 13, fontWeight: '600', color: colors.text1, letterSpacing: -0.3, textAlign: 'right', marginLeft: 16 }}>
              {value}
            </Text>
          </View>
        ))}
      </View>
      {!!note && <Text style={{ fontSize: 13, lineHeight: 13 * 1.5, fontWeight: '500', color: colors.text2, letterSpacing: -0.3, marginBottom: 16 }}>{note}</Text>}
      <View className="flex-row" style={{ gap: 8 }}>
        <BtnOutline busy={busy === 'download'} off={busy === 'review'} onPress={() => run('download', onDownload)}>
          다운로드
        </BtnOutline>
        {canRequestReview(status) && (
          <BtnPrimary busy={busy === 'review'} off={busy === 'download'} onPress={() => run('review', onReview)}>
            검토 요청
          </BtnPrimary>
        )}
      </View>
      {canDelete(status) && (
        <View style={{ marginTop: 4 }}>
          <BtnDel off={!!busy} onPress={onDelete} />
        </View>
      )}
    </DocSheet>
  );
}
