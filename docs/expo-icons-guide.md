# 🎨 Expo Vector Icons Guide

## Overview
Expo projects come with multiple vector icon libraries built-in! No additional installation required.

## Available Icon Libraries

### 1. **Ionicons** (Most Popular)
```typescript
import { Ionicons } from '@expo/vector-icons';

<Ionicons name="home" size={30} color="blue" />
```

**Popular Icons:**
- `home`, `person`, `heart`, `star`, `settings`
- `search`, `add`, `close`, `menu`, `arrow-back`
- `checkmark`, `close-circle`, `information-circle`

### 2. **Material Icons**
```typescript
import { MaterialIcons } from '@expo/vector-icons';

<MaterialIcons name="favorite" size={30} color="red" />
```

**Popular Icons:**
- `home`, `person`, `favorite`, `star`, `settings`
- `search`, `add`, `close`, `menu`, `arrow-back`
- `check-circle`, `close`, `info`

### 3. **Ant Design**
```typescript
import { AntDesign } from '@expo/vector-icons';

<AntDesign name="heart" size={30} color="red" />
```

**Popular Icons:**
- `home`, `user`, `heart`, `star`, `setting`
- `search1`, `plus`, `close`, `menu`, `left`
- `checkcircle`, `closecircle`, `infocirlce`

### 4. **Feather**
```typescript
import { Feather } from '@expo/vector-icons';

<Feather name="heart" size={30} color="red" />
```

**Popular Icons:**
- `home`, `user`, `heart`, `star`, `settings`
- `search`, `plus`, `x`, `menu`, `arrow-left`
- `check`, `x-circle`, `info`

### 5. **Font Awesome**
```typescript
import { FontAwesome } from '@expo/vector-icons';

<FontAwesome name="home" size={30} color="blue" />
```

### 6. **Entypo**
```typescript
import { Entypo } from '@expo/vector-icons';

<Entypo name="home" size={30} color="blue" />
```

### 7. **Material Community Icons**
```typescript
import { MaterialCommunityIcons } from '@expo/vector-icons';

<MaterialCommunityIcons name="home" size={30} color="blue" />
```

### 8. **Simple Line Icons**
```typescript
import { SimpleLineIcons } from '@expo/vector-icons';

<SimpleLineIcons name="home" size={30} color="blue" />
```

## Usage Examples

### Basic Usage
```typescript
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';

// Simple icon
<Ionicons name="home" size={24} color="#8B5CF6" />

// With dynamic props
<MaterialIcons 
  name="favorite" 
  size={isActive ? 30 : 24} 
  color={isActive ? "red" : "gray"} 
/>
```

### Dynamic Icon Selection
```typescript
const getIconComponent = (iconFamily: string) => {
  switch (iconFamily) {
    case 'Ionicons': return Ionicons;
    case 'MaterialIcons': return MaterialIcons;
    case 'AntDesign': return AntDesign;
    case 'Feather': return Feather;
    default: return Ionicons;
  }
};

const IconComponent = getIconComponent('MaterialIcons');
<IconComponent name="home" size={24} color="blue" />
```

### Conditional Icons
```typescript
const iconName = isActive ? 'heart' : 'heart-outline';
const iconColor = isActive ? 'red' : 'gray';

<Ionicons name={iconName} size={24} color={iconColor} />
```

### Icon in TouchableOpacity
```typescript
<TouchableOpacity onPress={handlePress}>
  <Ionicons name="add" size={24} color="blue" />
</TouchableOpacity>
```

## Best Practices

### 1. **Consistent Icon Library**
Choose one primary library (Ionicons recommended) for consistency.

### 2. **Size Guidelines**
- **Small**: 16-20px (inline text, small buttons)
- **Medium**: 24-28px (buttons, navigation)
- **Large**: 32-40px (headers, important actions)
- **Extra Large**: 48px+ (hero sections, main features)

### 3. **Color Guidelines**
```typescript
// Use theme colors
const colors = {
  primary: '#8B5CF6',
  secondary: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  gray: '#6B7280'
};

<Ionicons name="home" size={24} color={colors.primary} />
```

### 4. **Accessibility**
```typescript
<TouchableOpacity 
  accessible={true}
  accessibilityLabel="Home button"
  accessibilityRole="button"
>
  <Ionicons name="home" size={24} color="blue" />
</TouchableOpacity>
```

## Common Icon Patterns

### Navigation Icons
```typescript
const navigationIcons = {
  home: 'home',
  profile: 'person',
  settings: 'settings',
  search: 'search',
  back: 'arrow-back'
};
```

### Action Icons
```typescript
const actionIcons = {
  add: 'add',
  edit: 'create',
  delete: 'trash',
  save: 'checkmark',
  cancel: 'close'
};
```

### Status Icons
```typescript
const statusIcons = {
  success: 'checkmark-circle',
  error: 'close-circle',
  warning: 'warning',
  info: 'information-circle'
};
```

## Performance Tips

### 1. **Import Only What You Need**
```typescript
// Good
import { Ionicons } from '@expo/vector-icons';

// Avoid importing all libraries if not needed
```

### 2. **Memoize Icon Components**
```typescript
const MemoizedIcon = React.memo(({ name, size, color }) => (
  <Ionicons name={name} size={size} color={color} />
));
```

### 3. **Use Consistent Sizing**
```typescript
const iconSizes = {
  small: 16,
  medium: 24,
  large: 32
};

<Ionicons name="home" size={iconSizes.medium} color="blue" />
```

## Troubleshooting

### Common Issues

1. **Icon Not Found**
   - Check icon name spelling
   - Verify icon exists in the library
   - Try different icon libraries

2. **TypeScript Errors**
   - Use `as any` for dynamic icon names
   - Import proper types if available

3. **Performance Issues**
   - Avoid too many icons in lists
   - Use memoization for repeated icons

## Resources

- [Ionicons Documentation](https://ionic.io/ionicons)
- [Material Icons](https://fonts.google.com/icons)
- [Ant Design Icons](https://ant.design/components/icon)
- [Feather Icons](https://feathericons.com/)

## Example Implementation

```typescript
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';

export function IconExample() {
  return (
    <View>
      {/* Basic Icons */}
      <Ionicons name="home" size={24} color="#8B5CF6" />
      <MaterialIcons name="favorite" size={24} color="#EC4899" />
      <AntDesign name="star" size={24} color="#F59E0B" />
      
      {/* Interactive Icons */}
      <TouchableOpacity>
        <Ionicons name="add" size={32} color="blue" />
      </TouchableOpacity>
    </View>
  );
}
```

This guide covers everything you need to know about using Expo vector icons in your React Native projects! 🎉
