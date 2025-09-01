import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { ref, onValue, push, remove, update } from 'firebase/database';
import { database } from '../config/firebaseConfig.js';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const ChatForum = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [editId, setEditId] = useState(null);
  const [visibleActions, setVisibleActions] = useState({});
  const lastTapRef = useRef({});

  useEffect(() => {
    const auth = getAuth();
    setCurrentUser(auth.currentUser);

    const messagesRef = ref(database, 'chatMessages/');
    onValue(messagesRef, snapshot => {
      const data = snapshot.val();
      const messageList = data
        ? Object.keys(data).map(key => ({ ...data[key], id: key }))
        : [];
      setMessages(messageList.reverse());
    });
  }, []);

  const handleSendMessage = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert('You must be logged in to send messages.');
      return;
    }

    const messagesRef = ref(database, 'chatMessages/');

    if (editId) {
      const editRef = ref(database, `chatMessages/${editId}`);
      update(editRef, { message });
      setEditId(null);
    } else {
      push(messagesRef, {
        message,
        sender: user.email || 'Anonymous',
      });
    }

    setMessage('');
  };

  const handleEdit = item => {
    setMessage(item.message);
    setEditId(item.id);
  };

  const handleDelete = id => {
    const messageRef = ref(database, `chatMessages/${id}`);
    remove(messageRef);
  };

  const handleDoubleTap = id => {
    const now = Date.now();
    const timeDiff = now - (lastTapRef.current[id] || 0);

    if (timeDiff < 300) {
      setVisibleActions(prev => ({
        ...prev,
        [id]: !prev[id],
      }));
    }

    lastTapRef.current[id] = now;
  };

  const renderMessageItem = ({ item }) => {
    const isCurrentUser = currentUser && item.sender === currentUser.email;
    const showActions = visibleActions[item.id];

    return (
      <TouchableWithoutFeedback onPress={() => handleDoubleTap(item.id)}>
        <View
          style={[
            styles.messageItem,
            isCurrentUser ? styles.myMessage : styles.otherMessage,
          ]}
        >
          {!isCurrentUser && (
            <Text style={styles.sender}>{item.sender || 'Unknown'}:</Text>
          )}
          <Text style={styles.messageText}>{item.message}</Text>

          {isCurrentUser && showActions && (
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.editBtn}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteBtn}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      {/* Drawer Menu - Top Left */}
      <TouchableOpacity
        style={styles.drawerButton}
        onPress={() => navigation.openDrawer()}
      >
        <Ionicons name="menu" size={28} color="white" />
      </TouchableOpacity>

      {/* Back Arrow - Top Right */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessageItem}
        inverted
        contentContainerStyle={{ paddingTop: 60 }}
      />
      <TextInput
        style={styles.input}
        placeholder="Type a message"
        value={message}
        onChangeText={setMessage}
      />
      <Button
        title={editId ? 'Update Message' : 'Send Message'}
        onPress={handleSendMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#f5f5f5',
  },
  drawerButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 1,
    backgroundColor: '#007BFF',
    borderRadius: 50,
    padding: 8,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    right: 15,
    zIndex: 1,
    backgroundColor: '#10b981',
    borderRadius: 50,
    padding: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  messageItem: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#87CEEB',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },
  sender: {
    fontWeight: 'bold',
    color: '#2e2e2e',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  editBtn: {
    marginRight: 10,
    color: '#0a84ff',
    fontWeight: 'bold',
  },
  deleteBtn: {
    color: '#ff3b30',
    fontWeight: 'bold',
  },
});

export default ChatForum;
