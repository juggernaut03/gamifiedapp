import React, { useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Dimensions,
  Animated
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

const OnboardingScreen = () => {
  const scrollRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentPage, setCurrentPage] = useState(0);

  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  // Onboarding data state
  const [subjects, setSubjects] = useState([]);
  const [learningGoals, setLearningGoals] = useState('');
  const [learningStyle, setLearningStyle] = useState('');
  const [studyHours, setStudyHours] = useState('1-2');
  
  // Available subjects by category
  const subjectOptions = {
    "Computer Science": [
      "Operating Systems", 
      "Data Structures", 
      "Algorithms", 
      "Computer Networks", 
      "Database Systems"
    ],
    "Mathematics": [
      "Calculus", 
      "Linear Algebra", 
      "Discrete Mathematics", 
      "Statistics", 
      "Probability"
    ],
    "Physics": [
      "Mechanics", 
      "Electromagnetism", 
      "Thermodynamics", 
      "Quantum Physics", 
      "Relativity"
    ],
    "Engineering": [
      "Electrical Engineering", 
      "Mechanical Engineering", 
      "Civil Engineering", 
      "Chemical Engineering", 
      "Software Engineering"
    ]
  };

  const learningStyleOptions = [
    "Visual",
    "Auditory",
    "Reading/Writing",
    "Kinesthetic"
  ];

  const studyHoursOptions = [
    "Less than 1 hour",
    "1-2 hours",
    "2-4 hours",
    "4+ hours"
  ];

  // Toggle subject selection
  const toggleSubject = (subject) => {
    if (subjects.includes(subject)) {
      setSubjects(subjects.filter(s => s !== subject));
    } else {
      if (subjects.length < 5) {
        setSubjects([...subjects, subject]);
      }
    }
  };

  // Handle slide changes
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const page = Math.round(scrollPosition / width);
    setCurrentPage(page);
  };

  const nextSlide = () => {
    if (currentPage < 3) {
      scrollRef.current?.scrollTo({
        x: width * (currentPage + 1),
        animated: true,
      });
      setCurrentPage(currentPage + 1);
    } else {
      handleFinish();
    }
  };

  const prevSlide = () => {
    if (currentPage > 0) {
      scrollRef.current?.scrollTo({
        x: width * (currentPage - 1),
        animated: true,
      });
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFinish = () => {
    // Save user preferences and complete onboarding
    // In a real app, you'd send this data to your API
    console.log({
      userId: user?.id,
      preferences: {
        subjects,
        learningGoals,
        learningStyle,
        studyHours
      }
    });
    
    // Navigate to the main app
    // This will work because we're updating the user context
    // which will trigger the AppNavigator to switch to the main app
  };

  // Button states
  const isNextDisabled = () => {
    switch (currentPage) {
      case 0:
        return subjects.length === 0;
      case 1:
        return !learningGoals.trim();
      case 2:
        return !learningStyle;
      default:
        return false;
    }
  };

  // Render indicator dots
  const renderDots = () => {
    return (
      <View style={styles.dotContainer}>
        {[0, 1, 2, 3].map(index => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: currentPage === index 
                  ? theme.colors.primary 
                  : theme.colors.border
              }
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>
          Personalize Your Learning
        </Text>
      </View>

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {/* Page 1: Subject Selection */}
        <View style={[styles.page, { width }]}>
          <Text style={[styles.pageTitle, { color: theme.colors.text }]}>
            Select Subjects
          </Text>
          <Text style={[styles.pageSubtitle, { color: theme.colors.text + 'AA' }]}>
            Choose up to 5 subjects you want to learn
          </Text>

          <ScrollView style={styles.subjectsContainer}>
            {Object.entries(subjectOptions).map(([category, categorySubjects]) => (
              <View key={category} style={styles.categoryContainer}>
                <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>
                  {category}
                </Text>
                <View style={styles.subjectButtonsContainer}>
                  {categorySubjects.map(subject => (
                    <TouchableOpacity
                      key={subject}
                      style={[
                        styles.subjectButton,
                        {
                          backgroundColor: subjects.includes(subject)
                            ? theme.colors.primary
                            : theme.colors.card,
                          borderColor: theme.colors.border
                        }
                      ]}
                      onPress={() => toggleSubject(subject)}
                    >
                      <Text
                        style={[
                          styles.subjectButtonText,
                          {
                            color: subjects.includes(subject)
                              ? 'white'
                              : theme.colors.text
                          }
                        ]}
                      >
                        {subject}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
          
          <Text style={[styles.selectionInfo, { color: theme.colors.info }]}>
            {subjects.length}/5 subjects selected
          </Text>
        </View>

        {/* Page 2: Learning Goals */}
        <View style={[styles.page, { width }]}>
          <Text style={[styles.pageTitle, { color: theme.colors.text }]}>
            Learning Goals
          </Text>
          <Text style={[styles.pageSubtitle, { color: theme.colors.text + 'AA' }]}>
            What do you hope to achieve with our platform?
          </Text>

          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border
              }
            ]}
            placeholder="e.g., Pass my exams, master new concepts, prepare for certification..."
            placeholderTextColor={theme.colors.text + '80'}
            value={learningGoals}
            onChangeText={setLearningGoals}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Page 3: Learning Style */}
        <View style={[styles.page, { width }]}>
          <Text style={[styles.pageTitle, { color: theme.colors.text }]}>
            Learning Style
          </Text>
          <Text style={[styles.pageSubtitle, { color: theme.colors.text + 'AA' }]}>
            How do you learn best?
          </Text>

          <View style={styles.learningStyleContainer}>
            {learningStyleOptions.map((style) => (
              <TouchableOpacity
                key={style}
                style={[
                  styles.learningStyleButton,
                  {
                    backgroundColor: learningStyle === style
                      ? theme.colors.primary
                      : theme.colors.card,
                    borderColor: theme.colors.border
                  }
                ]}
                onPress={() => setLearningStyle(style)}
              >
                <Text
                  style={[
                    styles.learningStyleText,
                    {
                      color: learningStyle === style
                        ? 'white'
                        : theme.colors.text
                    }
                  ]}
                >
                  {style}
                </Text>
                <Text
                  style={[
                    styles.learningStyleDescription,
                    {
                      color: learningStyle === style
                        ? 'white'
                        : theme.colors.text + '80'
                    }
                  ]}
                >
                  {style === "Visual" && "Learn through images, videos, and diagrams"}
                  {style === "Auditory" && "Learn through lectures, discussions, and audio"}
                  {style === "Reading/Writing" && "Learn through reading and writing notes"}
                  {style === "Kinesthetic" && "Learn through hands-on practice and activities"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Page 4: Study Time */}
        <View style={[styles.page, { width }]}>
          <Text style={[styles.pageTitle, { color: theme.colors.text }]}>
            Study Time
          </Text>
          <Text style={[styles.pageSubtitle, { color: theme.colors.text + 'AA' }]}>
            How much time can you dedicate to studying each day?
          </Text>

          <View style={styles.studyHoursContainer}>
            {studyHoursOptions.map((hours) => (
              <TouchableOpacity
                key={hours}
                style={[
                  styles.studyHoursButton,
                  {
                    backgroundColor: studyHours === hours
                      ? theme.colors.primary
                      : theme.colors.card,
                    borderColor: theme.colors.border
                  }
                ]}
                onPress={() => setStudyHours(hours)}
              >
                <Text
                  style={[
                    styles.studyHoursText,
                    {
                      color: studyHours === hours
                        ? 'white'
                        : theme.colors.text
                    }
                  ]}
                >
                  {hours}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.finalInfoContainer}>
            <Text style={[styles.finalInfoText, { color: theme.colors.text + 'AA' }]}>
              Our AI will create a personalized study plan based on your available time.
            </Text>
          </View>
        </View>
      </Animated.ScrollView>

      {renderDots()}

      <View style={styles.buttonContainer}>
        {currentPage > 0 && (
          <TouchableOpacity
            style={[styles.navButton, { borderColor: theme.colors.border }]}
            onPress={prevSlide}
          >
            <Text style={[styles.backButtonText, { color: theme.colors.text }]}>
              Back
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.navButton,
            styles.nextButton,
            {
              backgroundColor: isNextDisabled()
                ? theme.colors.primary + '80'
                : theme.colors.primary
            }
          ]}
          onPress={nextSlide}
          disabled={isNextDisabled()}
        >
          <Text style={styles.nextButtonText}>
            {currentPage === 3 ? 'Finish' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  page: {
    flex: 1,
    padding: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  subjectsContainer: {
    flex: 1,
    marginBottom: 10,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  subjectButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subjectButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
    marginBottom: 10,
  },
  subjectButtonText: {
    fontSize: 14,
  },
  selectionInfo: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginTop: 10,
    height: 180,
  },
  learningStyleContainer: {
    marginTop: 10,
  },
  learningStyleButton: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  learningStyleText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  learningStyleDescription: {
    fontSize: 14,
  },
  studyHoursContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  studyHoursButton: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    width: '23%',
    alignItems: 'center',
  },
  studyHoursText: {
    fontSize: 14,
    textAlign: 'center',
  },
  finalInfoContainer: {
    marginTop: 40,
    alignItems: 'center',
    padding: 20,
  },
  finalInfoText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 40,
  },
  navButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    borderWidth: 1,
  },
  nextButton: {
    flex: 1,
    marginLeft: 10,
  },
  backButtonText: {
    fontSize: 16,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;