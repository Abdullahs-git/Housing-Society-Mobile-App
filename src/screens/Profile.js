import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const navigation = useNavigation();

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                Alert.alert("Logged out", "You have been signed out successfully.");
                navigation.replace("Login"); // navigate back to Login screen
            })
            .catch(error => {
                Alert.alert("Error", error.message);
            });
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/boy.png')} 
                style={styles.avatar}
            />
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user?.email || 'Guest'}</Text>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9'
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    label: {
        fontSize: 16,
        fontWeight: '600'
    },
    value: {
        fontSize: 16,
        marginBottom: 20
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: '#ff4d4d',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        elevation: 3
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default Profile;
