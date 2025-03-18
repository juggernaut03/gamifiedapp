import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const SignupScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [academicLevel, setAcademicLevel] = useState('');
  const [error, setError] = useState('');
  
  const { signup } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password) => {
    // Minimum 8 characters, at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };
  
  const handleSignup = async () => {
    // Reset error
    setError('');
    
    // Validate inputs
    if (!fullName || !email || !password || !confirmPassword || !academicLevel) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and contain both letters and numbers');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      // In a real app, this would call your API to register the user
      const userData = {
        fullName,
        email,
        academicLevel,
        token: 'dummy-signup-token' // In real app, this would come from your backend
      };
      
      const success = await signup(userData);
      
      if (!success) {
        setError('Failed to create account. Please try again.');
      } else {
        // Signup successful, navigate to onboarding
        navigation.navigate('Onboarding');
      }
    } catch (err) {
      setError('An error occurred during signup');
      console.error(err);
    }
  };
  
  // Academic level options
  const academicLevels = [
    'High School',
    'Undergraduate',
    'Graduate',
    'Professional'
  ];
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>
            Create Account
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.text }]}>
            Join our AI-powered learning community
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border
              }
            ]}
            placeholder="Full Name"
            placeholderTextColor={theme.colors.text + '80'}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
          
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border
              }
            ]}
            placeholder="Email"
            placeholderTextColor={theme.colors.text + '80'}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border
              }
            ]}
            placeholder="Password"
            placeholderTextColor={theme.colors.text + '80'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border
              }
            ]}
            placeholder="Confirm Password"
            placeholderTextColor={theme.colors.text + '80'}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Academic Level
          </Text>
          
          <View style={styles.academicLevelContainer}>
            {academicLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.academicLevelButton,
                  { 
                    backgroundColor: academicLevel === level 
                      ? theme.colors.primary 
                      : theme.colors.card,
                    borderColor: theme.colors.border
                  }
                ]}
                onPress={() => setAcademicLevel(level)}
              >
                <Text
                  style={[
                    styles.academicLevelText,
                    { 
                      color: academicLevel === level 
                        ? 'white' 
                        : theme.colors.text 
                    }
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {error ? (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
          ) : null}
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={handleSignup}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.linkText, { color: theme.colors.primary }]}>
              Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  academicLevelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  academicLevelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
    marginBottom: 10,
  },
  academicLevelText: {
    fontSize: 14,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
  },
});

export default SignupScreen;