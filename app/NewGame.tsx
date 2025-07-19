import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const LANDSCAPE_WIDTH = Math.max(width, height);
const LANDSCAPE_HEIGHT = Math.min(width, height);

const COLUMN_WIDTH = LANDSCAPE_WIDTH / 7;
const CARD_WIDTH = 80;
const CARD_HEIGHT = 120;

const initialCards = [
    { id: '1', value: 'A♠', column: 0 },
    { id: '2', value: 'K♥', column: 1 },
    { id: '3', value: 'Q♣', column: 2 },
    { id: '4', value: 'J♦', column: 3 },
];

function DraggableCard({ card, onDrop }) {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.offsetX = translateX.value;
            ctx.offsetY = translateY.value;
        },
        onActive: (event, ctx) => {
            translateX.value = ctx.offsetX + event.translationX;
            translateY.value = ctx.offsetY + event.translationY;
        },
        onEnd: () => {
            runOnJS(onDrop)(card.id, translateX.value, translateY.value);
            translateX.value = withSpring(0);
            translateY.value = withSpring(0);
        },
    });

    const cardStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
    }));

    return (
        <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.card, cardStyle]}>
                <Text style={styles.cardText}>{card.value}</Text>
            </Animated.View>
        </PanGestureHandler>
    );
}

export default function NewGameScreen() {
    const [cards, setCards] = useState(initialCards);
    const router = useRouter();

    useEffect(() => {
        // Lock screen orientation to landscape
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        return () => {
            // Unlock orientation when leaving this screen
            ScreenOrientation.unlockAsync();
        };
    }, []);

    const handleDrop = (cardId, x, y) => {
        const columnIndex = Math.floor((x + LANDSCAPE_WIDTH / 2) / COLUMN_WIDTH);
        if (columnIndex >= 0 && columnIndex < 7) {
            setCards((prev) =>
                prev.map((c) => (c.id === cardId ? { ...c, column: columnIndex } : c))
            );
        }
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <Pressable style={styles.backButton} onPress={() => router.push('/')}>
                <Text style={styles.backButtonText}>← Back</Text>
            </Pressable>

            <Text style={styles.title}>New Game</Text>

            <View style={styles.table}>
                {Array.from({ length: 7 }).map((_, colIndex) => (
                    <View
                        key={colIndex}
                        style={[styles.column, { left: colIndex * COLUMN_WIDTH }]}
                    />
                ))}

                {cards.map((card) => {
                    const x =
                        card.column * COLUMN_WIDTH + (COLUMN_WIDTH - CARD_WIDTH) / 2;
                    return (
                        <View
                            key={card.id}
                            style={[styles.cardContainer, { left: x, top: 40 }]}
                        >
                            <DraggableCard card={card} onDrop={handleDrop} />
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e',
        paddingTop: 20,
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#333',
        borderRadius: 8,
        zIndex: 100,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    title: {
        color: '#fff',
        fontSize: 28,
        marginBottom: 10,
    },
    table: {
        flex: 1,
        width: LANDSCAPE_WIDTH,
        position: 'relative',
    },
    column: {
        position: 'absolute',
        top: 0,
        width: COLUMN_WIDTH,
        height: '100%',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
    },
    cardContainer: {
        position: 'absolute',
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 8,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    cardText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
