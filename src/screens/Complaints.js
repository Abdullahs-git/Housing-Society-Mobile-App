import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { ref, onValue, push } from 'firebase/database';
import { database } from '../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const Complaints = ({ navigation }) => {
  const [complaint, setComplaint] = useState('');
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const complaintsRef = ref(database, 'complaints/');
    onValue(complaintsRef, snapshot => {
      const data = snapshot.val();
      const complaintList = data ? Object.keys(data).map(key => ({ ...data[key], id: key })) : [];
      setComplaints(complaintList.reverse()); // Most recent on top
    });
  }, []);

  const handleSubmitComplaint = () => {
    if (complaint.trim()) {
      const complaintsRef = ref(database, 'complaints/');
      push(complaintsRef, { complaint });
      setComplaint('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Submit Your Complaint</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your complaint here..."
        value={complaint}
        onChangeText={setComplaint}
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitComplaint}>
        <Text style={styles.submitText}>Submit Complaint</Text>
      </TouchableOpacity>

      <Text style={styles.submittedTitle}>Previous Complaints</Text>

      <FlatList
        data={complaints}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.complaintCard}>
            <Text style={styles.complaintText}>{item.complaint}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 2,
    backgroundColor: '#3498db',
    borderRadius: 20,
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    marginBottom: 12,
    textAlignVertical: 'top',
    height: 100,
  },
  submitButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  submittedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 10,
  },
  complaintCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#e67e22',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  complaintText: {
    fontSize: 15,
    color: '#2c3e50',
  },
});

export default Complaints;
