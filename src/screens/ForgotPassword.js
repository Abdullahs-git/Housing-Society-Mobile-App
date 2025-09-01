import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebaseConfig'; // Ensure this path is correct

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    try {
      setLoading(true);
      console.log("Sending password reset email to:", email); // Debugging log
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent successfully."); // Debugging log
      Alert.alert(
        'Email Sent',
        'Password reset instructions have been sent to your email.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.log("Password reset error:", error.message); // Debugging log
      handlePasswordResetError(error);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handlePasswordResetError = (error) => {
    switch (error.code) {
      case 'auth/user-not-found':
        Alert.alert('Error', 'No account found with this email address');
        break;
      case 'auth/invalid-email':
        Alert.alert('Error', 'Invalid email address format');
        break;
      default:
        Alert.alert('Error', 'Password reset failed: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your email to reset password</Text>

      <View style={styles.inputContainer}>
        <Icon name="email" size={20} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFC107" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: '80%',
  },
  icon: {
    marginRight: 10,
    color: '#888',
  },
  input: {
    flex: 1,
    height: 50,
    color: 'white',
  },
  button: {
    backgroundColor: 'brown',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ForgotPassword;
