import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ref, onValue, push, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { database } from '../config/firebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const EventsNotices = () => {
  const [events, setEvents] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const adminRef = ref(database, `admins/${currentUser.uid}`);
      onValue(adminRef, (snapshot) => {
        const adminData = snapshot.val();
        if (adminData && adminData.role === 'admin') {
          setIsAdmin(true);
        }
      });
    }

    const eventsRef = ref(database, 'eventNotices/');
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      const eventList = data
        ? Object.keys(data).map((key) => ({ ...data[key], id: key }))
        : [];
      setEvents(eventList.reverse());
    });
  }, []);

  const handleAddEvent = () => {
    if (!newEventTitle || !newEventDescription) {
      Alert.alert('Error', 'Please fill in both the title and description.');
      return;
    }

    const newRef = push(ref(database, 'eventNotices/'));
    set(newRef, {
      eventTitle: newEventTitle,
      eventDescription: newEventDescription,
      timestamp: new Date().toISOString(),
    })
      .then(() => {
        setNewEventTitle('');
        setNewEventDescription('');
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  const renderItem = ({ item }) => (
    <View style={styles.eventItem}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{item.eventTitle}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
      <Text style={styles.eventDescription}>{item.eventDescription}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🔙 Back Arrow Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      <Text style={styles.pageHeader}>Events & Notices</Text>

      {/* Admin Form */}
      {isAdmin && (
        <View style={styles.inputContainer}>
          <Text style={styles.adminHeader}>Add New Notice</Text>
          <TextInput
            style={styles.input}
            placeholder="Event Title"
            value={newEventTitle}
            onChangeText={setNewEventTitle}
          />
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Event Description"
            value={newEventDescription}
            onChangeText={setNewEventDescription}
            multiline
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
            <Text style={styles.addButtonText}>+ Add Event Notice</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.sectionTitle}>Community Notices</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#f1f5f9',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    right: 16,
    backgroundColor: '#3b82f6',
    padding: 8,
    borderRadius: 20,
    zIndex: 2,
  },
  pageHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  adminHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1e293b',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f8fafc',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1e293b',
    paddingLeft: 8,
  },
  listContent: {
    paddingBottom: 100,
  },
  eventItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    marginHorizontal: 8,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
  },
  timestamp: {
    fontSize: 12,
    color: '#6b7280',
  },
  eventDescription: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
});

export default EventsNotices;
