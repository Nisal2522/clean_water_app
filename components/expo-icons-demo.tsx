import {
    AntDesign,
    Entypo,
    Feather,
    FontAwesome,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    SimpleLineIcons
} from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function ExpoIconsDemo() {
  const iconCategories = [
    {
      title: 'Ionicons',
      component: Ionicons,
      icons: ['home', 'person', 'heart', 'star', 'settings', 'search', 'add', 'close']
    },
    {
      title: 'Material Icons',
      component: MaterialIcons,
      icons: ['home', 'person', 'favorite', 'star', 'settings', 'search', 'add', 'close']
    },
    {
      title: 'Ant Design',
      component: AntDesign,
      icons: ['home', 'user', 'heart', 'star', 'setting', 'search1', 'plus', 'close']
    },
    {
      title: 'Feather',
      component: Feather,
      icons: ['home', 'user', 'heart', 'star', 'settings', 'search', 'plus', 'x']
    },
    {
      title: 'Font Awesome',
      component: FontAwesome,
      icons: ['home', 'user', 'heart', 'star', 'cog', 'search', 'plus', 'times']
    },
    {
      title: 'Entypo',
      component: Entypo,
      icons: ['home', 'user', 'heart', 'star', 'cog', 'magnifying-glass', 'plus', 'cross']
    },
    {
      title: 'Material Community',
      component: MaterialCommunityIcons,
      icons: ['home', 'account', 'heart', 'star', 'cog', 'magnify', 'plus', 'close']
    },
    {
      title: 'Simple Line',
      component: SimpleLineIcons,
      icons: ['home', 'user', 'heart', 'star', 'settings', 'magnifier', 'plus', 'close']
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>🎨 Expo Vector Icons Demo</Text>
      <Text style={styles.subtitle}>
        All these icon libraries are built into Expo projects!
      </Text>

      {iconCategories.map((category, categoryIndex) => {
        const IconComponent = category.component;
        
        return (
          <View key={categoryIndex} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <View style={styles.iconGrid}>
              {category.icons.map((iconName, iconIndex) => (
                <TouchableOpacity
                  key={iconIndex}
                  style={styles.iconButton}
                  activeOpacity={0.7}
                >
                  <IconComponent 
                    name={iconName as any} 
                    size={24} 
                    color="#8B5CF6" 
                  />
                  <Text style={styles.iconLabel}>{iconName}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      })}

      {/* Usage Examples */}
      <View style={styles.usageContainer}>
        <Text style={styles.usageTitle}>💡 Usage Examples</Text>
        
        <View style={styles.exampleCard}>
          <Text style={styles.exampleTitle}>Basic Usage:</Text>
          <Text style={styles.codeText}>
            {`import { Ionicons } from '@expo/vector-icons';

<Ionicons name="home" size={30} color="blue" />`}
          </Text>
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleTitle}>Multiple Libraries:</Text>
          <Text style={styles.codeText}>
            {`import { 
  Ionicons, 
  MaterialIcons, 
  AntDesign 
} from '@expo/vector-icons';

<Ionicons name="home" size={24} color="#8B5CF6" />
<MaterialIcons name="favorite" size={24} color="#EC4899" />
<AntDesign name="star" size={24} color="#F59E0B" />`}
          </Text>
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleTitle}>Dynamic Icons:</Text>
          <Text style={styles.codeText}>
            {`const IconComponent = isActive ? Ionicons : MaterialIcons;
const iconName = isActive ? 'heart' : 'favorite';

<IconComponent name={iconName} size={20} color="red" />`}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🎉 No additional installation required! 
          These icons are built into Expo projects.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  categoryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconButton: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    minWidth: 80,
  },
  iconLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  usageContainer: {
    marginTop: 8,
  },
  usageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  exampleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  codeText: {
    fontSize: 12,
    color: '#374151',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    fontFamily: 'monospace',
  },
  footer: {
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
