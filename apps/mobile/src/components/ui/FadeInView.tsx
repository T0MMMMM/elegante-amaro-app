import { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  /** Délai avant l'apparition (ms) — pour des révélations en cascade. */
  delay?: number;
  /** Distance de montée à l'apparition (px). */
  offset?: number;
  style?: StyleProp<ViewStyle>;
}

/** Apparition douce (fondu + légère montée) au montage — pour révéler le contenu avec élégance. */
export default function FadeInView({ children, delay = 0, offset = 14, style }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 460,
      delay,
      useNativeDriver: true,
    }).start();
  }, [progress, delay]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [offset, 0] });

  return (
    <Animated.View style={[style, { opacity: progress, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
