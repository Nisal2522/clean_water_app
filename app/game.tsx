import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';

export default function GameScreen() {
	// Animation values
	const garbageTranslateX = useSharedValue(300); // Start from far right side
	const garbageOpacity = useSharedValue(0); // Start invisible

	// Start animation when component mounts
	useEffect(() => {
		// Start the animation after a short delay
		const timer = setTimeout(() => {
			garbageTranslateX.value = withTiming(0, { duration: 2000 });
			garbageOpacity.value = withTiming(1, { duration: 2000 });
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	// Animated style for garbage pile
	const garbageAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: garbageTranslateX.value }],
			opacity: garbageOpacity.value,
		};
	});

	return (
		<ThemedView style={styles.container}>
			<Stack.Screen options={{ headerShown: false }} />
			<View style={styles.card}>
				<ThemedText style={styles.title}> GERM BUSTER LAB 🦠 ⚔️</ThemedText>
				<Image
					source={require('@/assets/images/GermImageTree_HealthyKid.png')}
					style={styles.hero}
					contentFit="contain"
				/>
				<Animated.View style={[styles.garbage, garbageAnimatedStyle]}>
					<Image
						source={require('../assets/images/GarbagePile.png')}
						style={{ width: '100%', height: '100%' }}
						contentFit="contain"
					/>
				</Animated.View>
				<View style={styles.toolsContainer}>
					<View style={styles.toolsRow}>
						<View style={styles.toolBox}>
							<Image source={require('@/assets/images/DustBin.png')} style={styles.toolIcon} contentFit="contain" />
						</View>
						<View style={styles.toolBox}>
							<Image source={require('@/assets/images/ToothBrush.png')} style={styles.toolIcon} contentFit="contain" />
						</View>
						<View style={styles.toolBox}>
							<Image source={require('@/assets/images/Broom.png')} style={styles.toolIcon} contentFit="contain" />
						</View>
						<View style={styles.toolBox}>
							<Image source={require('@/assets/images/Soap.png')} style={styles.toolIcon} contentFit="contain" />
						</View>
					</View>
					<View style={styles.toolsRow}>
						<View style={styles.toolBox}>
							<Image source={require('@/assets/images/Sanitizer_Bottle.png')} style={styles.toolIcon} contentFit="contain" />
						</View>
						<View style={styles.toolBox}>
							<Image source={require('@/assets/images/Filter_Water.png')} style={styles.toolIcon} contentFit="contain" />
						</View>
						<View style={styles.toolBox}>
							<Image source={require('@/assets/images/FaceMask.png')} style={styles.toolIcon} contentFit="contain" />
						</View>
						<View style={styles.toolBox}>
							<Image source={require('@/assets/images/ShowerHead.png')} style={styles.toolIcon} contentFit="contain" />
						</View>
					</View>
				</View>
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#B8D4FD',
		padding: 16,
	},
	card: {
		width: '100%',
		maxWidth: 380,
		height: '90%',
		backgroundColor: '#9EBEF5',
		borderRadius: 16,
		padding: 12,
		borderWidth: 2,
		borderColor: '#80A7EF',
	},
	title: {
		fontSize: 24,
		fontWeight: '900',
		textAlign: 'center',
		marginBottom: 8,
		color: '#081082',
	},
	hero: {
		width: '100%',
		aspectRatio: 1.3,
		marginTop: 28,
		alignSelf: 'flex-end',
		marginRight: 40,
	},
	garbage: {
		width: '65%',
		aspectRatio: 1.2,
		marginTop: 30,
		marginBottom: 12,
		alignSelf: 'center',
		position: 'relative',
		overflow: 'visible',
	},
	toolsContainer: {
		position: 'absolute',
		bottom: 12,
		left: 12,
		right: 12,
		gap: 8,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#9EBEF5',
		paddingVertical: 8,
		paddingHorizontal: 8,
	},
	toolsRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		gap: 4,
		width: '100%',
	},
	toolBox: {
		width: 70,
		height: 70,
		backgroundColor: '#fff',
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#e8e8e8',
		marginHorizontal: 0,
		marginVertical: 2,
		flex: 1,
	},
	toolIcon: {
		width: '80%',
		height: '80%',
	},
});


