import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Entypo,
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={{
        uri: 'https://www.jagahonline.com/blog/wp-content/uploads/2023/02/BTG-P_02-1024x574.jpg',
      }}
      resizeMode="cover"
      style={styles.bgImage}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Drawer Button */}
      <TouchableOpacity
        style={styles.drawerButton}
        onPress={() => navigation.openDrawer()}
      >
        <Ionicons name="menu" size={28} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f5d']}
          style={styles.headerContainer}
        >
          <Text style={styles.headerText}>
            Welcome to{"\n"}CITY HOUSING SOCIETY
          </Text>
        </LinearGradient>

        {/* Button Cards */}
        <View style={styles.cardContainer}>
          <Animatable.View animation="fadeInUp" delay={100} style={styles.animCard}>
            <HomeCard
              icon={<MaterialIcons name="real-estate-agent" size={24} color="#fff" />}
              label="Property Listings"
              onPress={() => navigation.navigate('PropertyListings')}
            />
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={200} style={styles.animCard}>
            <HomeCard
              icon={<FontAwesome5 name="tools" size={22} color="#fff" />}
              label="Services"
              onPress={() => navigation.navigate('ServicesScreen')}
            />
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={300} style={styles.animCard}>
            <HomeCard
              icon={<Ionicons name="alert-circle" size={24} color="#fff" />}
              label="Complaints"
              onPress={() => navigation.navigate('Complaints')}
            />
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={400} style={styles.animCard}>
            <HomeCard
              icon={<Entypo name="news" size={22} color="#fff" />}
              label="Events & Notices"
              onPress={() => navigation.navigate('EventsNotices')}
            />
          </Animatable.View>

          {/* Centered Chat & Forum */}
          <Animatable.View animation="fadeInUp" delay={500} style={styles.centerCard}>
            <HomeCard
              icon={<Ionicons name="chatbox-ellipses-outline" size={24} color="#fff" />}
              label="Chat & Forum"
              onPress={() => navigation.navigate('ChatForum')}
            />
          </Animatable.View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

// Home Card
const HomeCard = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <LinearGradient colors={['#1e3c72', '#2a5298']} style={styles.cardInner}>
      {icon}
      <Text style={styles.cardText}>{label}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  drawerButton: {
    position: 'absolute',
    top: 45,
    left: 20,
    zIndex: 10,
    backgroundColor: '#3b5998',
    padding: 8,
    borderRadius: 25,
    elevation: 5,
  },
  container: {
    paddingTop: 120,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerContainer: {
    height: 200,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 1,
    lineHeight: 30,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  animCard: {
    width: '48%',
    marginBottom: 20,
  },
  centerCard: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardInner: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  cardText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default HomeScreen;
