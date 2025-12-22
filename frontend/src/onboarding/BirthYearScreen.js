import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { theme } from '../theme/theme';
import OnboardingLayout from '../components/OnboardingLayout';
import { saveUserData, getUserData } from '../services/userDataService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_HEIGHT = 60;
const VISIBLE_ITEMS = 5;

// Generate years from 1950 to current year - 13
const currentYear = new Date().getFullYear();
const YEARS = [];
for (let y = currentYear - 13; y >= 1950; y--) {
    YEARS.push(y);
}

export default function BirthYearScreen({ navigation }) {
    const [selectedYear, setSelectedYear] = useState(2000);
    const flatListRef = useRef(null);
    const hasAutoAdvanced = useRef(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getUserData();
        if (data.birthYear) {
            setSelectedYear(data.birthYear);
            // Scroll to saved year
            const index = YEARS.indexOf(data.birthYear);
            if (index >= 0) {
                setTimeout(() => {
                    flatListRef.current?.scrollToIndex({ index, animated: false });
                }, 100);
            }
        } else {
            // Default to 2000
            const index = YEARS.indexOf(2000);
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({ index, animated: false });
            }, 100);
        }
    };

    const handleSelect = async (year) => {
        setSelectedYear(year);
        await saveUserData({ birthYear: year });

        // Auto-advance after short delay
        if (!hasAutoAdvanced.current) {
            hasAutoAdvanced.current = true;
            setTimeout(() => {
                navigation.navigate('Gender');
            }, 300);
        }
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const middleIndex = Math.floor(viewableItems.length / 2);
            const middleItem = viewableItems[middleIndex];
            if (middleItem) {
                setSelectedYear(middleItem.item);
            }
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const renderItem = ({ item, index }) => {
        const isSelected = item === selectedYear;

        return (
            <View style={styles.itemContainer}>
                <Text style={[
                    styles.itemText,
                    isSelected && styles.itemTextSelected,
                ]}>
                    {item}
                </Text>
            </View>
        );
    };

    const age = currentYear - selectedYear;

    return (
        <OnboardingLayout
            title="What year were you born?"
            subtitle={`You are ${age} years old`}
            step={2}
            onBack={() => navigation.goBack()}
        >
            <View style={styles.pickerContainer}>
                {/* Selection highlight */}
                <View style={styles.selectionHighlight} />

                <FlatList
                    ref={flatListRef}
                    data={YEARS}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.toString()}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    contentContainerStyle={{
                        paddingVertical: ITEM_HEIGHT * 2,
                    }}
                    getItemLayout={(data, index) => ({
                        length: ITEM_HEIGHT,
                        offset: ITEM_HEIGHT * index,
                        index,
                    })}
                    onMomentumScrollEnd={(e) => {
                        const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
                        if (YEARS[index]) {
                            handleSelect(YEARS[index]);
                        }
                    }}
                />
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    pickerContainer: {
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
        marginTop: 40,
    },
    selectionHighlight: {
        position: 'absolute',
        top: ITEM_HEIGHT * 2,
        left: 20,
        right: 20,
        height: ITEM_HEIGHT,
        backgroundColor: theme.colors.primaryMuted,
        borderRadius: theme.borders.radius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        zIndex: -1,
    },
    itemContainer: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 28,
        fontWeight: '600',
        color: theme.colors.textDim,
    },
    itemTextSelected: {
        fontSize: 36,
        fontWeight: '700',
        color: theme.colors.text,
    },
});
