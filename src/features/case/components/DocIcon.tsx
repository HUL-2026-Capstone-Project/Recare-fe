import { Image, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { DOCUMENT_STATUS_STYLE, type DocumentIcon, type DocumentStatus } from '@/features/case/mocks';

export function DocIcon({
  statusType,
  icon = 'doc',
}: {
  statusType: DocumentStatus;
  icon?: DocumentIcon;
}) {
  const style = DOCUMENT_STATUS_STYLE[statusType];
  const isCheck = icon === 'check';

  return (
    <View
      style={{
        width: 28,
        height: 32,
        borderRadius: 8,
        backgroundColor: isCheck ? colors.chip.greenBg : style.iconBg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        source={isCheck ? require('@/shared/assets/icons/check-timeline.png') : style.icon}
        style={{
          width: 14,
          height: 14,
          tintColor: isCheck ? colors.success : style.iconTint,
        }}
      />
    </View>
  );
}
