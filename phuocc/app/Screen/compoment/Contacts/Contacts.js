import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfigService from '../../../Service/ConfigService';
import ContactService from '../../../Service/ContactService';

function Contacts() {
  const [configs, setConfigs] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const result = await ConfigService.getList();
        if (Array.isArray(result)) {
          setConfigs(result);
        } else {
          console.error("Result is not an array:", result);
          setConfigs([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setConfigs([]);
      }
    })();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const userId = await AsyncStorage.getItem('userId'); // Get user ID from AsyncStorage
    const formDataToSend = {
      user_id: userId, // Use userId here
      title: formData.title,
      content: formData.content,
    };

    try {
      const response = await ContactService.createContact(formDataToSend);
      if (response.data && response.data.message) {
        setResponseMessage(response.data.message);
      } else {
        setResponseMessage('Contact message sent successfully. We will respond soon.');
      }
      setFormData({ title: "", content: "" });
    } catch (error) {
      const errorMessage = error.response && error.response.data
        ? error.response.data.message
        : 'An error occurred while sending the contact message.';
      console.error('Error submitting contact form:', error);
      setResponseMessage(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contactContainer}>
          <Text style={styles.title}>Contact Us</Text>

          <View style={styles.configContainer}>
            {configs && configs.length > 0 ? (
              configs.map((config) => (
                <View key={config.id} style={styles.configCard}>
                  <Text style={styles.configTitle}>Our Contact Information</Text>
                  <Text style={styles.configText}>
                    Feel free to reach out to us through the contact form or by using the details below.
                  </Text>
                  <Text style={styles.configSubtitle}>Address</Text>
                  <Text style={styles.configText}>{config.address}</Text>
                  <Text style={styles.configSubtitle}>Phone</Text>
                  <Text style={styles.configText}>{config.phone}</Text>
                  <Text style={styles.configSubtitle}>Email</Text>
                  <Text style={styles.configText}>{config.email}</Text>
                </View>
              ))
            ) : (
              <Text>No configs found</Text>
            )}
          </View>

          {/* Contact Form Section */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Send Us a Message</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your title"
              value={formData.title}
              onChangeText={(text) => handleInputChange('title', text)}
              required
            />
            <TextInput
              style={styles.textarea}
              placeholder="Enter your message"
              value={formData.content}
              onChangeText={(text) => handleInputChange('content', text)}
              multiline
              numberOfLines={4}
              required
            />
            <Button title="Send Message" onPress={handleSubmit} color="#007BFF" />
            {/* Display response message */}
            {responseMessage && <Text style={styles.responseMessage}>{responseMessage}</Text>}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContainer: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'center',
  },
  contactContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  configContainer: {
    marginBottom: 16,
  },
  configCard: {
    marginBottom: 16,
  },
  configTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  configText: {
    fontSize: 16,
    color: '#4B5563',
  },
  configSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  formContainer: {
    marginTop: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  textarea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  responseMessage: {
    textAlign: 'center',
    marginTop: 16,
    color: 'green',
  },
});

export default Contacts;
