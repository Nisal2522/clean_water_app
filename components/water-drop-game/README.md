# 💧 Water Drop Game

A fun and engaging water conservation game built with React Native and Expo.

## 🎮 Game Features

### Core Gameplay
- **Falling Water Drops**: Animated water drops fall from the top of the screen
- **Player Bucket**: Touch and drag to move your bucket to catch water drops
- **Collision Detection**: Precise collision detection between drops and bucket
- **Score System**: Earn points for each water drop caught
- **Lives System**: Start with 3 lives, lose one for each missed drop
- **Level Progression**: Game gets faster and more challenging as you level up

### Visual Design
- **Beautiful Gradients**: Modern gradient backgrounds and UI elements
- **Smooth Animations**: Fluid water drop animations using React Native Animated API
- **Responsive Design**: Works on all screen sizes and orientations
- **Modern UI**: Clean, child-friendly interface with Expo vector icons

### Sound Effects
- **Catch Sound**: Audio feedback when successfully catching water drops
- **Built with expo-av**: Cross-platform audio support

## 🛠️ Technical Implementation

### Components
- `WaterDrop.tsx` - Individual falling water drop with animation
- `PlayerBucket.tsx` - Player-controlled bucket with touch gestures
- `ScoreBoard.tsx` - Game statistics display (score, level, lives)
- `GameOverModal.tsx` - End game screen with restart options
- `WaterDropGame.tsx` - Main game logic and state management

### Key Technologies
- **React Native Animated API** - Smooth drop animations
- **React Native Gesture Handler** - Touch controls for bucket movement
- **Expo Linear Gradient** - Beautiful gradient backgrounds
- **Expo Vector Icons** - Consistent iconography
- **Expo AV** - Sound effects
- **TypeScript** - Type safety and better development experience

### Game Logic
- **Drop Spawning**: Random X positions with increasing frequency
- **Collision Detection**: Precise coordinate-based collision system
- **Difficulty Scaling**: Speed and spawn rate increase with level
- **State Management**: Comprehensive game state with React hooks

## 🎯 How to Play

1. **Start the Game**: Tap "Start Game" to begin
2. **Move Your Bucket**: Touch and drag to move the bucket left or right
3. **Catch Water Drops**: Position your bucket under falling water drops
4. **Score Points**: Each caught drop increases your score
5. **Level Up**: Every 10 points increases the difficulty level
6. **Don't Miss**: Missing drops costs you a life
7. **Game Over**: When you run out of lives, the game ends

## 🏆 Scoring System

- **+1 Point** for each water drop caught
- **Level Up** every 10 points
- **High Score** tracking
- **Lives System** (3 lives to start)

## 🎨 Customization

The game is highly customizable:
- Adjust drop speed and spawn rates
- Modify visual styling and colors
- Add new sound effects
- Implement power-ups or special drops
- Add different game modes

## 🚀 Integration

The game integrates seamlessly with the Clean Water App:
- Accessible from the main dashboard
- Consistent design language
- Responsive across all devices
- Educational water conservation theme

## 📱 Platform Support

- ✅ iOS
- ✅ Android  
- ✅ Web (with some limitations)
- ✅ Responsive design for all screen sizes

---

*Built with ❤️ for water conservation education*
