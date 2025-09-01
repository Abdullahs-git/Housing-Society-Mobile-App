import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
        setLoading(true);
        console.log("Logging in with:", email, password);
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Login successful");

        // Replace Login screen with the main app (Drawer Navigator)
        navigation.replace('MainApp'); // Ensure this matches the screen name in your Stack
    } catch (error) {
        console.log("Error:", error.message);
        handleAuthError(error);
    } finally {
        setLoading(false);
    }
};


  const validateForm = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleAuthError = (error) => {
    console.log("Auth Error: ", error);  // Debugging log
    switch (error.code) {
      case 'auth/invalid-email':
        Alert.alert('Error', 'Invalid email format');
        break;
      case 'auth/user-not-found':
        Alert.alert('Error', 'User not found');
        break;
      case 'auth/wrong-password':
        Alert.alert('Error', 'Incorrect password');
        break;
      default:
        Alert.alert('Error', `Login error: ${error.message}`);
    }
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://www.citihousing.pk/wp-content/uploads/2024/04/threeicons-image.webp' }}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Society Management</Text>

        <View style={styles.inputContainer}>
          <FontAwesome name="envelope" size={20} color="gray" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="gray"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="gray" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="gray"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    color: 'black',
  },
  button: {
    backgroundColor: 'brown',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#a0c4ff',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  linkText: {
    color: 'white',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default Login;
