import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

export const BlueprintInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType,
    secureTextEntry,
    multiline = false,
}) => {
    return (
        <View style={styles.container}>
            {label && (
                <Text style={styles.label}>{label}</Text>
            )}
            <View style={styles.inputWrapper}>
                <TextInput
                    style={[styles.input, multiline && styles.inputMultiline]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.textDim}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    multiline={multiline}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.l,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.primary,
        letterSpacing: 1.5,
        marginBottom: theme.spacing.s,
        textTransform: 'uppercase',
    },
    inputWrapper: {
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borders.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.borderMuted,
        paddingHorizontal: theme.spacing.m,
        paddingVertical: theme.spacing.s,
    },
    input: {
        color: theme.colors.text,
        fontSize: 16,
        paddingVertical: 8,
    },
    inputMultiline: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
});

export default BlueprintInput;
