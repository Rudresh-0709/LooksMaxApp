import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';

export const BlueprintButton = ({
    title,
    onPress,
    variant = 'primary',
    style,
    disabled = false,
}) => {
    const isPrimary = variant === 'primary';

    if (!isPrimary) {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                style={[styles.secondary, style]}
                disabled={disabled}
            >
                <Text style={styles.secondaryText}>{title}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[styles.container, style]}
            disabled={disabled}
        >
            <LinearGradient
                colors={disabled
                    ? ['#333', '#222']
                    : theme.gradients.button
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                <Text style={[styles.text, disabled && styles.textDisabled]}>
                    {title}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 56,
        borderRadius: theme.borders.radius.lg,
        overflow: 'hidden',
        ...theme.shadows.glow,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#FFFFFF',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontSize: 15,
    },
    textDisabled: {
        color: theme.colors.textDim,
    },
    secondary: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryText: {
        color: theme.colors.textSecondary,
        fontWeight: '600',
        fontSize: 15,
    },
});

export default BlueprintButton;
