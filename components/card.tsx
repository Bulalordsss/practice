import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/templateComponents/themed-text';
import { ThemedView } from '@/components/templateComponents/themed-view';

export type CardProps = Omit<PressableProps, 'style'> & {
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Card({
  title,
  subtitle,
  footer,
  children,
  style,
  contentStyle,
  disabled,
  ...rest
}: CardProps) {
  const isInteractive = typeof rest.onPress === 'function';

  const content = (
    <ThemedView lightColor="#FFFFFF" darkColor="#1F2937" style={[styles.card, style]}>
      {title || subtitle ? (
        <View style={styles.header}>
          {title ? <ThemedText type="defaultSemiBold">{title}</ThemedText> : null}
          {subtitle ? <ThemedText style={styles.subtitle}>{subtitle}</ThemedText> : null}
        </View>
      ) : null}

      <View style={[styles.content, contentStyle]}>{children}</View>

      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </ThemedView>
  );

  if (!isInteractive) {
    return content;
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [pressed ? styles.pressed : null]}
      {...rest}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(120,120,120,0.18)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  header: {
    gap: 4,
  },
  subtitle: {
    opacity: 0.7,
    lineHeight: 20,
  },
  content: {
    gap: 10,
  },
  footer: {
    paddingTop: 4,
  },
  pressed: {
    opacity: 0.88,
  },
});
