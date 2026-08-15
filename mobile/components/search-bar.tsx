import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInput } from 'react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  const { t } = useTranslation();

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={t('list.searchPlaceholder')}
      placeholderTextColor="#9BA1A6"
      autoCorrect={false}
      autoCapitalize="none"
      accessibilityLabel={t('list.searchAccessibilityLabel')}
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 44,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#9BA1A6',
    fontSize: 16,
  },
});
