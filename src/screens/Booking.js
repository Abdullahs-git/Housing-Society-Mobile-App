import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Linking,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { database } from '../config/firebaseConfig';
import { ref, set, get } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons';

const Booking = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const {
    providerName = '',
    contact = '',
    price = '',
    serviceType = '',
  } = route.params || {};

  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleBooking = async () => {
    if (!customerName.trim() || !customerContact.trim() || !customerAddress.trim()) {
      Alert.alert('Missing Info', 'Please enter all fields (Name, Contact, Address).');
      return;
    }

    const bookingDate = date.toISOString().split('T')[0];
    const bookingTime = time.toTimeString().split(' ')[0];
    const slotPath = `bookings/${bookingDate}/${bookingTime.replace(/:/g, '-')}`;

    try {
      const snapshot = await get(ref(database, slotPath));
      if (snapshot.exists()) {
        Alert.alert('Time Slot Taken', 'Please choose a different time.');
        return;
      }

      await set(ref(database, slotPath), {
        provider: providerName,
        service: serviceType,
        customer: customerName,
        customerContact,
        address: customerAddress,
        date: bookingDate,
        time: bookingTime,
        timestamp: Date.now(),
      });

      const whatsappMessage = `Dear ${providerName},\nYou have been booked by ${customerName} for ${serviceType} on ${bookingDate} at ${bookingTime}.\nAddress: ${customerAddress}`;
      const phone = contact.startsWith('+') ? contact : `+92${contact}`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`;
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', 'Could not open WhatsApp.');
      });

      Alert.alert('Success', 'Your booking has been confirmed.');
    } catch (err) {
      console.error(err);
      Alert.alert('Booking Error', 'Something went wrong. Try again later.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#1E3A8A" />
      </TouchableOpacity>

      <Text style={styles.header}>Book {providerName}</Text>

      <Text style={styles.label}>Your Name</Text>
      <TextInput
        style={styles.input}
        value={customerName}
        onChangeText={setCustomerName}
        placeholder="Full Name"
      />

      <Text style={styles.label}>Your Contact</Text>
      <TextInput
        style={styles.input}
        value={customerContact}
        onChangeText={setCustomerContact}
        placeholder="e.g. 03001234567"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Your Address</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={customerAddress}
        onChangeText={setCustomerAddress}
        placeholder="Street, City, etc."
        multiline
      />

      <Text style={styles.label}>Select Date</Text>
      {Platform.OS === 'web' ? (
        <TextInput
          style={styles.input}
          value={date.toISOString().split('T')[0]}
          onChangeText={(text) => setDate(new Date(text))}
          placeholder="YYYY-MM-DD"
        />
      ) : (
        <>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.selectBtn}>
            <Text>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(e, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </>
      )}

      <Text style={styles.label}>Select Time</Text>
      {Platform.OS === 'web' ? (
        <TextInput
          style={styles.input}
          value={time.toTimeString().split(' ')[0]}
          onChangeText={(text) => {
            const now = new Date();
            const [h, m] = text.split(':');
            now.setHours(h, m);
            setTime(new Date(now));
          }}
          placeholder="HH:MM"
        />
      ) : (
        <>
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.selectBtn}>
            <Text>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={(e, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) setTime(selectedTime);
              }}
            />
          )}
        </>
      )}

      <TouchableOpacity onPress={handleBooking} style={styles.bookBtn}>
        <Text style={styles.bookText}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Booking;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F6F8',
    padding: 20,
    paddingBottom: 60,
  },
  backBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 60,
  },
  label: {
    marginTop: 15,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 6,
  },
  selectBtn: {
    backgroundColor: '#fff',
    padding: 12,
    marginTop: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  bookBtn: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  bookText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
