import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';
import { saveUserData, getUserData } from '../services/userDataService';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { BlurView } from '@react-native-community/blur';
import { Platform } from 'react-native';



const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_HEIGHT = 64; // Slightly larger for better touch/scan
const RULER_HEIGHT = SCREEN_HEIGHT * 0.55; // Height of the ruler area

// Generate heights from 120 to 220 cm
const HEIGHTS = [];
for (let h = 220; h >= 120; h--) {
    HEIGHTS.push(h);
}

export default function HeightScreen({ navigation }) {
    const [selectedHeight, setSelectedHeight] = useState(170);
    const [unit, setUnit] = useState('cm');
    const flatListRef = useRef(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getUserData();
        const h = data.height || 170;
        setSelectedHeight(h);

        const index = 220 - h;
        setTimeout(() => {
            flatListRef.current?.scrollToOffset({
                offset: index * ITEM_HEIGHT,
                animated: false
            });
        }, 100);
    };

    const handleNext = async () => {
        await saveUserData({ height: selectedHeight });
        navigation.navigate('Weight');
    };

    const onScroll = (e) => {
        const offsetY = e.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / ITEM_HEIGHT);
        const height = HEIGHTS[index];
        if (height !== undefined && height !== selectedHeight) {
            setSelectedHeight(height);
        }
    };

    const cmToFtIn = (cm) => {
        const totalInches = cm / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        if (inches === 12) return { feet: feet + 1, inches: 0 };
        return { feet, inches };
    };

    const { feet, inches } = cmToFtIn(selectedHeight);

    const renderItem = ({ item }) => {
        const isMajor = item % 5 === 0;

        return (
            <View style={styles.tickRow}>
                <View style={[
                    styles.tick,
                    isMajor ? styles.majorTick : styles.minorTick
                ]} />
                {isMajor && (
                    <Text style={styles.tickLabel}>
                        {item}
                    </Text>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Background Gradients */}
            <LinearGradient
                colors={['#1e1b4b', '#020617', '#020617']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <ArrowLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerSubtitle}>BODY DETAILS</Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                {/* Title Section */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>What is your height?</Text>
                    <Text style={styles.subtitle}>This helps us calculate your calorie needs.</Text>
                </View>

                {/* Main Selection Area */}
                <View style={styles.mainContent}>

                    {/* Left: Value Display */}
                    <View style={styles.valueSection}>
                        <View style={styles.largeValueWrapper}>
                            <View style={styles.valueRow}>
                                {unit === 'cm' ? (
                                    <>
                                        <Text style={styles.largeValueText}>{selectedHeight}</Text>
                                        <Text style={styles.valueUnitLabel}>cm</Text>
                                    </>
                                ) : (
                                    <>
                                        <Text style={styles.largeValueText}>{feet}</Text>
                                        <Text style={styles.valueUnitLabelSmall}>ft</Text>
                                        <Text style={styles.largeValueTextSmall}>{inches}</Text>
                                        <Text style={styles.valueUnitLabelSmall}>in</Text>
                                    </>
                                )}
                            </View>
                        </View>

                        {/* Unit Toggle */}
                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                style={[styles.toggleBtn, unit === 'cm' && styles.toggleActive]}
                                onPress={() => setUnit('cm')}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.toggleText, unit === 'cm' && styles.toggleTextActive]}>CM</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.toggleBtn, unit === 'ft' && styles.toggleActive]}
                                onPress={() => setUnit('ft')}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.toggleText, unit === 'ft' && styles.toggleTextActive]}>FT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Right: Ruler Scroller */}
                    <View style={styles.rulerSection}>
                        
                        {Platform.OS === 'ios' && (
                            <BlurView
                                style={styles.rulerBlurTop}
                                blurType="dark"
                                blurAmount={20}
                            />
                        )}

                        {/* Center Pointer Indicator - Constrained to middle of ruler section */}
                        <View style={styles.indicatorContainer}>
                            <View style={styles.blueIndicatorLine} />
                            <View style={styles.centerDot} />
                        </View>

                        <FlatList
                            ref={flatListRef}
                            data={HEIGHTS}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.toString()}
                            showsVerticalScrollIndicator={false}
                            snapToInterval={ITEM_HEIGHT}
                            decelerationRate="fast"
                            onScroll={onScroll}
                            scrollEventThrottle={16}
                            contentContainerStyle={{
                                paddingVertical: (RULER_HEIGHT / 2) - (ITEM_HEIGHT / 2),
                            }}
                            getItemLayout={(data, index) => ({
                                length: ITEM_HEIGHT,
                                offset: ITEM_HEIGHT * index,
                                index,
                            })}
                            style={{ height: RULER_HEIGHT }}
                        />

                        {/* Gradient Overlays for Ruler Fade */}
                        {Platform.OS === 'android' && (
                            <LinearGradient
                                colors={[
                                    'rgba(2,6,23,0.9)',
                                    'rgba(2,6,23,0.6)',
                                    'rgba(2,6,23,0)'
                                ]}
                                locations={[0, 0.6, 1]}
                                style={styles.rulerFadeOverlayTop}
                                pointerEvents="none"
                            />
                        )}
                        <LinearGradient
                            colors={['rgba(2, 6, 23, 0)', '#020617', '#020617']}
                            locations={[0, 0.8, 1]}
                            style={styles.rulerFadeOverlayBottom}
                            pointerEvents="none"
                        />
                    </View>

                </View>

                {/* Footer Button */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={handleNext}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.continueButtonText}>Continue</Text>
                        <ArrowRight size={20} color="#FFF" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 10,
        height: 48,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerSubtitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#818CF8',
        letterSpacing: 2,
        opacity: 0.8,
    },
    titleContainer: {
        paddingHorizontal: 24,
        paddingTop: 12,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        lineHeight: 38,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(129, 140, 248, 0.6)',
        marginTop: 6,
    },
    mainContent: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 30,
    },
    valueSection: {
        flex: 1.2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    largeValueWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    largeValueText: {
        fontSize: 84,
        fontWeight: '800',
        color: '#6366F1',
        letterSpacing: -2,
        textShadowColor: 'rgba(99, 102, 241, 0.4)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 25,
    },
    largeValueTextSmall: {
        fontSize: 64,
        fontWeight: '800',
        color: '#6366F1',
        marginLeft: 6,
        textShadowColor: 'rgba(99, 102, 241, 0.4)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    valueUnitLabel: {
        fontSize: 22,
        fontWeight: '600',
        color: 'rgba(129, 140, 248, 0.4)',
        marginLeft: 4,
    },
    valueUnitLabelSmall: {
        fontSize: 16,
        fontWeight: '600',
        color: 'rgba(129, 140, 248, 0.4)',
        marginLeft: 2,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#0F172A',
        borderRadius: 30,
        padding: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        marginTop: 20,
        width: 140,
        justifyContent: 'center',
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 25,
    },
    toggleActive: {
        backgroundColor: '#6366F1',
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#64748B',
    },
    toggleTextActive: {
        color: '#FFFFFF',
    },
    rulerSection: {
        flex: 0.8,
        position: 'relative',
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255, 255, 255, 0.05)',
    },
    indicatorContainer: {
        position: 'absolute',
        top: RULER_HEIGHT / 2,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 100,
    },
    blueIndicatorLine: {
        position: 'absolute',
        left: 0,
        top: -1,
        width: 32,
        height: 3,
        backgroundColor: '#6366F1',
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    centerDot: {
        position: 'absolute',
        left: -4,
        top: -3.5,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#6366F1',
    },
    rulerFadeOverlayTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 140,
        zIndex: 100,
    },
    rulerFadeOverlayBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 140,
        zIndex: 100,
    },
    tickRow: {
        height: ITEM_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
    },
    tick: {
        backgroundColor: '#94A3B8',
        marginRight: 16,
    },
    majorTick: {
        width: 24,
        height: 2,
        opacity: 0.3,
    },
    minorTick: {
        width: 12,
        height: 1,
        opacity: 0.15,
    },
    selectedTick: {
        backgroundColor: '#FFFFFF',
        width: 24,
        height: 2,
        opacity: 1,
    },
    tickLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#94A3B8',
        opacity: 0.4,
    },
    selectedLabel: {
        color: '#FFFFFF',
        fontSize: 18,
        opacity: 1,
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
    },
    continueButton: {
        height: 58,
        backgroundColor: '#6366F1',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    continueButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    rulerBlurTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 120,
        zIndex: 150,
    },
});
