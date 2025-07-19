import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {useNavigation} from "expo-router";

export default function HomeScreen() {
    const navigation= useNavigation();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Solitaire</Text>

            <Pressable style={styles.button} onPress={() => navigation.navigate('NewGame')}>
                <Text style={styles.buttonText}>New Game</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={() => navigation.navigate('ResumeGame')}>
                <Text style={styles.buttonText}>Resume Game</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={() => navigation.navigate('Stats')}>
                <Text style={styles.buttonText}>Stats</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={() => navigation.navigate('HowTo')}>
                <Text style={styles.buttonText}>How To</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#4caf50',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginVertical: 10,
        width: '70%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});
