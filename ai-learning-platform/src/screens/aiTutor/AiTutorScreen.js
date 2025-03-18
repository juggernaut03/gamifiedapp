import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  Keyboard,
  Image
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';

// Message component for chat
const Message = ({ message, theme }) => {
  const isUser = message.sender === 'user';
  
  return (
    <View style={[
      styles.messageContainer,
      isUser ? styles.userMessageContainer : styles.aiMessageContainer,
    ]}>
      {!isUser && (
        <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.avatarText}>AI</Text>
        </View>
      )}
      <View style={[
        styles.messageBubble,
        isUser 
          ? [styles.userBubble, { backgroundColor: theme.colors.primary }] 
          : [styles.aiBubble, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]
      ]}>
        <Text style={[
          styles.messageText,
          { color: isUser ? 'white' : theme.colors.text }
        ]}>
          {message.text}
        </Text>
        <Text style={[
          styles.messageTime,
          { color: isUser ? 'rgba(255, 255, 255, 0.7)' : theme.colors.text + '80' }
        ]}>
          {message.time}
        </Text>
      </View>
      {isUser && (
        <View style={styles.emptyAvatarSpace} />
      )}
    </View>
  );
};

// Subject pill for quick selection
const SubjectPill = ({ subject, isSelected, onPress, theme }) => {
  return (
    <TouchableOpacity
      style={[
        styles.subjectPill,
        {
          backgroundColor: isSelected ? theme.colors.primary : theme.colors.card,
          borderColor: theme.colors.border
        }
      ]}
      onPress={() => onPress(subject)}
    >
      <Text
        style={[
          styles.subjectPillText,
          { color: isSelected ? 'white' : theme.colors.text }
        ]}
      >
        {subject}
      </Text>
    </TouchableOpacity>
  );
};

// Suggestion bubble
const SuggestionBubble = ({ suggestion, onPress, theme }) => {
  return (
    <TouchableOpacity
      style={[
        styles.suggestionBubble,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
      ]}
      onPress={() => onPress(suggestion)}
    >
      <Text style={[styles.suggestionText, { color: theme.colors.text }]}>
        {suggestion}
      </Text>
    </TouchableOpacity>
  );
};

const AiTutorScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  
  const scrollViewRef = useRef();
  
  // Available subjects
  const subjects = [
    'Operating Systems',
    'Data Structures',
    'Computer Networks',
    'Database Systems',
    'Calculus',
    'Linear Algebra'
  ];
  
  useFocusEffect(
    React.useCallback(() => {
      // Load chat history when screen is focused
      fetchChatHistory();
      
      // Set initial suggestions
      setInitialSuggestions();
      
      return () => {
        // Clean up if needed
      };
    }, [])
  );
  
  // Fetch chat history
  const fetchChatHistory = async () => {
    // Simulate API request
    setTimeout(() => {
      const history = [
        {
          id: 1,
          subject: 'Operating Systems',
          lastMessage: 'Can you explain process scheduling?',
          timestamp: '2d ago',
          messageCount: 8
        },
        {
          id: 2,
          subject: 'Data Structures',
          lastMessage: 'Help with binary search trees',
          timestamp: '1w ago',
          messageCount: 12
        },
        {
          id: 3,
          subject: 'Calculus',
          lastMessage: 'Solving integration problems',
          timestamp: '2w ago',
          messageCount: 15
        }
      ];
      
      setChatHistory(history);
    }, 500);
  };
  
  // Set initial suggestions
  const setInitialSuggestions = () => {
    const initialSuggestions = [
      'Explain the concept of process scheduling',
      'How to implement a binary search tree?',
      'What are the key database normalization steps?',
      'Help me understand virtual memory'
    ];
    
    setSuggestions(initialSuggestions);
  };
  
  // Start a new session
  const startNewSession = (subject) => {
    setSelectedSubject(subject);
    setCurrentSession({
      id: Date.now(),
      subject: subject,
      startTime: new Date().toLocaleTimeString()
    });
    setMessages([
      {
        id: Date.now(),
        text: `Hello! I'm your AI tutor for ${subject}. How can I help you today?`,
        sender: 'ai',
        time: new Date().toLocaleTimeString()
      }
    ]);
    
    // Set subject-specific suggestions
    updateSuggestionsBySubject(subject);
  };
  
  // Update suggestions based on selected subject
  const updateSuggestionsBySubject = (subject) => {
    let subjectSuggestions = [];
    
    switch(subject) {
      case 'Operating Systems':
        subjectSuggestions = [
          'Explain process scheduling algorithms',
          'What is virtual memory?',
          'How does paging work?',
          'Difference between mutex and semaphore'
        ];
        break;
      case 'Data Structures':
        subjectSuggestions = [
          'How to implement a balanced binary tree?',
          'Explain hash map collision resolution',
          'Time complexity of sorting algorithms',
          'When should I use a linked list vs array?'
        ];
        break;
      case 'Computer Networks':
        subjectSuggestions = [
          'Explain the TCP/IP protocol stack',
          'How does DNS resolution work?',
          'What is the purpose of subnetting?',
          'Difference between TCP and UDP'
        ];
        break;
      default:
        subjectSuggestions = [
          'What are the key concepts in this subject?',
          'Help me understand a difficult topic',
          'Give me practice problems',
          'Explain the fundamentals'
        ];
    }
    
    setSuggestions(subjectSuggestions);
  };
  
  // Load previous session
  const loadSession = (session) => {
    setSelectedSubject(session.subject);
    setCurrentSession(session);
    
    // Simulate loading previous messages
    const previousMessages = [
      {
        id: 1,
        text: `Hello! I'm your AI tutor for ${session.subject}. How can I help you today?`,
        sender: 'ai',
        time: '10:30 AM'
      },
      {
        id: 2,
        text: session.lastMessage,
        sender: 'user',
        time: '10:31 AM'
      },
      {
        id: 3,
        text: 'I would be happy to help you with that. Let me provide a detailed explanation...',
        sender: 'ai',
        time: '10:32 AM'
      }
    ];
    
    setMessages(previousMessages);
    updateSuggestionsBySubject(session.subject);
  };
  
  // Send a message
  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    // Create user message
    const userMessage = {
      id: Date.now(),
      text: input.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString()
    };
    
    // Add user message to chat
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    // Simulate AI thinking
    setLoading(true);
    
    // Simulate API request for AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: generateAIResponse(input, selectedSubject),
        sender: 'ai',
        time: new Date().toLocaleTimeString()
      };
      
      // Add AI response to chat
      setMessages(prevMessages => [...prevMessages, aiResponse]);
      setLoading(false);
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
      // Update suggestions based on conversation context
      updateSuggestionsByContext(input);
    }, 1500);
  };
  
  // Generate AI response (simulated)
  const generateAIResponse = (userInput, subject) => {
    // This would be replaced with actual AI API call
    const responses = {
      'Operating Systems': 'In operating systems, processes are managed through scheduling algorithms like FCFS, SJF, and Round Robin. These determine which process gets CPU time and in what order, optimizing resource usage.',
      'Data Structures': 'Binary search trees are hierarchical data structures where each node has at most two children. They enable efficient searching, insertion, and deletion operations with O(log n) time complexity in balanced trees.',
      'Computer Networks': 'The TCP/IP protocol stack consists of four layers: Application, Transport, Internet, and Network Interface. Each layer has specific protocols and functions, enabling data transmission across networks.',
      'Database Systems': 'Database normalization reduces redundancy and dependency by organizing fields and tables. The process includes 1NF, 2NF, 3NF, BCNF, and further normal forms to optimize database structure.',
      'Calculus': 'Integration can be approached through various techniques including substitution, integration by parts, partial fractions, and trigonometric substitutions, depending on the functions characteristics.',
      'Linear Algebra': 'Matrices represent linear transformations and can be used to solve systems of linear equations. Operations like addition, multiplication, and finding determinants help solve complex problems.'
    };
    
    return responses[subject] || 'That\'s an interesting question. Let me explain this concept in detail...';
  };
  
  // Update suggestions based on conversation context
  const updateSuggestionsByContext = (userInput) => {
    const input = userInput.toLowerCase();
    let contextSuggestions = [];
    
    // Simulated context-aware suggestions
    if (input.includes('algorithm') || input.includes('sorting')) {
      contextSuggestions = [
        'Compare quick sort and merge sort',
        'Explain time complexity analysis',
        'How to optimize sorting algorithms?',
        'Real-world applications of sorting'
      ];
    } else if (input.includes('memory') || input.includes('allocation')) {
      contextSuggestions = [
        'How does garbage collection work?',
        'Explain memory leaks and prevention',
        'What is stack vs heap memory?',
        'How does virtual memory work?'
      ];
    } else if (input.includes('database') || input.includes('sql')) {
      contextSuggestions = [
        'What are database indexing strategies?',
        'Explain SQL joins with examples',
        'How to optimize database queries?',
        'NoSQL vs relational databases'
      ];
    } else {
      // Default to subject-based suggestions
      updateSuggestionsBySubject(selectedSubject);
      return;
    }
    
    setSuggestions(contextSuggestions);
  };
  
  // Handle suggestion press
  const handleSuggestionPress = (suggestion) => {
    setInput(suggestion);
  };
  
  // End current session
  const endSession = () => {
    setSelectedSubject(null);
    setCurrentSession(null);
    setMessages([]);
    setInitialSuggestions();
  };
  
  // Main screen content
  if (!selectedSubject) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>AI Tutor</Text>
        </View>
        
        <View style={styles.tutorIntroContainer}>
          <View style={[styles.tutorAvatarLarge, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.tutorAvatarTextLarge}>AI</Text>
          </View>
          <Text style={[styles.tutorIntroTitle, { color: theme.colors.text }]}>
            Your Personal AI Learning Assistant
          </Text>
          <Text style={[styles.tutorIntroDescription, { color: theme.colors.text + '99' }]}>
            Ask questions, get explanations, and practice concepts with your AI tutor. Select a subject to get started.
          </Text>
        </View>
        
        <View style={styles.subjectsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Select a Subject
          </Text>
          <View style={styles.subjectGrid}>
            {subjects.map(subject => (
              <TouchableOpacity
                key={subject}
                style={[styles.subjectCard, { backgroundColor: theme.colors.card }]}
                onPress={() => startNewSession(subject)}
              >
                <View style={[
                  styles.subjectIcon, 
                  { backgroundColor: getSubjectColor(subject, theme) + '20' }
                ]}>
                  <Text style={[
                    styles.subjectIconText, 
                    { color: getSubjectColor(subject, theme) }
                  ]}>
                    {subject.substring(0, 2)}
                  </Text>
                </View>
                <Text style={[styles.subjectCardTitle, { color: theme.colors.text }]}>
                  {subject}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {chatHistory.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Recent Conversations
            </Text>
            {chatHistory.map(session => (
              <TouchableOpacity
                key={session.id}
                style={[styles.historyCard, { backgroundColor: theme.colors.card }]}
                onPress={() => loadSession(session)}
              >
                <View style={styles.historyCardContent}>
                  <View style={[
                    styles.historySubjectBadge, 
                    { backgroundColor: getSubjectColor(session.subject, theme) + '20' }
                  ]}>
                    <Text style={[
                      styles.historySubjectText, 
                      { color: getSubjectColor(session.subject, theme) }
                    ]}>
                      {session.subject}
                    </Text>
                  </View>
                  <Text style={[styles.historyMessageText, { color: theme.colors.text }]} numberOfLines={1}>
                    {session.lastMessage}
                  </Text>
                  <View style={styles.historyFooter}>
                    <Text style={[styles.historyTimestamp, { color: theme.colors.text + '80' }]}>
                      {session.timestamp}
                    </Text>
                    <Text style={[styles.historyMessageCount, { color: theme.colors.text + '80' }]}>
                      {session.messageCount} messages
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </SafeAreaView>
    );
  }
  
  // Chat interface
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Chat Header */}
        <View style={[styles.chatHeader, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={endSession}
          >
            <Text style={[styles.backButtonText, { color: theme.colors.primary }]}>
              Back
            </Text>
          </TouchableOpacity>
          <View style={styles.chatHeaderCenter}>
            <Text style={[styles.chatSubjectText, { color: theme.colors.text }]}>
              {selectedSubject}
            </Text>
          </View>
          <View style={styles.chatHeaderRight} />
        </View>
        
        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(message => (
            <Message 
              key={message.id} 
              message={message} 
              theme={theme} 
            />
          ))}
          
          {loading && (
            <View style={[
              styles.loadingContainer, 
              { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
            ]}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={[styles.loadingText, { color: theme.colors.text }]}>
                AI is thinking...
              </Text>
            </View>
          )}
        </ScrollView>
        
        {/* Suggestions */}
        {suggestions.length > 0 && !loading && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsContainer}
          >
            {suggestions.map((suggestion, index) => (
              <SuggestionBubble
                key={index}
                suggestion={suggestion}
                onPress={handleSuggestionPress}
                theme={theme}
              />
            ))}
          </ScrollView>
        )}
        
        {/* Input */}
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
          <TextInput
            style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.background }]}
            placeholder="Ask your AI tutor..."
            placeholderTextColor={theme.colors.text + '60'}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              { 
                backgroundColor: input.trim() ? theme.colors.primary : theme.colors.primary + '50' 
              }
            ]}
            onPress={sendMessage}
            disabled={!input.trim() || loading}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Helper function to get subject-specific colors
const getSubjectColor = (subject, theme) => {
  switch (subject) {
    case 'Operating Systems':
      return theme.colors.primary;
    case 'Data Structures':
      return theme.colors.secondary;
    case 'Computer Networks':
      return theme.colors.accent;
    case 'Database Systems':
      return theme.colors.info;
    case 'Calculus':
      return theme.colors.success;
    case 'Linear Algebra':
      return theme.colors.warning;
    default:
      return theme.colors.primary;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  tutorIntroContainer: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  tutorAvatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  tutorAvatarTextLarge: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  tutorIntroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  tutorIntroDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  subjectsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  subjectCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  subjectIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectIconText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subjectCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  historyContainer: {
    paddingHorizontal: 20,
  },
  historyCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  historyCardContent: {
    padding: 16,
  },
  historySubjectBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  historySubjectText: {
    fontSize: 12,
    fontWeight: '500',
  },
  historyMessageText: {
    fontSize: 14,
    marginBottom: 8,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyTimestamp: {
    fontSize: 12,
  },
  historyMessageCount: {
    fontSize: 12,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    paddingRight: 16,
  },
  backButtonText: {
    fontSize: 16,
  },
  chatHeaderCenter: {
    flex: 1,
    alignItems: 'center',
  },
  chatSubjectText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatHeaderRight: {
    width: 40,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '100%',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyAvatarSpace: {
    width: 36,
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    marginBottom: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  suggestionBubble: {
    padding: 10,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 48,
    marginRight: 8,
    maxHeight: 120,
    fontSize: 16,
  },
  sendButton: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  subjectPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  subjectPillText: {
    fontSize: 14,
  },
});

export default AiTutorScreen;