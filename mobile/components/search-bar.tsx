import { StyleSheet, TextInput } from 'react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="Search countries..."
      placeholderTextColor="#9BA1A6"
      autoCorrect={false}
      autoCapitalize="none"
      accessibilityLabel="Search countries by name"
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
