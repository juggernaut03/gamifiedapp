import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const MockTestCard = ({ navigation }) => {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigation.navigate("MockTest")}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={["#6C63FF", "#3A3897"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardGradient}
      >
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Icon name="brain" size={38} color="#FFF" />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Mock Tests</Text>
            <Text style={styles.cardSubtitle}>AI-generated practice exams</Text>

            <View style={styles.featureRow}>
              <View style={styles.featureItem}>
                <Icon name="star" size={14} color="#FFD700" />
                <Text style={styles.featureText}>Adaptive difficulty</Text>
              </View>

              <View style={styles.featureItem}>
                <Icon name="flash" size={14} color="#FFD700" />
                <Text style={styles.featureText}>Instant feedback</Text>
              </View>
            </View>
          </View>

          <View style={styles.arrowContainer}>
            <Icon name="chevron-right" size={26} color="#FFF" />
          </View>
        </View>

        {/* Badge showing it's new */}
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>

        {/* Stats preview */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>30+</Text>
            <Text style={styles.statLabel}>Topics</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>500+</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Difficulty Levels</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    height: 190, // Fixed height
  },
  cardGradient: {
    borderRadius: 16,
    overflow: "hidden",
    height: "100%",
  },
  cardContent: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  iconContainer: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  featureRow: {
    flexDirection: "row",
    marginTop: 5,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 14,
  },
  featureText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginLeft: 4,
  },
  arrowContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  newBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    marginTop: "auto",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 11,
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
});

export default MockTestCard;
