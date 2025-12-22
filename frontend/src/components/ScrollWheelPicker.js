import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { theme } from '../theme/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_HEIGHT = 60;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

/**
 * ScrollWheelPicker - Vertical scroll wheel for selecting values
 * Used for birth year, age, etc.
 * 
 * @param {Array} items - Array of { label, value } objects
 * @param {any} selectedValue - Currently selected value
 * @param {function} onValueChange - Callback when value changes
 */
export const ScrollWheelPicker = ({ items, selectedValue, onValueChange }) => {
    const scrollRef = useRef(null);

    // Find initial index
    const initialIndex = items.findIndex(item => item.value === selectedValue);
    const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / ITEM_HEIGHT);

        if (index >= 0 && index < items.length && index !== activeIndex) {
            setActiveIndex(index);
            onValueChange(items[index].value);
        }
    };

    const handleMomentumEnd = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / ITEM_HEIGHT);

        // Snap to nearest item
        scrollRef.current?.scrollTo({
            y: index * ITEM_HEIGHT,
            animated: true,
        });
    };

    return (
        <View style={styles.container}>
            {/* Selection highlight */}
            <View style={styles.selectionHighlight} pointerEvents="none" />

            <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                contentContainerStyle={{
                    paddingVertical: ITEM_HEIGHT * 2, // Center first/last items
                }}
                onScroll={handleScroll}
                onMomentumScrollEnd={handleMomentumEnd}
                scrollEventThrottle={16}
                contentOffset={{ x: 0, y: activeIndex * ITEM_HEIGHT }}
            >
                {items.map((item, index) => {
                    const isSelected = index === activeIndex;
                    const distance = Math.abs(index - activeIndex);
                    const opacity = distance === 0 ? 1 : distance === 1 ? 0.5 : 0.25;
                    const scale = distance === 0 ? 1 : distance === 1 ? 0.85 : 0.7;

                    return (
                        <View
                            key={item.value}
                            style={[
                                styles.item,
                                { opacity, transform: [{ scale }] }
                            ]}
                        >
                            <Text style={[
                                styles.itemText,
                                isSelected && styles.itemTextSelected
                            ]}>
                                {item.label}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: PICKER_HEIGHT,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    selectionHighlight: {
        position: 'absolute',
        top: ITEM_HEIGHT * 2,
        left: 24,
        right: 24,
        height: ITEM_HEIGHT,
        backgroundColor: theme.colors.primaryMuted,
        borderRadius: theme.borders.radius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    item: {
        height: ITEM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemText: {
        fontSize: 32,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    itemTextSelected: {
        color: theme.colors.primary,
        fontWeight: '700',
    },
});

export default ScrollWheelPicker;
