import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Animated,
  SafeAreaView
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';

// Tab component for categories
const CategoryTab = ({ category, isActive, onPress, theme }) => {
  return (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        isActive && { 
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary
        }
      ]}
      onPress={onPress}
    >
      <Text 
        style={[
          styles.categoryTabText,
          { color: isActive ? 'white' : theme.colors.text }
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );
};

// Subject card component
const SubjectCard = ({ subject, theme, onPress }) => {
  const progressWidth = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: subject.progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [subject.progress]);

  const topicsCompleted = Math.round(subject.topicsCompleted / subject.totalTopics * 100);

  return (
    <TouchableOpacity
      style={[styles.subjectCard, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
    >
      {/* Category Tag */}
      <View 
        style={[
          styles.categoryTag, 
          { 
            backgroundColor: getCategoryColor(subject.category, theme) + '20',
          }
        ]}
      >
        <Text 
          style={[
            styles.categoryTagText, 
            { color: getCategoryColor(subject.category, theme) }
          ]}
        >
          {subject.category}
        </Text>
      </View>

      {/* Subject Info */}
      <Text style={[styles.subjectName, { color: theme.colors.text }]}>
        {subject.name}
      </Text>
      
      <View style={styles.subjectMetrics}>
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: theme.colors.primary }]}>
            {subject.topicsCompleted}
          </Text>
          <Text style={[styles.metricLabel, { color: theme.colors.text + '80' }]}>
            Topics
          </Text>
        </View>
        <View style={styles.metricSeparator} />
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: theme.colors.primary }]}>
            {subject.exercisesCompleted}
          </Text>
          <Text style={[styles.metricLabel, { color: theme.colors.text + '80' }]}>
            Exercises
          </Text>
        </View>
        <View style={styles.metricSeparator} />
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: theme.colors.primary }]}>
            {subject.lastActive}
          </Text>
          <Text style={[styles.metricLabel, { color: theme.colors.text + '80' }]}>
            Last Active
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBackground, { backgroundColor: theme.colors.border }]}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { 
                width: progressWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%']
                }),
                backgroundColor: getProgressColor(subject.progress, theme)
              }
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: theme.colors.text }]}>
          {subject.progress}% Complete
        </Text>
      </View>
      
      {/* Continue Learning Button */}
      <TouchableOpacity 
        style={[styles.continueButton, { backgroundColor: theme.colors.primary }]}
        onPress={onPress}
      >
        <Text style={styles.continueButtonText}>Continue Learning</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

// Helper function to get category color
const getCategoryColor = (category, theme) => {
  switch (category) {
    case 'Computer Science':
      return theme.colors.primary;
    case 'Mathematics':
      return theme.colors.secondary;
    case 'Physics':
      return theme.colors.accent;
    case 'Engineering':
      return theme.colors.info;
    default:
      return theme.colors.primary;
  }
};

// Helper function to get progress color
const getProgressColor = (progress, theme) => {
  if (progress < 30) return theme.colors.error;
  if (progress < 70) return theme.colors.warning;
  return theme.colors.success;
};

const SubjectsListScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Categories for filter tabs
  const categories = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Engineering'];

  useFocusEffect(
    React.useCallback(() => {
      // Fetch subjects when the screen is focused
      fetchSubjects();
      return () => {
        // Clean up if needed
      };
    }, [])
  );

  // Fetch subjects data
  const fetchSubjects = async () => {
    setLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      // Mock data
      const data = [
        {
          id: 1,
          name: 'Operating Systems',
          category: 'Computer Science',
          progress: 75,
          topicsCompleted: 15,
          totalTopics: 20,
          exercisesCompleted: 45,
          lastActive: '2d ago'
        },
        {
          id: 2,
          name: 'Data Structures',
          category: 'Computer Science',
          progress: 45,
          topicsCompleted: 9,
          totalTopics: 20,
          exercisesCompleted: 30,
          lastActive: '1d ago'
        },
        {
          id: 3,
          name: 'Computer Networks',
          category: 'Computer Science',
          progress: 90,
          topicsCompleted: 18,
          totalTopics: 20,
          exercisesCompleted: 62,
          lastActive: 'Today'
        },
        {
          id: 4,
          name: 'Database Systems',
          category: 'Computer Science',
          progress: 30,
          topicsCompleted: 6,
          totalTopics: 20,
          exercisesCompleted: 18,
          lastActive: '5d ago'
        },
        {
          id: 5,
          name: 'Calculus',
          category: 'Mathematics',
          progress: 60,
          topicsCompleted: 12,
          totalTopics: 20,
          exercisesCompleted: 40,
          lastActive: '3d ago'
        },
        {
          id: 6,
          name: 'Linear Algebra',
          category: 'Mathematics',
          progress: 40,
          topicsCompleted: 8,
          totalTopics: 20,
          exercisesCompleted: 25,
          lastActive: '1w ago'
        },
        {
          id: 7,
          name: 'Mechanics',
          category: 'Physics',
          progress: 50,
          topicsCompleted: 10,
          totalTopics: 20,
          exercisesCompleted: 35,
          lastActive: '4d ago'
        },
        {
          id: 8,
          name: 'Electrical Engineering',
          category: 'Engineering',
          progress: 25,
          topicsCompleted: 5,
          totalTopics: 20,
          exercisesCompleted: 15,
          lastActive: '2w ago'
        }
      ];
      
      setSubjects(data);
      setFilteredSubjects(data);
      setLoading(false);
    }, 1000);
  };

  // Filter subjects when search query or category changes
  useEffect(() => {
    filterSubjects();
  }, [searchQuery, selectedCategory, subjects]);

  // Filter subjects based on search query and selected category
  const filterSubjects = () => {
    let filtered = subjects;
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(subject => subject.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(subject => 
        subject.name.toLowerCase().includes(query) ||
        subject.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredSubjects(filtered);
  };

  // Handle subject card press
  const handleSubjectPress = (subject) => {
    navigation.navigate('SubjectDetail', { subjectId: subject.id });
  };

  // Handle category tab press
  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading subjects...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Subjects
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.searchIcon, { color: theme.colors.text + '80' }]}>
            🔍
          </Text>
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search subjects..."
            placeholderTextColor={theme.colors.text + '60'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Text style={{ color: theme.colors.text + '80' }}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <CategoryTab
              category={item}
              isActive={selectedCategory === item}
              onPress={() => handleCategoryPress(item)}
              theme={theme}
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Subject List */}
      {filteredSubjects.length > 0 ? (
        <FlatList
          data={filteredSubjects}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <SubjectCard
              subject={item}
              theme={theme}
              onPress={() => handleSubjectPress(item)}
            />
          )}
          contentContainerStyle={styles.subjectsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            No subjects found matching your criteria.
          </Text>
          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            <Text style={styles.resetButtonText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  subjectsList: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  subjectCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  subjectName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subjectMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
  },
  metricSeparator: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBackground: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  continueButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SubjectsListScreen;