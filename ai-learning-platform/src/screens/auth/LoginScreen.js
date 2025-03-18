import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setError('');
    
    try {
      // In a real app, this would call your API
      const success = await login({ token: 'dummy-token', email });
      
      if (!success) {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.logoContainer}>
        <Text style={[styles.appTitle, { color: theme.colors.primary }]}>
          AI Learning Platform
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
        
        {error ? (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
        ) : null}
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={[styles.linkText, { color: theme.colors.primary }]}>
            Don't have an account? Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
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

export default LoginScreen;
