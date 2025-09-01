import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const PropertyListings = ({ navigation }) => {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const propertiesRef = ref(database, 'mainproperties/');
        onValue(propertiesRef, snapshot => {
            const data = snapshot.val();
            const propertyList = data ? Object.keys(data).map(key => ({ ...data[key], id: key })) : [];
            setProperties(propertyList);
        });
    }, []);

    const formatPrice = (price) => {
        return `PKR ${price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''}`;
    };

    const renderItem = ({ item }) => (
        <View style={styles.propertyCard}>
            <View style={[styles.statusTag, { backgroundColor: item.status === 'Sale' ? '#4CAF50' : '#3498db' }]}>
                <Text style={styles.statusText}>{item.status}</Text>
            </View>

            <View style={styles.propertyContent}>
                <Text style={styles.propertyTitle}>{item.title}</Text>
                <Text style={styles.propertyType}>{item.type}</Text>
                <Text style={styles.propertyLocation}>{item.location}</Text>
                <Text style={styles.propertyPrice}>{formatPrice(item.price)}</Text>

                <View style={styles.propertyFeatures}>
                    <Text style={styles.featureText}>{item.area} Sqft</Text>
                    <Text style={styles.featureText}>{item.bedrooms} Beds</Text>
                    <Text style={styles.featureText}>{item.bathrooms} Baths</Text>
                </View>

                <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={() => alert('Contacting Seller')}>
                    <Text style={styles.buttonText}>Contact Seller</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Navigation Buttons */}
            <View style={styles.topButtons}>
                <TouchableOpacity 
                    style={styles.drawerButton} 
                    onPress={() => navigation.openDrawer()}>
                    <Ionicons name="menu" size={28} color="white" />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
            </View>

            {/* Property List */}
            <FlatList
                data={properties}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    topButtons: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    drawerButton: {
        backgroundColor: 'rgba(52, 152, 219, 0.9)',
        borderRadius: 20,
        padding: 8,
    },
    backButton: {
        backgroundColor: 'rgba(52, 152, 219, 0.9)',
        borderRadius: 20,
        padding: 8,
    },
    listContainer: {
        padding: 16,
        paddingTop: 100, // Leaves space for buttons
    },
    propertyCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    statusTag: {
        position: 'absolute',
        top: 15,
        right: 15,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        zIndex: 1,
    },
    statusText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700',
    },
    propertyContent: {
        padding: 20,
    },
    propertyTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#2c3e50',
        marginBottom: 4,
    },
    propertyType: {
        fontSize: 16,
        color: '#7f8c8d',
        marginBottom: 4,
    },
    propertyLocation: {
        fontSize: 16,
        color: '#3498db',
        marginBottom: 12,
        fontWeight: '600',
    },
    propertyPrice: {
        fontSize: 20,
        fontWeight: '800',
        color: '#e74c3c',
        marginBottom: 16,
    },
    propertyFeatures: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    featureText: {
        fontSize: 15,
        color: '#34495e',
        fontWeight: '600',
    },
    contactButton: {
        backgroundColor: '#2ecc71',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
});

export default PropertyListings;
