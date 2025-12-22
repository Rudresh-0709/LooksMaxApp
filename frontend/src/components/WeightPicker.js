import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { theme } from '../theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = 60;
const VISIBLE_ITEMS = 5;

/**
 * WeightPicker - Horizontal scroll wheel for weight selection
 * 
 * @param {number} value - Weight in kg
 * @param {function} onValueChange - Callback with weight in kg
 * @param {number} minWeight - Minimum weight (default 30)
 * @param {number} maxWeight - Maximum weight (default 200)
 */
export const WeightPicker = ({
    value = 70,
    onValueChange,
    minWeight = 30,
    maxWeight = 200
}) => {
    const [unit, setUnit] = useState('kg'); // 'kg' or 'lbs'
    const [currentValue, setCurrentValue] = useState(value);
    const scrollRef = useRef(null);

    // Convert kg to lbs
    const kgToLbs = (kg) => Math.round(kg * 2.205);
    const lbsToKg = (lbs) => Math.round(lbs / 2.205);

    // Generate weight values
    const weights = [];
    for (let w = minWeight; w <= maxWeight; w++) {
        weights.push(w);
    }

    const handleScroll = (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / ITEM_WIDTH);
        const newValue = minWeight + index;
        const clampedValue = Math.max(minWeight, Math.min(maxWeight, newValue));

        if (clampedValue !== currentValue) {
            setCurrentValue(clampedValue);
            onValueChange?.(clampedValue);
        }
    };

    const displayValue = unit === 'kg' ? currentValue : kgToLbs(currentValue);
    const displayUnit = unit === 'kg' ? 'kg' : 'lbs';

    return (
        <View style={styles.container}>
            {/* Unit toggle */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleOption, unit === 'kg' && styles.toggleActive]}
                    onPress={() => setUnit('kg')}
                >
                    <Text style={[styles.toggleText, unit === 'kg' && styles.toggleTextActive]}>
                        kg
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleOption, unit === 'lbs' && styles.toggleActive]}
                    onPress={() => setUnit('lbs')}
                >
                    <Text style={[styles.toggleText, unit === 'lbs' && styles.toggleTextActive]}>
                        lbs
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Value display */}
            <View style={styles.valueContainer}>
                <Text style={styles.valueText}>
                    {displayValue}
                    <Text style={styles.unitText}> {displayUnit}</Text>
                </Text>
            </View>

            {/* Horizontal scroll picker */}
            <View style={styles.pickerContainer}>
                <View style={styles.indicator} />
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={ITEM_WIDTH}
                    decelerationRate="fast"
                    contentContainerStyle={{
                        paddingHorizontal: (SCREEN_WIDTH - ITEM_WIDTH) / 2,
                    }}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    contentOffset={{ x: (currentValue - minWeight) * ITEM_WIDTH, y: 0 }}
                >
                    {weights.map((weight, index) => {
                        const distance = Math.abs(weight - currentValue);
                        const opacity = distance === 0 ? 1 : distance <= 2 ? 0.5 : 0.2;

                        return (
                            <View
                                key={weight}
                                style={[styles.itemContainer, { opacity }]}
                            >
                                <View style={[
                                    styles.tick,
                                    weight % 5 === 0 && styles.tickMajor,
                                ]} />
                                {weight % 10 === 0 && (
                                    <Text style={styles.tickLabel}>{weight}</Text>
                                )}
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 24,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borders.radius.full,
        padding: 4,
        marginBottom: 24,
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
    valueContainer: {
        marginBottom: 32,
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
    pickerContainer: {
        height: 80,
        width: '100%',
        position: 'relative',
    },
    indicator: {
        position: 'absolute',
        top: 0,
        left: SCREEN_WIDTH / 2 - 1,
        width: 2,
        height: 40,
        backgroundColor: theme.colors.primary,
        zIndex: 10,
    },
    itemContainer: {
        width: ITEM_WIDTH,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    tick: {
        width: 1,
        height: 20,
        backgroundColor: theme.colors.borderMuted,
    },
    tickMajor: {
        height: 32,
        width: 2,
        backgroundColor: theme.colors.textSecondary,
    },
    tickLabel: {
        marginTop: 8,
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
});

export default WeightPicker;
