import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, StatusBar, Animated, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, ArrowRight, Info, Check } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { saveUserData, getUserData } from '../services/userDataService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = 280;
const CARD_MARGIN = 20;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN;

const BODY_TYPES = [
    {
        id: 'skinny',
        title: 'Skinny',
        description: 'Lean, low body fat',
        image: require('../assets/body-types/skinny.png')
    },
    {
        id: 'skinny-fat',
        title: 'Skinny Fat',
        description: 'Thin with belly',
        image: require('../assets/body-types/skinny-fat.png')
    },
    {
        id: 'average',
        title: 'Average',
        description: 'Normal build',
        image: require('../assets/body-types/average.png')
    },
    {
        id: 'overweight',
        title: 'Overweight',
        description: 'Higher body fat',
        image: require('../assets/body-types/overweight.png')
    },
];

const BodyCard = memo(({ item, isSelected, onSelect }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onSelect(item.id)}
            style={[
                styles.cardContainer,
                isSelected ? styles.cardSelected : styles.cardUnselected
            ]}
        >
            {isSelected && (
                <View style={styles.checkBadge}>
                    <Check size={18} color="#FFF" strokeWidth={3} />
                </View>
            )}

            <View style={styles.imageWrapper}>
                <Image
                    source={item.image}
                    style={[styles.cardImage, !isSelected && { opacity: 0.6 }]}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', isSelected ? '#1e293b' : '#0f172a']}
                    style={styles.imageOverlay}
                    locations={[0.4, 1]}
                />
            </View>

            <View style={styles.cardInfo}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <TouchableOpacity>
                        <Info size={20} color={isSelected ? '#6366f1' : '#64748b'} />
                    </TouchableOpacity>
                </View>
                <Text style={[styles.cardDescription, isSelected ? { color: '#818cf8' } : { color: '#64748b' }]}>
                    {item.description}
                </Text>
            </View>
        </TouchableOpacity>
    );
});

export default function BodyTypeScreen({ navigation }) {
    const [selectedId, setSelectedId] = useState('average');
    const shimmerAnim = useRef(new Animated.Value(-1)).current;

    const startShimmer = useCallback(() => {
        shimmerAnim.setValue(-1);
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            })
        ).start();
    }, [shimmerAnim]);

    const loadData = useCallback(async () => {
        try {
            const data = await getUserData();
            if (data.bodyType) setSelectedId(data.bodyType);
        } catch (error) {
            console.error('Failed to load body type data', error);
        }
    }, []);

    useEffect(() => {
        loadData();
        startShimmer();
    }, [loadData, startShimmer]);

    const handleNext = async () => {
        await saveUserData({ bodyType: selectedId });
        navigation.navigate('FitnessLevel');
    };

    const renderItem = useCallback(({ item }) => (
        <BodyCard
            item={item}
            isSelected={selectedId === item.id}
            onSelect={setSelectedId}
        />
    ), [selectedId]);

    const shimmerTranslate = shimmerAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <LinearGradient colors={['#020617', '#020617']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <ArrowLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.stepIndicator}>
                        <View style={styles.stepDotInactive} />
                        <View style={styles.stepBarActive} />
                        <View style={styles.stepDotInactive} />
                        <View style={styles.stepDotInactive} />
                        <View style={styles.stepDotInactive} />
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.titleSection}>
                    <Text style={styles.title}>What's your current body shape?</Text>
                    <Text style={styles.subtitle}>This helps us tailor your workout and nutrition plan.</Text>
                </View>

                <View style={styles.scrollSection}>
                    <FlatList
                        data={BODY_TYPES}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={SNAP_INTERVAL}
                        decelerationRate="fast"
                        contentContainerStyle={styles.flatListContent}
                        initialScrollIndex={2}
                        getItemLayout={(data, index) => ({
                            length: SNAP_INTERVAL,
                            offset: SNAP_INTERVAL * index,
                            index,
                        })}
                    />
                    <LinearGradient
                        colors={['#020617', 'transparent']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={styles.fadeLeft}
                        pointerEvents="none"
                    />
                    <LinearGradient
                        colors={['transparent', '#020617']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={styles.fadeRight}
                        pointerEvents="none"
                    />
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.continueButton} onPress={handleNext}>
                        <Animated.View
                            style={[
                                styles.shimmer,
                                { transform: [{ translateX: shimmerTranslate }] }
                            ]}
                        >
                            <LinearGradient
                                colors={['transparent', 'rgba(255,255,255,0.2)', 'transparent']}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                style={StyleSheet.absoluteFill}
                            />
                        </Animated.View>
                        <Text style={styles.continueText}>Continue</Text>
                        <ArrowRight size={20} color="#FFF" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#020617' },
    safeArea: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 60 },
    backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)' },
    stepIndicator: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    stepDotInactive: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#1e293b' },
    stepBarActive: { width: 32, height: 6, borderRadius: 3, backgroundColor: '#6366f1' },
    titleSection: { paddingHorizontal: 24, paddingVertical: 20, alignItems: 'center' },
    title: { fontSize: 32, fontWeight: '800', color: '#FFF', textAlign: 'center', lineHeight: 38 },
    subtitle: { fontSize: 16, color: '#64748b', textAlign: 'center', marginTop: 12, lineHeight: 24, maxWidth: 280 },
    scrollSection: { flex: 1, justifyContent: 'center', position: 'relative' },
    flatListContent: { paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2 },
    cardContainer: {
        width: CARD_WIDTH,
        marginHorizontal: CARD_MARGIN / 2,
        borderRadius: 24,
        padding: 12,
        borderWidth: 2,
        position: 'relative',
        overflow: 'hidden',
    },
    cardUnselected: {
        backgroundColor: '#0f172a',
        borderColor: 'transparent',
        opacity: 0.6,
        transform: [{ scale: 0.95 }],
    },
    cardSelected: {
        backgroundColor: '#1e293b',
        borderColor: '#6366f1',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 30,
        elevation: 10,
    },
    checkBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#6366f1',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
        elevation: 5,
    },
    imageWrapper: {
        width: '100%',
        aspectRatio: 3 / 4,
        borderRadius: 16,
        backgroundColor: '#020617',
        overflow: 'hidden',
        marginBottom: 16,
    },
    cardImage: { width: '100%', height: '100%' },
    imageOverlay: { ...StyleSheet.absoluteFillObject },
    cardInfo: { paddingHorizontal: 8, paddingBottom: 8 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    cardTitle: { fontSize: 24, fontWeight: '800', color: '#FFF' },
    cardDescription: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
    fadeLeft: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 40, zIndex: 10 },
    fadeRight: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 40, zIndex: 10 },
    footer: { padding: 24, paddingBottom: 40, backgroundColor: 'rgba(2, 6, 23, 0.8)' },
    continueButton: {
        height: 56,
        backgroundColor: '#6366f1',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
    continueText: { fontSize: 18, fontWeight: '700', color: '#FFF' },
    shimmer: { ...StyleSheet.absoluteFillObject, width: SCREEN_WIDTH },
});
