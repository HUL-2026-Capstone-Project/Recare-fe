import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

// 시안의 Spinner: 원(투명도 0.3) + 호, strokeWidth 3, 0.8초에 한 바퀴. 기존 ActivityIndicator와 모양이 달라 새로 만든다.
export function DocSpinner({ color = '#fff', size = 18 }: { color?: string; size?: number }) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.timing(rotation, { toValue: 1, duration: 800, easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [rotation]);

  return (
    <Animated.View
      style={{ width: size, height: size, flexShrink: 0, transform: [{ rotate: rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}
    >
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={12} r={9} stroke={color} strokeOpacity={0.3} strokeWidth={3} />
        <Path d="M12 3a9 9 0 0 1 9 9" stroke={color} strokeWidth={3} strokeLinecap="round" />
      </Svg>
    </Animated.View>
  );
}
