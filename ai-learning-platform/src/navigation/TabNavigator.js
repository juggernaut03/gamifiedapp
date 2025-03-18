import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ThemeContext } from "../context/ThemeContext";
// Import screens
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import SubjectsListScreen from "../screens/subjects/SubjectsListScreen";
import ChallengesScreen from "../screens/challenges/ChallengesScreen";
import AiTutorScreen from "../screens/aiTutor/AiTutorScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import MockTestApp from "../screens/Mock/mockTest";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: "Dashboard",
          // Add icon here
        }}
      />
      <Tab.Screen
        name="Subjects"
        component={SubjectsListScreen}
        options={{
          tabBarLabel: "Subjects",
          // Add icon here
        }}
      />
      <Tab.Screen
        name="Challenges"
        component={ChallengesScreen}
        options={{
          tabBarLabel: "Challenges",
          // Add icon here
        }}
      />
      <Tab.Screen
        name="AiTutor"
        component={AiTutorScreen}
        options={{
          tabBarLabel: "AI Tutor",
          // Add icon here
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          // Add icon here
        }}
      />
      <Tab.Screen
        name="mockTest"
        component={MockTestApp}
        options={{
          tabBarLabel: "Mock",
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
