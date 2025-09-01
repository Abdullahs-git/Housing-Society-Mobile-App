import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer'; // Import Drawer Navigator
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

// Screens
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import ForgotPassword from './src/screens/ForgotPassword';
import HomeScreen from './src/screens/HomeScreen';
import Profile from './src/screens/Profile';
import PropertyListings from './src/screens/PropertyListings';
import ServicesScreen from './src/screens/ServicesScreen';
import Complaints from './src/screens/Complaints';
import EventsNotices from './src/screens/EventsNotices';
import ChatForum from './src/screens/ChatForum';
import Plumbers from './src/screens/plumbers';
import Electricians from './src/screens/electricians';
import Booking from './src/screens/Booking';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator(); // Create Drawer Navigator

// Bottom Tab Navigator
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0a84ff',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-circle-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

// Drawer Navigator
function DrawerNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={BottomTabs} />
      <Drawer.Screen name="PropertyListings" component={PropertyListings} />
      <Drawer.Screen name="ServicesScreen" component={ServicesScreen} />
      <Drawer.Screen name="Complaints" component={Complaints} />
      <Drawer.Screen name="EventsNotices" component={EventsNotices} />
      <Drawer.Screen name="ChatForum" component={ChatForum} />
      <Stack.Screen name="Plumbers" component={Plumbers} />
      <Stack.Screen name="Electricians" component={Electricians} />
      <Stack.Screen name="Booking" component={Booking} />
    </Drawer.Navigator>
  );
}

// App Component
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Authentication screens */}
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

          {/* Main App - Drawer Navigator */}
          <Stack.Screen name="MainApp" component={DrawerNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
