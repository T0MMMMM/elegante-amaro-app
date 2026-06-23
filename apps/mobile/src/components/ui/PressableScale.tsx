import { useRef } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

type Props = Omit<PressableProps, 'style' | 'children'> & {
  /** Échelle atteinte pendant l'appui (1 = pas d'effet). */
  scaleTo?: number;
  /** Style de mise en page appliqué au Pressable (ex. flex). */
  containerStyle?: StyleProp<ViewStyle>;
  /** Style visuel appliqué à la vue animée. */
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

/** Pressable qui se contracte légèrement à l'appui (ressort) — feedback tactile fluide. */
export default function PressableScale({
  scaleTo = 0.94,
  containerStyle,
  style,
  children,
  onPressIn,
  onPressOut,
  disabled,
  ...rest
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const spring = (to: number) =>
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();

  const handleIn = (e: GestureResponderEvent) => {
    if (!disabled) spring(scaleTo);
    onPressIn?.(e);
  };
  const handleOut = (e: GestureResponderEvent) => {
    if (!disabled) spring(1);
    onPressOut?.(e);
  };

  return (
    <Pressable
      onPressIn={handleIn}
      onPressOut={handleOut}
      disabled={disabled}
      style={containerStyle}
      {...rest}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
