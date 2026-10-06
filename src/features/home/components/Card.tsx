import { View, ViewProps } from 'react-native';

export const cardShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.04,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
} as const;

type CardProps = ViewProps & { className?: string };

export function Card({ className, style, ...props }: CardProps) {
  return (
    <View
      className={`bg-white rounded-[20px] ${className ?? ''}`}
      style={[cardShadow, style]}
      {...props}
    />
  );
}
