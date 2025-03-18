import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  ActivityIndicator,
  Modal,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Mock data for testing (in real app, you would fetch from an API like Gemini)
const mockQuestions = {
  cs: [
    {
      id: 1,
      question: "What is the time complexity of a binary search algorithm?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
      correctAnswer: "O(log n)",
      explanation:
        "Binary search divides the search interval in half with each comparison, resulting in a logarithmic time complexity.",
    },
    {
      id: 2,
      question:
        "Which of the following data structures is based on LIFO principle?",
      options: ["Queue", "Stack", "Linked List", "Graph"],
      correctAnswer: "Stack",
      explanation:
        "A stack follows the Last-In-First-Out (LIFO) principle where the last element added is the first one to be removed.",
    },
    {
      id: 3,
      question:
        "What is the primary purpose of normalization in database design?",
      options: [
        "To speed up queries",
        "To reduce data redundancy",
        "To increase storage capacity",
        "To improve data visualization",
      ],
      correctAnswer: "To reduce data redundancy",
      explanation:
        "Normalization is the process of organizing data to eliminate redundancy and ensure data integrity by dividing large tables into smaller ones.",
    },
    {
      id: 4,
      question:
        "Which of the following is not a valid access modifier in Java?",
      options: ["public", "private", "protected", "friendly"],
      correctAnswer: "friendly",
      explanation:
        'Java has three access modifiers: public, private, and protected. The default is package-private (no modifier). "friendly" is not a valid access modifier in Java.',
    },
    {
      id: 5,
      question:
        "What design pattern is used to separate the construction of a complex object from its representation?",
      options: ["Factory", "Builder", "Singleton", "Adapter"],
      correctAnswer: "Builder",
      explanation:
        "The Builder pattern separates the construction of a complex object from its representation, allowing the same construction process to create different representations.",
    },
  ],
  physics: [
    {
      id: 1,
      question: "What is the SI unit of force?",
      options: ["Watt", "Joule", "Newton", "Pascal"],
      correctAnswer: "Newton",
      explanation:
        "Newton (N) is the SI unit of force, defined as the force needed to accelerate a mass of one kilogram at a rate of one meter per second squared.",
    },
    {
      id: 2,
      question: "Which of the following is a vector quantity?",
      options: ["Mass", "Temperature", "Velocity", "Energy"],
      correctAnswer: "Velocity",
      explanation:
        "Velocity is a vector quantity as it has both magnitude (speed) and direction.",
    },
  ],
};

const generateQuestions = (subject) => {
  // Simulate API call to Gemini or other AI service
  return new Promise((resolve) => {
    setTimeout(() => {
      if (subject.toLowerCase().includes("physics")) {
        resolve(mockQuestions.physics);
      } else {
        // Default to CS questions if subject is skipped or not found
        resolve(mockQuestions.cs);
      }
    }, 1500);
  });
};

// Loading animation component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#6C63FF" />
    <Text style={styles.loadingText}>Generating your personalized quiz...</Text>
    <Text style={styles.loadingSubText}>
      Crafting challenging questions just for you
    </Text>
  </View>
);

// Welcome Screen Component
const WelcomeScreen = ({ onStart, onSkip }) => {
  const [subject, setSubject] = useState("");
  const scaleAnim = useState(new Animated.Value(0.95))[0];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient
      colors={["#6C63FF", "#3A3897"]}
      style={styles.welcomeContainer}
    >
      <Text style={styles.welcomeTitle}>Mock Test Generator</Text>
      <Text style={styles.welcomeSubtitle}>
        Challenge yourself with AI-generated questions
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Enter a subject for your quiz:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Computer Science, Physics, Mathematics..."
          placeholderTextColor="#A9A9A9"
          value={subject}
          onChangeText={setSubject}
        />
      </View>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => onStart(subject)}
        >
          <Text style={styles.startButtonText}>Start Quiz</Text>
          <Icon name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
        <Text style={styles.skipButtonText}>Skip & Use CS Questions</Text>
      </TouchableOpacity>

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Features:</Text>
        <View style={styles.featureItem}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.featureText}>AI-generated practice exams</Text>
        </View>
        <View style={styles.featureItem}>
          <Icon name="chart-line-variant" size={16} color="#FFD700" />
          <Text style={styles.featureText}>Adaptive difficulty levels</Text>
        </View>
        <View style={styles.featureItem}>
          <Icon name="flash" size={16} color="#FFD700" />
          <Text style={styles.featureText}>Instant performance analysis</Text>
        </View>
        <View style={styles.featureItem}>
          <Icon name="comment-text-outline" size={16} color="#FFD700" />
          <Text style={styles.featureText}>
            Detailed feedback on weak areas
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

