import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

export const BlueprintInput = ({ label, value, onChangeText, placeholder, keyboardType, secureTextEntry }) => {
    return (
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                <View style={styles.decorationLine} />
                <Text style={styles.label}>{label}</Text>
            </View>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.textDim}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                />
                <View style={styles.cornerTL} />
                <View style={styles.cornerTR} />
                <View style={styles.cornerBL} />
                <View style={styles.cornerBR} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.l,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.s,
    },
    decorationLine: {
        width: 10,
        height: 1,
        backgroundColor: theme.colors.primary,
        marginRight: theme.spacing.s,
    },
    label: {
        ...theme.typography.label,
        color: theme.colors.primary,
        marginBottom: 0,
    },
    inputWrapper: {
        position: 'relative',
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: 'rgba(0, 240, 255, 0.05)',
        paddingHorizontal: theme.spacing.m,
        paddingVertical: theme.spacing.s,
    },
    input: {
        color: theme.colors.text,
        fontSize: 16,
        fontFamily: 'monospace', // Monospace fits the CAD theme well
    },
    // Corner decorations for that CAD look
    cornerTL: {
        position: 'absolute',
        top: -1,
        left: -1,
        width: 6,
        height: 6,
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderColor: theme.colors.primary,
    },
    cornerTR: {
        position: 'absolute',
        top: -1,
        right: -1,
        width: 6,
        height: 6,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderColor: theme.colors.primary,
    },
    cornerBL: {
        position: 'absolute',
        bottom: -1,
        left: -1,
        width: 6,
        height: 6,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderColor: theme.colors.primary,
    },
    cornerBR: {
        position: 'absolute',
        bottom: -1,
        right: -1,
        width: 6,
        height: 6,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderColor: theme.colors.primary,
    },
});
