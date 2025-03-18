import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  SafeAreaView,
  Alert
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

// Profile stat card component
const StatCard = ({ title, value, icon, theme }) => {
  return (
    <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
      <View style={[styles.statIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
        <Text style={[styles.statIcon, { color: theme.colors.primary }]}>{icon}</Text>
      </View>
      <Text style={[styles.statValue, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: theme.colors.text + '99' }]}>{title}</Text>
    </View>
  );
};

// Achievement badge component
const AchievementBadge = ({ achievement, theme }) => {
  return (
    <View style={[styles.achievementBadge, { backgroundColor: theme.colors.card }]}>
      <View 
        style={[
          styles.badgeIconContainer, 
          { 
            backgroundColor: achievement.unlocked ? 
              theme.colors.primary : 
              theme.colors.border
          }
        ]}
      >
        <Text style={styles.badgeIcon}>{achievement.icon}</Text>
      </View>
      <Text 
        style={[
          styles.badgeName, 
          { 
            color: achievement.unlocked ? 
              theme.colors.text : 
              theme.colors.text + '60' 
          }
        ]}
      >
        {achievement.name}
      </Text>
      {!achievement.unlocked && (
        <Text style={[styles.badgeLocked, { color: theme.colors.text + '60' }]}>
          {achievement.progress}%
        </Text>
      )}
    </View>
  );
};

// Setting item component
const SettingItem = ({ icon, title, description, action, toggle, value, theme }) => {
  return (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
      onPress={action}
      disabled={toggle}
    >
      <View style={[styles.settingIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
        <Text style={[styles.settingIcon, { color: theme.colors.primary }]}>{icon}</Text>
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme.colors.text }]}>{title}</Text>
        {description && (
          <Text style={[styles.settingDescription, { color: theme.colors.text + '99' }]}>
            {description}
          </Text>
        )}
      </View>
      {toggle ? (
        <Switch
          value={value}
          onValueChange={action}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
          thumbColor={value ? theme.colors.primary : '#f4f3f4'}
        />
      ) : (
        <Text style={[styles.settingChevron, { color: theme.colors.text + '60' }]}>›</Text>
      )}
    </TouchableOpacity>
  );
};

