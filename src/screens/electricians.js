import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ref, get } from 'firebase/database';
import { database } from '../config/firebaseConfig';

const Electricians = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedCategory, selectedService } = route.params;
  const [electricians, setElectricians] = useState([]);

  useEffect(() => {
    const fetchElectricians = async () => {
      try {
        const electriciansRef = ref(database, '/services/electrician');
        const snapshot = await get(electriciansRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const filtered = Object.entries(data)
            .filter(([_, value]) => {
              const services = value.services || {};
              return Object.keys(services).includes(selectedCategory.name);
            })
            .map(([key, value]) => ({
              id: key,
              ...value,
              rate: value.services[selectedCategory.name]?.price || '',
            }));
          setElectricians(filtered);
        }
      } catch (error) {
        console.error('Error fetching electricians:', error);
      }
    };

    fetchElectricians();
  }, [selectedCategory.name]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.detail}>Contact: {item.contact}</Text>
        <Text style={styles.detail}>Experience: {item.experience}</Text>
        <Text style={styles.detail}>Service: {selectedCategory.name}</Text>
        <Text style={styles.rate}>Rs {item.rate}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('Booking', {
              providerName: item.name,
              contact: item.contact,
              price: item.rate,
            })
          }
        >
          <Text style={styles.buttonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={22} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Available Electricians for {selectedCategory.name}</Text>

      <FlatList
        data={electricians}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F',
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: '#1E3A8A',
    padding: 8,
    borderRadius: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#1E3A8A',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detail: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 5,
  },
  rate: {
    color: '#00FF99',
    fontWeight: 'bold',
    marginTop: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#00C853',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Electricians;
