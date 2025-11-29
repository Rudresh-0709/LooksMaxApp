import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { theme } from '../theme/theme';

const BlueprintPicker = ({ label, value, onValueChange, items, placeholder }) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={styles.inputContainer}>
                {/* Corner decorations */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />

                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={value}
                        onValueChange={onValueChange}
                        style={styles.picker}
                        dropdownIconColor={theme.colors.primary}
                        mode="dropdown"
                    >
                        {placeholder && (
                            <Picker.Item
                                label={placeholder}
                                value=""
                                color={theme.colors.textSecondary}
                            />
                        )}
                        {items.map((item, index) => (
                            <Picker.Item
                                key={index}
                                label={item.label}
                                value={item.value}
                                color={Platform.OS === 'ios' ? theme.colors.text : theme.colors.textSecondary}
                            />
                        ))}
                    </Picker>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.lg,
    },
    label: {
        color: theme.colors.primary,
        fontSize: 12,
        fontFamily: theme.typography.fontFamily,
        letterSpacing: 2,
        marginBottom: theme.spacing.sm,
        textTransform: 'uppercase',
    },
    inputContainer: {
        position: 'relative',
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: 'transparent',
    },
    corner: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderColor: theme.colors.primary,
        zIndex: 1,
    },
    topLeft: {
        top: -1,
        left: -1,
        borderTopWidth: 2,
        borderLeftWidth: 2,
    },
    topRight: {
        top: -1,
        right: -1,
        borderTopWidth: 2,
        borderRightWidth: 2,
    },
    bottomLeft: {
        bottom: -1,
        left: -1,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
    },
    bottomRight: {
        bottom: -1,
        right: -1,
        borderBottomWidth: 2,
        borderRightWidth: 2,
    },
    pickerWrapper: {
        paddingHorizontal: theme.spacing.md,
    },
    picker: {
        color: theme.colors.text,
        height: 50,
        backgroundColor: 'transparent',
    },
});

export default BlueprintPicker;
