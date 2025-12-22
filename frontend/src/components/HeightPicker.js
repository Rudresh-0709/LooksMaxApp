import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { theme } from '../theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RULER_HEIGHT = 300;
const TICK_SPACING = 8;

/**
 * HeightPicker - Vertical ruler picker with cm/ft toggle
 * 
 * @param {number} value - Height in cm
 * @param {function} onValueChange - Callback with height in cm
 * @param {number} minHeight - Minimum height in cm (default 100)
 * @param {number} maxHeight - Maximum height in cm (default 250)
 */
export const HeightPicker = ({
    value = 170,
    onValueChange,
    minHeight = 100,
    maxHeight = 250
}) => {
    const [unit, setUnit] = useState('cm'); // 'cm' or 'ft'
    const [currentValue, setCurrentValue] = useState(value);

    // Convert cm to ft-in
    const cmToFtIn = (cm) => {
        const totalInches = cm / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        return { feet, inches };
    };

    // Generate ruler ticks
    const ticks = [];
    for (let h = maxHeight; h >= minHeight; h--) {
        ticks.push(h);
    }

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const heightValue = maxHeight - Math.round(offsetY / TICK_SPACING);
        const clampedValue = Math.max(minHeight, Math.min(maxHeight, heightValue));

        if (clampedValue !== currentValue) {
            setCurrentValue(clampedValue);
            onValueChange?.(clampedValue);
        }
    };

    const displayValue = () => {
        if (unit === 'cm') {
            return (
                <Text style={styles.valueText}>
                    {currentValue}
                    <Text style={styles.unitText}> cm</Text>
                </Text>
            );
        } else {
            const { feet, inches } = cmToFtIn(currentValue);
            return (
                <Text style={styles.valueText}>
                    {feet}
                    <Text style={styles.unitTextSmall}>ft</Text>
                    {' '}
                    {inches}
                    <Text style={styles.unitTextSmall}>in</Text>
                </Text>
            );
        }
    };

    return (
        <View style={styles.container}>
            {/* Unit toggle */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleOption, unit === 'cm' && styles.toggleActive]}
                    onPress={() => setUnit('cm')}
                >
                    <Text style={[styles.toggleText, unit === 'cm' && styles.toggleTextActive]}>
                        cm
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleOption, unit === 'ft' && styles.toggleActive]}
                    onPress={() => setUnit('ft')}
                >
                    <Text style={[styles.toggleText, unit === 'ft' && styles.toggleTextActive]}>
                        ft
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Main display area */}
            <View style={styles.displayArea}>
                {/* Value display */}
                <View style={styles.valueDisplay}>
                    {displayValue()}
                </View>

                {/* Ruler */}
                <View style={styles.rulerContainer}>
                    <View style={styles.indicatorLine} />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingVertical: RULER_HEIGHT / 2,
                        }}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        contentOffset={{ x: 0, y: (maxHeight - value) * TICK_SPACING }}
                    >
                        {ticks.map((tick) => {
                            const isMajor = tick % 10 === 0;
                            const isHalf = tick % 5 === 0 && !isMajor;

                            return (
                                <View key={tick} style={styles.tickRow}>
                                    <View
                                        style={[
                                            styles.tick,
                                            isMajor && styles.tickMajor,
                                            isHalf && styles.tickHalf,
                                        ]}
                                    />
                                    {isMajor && (
                                        <Text style={styles.tickLabel}>{tick}</Text>
                                    )}
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borders.radius.full,
        padding: 4,
        marginBottom: 32,
    },
    toggleOption: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: theme.borders.radius.full,
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
    displayArea: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 24,
    },
    valueDisplay: {
        flex: 1,
        alignItems: 'center',
    },
    valueText: {
        fontSize: 56,
        fontWeight: '700',
        color: theme.colors.text,
    },
    unitText: {
        fontSize: 24,
        fontWeight: '400',
        color: theme.colors.textSecondary,
    },
    unitTextSmall: {
        fontSize: 20,
        fontWeight: '400',
        color: theme.colors.textSecondary,
    },
    rulerContainer: {
        height: RULER_HEIGHT,
        width: 80,
        position: 'relative',
    },
    indicatorLine: {
        position: 'absolute',
        top: RULER_HEIGHT / 2 - 1,
        left: 0,
        right: 20,
        height: 2,
        backgroundColor: theme.colors.primary,
        zIndex: 10,
    },
    tickRow: {
        height: TICK_SPACING,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 8,
    },
    tick: {
        width: 12,
        height: 1,
        backgroundColor: theme.colors.borderMuted,
        marginRight: 8,
    },
    tickMajor: {
        width: 24,
        height: 2,
        backgroundColor: theme.colors.textSecondary,
    },
    tickHalf: {
        width: 16,
        backgroundColor: theme.colors.borderMuted,
    },
    tickLabel: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        width: 30,
        textAlign: 'right',
    },
});

export default HeightPicker;