const ProfileScreen = ({ navigation }) => {
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);
  const [achievements, setAchievements] = useState([]);
  
  useFocusEffect(
    React.useCallback(() => {
      // Load profile data when the screen is focused
      fetchProfileData();
      return () => {
        // Clean up if needed
      };
    }, [])
  );
  
  // Fetch profile data
  const fetchProfileData = async () => {
    setLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      // Mock profile data
      const profileData = {
        id: 1,
        name: user?.fullName || 'Sarah Johnson',
        email: user?.email || 'sarah.johnson@example.com',
        academicLevel: 'Undergraduate',
        joinDate: 'September 2024',
        stats: {
          subjectsLearned: 8,
          challengesCompleted: 42,
          totalStudyHours: 156,
          streak: 16
        },
        achievements: [
          { id: 1, name: 'Fast Learner', icon: '🚀', unlocked: true, progress: 100 },
          { id: 2, name: 'Problem Solver', icon: '🧩', unlocked: true, progress: 100 },
          { id: 3, name: 'Knowledge Seeker', icon: '🔍', unlocked: true, progress: 100 },
          { id: 4, name: 'Coding Master', icon: '💻', unlocked: false, progress: 65 },
          { id: 5, name: 'Math Wizard', icon: '🧮', unlocked: false, progress: 30 },
          { id: 6, name: 'Perfect Score', icon: '🏆', unlocked: false, progress: 75 }
        ]
      };
      
      setUserProfile(profileData);
      setAchievements(profileData.achievements);
      setLoading(false);
    }, 1000);
  };
  
  // Handle account settings press
  const handleAccountSettings = () => {
    navigation.navigate('AccountSettings');
  };
  
  // Handle language selection press
  const handleLanguageSelection = () => {
    navigation.navigate('LanguageSettings');
  };
  
  // Handle study preferences press
  const handleStudyPreferences = () => {
    navigation.navigate('StudyPreferences');
  };
  
  // Handle notifications toggle
  const toggleNotifications = (value) => {
    setNotifications(value);
  };
  
  // Handle study reminders toggle
  const toggleStudyReminders = (value) => {
    setStudyReminders(value);
  };
  
  // Handle logout press
  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Log Out',
          onPress: () => {
            // Call logout from auth context
            logout();
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  // Handle help center press
  const handleHelpCenter = () => {
    navigation.navigate('HelpCenter');
  };
  
  // Handle about press
  const handleAbout = () => {
    navigation.navigate('About');
  };
  
  if (!userProfile) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profile</Text>
        </View>
        
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.avatarText}>
                {userProfile.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.colors.text }]}>
                {userProfile.name}
              </Text>
              <Text style={[styles.profileEmail, { color: theme.colors.text + '99' }]}>
                {userProfile.email}
              </Text>
              <View style={styles.profileBadges}>
                <View style={[styles.profileBadge, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Text style={[styles.profileBadgeText, { color: theme.colors.primary }]}>
                    {userProfile.academicLevel}
                  </Text>
                </View>
                <View style={[styles.profileBadge, { backgroundColor: theme.colors.secondary + '20' }]}>
                  <Text style={[styles.profileBadgeText, { color: theme.colors.secondary }]}>
                    Member since {userProfile.joinDate}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard 
              title="Subjects" 
              value={userProfile.stats.subjectsLearned}
              icon="📚"
              theme={theme}
            />
            <StatCard 
              title="Challenges" 
              value={userProfile.stats.challengesCompleted}
              icon="🏆"
              theme={theme}
            />
            <StatCard 
              title="Study Hours" 
              value={userProfile.stats.totalStudyHours}
              icon="⏱️"
              theme={theme}
            />
            <StatCard 
              title="Day Streak" 
              value={userProfile.stats.streak}
              icon="🔥"
              theme={theme}
            />
          </View>
        </View>
        
        {/* Achievements Section */}
        <View style={styles.achievementsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Achievements
          </Text>
          <View style={styles.achievementsGrid}>
            {achievements.map(achievement => (
              <AchievementBadge 
                key={achievement.id}
                achievement={achievement}
                theme={theme}
              />
            ))}
          </View>
        </View>
        
        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Settings
          </Text>
          
          {/* Account Settings */}
          <View style={[styles.settingsCard, { backgroundColor: theme.colors.card }]}>
            <SettingItem
              icon="👤"
              title="Account Settings"
              description="Update your profile information"
              action={handleAccountSettings}
              theme={theme}
            />
            <SettingItem
              icon="🔄"
              title="Study Preferences"
              description="Customize your learning experience"
              action={handleStudyPreferences}
              theme={theme}
            />
            <SettingItem
              icon="🌐"
              title="Language"
              description="English"
              action={handleLanguageSelection}
              theme={theme}
            />
          </View>
          
          {/* Notification Settings */}
          <View style={[styles.settingsCard, { backgroundColor: theme.colors.card }]}>
            <SettingItem
              icon="🔔"
              title="Push Notifications"
              toggle={true}
              value={notifications}
              action={toggleNotifications}
              theme={theme}
            />
            <SettingItem
              icon="⏰"
              title="Study Reminders"
              toggle={true}
              value={studyReminders}
              action={toggleStudyReminders}
              theme={theme}
            />
            <SettingItem
              icon="🌙"
              title="Dark Mode"
              toggle={true}
              value={isDarkMode}
              action={toggleTheme}
              theme={theme}
            />
          </View>
          
          {/* Help & Support */}
          <View style={[styles.settingsCard, { backgroundColor: theme.colors.card }]}>
            <SettingItem
              icon="❓"
              title="Help Center"
              action={handleHelpCenter}
              theme={theme}
            />
            <SettingItem
              icon="ℹ️"
              title="About"
              action={handleAbout}
              theme={theme}
            />
            <SettingItem
              icon="🚪"
              title="Log Out"
              action={handleLogout}
              theme={theme}
            />
          </View>
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
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  profileBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  profileBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  profileBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
  },
  achievementsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementBadge: {
    width: '31%',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  badgeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeIcon: {
    fontSize: 24,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeLocked: {
    fontSize: 10,
  },
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  settingsCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingIcon: {
    fontSize: 18,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  settingChevron: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 100,
  },
});

export default ProfileScreen;