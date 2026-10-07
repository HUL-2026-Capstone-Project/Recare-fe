import { Image, Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { CARD_SHADOW } from '@/features/case/constants';
import { DocIcon } from '@/features/case/components/DocIcon';
import { DOCUMENT_STATUS_STYLE, type DocumentItem } from '@/features/case/mocks';

type DocumentListProps = {
  documents: DocumentItem[];
  title?: string;
};

export function DocumentList({ documents, title = '서류 목록' }: DocumentListProps) {
  const requiredCount = documents.filter((doc) => doc.statusType === 'required').length;
  const doneCount = documents.filter((doc) => doc.statusType === 'done').length;

  return (
    <View className="mt-2.5">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-[17px] font-bold text-text1" style={{ letterSpacing: -0.3 }}>
          {title}
        </Text>
        <Text className="text-[12px]" style={{ color: colors.text2, letterSpacing: -0.2 }}>
          {documents.length} 건
          {requiredCount > 0 && (
            <Text style={{ color: colors.chip.redFg, fontWeight: '700' }}>
              {' · '}
              {requiredCount}건 필요
            </Text>
          )}
          {requiredCount === 0 && doneCount === documents.length && documents.length > 0 && (
            <Text> · 전체 완료</Text>
          )}
        </Text>
      </View>

      <View className="bg-white" style={{ borderRadius: 20, ...CARD_SHADOW }}>
        {documents.map((doc, i) => {
          const style = DOCUMENT_STATUS_STYLE[doc.statusType];
          const trailing = doc.trailing ?? 'chip';
          return (
            <View
              key={doc.name}
              className="flex-row items-center px-4 py-3 gap-2.5"
              style={{
                borderBottomWidth: i < documents.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
              }}
            >
              <DocIcon statusType={doc.statusType} icon={doc.icon} />
              <View className="flex-1">
                <Text
                  className="text-[13px] font-semibold text-text1"
                  style={{ letterSpacing: -0.3 }}
                >
                  {doc.name}
                </Text>
                {doc.subtitle && (
                  <Text
                    className="text-[11px] mt-0.5"
                    style={{ color: colors.text3, letterSpacing: -0.2 }}
                  >
                    {doc.subtitle}
                  </Text>
                )}
              </View>
              {trailing === 'arrow' ? (
                <Image
                  source={require('@/shared/assets/icons/download.png')}
                  style={{ width: 14, height: 14, tintColor: colors.text3 }}
                />
              ) : (
                <View
                  className="px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: style.chipBg }}
                >
                  <Text
                    className="text-[11px] font-semibold"
                    style={{ color: style.chipFg, letterSpacing: -0.2 }}
                  >
                    {doc.status}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
