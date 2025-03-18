import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MockTestApp from "../Mock/mockTest.js"; // Import the mock test component
import MockTestCard from "./card.js"; // Import the navigation card

// Create other navigation cards as needed
const FlashCardStudyCard = ({ navigation }) => {
  // Similar implementation as MockTestCard but with different styling/content
  return (
    <View style={[styles.plainCard, { backgroundColor: "#4ECDC4" }]}>
      <Text style={styles.plainCardTitle}>Flash Cards</Text>
      <Text style={styles.plainCardSubtitle}>Review key concepts</Text>
    </View>
  );
};

const StudyGroupsCard = ({ navigation }) => {
  return (
    <View style={[styles.plainCard, { backgroundColor: "#FF6B6B" }]}>
      <Text style={styles.plainCardTitle}>Study Groups</Text>
      <Text style={styles.plainCardSubtitle}>Learn collaboratively</Text>
    </View>
  );
};

// Home Screen Component
const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, Student!</Text>
        <Text style={styles.subtitle}>What would you like to study today?</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Practice & Assessment</Text>

        {/* The Mock Test Card we created */}
        <MockTestCard navigation={navigation} />

        <Text style={styles.sectionTitle}>Study Resources</Text>

        {/* Other cards for different study features */}
        <View style={styles.rowContainer}>
          <FlashCardStudyCard navigation={navigation} />
          <StudyGroupsCard navigation={navigation} />
        </View>

        {/* Add more sections as needed */}
      </ScrollView>
    </SafeAreaView>
  );
};

// Create a stack navigator
const Stack = createStackNavigator();

// App container with navigation
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Study Dashboard",
            headerStyle: {
              backgroundColor: "#6C63FF",
            },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="MockTest"
          component={MockTestApp}
          options={{
            title: "Mock Test",
            headerStyle: {
              backgroundColor: "#6C63FF",
            },
            headerTintColor: "#fff",
            headerShown: false, // Hide header for the mock test screen
          }}
        />
        {/* Add other screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    padding: 20,
    backgroundColor: "#6C63FF",
    paddingTop: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  rowContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  plainCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 4,
    height: 100,
  },
  plainCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  plainCardSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
});

export default App;
