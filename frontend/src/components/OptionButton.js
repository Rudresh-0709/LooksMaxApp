import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';

/**
 * OptionButton - Simple selectable option button/pill
 * Used for fitness level, sleep, water intake, time commitment
 * 
 * @param {string} label - Button text
 * @param {boolean} selected - Whether selected
 * @param {function} onPress - Selection handler
 * @param {string} size - 'sm', 'md' (default), 'lg'
 */
export const OptionButton = ({
    label,
    selected = false,
    onPress,
    size = 'md',
}) => {
    const sizeStyles = {
        sm: styles.sizeSm,
        md: styles.sizeMd,
        lg: styles.sizeLg,
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                sizeStyles[size],
                selected && styles.containerSelected,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={[styles.label, selected && styles.labelSelected]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

/**
 * OptionButtonGroup - Container for a row of OptionButtons
 */
export const OptionButtonGroup = ({
    options,
    selectedValue,
    onValueChange,
    size = 'md',
    wrap = false,
}) => {
    return (
        <View style={[styles.group, wrap && styles.groupWrap]}>
            {options.map((option) => (
                <OptionButton
                    key={option.value}
                    label={option.label}
                    selected={selectedValue === option.value}
                    onPress={() => onValueChange(option.value)}
                    size={size}
                />
            ))}
        </View>
    );
};

/**
 * ToggleSwitch - Yes/No style toggle
 */
export const ToggleSwitch = ({
    value,
    onValueChange,
    yesLabel = 'Yes',
    noLabel = 'No',
}) => {
    return (
        <View style={styles.toggleContainer}>
            <TouchableOpacity
                style={[styles.toggleOption, value === true && styles.toggleActive]}
                onPress={() => onValueChange(true)}
            >
                <Text style={[styles.toggleText, value === true && styles.toggleTextActive]}>
                    {yesLabel}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.toggleOption, value === false && styles.toggleActive]}
                onPress={() => onValueChange(false)}
            >
                <Text style={[styles.toggleText, value === false && styles.toggleTextActive]}>
                    {noLabel}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: theme.borders.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.borderMuted,
        backgroundColor: theme.colors.backgroundCard,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        marginBottom: 8,
    },
    sizeSm: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    sizeMd: {
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    sizeLg: {
        paddingHorizontal: 28,
        paddingVertical: 18,
        flex: 1,
    },
    containerSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primaryMuted,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    labelSelected: {
        color: theme.colors.primary,
    },
    group: {
        flexDirection: 'row',
    },
    groupWrap: {
        flexWrap: 'wrap',
    },
    // Toggle styles
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borders.radius.md,
        padding: 4,
        alignSelf: 'flex-start',
    },
    toggleOption: {
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: theme.borders.radius.sm,
    },
    toggleActive: {
        backgroundColor: theme.colors.primary,
    },
    toggleText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    toggleTextActive: {
        color: theme.colors.background,
    },
});

export default OptionButton;
