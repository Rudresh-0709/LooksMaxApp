import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, ArrowRight, Info, CheckCircle } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { saveUserData, getUserData } from '../services/userDataService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_WIDTH = 14;

// Generate weights from 30.0 to 200.0 kg in 0.1 increments
const WEIGHTS = [];
for (let w = 300; w <= 2000; w++) {
    WEIGHTS.push(w / 10);
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#020617' },
    safeArea: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 56 },
    backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)' },
    headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
    valueSection: { alignItems: 'center', paddingTop: 20 },
    largeValueContainer: { alignItems: 'center', position: 'relative' },
    largeValueText: { fontSize: 72, fontWeight: '800', color: '#FFFFFF', letterSpacing: -2 },
    largeValueDecimal: { fontSize: 40, color: '#64748B' },
    underlineGlow: { position: 'absolute', bottom: 5, width: '100%', height: 1, backgroundColor: '#6366F1', opacity: 0.5 },
    toggleContainer: { flexDirection: 'row', backgroundColor: '#0F172A', borderRadius: 30, padding: 4, marginTop: 24, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    toggleBtn: { paddingHorizontal: 30, paddingVertical: 10, borderRadius: 25 },
    toggleActive: { backgroundColor: '#6366F1' },
    toggleText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
    toggleTextActive: { color: '#FFFFFF' },
    rulerWrapper: { height: 140, marginTop: 40, position: 'relative' },
    indicatorContainer: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, marginLeft: -1, alignItems: 'center', justifyContent: 'center', zIndex: 20 },
    indicatorTriangleTop: { width: 0, height: 0, borderLeftWidth: 10, borderRightWidth: 10, borderTopWidth: 10, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#6366F1', marginBottom: 8 },
    indicatorTriangleBottom: { width: 0, height: 0, borderLeftWidth: 10, borderRightWidth: 10, borderBottomWidth: 10, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#6366F1', marginTop: 8 },
    indicatorLine: { width: 2, height: 60, backgroundColor: '#6366F1' },
    tickColumn: { width: ITEM_WIDTH, alignItems: 'center', justifyContent: 'center' },
    tick: { backgroundColor: '#334155' },
    majorTick: { width: 2, height: 40, backgroundColor: '#64748B' },
    halfTick: { width: 2, height: 24, opacity: 0.5 },
    minorTick: { width: 2, height: 12, opacity: 0.3 },
    tickLabel: { position: 'absolute', bottom: -22, fontSize: 11, fontWeight: '600', color: '#64748B', width: 40, textAlign: 'center', left: -13 },
    rulerFadeLeft: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, zIndex: 10 },
    rulerFadeRight: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, zIndex: 10 },
    bmiCard: { backgroundColor: '#0F172A', marginHorizontal: 24, borderRadius: 24, padding: 24, marginTop: 'auto', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', position: 'relative', overflow: 'hidden' },
    bmiCardGlow: { position: 'absolute', top: -60, right: -60, width: 140, height: 140, backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: 70 },
    bmiCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    bmiBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#6366F1' },
    badgeText: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 1.5 },
    bmiCardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    bmiValueText: { fontSize: 40, fontWeight: '900', color: '#FFFFFF', letterSpacing: -1 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(99, 102, 241, 0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginTop: 8, gap: 6, borderWidth: 1, borderColor: 'rgba(99, 102, 241, 0.2)' },
    statusText: { fontSize: 12, fontWeight: '700', color: '#818CF8' },
    chartContainer: { alignItems: 'flex-end' },
    chartLabel: { fontSize: 10, fontWeight: '600', color: '#64748B', marginBottom: 4 },
    chartBars: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: 4, borderRadius: 8, gap: 4 },
    chartBar: { width: 10, borderRadius: 2 },
    footer: { padding: 24, paddingBottom: 40 },
    confirmButton: { height: 60, backgroundColor: '#6366F1', borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: '#6366F1', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 8 },
    confirmButtonText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
});

// Optimized Tick Component
const WeightTick = memo(({ item, isMajor, isHalf }) => (
    <View style={styles.tickColumn}>
        <View style={[
            styles.tick,
            isMajor ? styles.majorTick : (isHalf ? styles.halfTick : styles.minorTick)
        ]} />
        {isMajor && (
            <Text style={styles.tickLabel} numberOfLines={1}>{Math.round(item)}</Text>
        )}
    </View>
));

