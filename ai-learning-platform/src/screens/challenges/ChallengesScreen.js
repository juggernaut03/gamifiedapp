import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';

// Challenge card component
const ChallengeCard = ({ challenge, theme, onPress }) => {
  // Calculate progress percentage
  const progressPercentage = challenge.completed ? 100 : 0;
  
  return (
    <TouchableOpacity
      style={[styles.challengeCard, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
    >
      {/* Challenge Type Badge */}
      <View style={[
        styles.challengeTypeBadge, 
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

      {/* Challenge Title */}
      <Text style={[styles.challengeTitle, { color: theme.colors.text }]}>
        {challenge.title}
      </Text>

      {/* Challenge Subject & Duration */}
      <View style={styles.challengeDetails}>
        <Text style={[styles.challengeSubject, { color: theme.colors.text + '99' }]}>
          {challenge.subject}
        </Text>
        <Text style={[styles.challengeDuration, { color: theme.colors.text + '99' }]}>
          {challenge.estimatedDuration} min
        </Text>
      </View>

      {/* Difficulty & XP */}
      <View style={styles.challengeStats}>
        <View style={[
          styles.difficultyBadge, 
          { 
            backgroundColor: 
              challenge.difficulty === 'Easy' 
                ? theme.colors.success + '20' 
                : challenge.difficulty === 'Medium' 
                  ? theme.colors.warning + '20' 
                  : theme.colors.error + '20' 
          }
        ]}>
          <Text style={[
            styles.difficultyText, 
            { 
              color: 
                challenge.difficulty === 'Easy' 
                  ? theme.colors.success 
                  : challenge.difficulty === 'Medium' 
                    ? theme.colors.warning 
                    : theme.colors.error 
            }
          ]}>
            {challenge.difficulty}
          </Text>
        </View>
        <View style={styles.xpContainer}>
          <Text style={[styles.xpText, { color: theme.colors.primary }]}>
            {challenge.xpReward} XP
          </Text>
        </View>
      </View>

      {/* Status Indicator */}
      <View style={styles.statusContainer}>
        {challenge.completed ? (
          <View style={[styles.completedBadge, { backgroundColor: theme.colors.success }]}>
            <Text style={styles.completedText}>Completed</Text>
          </View>
        ) : challenge.inProgress ? (
          <View style={[styles.inProgressBadge, { backgroundColor: theme.colors.warning }]}>
            <Text style={styles.inProgressText}>In Progress</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.startButton, { backgroundColor: theme.colors.primary }]}
            onPress={onPress}
          >
            <Text style={styles.startButtonText}>Start Challenge</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Difficulty filter tab
const DifficultyTab = ({ title, isActive, onPress, theme }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.difficultyTab,
        isActive && { 
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary 
        }
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.difficultyTabText,
        { color: isActive ? 'white' : theme.colors.text }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// Challenge type filter
const TypeFilter = ({ type, isActive, onPress, theme }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.typeFilter,
        { 
          backgroundColor: isActive ? 
            theme.colors.card : 
            theme.colors.background,
          borderColor: isActive ? 
            theme.colors.primary : 
            theme.colors.border,
        }
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.typeFilterText,
        { color: isActive ? theme.colors.primary : theme.colors.text + '80' }
      ]}>
        {type}
      </Text>
      {isActive && (
        <View style={[
          styles.activeIndicator, 
          { backgroundColor: theme.colors.primary }
        ]} />
      )}
    </TouchableOpacity>
  );
};

// Challenge leaderboard row
const LeaderboardRow = ({ rank, user, score, isCurrentUser, theme }) => {
  return (
    <View style={[
      styles.leaderboardRow, 
      isCurrentUser && { backgroundColor: theme.colors.primary + '10' }
    ]}>
      <View style={styles.rankContainer}>
        <Text style={[
          styles.rankText, 
          { 
            color: 
              rank <= 3 ? 
                theme.colors.primary : 
                theme.colors.text 
          }
        ]}>
          {rank}
        </Text>
      </View>
      <View style={styles.userContainer}>
        <View style={[
          styles.userAvatar, 
          { backgroundColor: isCurrentUser ? theme.colors.primary : theme.colors.secondary }
        ]}>
          <Text style={styles.userInitial}>
            {user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={[
          styles.userName, 
          { 
            color: theme.colors.text,
            fontWeight: isCurrentUser ? 'bold' : 'normal'
          }
        ]}>
          {user.name}
        </Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={[
          styles.scoreText, 
          { 
            color: isCurrentUser ? 
              theme.colors.primary : 
              theme.colors.text 
          }
        ]}>
          {score} XP
        </Text>
      </View>
    </View>
  );
};

const ChallengesScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [challenges, setAllChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [selectedTab, setSelectedTab] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [userRank, setUserRank] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  // Difficulty tabs
  const difficultyTabs = ['All', 'Easy', 'Medium', 'Hard'];
  
  // Challenge types
  const challengeTypes = ['All', 'Quiz', 'Coding', 'Practice'];

  useFocusEffect(
    React.useCallback(() => {
      // Fetch challenges when the screen is focused
      fetchChallenges();
      fetchLeaderboard();
      return () => {
        // Clean up if needed
      };
    }, [])
  );

  // Fetch challenges data
  const fetchChallenges = async () => {
    setLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      // Mock data
      const data = [
        {
          id: 1,
          title: 'Process Synchronization Challenge',
          type: 'Quiz',
          subject: 'Operating Systems',
          difficulty: 'Medium',
          estimatedDuration: 15,
          xpReward: 150,
          completed: false,
          inProgress: true
        },
        {
          id: 2,
          title: 'Binary Tree Implementation',
          type: 'Coding',
          subject: 'Data Structures',
          difficulty: 'Hard',
          estimatedDuration: 30,
          xpReward: 300,
          completed: false,
          inProgress: false
        },
        {
          id: 3,
          title: 'SQL Query Optimization',
          type: 'Practice',
          subject: 'Database Systems',
          difficulty: 'Easy',
          estimatedDuration: 10,
          xpReward: 100,
          completed: true,
          inProgress: false
        },
        {
          id: 4,
          title: 'TCP/IP Protocol Stack',
          type: 'Quiz',
          subject: 'Computer Networks',
          difficulty: 'Medium',
          estimatedDuration: 15,
          xpReward: 150,
          completed: false,
          inProgress: false
        },
        {
          id: 5,
          title: 'Heap Sort Implementation',
          type: 'Coding',
          subject: 'Algorithms',
          difficulty: 'Medium',
          estimatedDuration: 25,
          xpReward: 200,
          completed: false,
          inProgress: false
        },
        {
          id: 6,
          title: 'Derivatives Challenge',
          type: 'Practice',
          subject: 'Calculus',
          difficulty: 'Hard',
          estimatedDuration: 20,
          xpReward: 250,
          completed: false,
          inProgress: false
        },
        {
          id: 7,
          title: 'Vector Spaces Quiz',
          type: 'Quiz',
          subject: 'Linear Algebra',
          difficulty: 'Easy',
          estimatedDuration: 12,
          xpReward: 120,
          completed: true,
          inProgress: false
        },
        {
          id: 8,
          title: 'Circuit Analysis Practice',
          type: 'Practice',
          subject: 'Electrical Engineering',
          difficulty: 'Medium',
          estimatedDuration: 18,
          xpReward: 180,
          completed: false,
          inProgress: false
        },
      ];
      
      setAllChallenges(data);
      setFilteredChallenges(data);
      setLoading(false);
    }, 1000);
  };

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    // Simulate API request
    setTimeout(() => {
      // Mock data
      const data = [
        { id: 1, user: { name: 'Alex Johnson' }, score: 4250 },
        { id: 2, user: { name: 'Emma Williams' }, score: 3980 },
        { id: 3, user: { name: 'Michael Brown' }, score: 3720 },
        { id: 4, user: { name: 'Current User' }, score: 3150 },
        { id: 5, user: { name: 'Sophia Garcia' }, score: 2890 },
        { id: 6, user: { name: 'Daniel Martinez' }, score: 2750 },
        { id: 7, user: { name: 'Olivia Wilson' }, score: 2580 },
      ];
      
      setLeaderboard(data);
      setUserRank(4); // Assuming the current user is at rank 4
    }, 1200);
  };

  // Filter challenges when tab or type changes
  useEffect(() => {
    filterChallenges();
  }, [selectedTab, selectedType, challenges]);

  // Filter challenges based on selected tab and type
  const filterChallenges = () => {
    let filtered = challenges;
    
    // Filter by difficulty
    if (selectedTab !== 'All') {
      filtered = filtered.filter(challenge => 
        challenge.difficulty === selectedTab
      );
    }
    
    // Filter by type
    if (selectedType !== 'All') {
      filtered = filtered.filter(challenge => 
        challenge.type === selectedType
      );
    }
    
    setFilteredChallenges(filtered);
  };

  // Handle challenge card press
  const handleChallengePress = (challenge) => {
    navigation.navigate('ChallengeDetail', { challengeId: challenge.id });
  };

  // Handle difficulty tab press
  const handleTabPress = (tab) => {
    setSelectedTab(tab);
  };

  // Handle type filter press
  const handleTypePress = (type) => {
    setSelectedType(type);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading challenges...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Challenges
          </Text>
        </View>

        {/* Featured Challenge */}
        <View style={styles.featuredContainer}>
          <View style={[styles.featuredCard, { backgroundColor: theme.colors.primary }]}>
            <View style={styles.featuredContent}>
              <View style={styles.featuredBadgeContainer}>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>FEATURED</Text>
                </View>
              </View>
              <Text style={styles.featuredTitle}>
                Weekly Coding Competition
              </Text>
              <Text style={styles.featuredDescription}>
                Solve algorithm problems and compete with other students. Top 3 win bonus XP!
              </Text>
              <TouchableOpacity style={styles.featuredButton}>
                <Text style={styles.featuredButtonText}>Join Now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.featuredImageContainer}>
              <Text style={styles.trophyEmoji}>🏆</Text>
            </View>
          </View>
        </View>

        {/* Leaderboard Section */}
        <View style={styles.leaderboardSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Leaderboard
          </Text>
          <View style={[styles.leaderboardCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.leaderboardHeader}>
              <Text style={[styles.leaderboardTitle, { color: theme.colors.text }]}>
                Weekly Challenge Points
              </Text>
              <TouchableOpacity>
                <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.leaderboardList}>
              {leaderboard.slice(0, 5).map((entry, index) => (
                <LeaderboardRow
                  key={entry.id}
                  rank={index + 1}
                  user={entry.user}
                  score={entry.score}
                  isCurrentUser={index + 1 === userRank}
                  theme={theme}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filtersContainer}>
          <Text style={[styles.filterTitle, { color: theme.colors.text }]}>
            Difficulty
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.difficultyTabsContainer}
          >
            {difficultyTabs.map((tab) => (
              <DifficultyTab
                key={tab}
                title={tab}
                isActive={selectedTab === tab}
                onPress={() => handleTabPress(tab)}
                theme={theme}
              />
            ))}
          </ScrollView>
        </View>

        {/* Type Filters */}
        <View style={styles.typeFiltersContainer}>
          <Text style={[styles.filterTitle, { color: theme.colors.text }]}>
            Challenge Type
          </Text>
          <View style={styles.typeFiltersRow}>
            {challengeTypes.map((type) => (
              <TypeFilter
                key={type}
                type={type}
                isActive={selectedType === type}
                onPress={() => handleTypePress(type)}
                theme={theme}
              />
            ))}
          </View>
        </View>

        {/* Challenges List */}
        <View style={styles.challengesListContainer}>
          <Text style={[styles.challengesListTitle, { color: theme.colors.text }]}>
            Available Challenges
          </Text>
          {filteredChallenges.length > 0 ? (
            <View style={styles.challengesList}>
              {filteredChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  theme={theme}
                  onPress={() => handleChallengePress(challenge)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>
                No challenges match your current filters.
              </Text>
              <TouchableOpacity
                style={[styles.resetButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => {
                  setSelectedTab('All');
                  setSelectedType('All');
                }}
              >
                <Text style={styles.resetButtonText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
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
  featuredContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  featuredCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
  },
  featuredContent: {
    flex: 2,
  },
  featuredBadgeContainer: {
    marginBottom: 8,
  },
  featuredBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  featuredBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featuredTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featuredDescription: {
    color: 'white',
    opacity: 0.8,
    fontSize: 14,
    marginBottom: 16,
  },
  featuredButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  featuredButtonText: {
    color: '#3498db', // Primary color
    fontWeight: 'bold',
  },
  featuredImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophyEmoji: {
    fontSize: 50,
  },
  leaderboardSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  leaderboardCard: {
    borderRadius: 16,
    padding: 16,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  leaderboardTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  viewAllText: {
    fontSize: 14,
  },
  leaderboardList: {
    marginBottom: 8,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userInitial: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 14,
  },
  scoreContainer: {
    width: 80,
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  difficultyTabsContainer: {
    paddingRight: 20,
  },
  difficultyTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  difficultyTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  typeFiltersContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  typeFiltersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeFilter: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  typeFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  challengesListContainer: {
    paddingHorizontal: 20,
  },
  challengesListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  challengesList: {
    marginBottom: 24,
  },
  challengeCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  challengeTypeBadge: {
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
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  challengeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  challengeSubject: {
    fontSize: 14,
  },
  challengeDuration: {
    fontSize: 14,
  },
  challengeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  xpContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  xpText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusContainer: {
    marginTop: 8,
  },
  completedBadge: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  completedText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  inProgressBadge: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  inProgressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  startButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
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
  bottomPadding: {
    height: 100,
  },
});

export default ChallengesScreen;