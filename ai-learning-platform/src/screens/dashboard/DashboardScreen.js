import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';

// Placeholder component for chart/progress visualization
const ProgressChart = ({ progress, theme }) => {
  return (
    <View style={[styles.chartContainer, { backgroundColor: theme.colors.card }]}>
      <View style={styles.progressCircle}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${progress}%`,
              backgroundColor: progress < 30 
                ? theme.colors.error 
                : progress < 70 
                  ? theme.colors.warning 
                  : theme.colors.success
            }
          ]} 
        />
      </View>
      <Text style={[styles.progressText, { color: theme.colors.text }]}>
        {progress}% Complete
      </Text>
    </View>
  );
};

const SubjectCard = ({ subject, progress, theme, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.subjectCard, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
    >
      <View style={styles.subjectIconContainer}>
        <View style={[
          styles.subjectIcon,
          { backgroundColor: theme.colors.primary + '20' }
        ]}>
          <Text style={[styles.subjectIconText, { color: theme.colors.primary }]}>
            {subject.name.substring(0, 2).toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={styles.subjectInfo}>
        <Text style={[styles.subjectName, { color: theme.colors.text }]}>
          {subject.name}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressBarFill, 
              { 
                width: `${progress}%`,
                backgroundColor: progress < 30 
                  ? theme.colors.error 
                  : progress < 70 
                    ? theme.colors.warning 
                    : theme.colors.success
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressPercentage, { color: theme.colors.text + '80' }]}>
          {progress}%
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const ChallengeCard = ({ challenge, theme, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.challengeCard, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
    >
      <View style={[
        styles.challengeTypeTag, 
        { 
          backgroundColor: 
            challenge.type === 'Quiz' 
              ? theme.colors.primary + '20' 
              : challenge.type === 'Coding' 
                ? theme.colors.secondary + '20' 
                : theme.colors.accent + '20' 
        }
      ]}>
        <Text style={[
          styles.challengeTypeText,
          { 
            color: 
              challenge.type === 'Quiz' 
                ? theme.colors.primary 
                : challenge.type === 'Coding' 
                  ? theme.colors.secondary 
                  : theme.colors.accent 
          }
        ]}>
          {challenge.type}
        </Text>
      </View>
      <Text style={[styles.challengeName, { color: theme.colors.text }]}>
        {challenge.name}
      </Text>
      <Text style={[styles.challengeSubject, { color: theme.colors.text + '80' }]}>
        {challenge.subject}
      </Text>
      <View style={styles.challengeDetails}>
        <Text style={[styles.challengePoints, { color: theme.colors.text + '80' }]}>
          {challenge.points} XP
        </Text>
        <View style={[styles.challengeDifficulty, { 
          backgroundColor: 
            challenge.difficulty === 'Easy' 
              ? theme.colors.success + '20' 
              : challenge.difficulty === 'Medium' 
                ? theme.colors.warning + '20' 
                : theme.colors.error + '20' 
        }]}>
          <Text style={[styles.challengeDifficultyText, { 
            color: 
              challenge.difficulty === 'Easy' 
                ? theme.colors.success 
                : challenge.difficulty === 'Medium' 
                  ? theme.colors.warning 
                  : theme.colors.error 
          }]}>
            {challenge.difficulty}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ExamCard = ({ exam, theme, onPress }) => {
  // Calculate days remaining
  const today = new Date();
  const examDate = new Date(exam.date);
  const diffTime = Math.abs(examDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <TouchableOpacity 
      style={[styles.examCard, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
    >
      <View style={styles.examDateContainer}>
        <Text style={[styles.examMonth, { color: theme.colors.primary }]}>
          {new Date(exam.date).toLocaleString('default', { month: 'short' })}
        </Text>
        <Text style={[styles.examDay, { color: theme.colors.text }]}>
          {new Date(exam.date).getDate()}
        </Text>
      </View>
      <View style={styles.examInfoContainer}>
        <Text style={[styles.examName, { color: theme.colors.text }]}>
          {exam.name}
        </Text>
        <Text style={[styles.examSubject, { color: theme.colors.text + '80' }]}>
          {exam.subject}
        </Text>
        <View style={[
          styles.examTag, 
          { 
            backgroundColor: diffDays <= 7 
              ? theme.colors.error + '20' 
              : diffDays <= 14 
                ? theme.colors.warning + '20' 
                : theme.colors.info + '20' 
          }
        ]}>
          <Text style={[
            styles.examTagText, 
            { 
              color: diffDays <= 7 
                ? theme.colors.error 
                : diffDays <= 14 
                  ? theme.colors.warning 
                  : theme.colors.info 
            }
          ]}>
            {diffDays} days remaining
          </Text>
        </View>
      </View>
      <View style={styles.examReadinessContainer}>
        <Text style={[styles.examReadiness, { color: theme.colors.text + '80' }]}>
          Readiness
        </Text>
        <View style={styles.examReadinessBar}>
          <View 
            style={[
              styles.examReadinessFill, 
              { 
                width: `${exam.readiness}%`,
                backgroundColor: exam.readiness < 30 
                  ? theme.colors.error 
                  : exam.readiness < 70 
                    ? theme.colors.warning 
                    : theme.colors.success
              }
            ]} 
          />
        </View>
        <Text style={[styles.examReadinessPercentage, { color: theme.colors.text }]}>
          {exam.readiness}%
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const DashboardScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [streak, setStreak] = useState(0);
  const [dailyGoalCompleted, setDailyGoalCompleted] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // Fetch dashboard data when the screen is focused
      fetchDashboardData();
      return () => {
        // Clean up if needed
      };
    }, [])
  );

  const fetchDashboardData = async () => {
    // This would be replaced with an actual API call
    setLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      // Mock data
      const data = {
        overallProgress: 68,
        streak: 7,
        dailyGoalCompleted: true,
        subjects: [
          { id: 1, name: 'Operating Systems', progress: 75 },
          { id: 2, name: 'Data Structures', progress: 45 },
          { id: 3, name: 'Computer Networks', progress: 90 },
          { id: 4, name: 'Database Systems', progress: 30 },
        ],
        recommendedChallenges: [
          { 
            id: 1, 
            name: 'Process Synchronization Challenge', 
            subject: 'Operating Systems', 
            type: 'Quiz', 
            difficulty: 'Medium', 
            points: 150 
          },
          { 
            id: 2, 
            name: 'Binary Tree Implementation', 
            subject: 'Data Structures', 
            type: 'Coding', 
            difficulty: 'Hard', 
            points: 300 
          },
          { 
            id: 3, 
            name: 'SQL Query Optimization', 
            subject: 'Database Systems', 
            type: 'Practice', 
            difficulty: 'Easy', 
            points: 100 
          },
        ],
        upcomingExams: [
          { 
            id: 1, 
            name: 'Operating Systems Midterm', 
            subject: 'Operating Systems', 
            date: '2025-04-15', 
            readiness: 65 
          },
          { 
            id: 2, 
            name: 'Data Structures Final', 
            subject: 'Data Structures', 
            date: '2025-06-10', 
            readiness: 40 
          },
        ]
      };
      
      setDashboardData(data);
      setStreak(data.streak);
      setDailyGoalCompleted(data.dailyGoalCompleted);
      setLoading(false);
    }, 1000);
  };

  const handleSubjectPress = (subject) => {
    // Navigate to subject detail screen
    navigation.navigate('SubjectDetail', { subjectId: subject.id });
  };

  const handleChallengePress = (challenge) => {
    // Navigate to challenge detail screen
    navigation.navigate('ChallengeDetail', { challengeId: challenge.id });
  };

  const handleExamPress = (exam) => {
    // Navigate to exam preparation screen
    navigation.navigate('ExamPreparation', { examId: exam.id });
  };

  const handleAiTutorPress = () => {
    // Navigate to AI Tutor screen
    navigation.navigate('AiTutor');
  };

  const handleStudyPlanPress = () => {
    // Navigate to Study Planner screen
    navigation.navigate('StudyPlanner');
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading your personalized dashboard...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.colors.text }]}>
            Hello, {user?.fullName || 'Student'}
          </Text>
          <Text style={[styles.date, { color: theme.colors.text + '80' }]}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
          <View style={[styles.profileAvatar, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.profileInitial}>
              {user?.fullName ? user.fullName[0].toUpperCase() : 'S'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={[styles.statsCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.statsValue, { color: theme.colors.primary }]}>
            {streak}
          </Text>
          <Text style={[styles.statsLabel, { color: theme.colors.text }]}>
            Day Streak
          </Text>
        </View>
        <View style={[styles.statsCard, { backgroundColor: theme.colors.card }]}>
          <View style={[
            styles.goalIndicator, 
            { 
              backgroundColor: dailyGoalCompleted 
                ? theme.colors.success 
                : theme.colors.card 
            }
          ]}>
            {dailyGoalCompleted && (
              <Text style={styles.goalCheckmark}>✓</Text>
            )}
          </View>
          <Text style={[styles.statsLabel, { color: theme.colors.text }]}>
            {dailyGoalCompleted ? 'Goal Complete' : 'Daily Goal'}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.statsCard, { backgroundColor: theme.colors.card }]}
          onPress={handleStudyPlanPress}
        >
          <Text style={[styles.studyPlanIcon, { color: theme.colors.primary }]}>
            📋
          </Text>
          <Text style={[styles.statsLabel, { color: theme.colors.text }]}>
            Study Plan
          </Text>
        </TouchableOpacity>
      </View>

      {/* Overall Progress */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Overall Progress
        </Text>
        <ProgressChart 
          progress={dashboardData.overallProgress} 
          theme={theme} 
        />
      </View>

      {/* Active Subjects */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Active Subjects
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Subjects')}>
            <Text style={[styles.seeAllButton, { color: theme.colors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        {dashboardData.subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            progress={subject.progress}
            theme={theme}
            onPress={() => handleSubjectPress(subject)}
          />
        ))}
      </View>

      {/* Recommended Challenges */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Recommended Challenges
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Challenges')}>
            <Text style={[styles.seeAllButton, { color: theme.colors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.challengesContainer}
        >
          {dashboardData.recommendedChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              theme={theme}
              onPress={() => handleChallengePress(challenge)}
            />
          ))}
        </ScrollView>
      </View>

      {/* AI Tutor Quick Access */}
      <TouchableOpacity 
        style={[styles.aiTutorCard, { backgroundColor: theme.colors.primary }]}
        onPress={handleAiTutorPress}
      >
        <View style={styles.aiTutorContent}>
          <Text style={styles.aiTutorTitle}>
            Need help with a concept?
          </Text>
          <Text style={styles.aiTutorSubtitle}>
            Ask your AI Tutor for instant assistance
          </Text>
          <View style={styles.aiTutorButton}>
            <Text style={styles.aiTutorButtonText}>
              Open AI Tutor
            </Text>
          </View>
        </View>
        <View style={styles.aiTutorImageContainer}>
          <Text style={styles.aiTutorEmoji}>
            🤖
          </Text>
        </View>
      </TouchableOpacity>

      {/* Upcoming Exams */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Upcoming Exams
          </Text>
        </View>
        {dashboardData.upcomingExams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            theme={theme}
            onPress={() => handleExamPress(exam)}
          />
        ))}
      </View>

      {/* Bottom Padding */}
      <View style={styles.bottomPadding} />
    </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    marginTop: 4,
  },
  profileButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileAvatar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsCard: {
    width: '31%',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  goalIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalCheckmark: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  studyPlanIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllButton: {
    fontSize: 14,
  },
  chartContainer: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  progressCircle: {
    width: '100%',
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '500',
  },
  subjectCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  subjectIconContainer: {
    marginRight: 16,
  },
  subjectIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectIconText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
  },
  challengesContainer: {
    paddingRight: 20,
  },
  challengeCard: {
    width: 180,
    padding: 16,
    borderRadius: 10,
    marginRight: 12,
  },
  challengeTypeTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  challengeTypeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  challengeName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  challengeSubject: {
    fontSize: 12,
    marginBottom: 12,
  },
  challengeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengePoints: {
    fontSize: 12,
  },
  challengeDifficulty: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  challengeDifficultyText: {
    fontSize: 10,
    fontWeight: '500',
  },
  aiTutorCard: {
    flexDirection: 'row',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
  },
  aiTutorContent: {
    flex: 3,
  },
  aiTutorTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  aiTutorSubtitle: {
    color: 'white',
    opacity: 0.8,
    fontSize: 14,
    marginBottom: 16,
  },
  aiTutorButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  aiTutorButtonText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#3498db', // Using primary color directly for contrast
  },
  aiTutorImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiTutorEmoji: {
    fontSize: 36,
  },
  examCard: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  examDateContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  examMonth: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  examDay: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  examInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  examName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  examSubject: {
    fontSize: 14,
    marginBottom: 8,
  },
  examTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  examTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  examReadinessContainer: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  examReadiness: {
    fontSize: 12,
    marginBottom: 4,
  },
  examReadinessBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 4,
  },
  examReadinessFill: {
    height: '100%',
    borderRadius: 4,
  },
  examReadinessPercentage: {
    fontSize: 12,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 100,
  },
});

export default DashboardScreen;