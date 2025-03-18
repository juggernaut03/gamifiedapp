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
  Image,
  Alert
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// API Key configuration dialog
const ApiKeyDialog = ({ visible, apiKey, onSave, onCancel, theme }) => {
  const [key, setKey] = useState(apiKey || '');

  return visible ? (
    <View style={[styles.dialogOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
      <View style={[styles.dialogContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.dialogTitle, { color: theme.colors.text }]}>Gemini API Key</Text>
        <Text style={[styles.dialogDescription, { color: theme.colors.text + '99' }]}>
          Enter your Gemini API key to power the AI tutor. Your key will be stored securely on your device.
        </Text>
        <TextInput
          style={[
            styles.dialogInput,
            { 
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
              borderColor: theme.colors.border
            }
          ]}
          placeholder="Enter your Gemini API key"
          placeholderTextColor={theme.colors.text + '60'}
          value={key}
          onChangeText={setKey}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={styles.dialogButtonContainer}>
          <TouchableOpacity
            style={[styles.dialogButton, { borderColor: theme.colors.border }]}
            onPress={onCancel}
          >
            <Text style={[styles.dialogButtonText, { color: theme.colors.text }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dialogButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => onSave(key)}
          >
            <Text style={[styles.dialogButtonText, { color: 'white' }]}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ) : null;
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
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  
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
      // Load API key and chat history when screen is focused
      loadApiKey();
      fetchChatHistory();
      
      // Set initial suggestions
      setInitialSuggestions();
      
      return () => {
        // Clean up if needed
      };
    }, [])
  );
  
  // Load API key from storage
  const loadApiKey = async () => {
    try {
      const key = await AsyncStorage.getItem('gemini_api_key');
      if (key) {
        setGeminiApiKey(key);
      } else {
        // If no API key is found, show the dialog
        setShowApiKeyDialog(true);
      }
    } catch (error) {
      console.error('Error loading API key:', error);
      setShowApiKeyDialog(true);
    }
  };
  
  // Save API key to storage
  const saveApiKey = async (key) => {
    if (!key.trim()) {
      Alert.alert('Error', 'Please enter a valid API key');
      return;
    }
    
    try {
      await AsyncStorage.setItem('gemini_api_key', key);
      setGeminiApiKey(key);
      setShowApiKeyDialog(false);
    } catch (error) {
      console.error('Error saving API key:', error);
      Alert.alert('Error', 'Failed to save API key. Please try again.');
    }
  };
  
  // Fetch chat history
  const fetchChatHistory = async () => {
    try {
      const historyJson = await AsyncStorage.getItem('chat_history');
      if (historyJson) {
        const history = JSON.parse(historyJson);
        setChatHistory(history);
      } else {
        // Sample history for first-time users
        const sampleHistory = [
          {
            id: 1,
            subject: 'Operating Systems',
            lastMessage: 'Can you explain process scheduling?',
            timestamp: '2d ago',
            messageCount: 8
          }
        ];
        await AsyncStorage.setItem('chat_history', JSON.stringify(sampleHistory));
        setChatHistory(sampleHistory);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      // Use default history on error
      setChatHistory([]);
    }
  };
  
  // Save chat history
  const saveChatHistory = async (session, lastMessage) => {
    try {
      const existingHistoryJson = await AsyncStorage.getItem('chat_history');
      let history = [];
      
      if (existingHistoryJson) {
        history = JSON.parse(existingHistoryJson);
      }
      
      // Check if session already exists in history
      const existingIndex = history.findIndex(item => item.id === session.id);
      
      if (existingIndex !== -1) {
        // Update existing session
        history[existingIndex] = {
          ...history[existingIndex],
          lastMessage: lastMessage,
          timestamp: getRelativeTime(new Date()),
          messageCount: history[existingIndex].messageCount + 1
        };
      } else {
        // Add new session to history
        history.unshift({
          id: session.id,
          subject: session.subject,
          lastMessage: lastMessage,
          timestamp: getRelativeTime(new Date()),
          messageCount: messages.length + 1
        });
      }
      
      // Keep only the last 10 sessions
      history = history.slice(0, 10);
      
      await AsyncStorage.setItem('chat_history', JSON.stringify(history));
      setChatHistory(history);
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };
  
  // Save chat messages for a session
  const saveSessionMessages = async (sessionId, messagesList) => {
    try {
      await AsyncStorage.setItem(`session_${sessionId}`, JSON.stringify(messagesList));
    } catch (error) {
      console.error('Error saving session messages:', error);
    }
  };
  
  // Load messages for a session
  const loadSessionMessages = async (sessionId) => {
    try {
      const messagesJson = await AsyncStorage.getItem(`session_${sessionId}`);
      if (messagesJson) {
        return JSON.parse(messagesJson);
      }
      return null;
    } catch (error) {
      console.error('Error loading session messages:', error);
      return null;
    }
  };
  
  // Helper to get relative time string
  const getRelativeTime = (date) => {
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else if (diffInDays < 30) {
      return `${Math.floor(diffInDays / 7)}w ago`;
    } else {
      return `${Math.floor(diffInDays / 30)}m ago`;
    }
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
    const sessionId = Date.now();
    const session = {
      id: sessionId,
      subject: subject,
      startTime: new Date().toLocaleTimeString()
    };
    
    setSelectedSubject(subject);
    setCurrentSession(session);
    
    const initialMessage = {
      id: Date.now(),
      text: `Hello! I'm your AI tutor for ${subject}. How can I help you today?`,
      sender: 'ai',
      time: new Date().toLocaleTimeString()
    };
    
    setMessages([initialMessage]);
    
    // Save initial message
    saveSessionMessages(sessionId, [initialMessage]);
    saveChatHistory(session, initialMessage.text);
    
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
  const loadSession = async (session) => {
    setSelectedSubject(session.subject);
    setCurrentSession(session);
    
    // Load saved messages for this session
    const savedMessages = await loadSessionMessages(session.id);
    
    if (savedMessages && savedMessages.length > 0) {
      setMessages(savedMessages);
    } else {
      // Fallback to a default message if no saved messages
      const defaultMessage = {
        id: Date.now(),
        text: `Hello! I'm your AI tutor for ${session.subject}. How can I help you today?`,
        sender: 'ai',
        time: new Date().toLocaleTimeString()
      };
      setMessages([defaultMessage]);
    }
    
    updateSuggestionsBySubject(session.subject);
  };
  
  // Call Gemini API to get a response
  const callGeminiApi = async (userInput, subject) => {
    if (!geminiApiKey) {
      setShowApiKeyDialog(true);
      return 'Please set up your Gemini API key to continue.';
    }
    
    try {
      // Create a better prompt with context about the subject
      let promptPrefix = `You are an expert AI tutor specializing in ${subject}. 
        Your goal is to help the student understand concepts, solve problems, 
        and learn effectively. Keep explanations clear, concise, and at 
        an appropriate educational level. Include examples and analogies 
        when helpful.`;
      
      // Build conversation history in a format Gemini supports
      let conversationContext = '';
      
      // Add previous messages (limited to last 5 for context)
      const recentMessages = messages.slice(-5);
      for (const msg of recentMessages) {
        const role = msg.sender === 'user' ? 'User' : 'Tutor';
        conversationContext += `${role}: ${msg.text}\n\n`;
      }
      
      // Prepare the final prompt with the current user question
      const finalPrompt = `${promptPrefix}\n\n${conversationContext}User: ${userInput}\n\nTutor:`;
  
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              { 
                parts: [
                  { text: finalPrompt }
                ] 
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            },
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error?.message || 'Error calling Gemini API');
      }
  
      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return `I'm having trouble connecting to my AI systems. Error: ${error.message}`;
    }
  };
  
  // Also update the generateSuggestions function
  
  
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
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    // AI processing
    setLoading(true);
    
    try {
      // Get AI response from Gemini API
      const aiResponseText = await callGeminiApi(userMessage.text, selectedSubject);
      
      // Create AI message
      const aiResponse = {
        id: Date.now() + 1,
        text: aiResponseText,
        sender: 'ai',
        time: new Date().toLocaleTimeString()
      };
      
      // Add AI response to chat
      const finalMessages = [...updatedMessages, aiResponse];
      setMessages(finalMessages);
      
      // Save conversation
      if (currentSession) {
        saveSessionMessages(currentSession.id, finalMessages);
        saveChatHistory(currentSession, userMessage.text);
      }
      
      // Generate contextual suggestions based on the conversation
      generateSuggestions(userMessage.text, aiResponseText);
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Create error message
      const errorResponse = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error while processing your request. Please try again later.',
        sender: 'ai',
        time: new Date().toLocaleTimeString()
      };
      
      setMessages([...updatedMessages, errorResponse]);
    } finally {
      setLoading(false);
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };
  
  // Generate suggestions based on conversation context
  const generateSuggestions = async (userInput, aiResponse) => {
    try {
      if (!geminiApiKey) {
        updateSuggestionsBySubject(selectedSubject);
        return;
      }
      
      const prompt = `Based on this conversation about ${selectedSubject}:
      
      User: "${userInput}"
      AI Tutor: "${aiResponse}"
      
      Generate 4 follow-up questions the student might want to ask next to deepen their understanding. Keep each suggestion under 60 characters. Format your response as a list of numbered questions.`;
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 200,
            },
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to generate suggestions');
      }
      
      const data = await response.json();
      const generatedText = data.candidates[0]?.content?.parts[0]?.text || '';
      
      // Extract suggestions line by line
      const lines = generatedText.split('\n');
      const extractedSuggestions = lines
        .filter(line => line.trim())
        .map(line => line.replace(/^[0-9.]+ */, '').trim()) // Remove numbering
        .filter(line => line.length < 60 && line.length > 5)
        .slice(0, 4);
      
      if (extractedSuggestions.length > 0) {
        setSuggestions(extractedSuggestions);
      } else {
        // Fallback to subject-based suggestions
        updateSuggestionsBySubject(selectedSubject);
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      updateSuggestionsBySubject(selectedSubject);
    }
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
  
  // Handle API key settings button
  const handleApiSettings = () => {
    setShowApiKeyDialog(true);
  };
  
  // Main screen content
  if (!selectedSubject) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>AI Tutor</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleApiSettings}
          >
            <Text style={[styles.settingsButtonText, { color: theme.colors.primary }]}>API Key</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tutorIntroContainer}>
          <View style={[styles.tutorAvatarLarge, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.tutorAvatarTextLarge}>AI</Text>
          </View>
          <Text style={[styles.tutorIntroTitle, { color: theme.colors.text }]}>
            Your Personal AI Learning Assistant
          </Text>
          <Text style={[styles.tutorIntroDescription, { color: theme.colors.text + '99' }]}>
            Powered by Google's Gemini API, your AI tutor can answer questions, explain concepts, and help you master any subject.
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
        
        <ApiKeyDialog
          visible={showApiKeyDialog}
          apiKey={geminiApiKey}
          onSave={saveApiKey}
          onCancel={() => setShowApiKeyDialog(false)}
          theme={theme}
        />
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
          <TouchableOpacity 
            style={styles.chatHeaderRight}
            onPress={handleApiSettings}
          >
            <Text style={[styles.apiKeyText, { color: theme.colors.primary }]}>
              API
            </Text>
          </TouchableOpacity>
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
      
      <ApiKeyDialog
        visible={showApiKeyDialog}
        apiKey={geminiApiKey}
        onSave={saveApiKey}
        onCancel={() => setShowApiKeyDialog(false)}
        theme={theme}
      />
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    settingsButton: {
      padding: 8,
    },
    settingsButtonText: {
      fontSize: 14,
      fontWeight: '600',
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
      padding: 8,
    },
    apiKeyText: {
      fontSize: 14,
      fontWeight: '600',
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
    dialogOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    dialogContainer: {
      width: '80%',
      padding: 20,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    dialogTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    dialogDescription: {
      fontSize: 14,
      marginBottom: 16,
      lineHeight: 20,
    },
    dialogInput: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
      marginBottom: 20,
    },
    dialogButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    dialogButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginLeft: 12,
      borderWidth: 1,
    },
    dialogButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
  });
  
  export default AiTutorScreen;