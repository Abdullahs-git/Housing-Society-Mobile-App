import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ref, get } from 'firebase/database';
import { database } from '../config/firebaseConfig';

const Plumbers = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { selectedCategory, selectedService } = route.params;
  const [plumbers, setPlumbers] = useState([]);

  useEffect(() => {
    const fetchPlumbers = async () => {
      try {
        const plumbersRef = ref(database, '/services/plumber');
        const snapshot = await get(plumbersRef);

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
          setPlumbers(filtered);
        }
      } catch (error) {
        console.error('Error fetching plumbers:', error);
      }
    };

    fetchPlumbers();
  }, [selectedCategory.name]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>
        {selectedCategory.name} - {selectedService}
      </Text>

      <FlatList
        data={plumbers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.profileCard}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.detail}>Experience: {item.experience}</Text>
              <Text style={styles.detail}>Contact: {item.contact}</Text>
              <Text style={styles.detail}>Service: {selectedCategory.name}</Text>
              <Text style={styles.rate}>Rs {item.rate}</Text>

              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() =>
                  navigation.navigate('Booking', {
                    providerName: item.name,
                    contact: item.contact,
                    price: item.rate,
                  })
                }
              >
                <Text style={styles.bookText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F',
    padding: 10,
  },
  backButton: {
    marginTop: 50,
    marginBottom: 10,
    marginLeft: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 8,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 15,
  },
  profileCard: {
    backgroundColor: '#1E3A8A',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  detail: {
    color: '#bdc3c7',
    fontSize: 14,
    marginTop: 2,
  },
  rate: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  bookBtn: {
    marginTop: 10,
    backgroundColor: '#2ecc71',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  bookText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Plumbers;