export default function WeightScreen({ navigation }) {
    const [selectedWeight, setSelectedWeight] = useState(75.4);
    const [unit, setUnit] = useState('kg');
    const [userHeight, setUserHeight] = useState(170);
    const flatListRef = useRef(null);
    const lastIndex = useRef(-1);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getUserData();
        const w = data.weight || 75.4;
        const h = data.height || 170;
        setSelectedWeight(w);
        setUserHeight(h);

        const index = Math.round((w - 30) * 10);
        lastIndex.current = index;
        setTimeout(() => {
            flatListRef.current?.scrollToOffset({
                offset: index * ITEM_WIDTH,
                animated: false
            });
        }, 100);
    };

    const handleNext = async () => {
        await saveUserData({ weight: selectedWeight });
        navigation.navigate('BodyType');
    };

    const onScroll = useCallback((e) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / ITEM_WIDTH);

        if (index !== lastIndex.current) {
            lastIndex.current = index;
            const weight = WEIGHTS[index];
            if (weight !== undefined) {
                setSelectedWeight(weight);
            }
        }
    }, []);

    const kgToLbs = (kg) => (kg * 2.20462).toFixed(1);

    const bmi = (selectedWeight / ((userHeight / 100) ** 2)).toFixed(1);
    const getBmiCategory = (bmiVal) => {
        const b = parseFloat(bmiVal);
        if (b < 18.5) return { label: 'Underweight', color: '#FACC15' };
        if (b < 25) return { label: 'Healthy Weight', color: '#6366F1' };
        if (b < 30) return { label: 'Overweight', color: '#FB923C' };
        return { label: 'Obese', color: '#F87171' };
    };
    const bmiInfo = getBmiCategory(bmi);

    const renderItem = useCallback(({ item }) => {
        const isMajor = Math.round(item * 10) % 10 === 0;
        const isHalf = Math.round(item * 10) % 5 === 0 && !isMajor;
        return <WeightTick item={item} isMajor={isMajor} isHalf={isHalf} />;
    }, []);

    const weightMain = Math.floor(unit === 'kg' ? selectedWeight : parseFloat(kgToLbs(selectedWeight)));
    const weightDecimal = (unit === 'kg' ? (selectedWeight % 1).toFixed(1) : (parseFloat(kgToLbs(selectedWeight)) % 1).toFixed(1)).substring(2);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <LinearGradient colors={['#1e1b4b', '#020617', '#020617']} style={StyleSheet.absoluteFill} />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <ArrowLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Log Weight</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.valueSection}>
                    <View style={styles.largeValueContainer}>
                        <Text style={styles.largeValueText}>
                            {weightMain}<Text style={styles.largeValueDecimal}>.{weightDecimal}</Text>
                        </Text>
                        <View style={styles.underlineGlow} />
                    </View>
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity style={[styles.toggleBtn, unit === 'kg' && styles.toggleActive]} onPress={() => setUnit('kg')}>
                            <Text style={[styles.toggleText, unit === 'kg' && styles.toggleTextActive]}>kg</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.toggleBtn, unit === 'lbs' && styles.toggleActive]} onPress={() => setUnit('lbs')}>
                            <Text style={[styles.toggleText, unit === 'lbs' && styles.toggleTextActive]}>lbs</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.rulerWrapper}>
                    <View style={styles.indicatorContainer}>
                        <View style={styles.indicatorTriangleTop} />
                        <View style={styles.indicatorLine} />
                        <View style={styles.indicatorTriangleBottom} />
                    </View>
                    <FlatList
                        ref={flatListRef}
                        data={WEIGHTS}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={ITEM_WIDTH}
                        decelerationRate="fast"
                        onScroll={onScroll}
                        scrollEventThrottle={16}
                        initialNumToRender={30}
                        windowSize={5}
                        contentContainerStyle={{
                            paddingLeft: SCREEN_WIDTH / 2 - ITEM_WIDTH / 2,
                            paddingRight: SCREEN_WIDTH / 2 - ITEM_WIDTH / 2,
                        }}
                        getItemLayout={(data, index) => ({
                            length: ITEM_WIDTH,
                            offset: ITEM_WIDTH * index,
                            index,
                        })}
                    />
                    <LinearGradient colors={['#020617', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.rulerFadeLeft} pointerEvents="none" />
                    <LinearGradient colors={['transparent', '#020617']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.rulerFadeRight} pointerEvents="none" />
                </View>
                <View style={styles.bmiCard}>
                    <View style={styles.bmiCardGlow} />
                    <View style={styles.bmiCardHeader}>
                        <View style={styles.bmiBadge}><View style={styles.badgeDot} /><Text style={styles.badgeText}>BMI ANALYSIS</Text></View>
                        <Info size={18} color="#64748B" />
                    </View>
                    <View style={styles.bmiCardContent}>
                        <View>
                            <Text style={styles.bmiValueText}>{bmi}</Text>
                            <View style={styles.statusBadge}><CheckCircle size={14} color="#6366F1" /><Text style={styles.statusText}>{bmiInfo.label}</Text></View>
                        </View>
                        <View style={styles.chartContainer}>
                            <Text style={styles.chartLabel}>Normal Range</Text>
                            <View style={styles.chartBars}>
                                <View style={[styles.chartBar, { height: 16, backgroundColor: 'rgba(234, 179, 8, 0.2)' }]} />
                                <View style={[styles.chartBar, { height: 32, backgroundColor: '#6366F1' }]} />
                                <View style={[styles.chartBar, { height: 20, backgroundColor: 'rgba(249, 115, 22, 0.2)' }]} />
                                <View style={[styles.chartBar, { height: 12, backgroundColor: 'rgba(239, 68, 68, 0.2)' }]} />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleNext}>
                        <Text style={styles.confirmButtonText}>Confirm Weight</Text>
                        <ArrowRight size={20} color="#FFF" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}
