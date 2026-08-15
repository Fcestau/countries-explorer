import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

type FlagPlaceholderProps = {
  width: number;
  height: number;
};

export function FlagPlaceholder({ width, height }: FlagPlaceholderProps) {
  return (
    <View
      style={[styles.container, { width, height, borderRadius: width > 60 ? 8 : 4 }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      <Ionicons name="flag-outline" size={Math.min(width, height) * 0.5} color="#9BA1A6" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(155, 161, 166, 0.15)',
  },
});
