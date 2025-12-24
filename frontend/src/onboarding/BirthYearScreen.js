import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';
import OnboardingLayout from '../components/OnboardingLayout';
import { BlueprintButton } from '../components/BlueprintButton';
import { saveUserData, getUserData } from '../services/userDataService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_HEIGHT = 70;
const VISIBLE_ITEMS = 5;

// Generate years
const currentYear = new Date().getFullYear();
const YEARS = [];
for (let y = currentYear - 13; y >= 1950; y--) {
    YEARS.push(y);
}

export default function BirthYearScreen({ navigation }) {
    const [selectedYear, setSelectedYear] = useState(2000);
    const flatListRef = useRef(null);
    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getUserData();
        const year = data.birthYear || 2000;
        setSelectedYear(year);

        const index = YEARS.indexOf(year);
        if (index >= 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({ index, animated: false });
            }, 100);
        }
    };

    const handleNext = async () => {
        await saveUserData({ birthYear: selectedYear });
        navigation.navigate('Gender');
    };

    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
    );

    const onMomentumScrollEnd = (e) => {
        const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
        if (YEARS[index]) {
            setSelectedYear(YEARS[index]);
        }
    };

    const renderItem = ({ item, index }) => {
        const inputRange = [
            (index - 2) * ITEM_HEIGHT,
            (index - 1) * ITEM_HEIGHT,
            index * ITEM_HEIGHT,
            (index + 1) * ITEM_HEIGHT,
            (index + 2) * ITEM_HEIGHT,
        ];

        const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.7, 0.85, 1, 0.85, 0.7],
            extrapolate: 'clamp',
        });

        const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0.3, 0.5, 1, 0.5, 0.3],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View
                style={[
                    styles.itemContainer,
                    {
                        transform: [{ scale }],
                        opacity,
                    }
                ]}
            >
                <Text style={styles.itemText}>{item}</Text>
            </Animated.View>
        );
    };

    const age = currentYear - selectedYear;

    return (
        <OnboardingLayout
            title="When were you born?"
            subtitle={`You are ${age} years old`}
            step={2}
            onBack={() => navigation.goBack()}
            footer={<BlueprintButton title="CONTINUE" onPress={handleNext} />}
        >
            <View style={styles.pickerWrapper}>
                {/* Top blur gradient */}
                <LinearGradient
                    colors={[theme.colors.background, 'transparent']}
                    style={styles.topBlur}
                    pointerEvents="none"
                />

                {/* Selection highlight */}
                <View style={styles.selectionHighlight}>
                    <LinearGradient
                        colors={['rgba(139, 92, 246, 0.15)', 'rgba(139, 92, 246, 0.05)']}
                        style={styles.highlightGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    />
                </View>

                {/* Year list */}
                <Animated.FlatList
                    ref={flatListRef}
                    data={YEARS}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.toString()}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onScroll={onScroll}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    contentContainerStyle={{
                        paddingVertical: ITEM_HEIGHT * 2,
                    }}
                    getItemLayout={(data, index) => ({
                        length: ITEM_HEIGHT,
                        offset: ITEM_HEIGHT * index,
                        index,
                    })}
                />

                {/* Bottom blur gradient */}
                <LinearGradient
                    colors={['transparent', theme.colors.background]}
                    style={styles.bottomBlur}
                    pointerEvents="none"
                />
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    pickerWrapper: {
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
        marginTop: 20,
    },
    topBlur: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: ITEM_HEIGHT * 1.5,
        zIndex: 10,
    },
    bottomBlur: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: ITEM_HEIGHT * 1.5,
        zIndex: 10,
    },
    selectionHighlight: {
        position: 'absolute',
        top: ITEM_HEIGHT * 2,
        left: 20,
        right: 20,
        height: ITEM_HEIGHT,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: theme.colors.primary,
        overflow: 'hidden',
        zIndex: 5,
    },
    highlightGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    itemContainer: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 40,
        fontWeight: '700',
        color: theme.colors.text,
    },
});
