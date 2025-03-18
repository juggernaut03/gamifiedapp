import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ThemeContext } from "../context/ThemeContext";

import { MaterialCommunityIcons } from "@expo/vector-icons";

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
        tabBarInactiveTintColor: "black",
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
          tabBarIcon: ({ focused, size }) => (
            <MaterialCommunityIcons
              name="view-dashboard"
              size={size}
              color={focused ? theme.colors.primary : "black"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Subjects"
        component={SubjectsListScreen}
        options={{
          tabBarLabel: "Subjects",
          tabBarIcon: ({ focused, size }) => (
            <MaterialCommunityIcons
              name="book-open-variant"
              size={size}
              color={focused ? theme.colors.primary : "black"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Challenges"
        component={ChallengesScreen}
        options={{
          tabBarLabel: "Challenges",
          tabBarIcon: ({ focused, size }) => (
            <MaterialCommunityIcons
              name="trophy-outline"
              size={size}
              color={focused ? theme.colors.primary : "black"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AiTutor"
        component={AiTutorScreen}
        options={{
          tabBarLabel: "AI Tutor",
          tabBarIcon: ({ focused, size }) => (
            <MaterialCommunityIcons
              name="robot"
              size={size}
              color={focused ? theme.colors.primary : "black"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused, size }) => (
            <MaterialCommunityIcons
              name="account"
              size={size}
              color={focused ? theme.colors.primary : "black"}
            />
          ),
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
