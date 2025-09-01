import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { ref, get } from 'firebase/database';
import { database } from '../config/firebaseConfig';

const { width } = Dimensions.get('window');

const ServicesScreen = () => {
  const [servicesData, setServicesData] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [animation] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesRef = ref(database, '/services');
        const snapshot = await get(servicesRef);
        if (snapshot.exists()) {
          const val = snapshot.val();
          const data = Object.entries(val).map(([serviceKey, providers]) => {
            const categoriesSet = new Set();
            Object.values(providers).forEach(provider => {
              if (provider.services) {
                Object.keys(provider.services).forEach(cat => categoriesSet.add(cat));
              }
            });
            return {
              key: serviceKey,
              name: serviceKey === 'electrician' ? 'Electrical Service' : 'Plumbing Service',
              icon: serviceKey === 'electrician' ? 'bolt' : 'wrench',
              categories: Array.from(categoriesSet).map((cat, idx) => ({
                id: idx.toString(),
                name: cat,
              })),
            };
          });
          setServicesData(data);
        }
      } catch (e) {
        console.error('Error fetching servicesData:', e);
        Alert.alert('Error', 'Unable to load services. Please try again.');
      }
    };
    fetchServices();
  }, []);

  const handleServicePress = (serviceName) => {
    setSelectedService(serviceName);
    animation.setValue(0);
    Animated.timing(animation, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const renderService = ({ item }) => (
    <TouchableOpacity style={styles.serviceCard} onPress={() => handleServicePress(item.name)}>
      <Icon name={item.icon} size={28} color="#fff" style={styles.icon} />
      <Text style={styles.serviceName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => {
    const parentService = servicesData.find(s => s.name === selectedService);
    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => {
          const svcType = parentService?.key;
          if (svcType === 'plumber') {
            navigation.navigate('Plumbers', {
              selectedCategory: item,
              serviceType: selectedService,
            });
          } else if (svcType === 'electrician') {
            navigation.navigate('Electricians', {
              selectedCategory: item,
              serviceType: selectedService,
            });
          } else {
            Alert.alert('Error', 'No screen available for this category.');
          }
        }}
      >
        <Text style={styles.categoryName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const selectedServiceData = servicesData.find(service => service.name === selectedService);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A192F" />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Explore Our Services</Text>

      <FlatList
        data={servicesData}
        renderItem={renderService}
        keyExtractor={item => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.serviceList}
      />

      {selectedService && selectedServiceData && (
        <Animated.View
          style={[
            styles.categoryContainer,
            {
              opacity: animation,
              transform: [{
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              }],
            },
          ]}
        >
          <Text style={styles.categoryTitle}>{selectedService} Categories</Text>

          <FlatList
            data={selectedServiceData.categories}
            renderItem={renderCategory}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.categoryList}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    backgroundColor: '#1E3A8A',
    padding: 8,
    borderRadius: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  serviceList: {
    paddingVertical: 10,
  },
  serviceCard: {
    backgroundColor: '#1E3A8A',
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 15,
    marginRight: 15,
    alignItems: 'center',
    width: width * 0.45,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  icon: {
    marginBottom: 12,
  },
  serviceName: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryContainer: {
    marginTop: 25,
    paddingBottom: 20,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00C9A7',
    marginBottom: 15,
    textAlign: 'center',
  },
  categoryList: {
    paddingHorizontal: 10,
  },
  categoryCard: {
    backgroundColor: '#00B894',
    borderRadius: 18,
    padding: 20,
    margin: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ServicesScreen;
