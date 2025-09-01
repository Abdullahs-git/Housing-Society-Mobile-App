import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { ref, set } from 'firebase/database';
import { database } from '../config/firebaseConfig';

const ServiceRequest = () => {
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');

  const handleRequestService = () => {
    const serviceRef = ref(database, 'serviceRequests/' + Date.now());
    set(serviceRef, {
      serviceType,
      description
    }).then(() => {
      alert('Service request submitted!');
    });
  };

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input} 
        placeholder="Service Type" 
        value={serviceType} 
        onChangeText={setServiceType} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Description" 
        value={description} 
        onChangeText={setDescription} 
      />
      <Button title="Submit Request" onPress={handleRequestService} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    padding: 16
  },
  input: {
    borderWidth: 1, 
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 5
  }
});

export default ServiceRequest;