// Question Card Component
const QuestionCard = ({
  question,
  options,
  selected,
  onSelect,
  showAnswer,
  isCorrect,
  animation,
}) => {
  return (
    <Animated.View style={[styles.questionCard, animation]}>
      <Text style={styles.questionText}>{question}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selected === option && styles.selectedOption,
              showAnswer &&
                selected === option &&
                !isCorrect &&
                styles.wrongOption,
              showAnswer &&
                option === question.correctAnswer &&
                styles.correctOption,
            ]}
            onPress={() => !showAnswer && onSelect(option)}
            disabled={showAnswer}
          >
            <Text
              style={[
                styles.optionText,
                selected === option && styles.selectedOptionText,
                showAnswer &&
                  selected === option &&
                  !isCorrect &&
                  styles.wrongOptionText,
                showAnswer &&
                  option === question.correctAnswer &&
                  styles.correctOptionText,
              ]}
            >
              {String.fromCharCode(65 + index)}. {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

// Results Modal Component
const ResultsModal = ({
  visible,
  score,
  totalQuestions,
  weakAreas,
  onRetry,
  onClose,
}) => {
  const percentage = (score / totalQuestions) * 100;
  const performanceText =
    percentage >= 80
      ? "Excellent!"
      : percentage >= 60
      ? "Good Job!"
      : "Keep Practicing!";

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Icon
            name={
              percentage >= 80 ? "trophy" : percentage >= 60 ? "star" : "school"
            }
            size={60}
            color={
              percentage >= 80
                ? "#FFD700"
                : percentage >= 60
                ? "#6C63FF"
                : "#3A3897"
            }
            style={styles.resultIcon}
          />

          <Text style={styles.performanceText}>{performanceText}</Text>
          <Text style={styles.scoreText}>
            Your Score: {score}/{totalQuestions}
          </Text>
          <Text style={styles.percentageText}>{percentage.toFixed(1)}%</Text>

          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${percentage}%` }]} />
          </View>

          {weakAreas.length > 0 && (
            <View style={styles.weakAreasContainer}>
              <Text style={styles.weakAreasTitle}>Areas to Improve:</Text>
              {weakAreas.map((area, index) => (
                <Text key={index} style={styles.weakAreaItem}>
                  • {area}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <Icon name="refresh" size={20} color="#FFF" />
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={20} color="#FFF" />
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Main App Component
const MockTestApp = () => {
  const [screen, setScreen] = useState("welcome");
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [weakAreas, setWeakAreas] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));

  // Function to handle subject input and start quiz
  const handleStart = (inputSubject) => {
    setSubject(inputSubject || "Computer Science");
    setScreen("loading");

    generateQuestions(inputSubject).then((generatedQuestions) => {
      setQuestions(generatedQuestions);
      setScreen("quiz");
    });
  };

  // Function to skip subject input and use default CS questions
  const handleSkip = () => {
    setSubject("Computer Science");
    setScreen("loading");

    generateQuestions("Computer Science").then((generatedQuestions) => {
      setQuestions(generatedQuestions);
      setScreen("quiz");
    });
  };

  // Function to handle answer selection
  const handleSelectAnswer = (answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answer,
    });
  };

  // Function to check answer and move to next question
  const handleCheckAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = selectedAnswers[currentQuestionIndex];

    if (!userAnswer) return; // Require an answer before proceeding

    setShowAnswer(true);

    // Update score if answer is correct
    if (userAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    } else {
      // Add to weak areas if wrong
      setWeakAreas([...new Set([...weakAreas, currentQuestion.question])]);
    }

    // Delay before moving to next question
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        // Slide out animation
        Animated.timing(slideAnim, {
          toValue: -400,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setShowAnswer(false);
          slideAnim.setValue(400); // Move to right side of screen

          // Slide in animation for next question
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        });
      } else {
        // End of quiz
        setShowResults(true);
      }
    }, 1500);
  };

  // Animation for question cards
  const questionAnimation = {
    transform: [{ translateX: slideAnim }],
  };

  // Initialize animation when a new question is shown
  useEffect(() => {
    if (screen === "quiz") {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [currentQuestionIndex, screen]);

  // Function to restart the quiz
  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowAnswer(false);
    setScore(0);
    setWeakAreas([]);
    setShowResults(false);
    slideAnim.setValue(400);

    // Animate the first question
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Function to go back to welcome screen
  const handleClose = () => {
    setShowResults(false);
    setScreen("welcome");
  };

  // Render appropriate screen
  const renderScreen = () => {
    switch (screen) {
      case "welcome":
        return <WelcomeScreen onStart={handleStart} onSkip={handleSkip} />;

      case "loading":
        return <LoadingScreen />;

      case "quiz":
        if (questions.length === 0) {
          return <LoadingScreen />;
        }

        const currentQuestion = questions[currentQuestionIndex];
        return (
          <SafeAreaView style={styles.quizContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </Text>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFg,
                    {
                      width: `${
                        ((currentQuestionIndex + 1) / questions.length) * 100
                      }%`,
                    },
                  ]}
                />
              </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <QuestionCard
                question={currentQuestion.question}
                options={currentQuestion.options}
                selected={selectedAnswers[currentQuestionIndex]}
                onSelect={handleSelectAnswer}
                showAnswer={showAnswer}
                isCorrect={
                  selectedAnswers[currentQuestionIndex] ===
                  currentQuestion.correctAnswer
                }
                animation={questionAnimation}
              />

              {showAnswer && (
                <View style={styles.explanationContainer}>
                  <Text style={styles.explanationTitle}>
                    {selectedAnswers[currentQuestionIndex] ===
                    currentQuestion.correctAnswer
                      ? "✅ Correct!"
                      : "❌ Incorrect"}
                  </Text>
                  <Text style={styles.explanationText}>
                    {currentQuestion.explanation}
                  </Text>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.nextButton,
                !selectedAnswers[currentQuestionIndex] &&
                  !showAnswer &&
                  styles.disabledButton,
              ]}
              onPress={handleCheckAnswer}
              disabled={!selectedAnswers[currentQuestionIndex] && !showAnswer}
            >
              <Text style={styles.nextButtonText}>
                {showAnswer
                  ? currentQuestionIndex < questions.length - 1
                    ? "Next Question"
                    : "See Results"
                  : "Check Answer"}
              </Text>
              <Icon
                name={showAnswer ? "arrow-right" : "check"}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>

            {/* Results Modal */}
            <ResultsModal
              visible={showResults}
              score={score}
              totalQuestions={questions.length}
              weakAreas={weakAreas}
              onRetry={handleRetry}
              onClose={handleClose}
            />
          </SafeAreaView>
        );

      default:
        return <WelcomeScreen onStart={handleStart} onSkip={handleSkip} />;
    }
  };

  return renderScreen();
};

const styles = StyleSheet.create({
  // Welcome Screen Styles
  welcomeContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 40,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: "#fff",
    width: "100%",
  },
  startButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  skipButton: {
    padding: 10,
  },
  skipButtonText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
  },
  featuresContainer: {
    marginTop: 40,
    alignSelf: "flex-start",
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    color: "rgba(255, 255, 255, 0.9)",
    marginLeft: 8,
    fontSize: 14,
  },

  // Loading Screen Styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F2F5",
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    textAlign: "center",
  },
  loadingSubText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },

  // Quiz Screen Styles
  quizContainer: {
    flex: 1,
    backgroundColor: "#F0F2F5",
  },
  progressHeader: {
    padding: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFg: {
    height: "100%",
    backgroundColor: "#6C63FF",
    borderRadius: 3,
  },
  scrollContainer: {
    padding: 15,
    paddingBottom: 100,
  },
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: "#F5F7FA",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E9F0",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedOption: {
    backgroundColor: "rgba(108, 99, 255, 0.1)",
    borderColor: "#6C63FF",
  },
  selectedOptionText: {
    color: "#6C63FF",
    fontWeight: "bold",
  },
  correctOption: {
    backgroundColor: "rgba(46, 213, 115, 0.1)",
    borderColor: "#2ED573",
  },
  correctOptionText: {
    color: "#2ED573",
    fontWeight: "bold",
  },
  wrongOption: {
    backgroundColor: "rgba(255, 71, 87, 0.1)",
    borderColor: "#FF4757",
  },
  wrongOptionText: {
    color: "#FF4757",
    fontWeight: "bold",
  },
  explanationContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  explanationText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  nextButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#6C63FF",
    borderRadius: 30,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  disabledButton: {
    backgroundColor: "#A8A8A8",
    shadowOpacity: 0.1,
  },

  // Results Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  resultIcon: {
    marginBottom: 15,
  },
  performanceText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  scoreText: {
    fontSize: 18,
    color: "#555",
    marginBottom: 5,
  },
  percentageText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#6C63FF",
    marginBottom: 15,
  },
  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    marginBottom: 20,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#6C63FF",
    borderRadius: 5,
  },
  weakAreasContainer: {
    width: "100%",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "rgba(255, 71, 87, 0.1)",
    borderRadius: 8,
  },
  weakAreasTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF4757",
    marginBottom: 8,
  },
  weakAreaItem: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  retryButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 10,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  closeButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginLeft: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default MockTestApp;
