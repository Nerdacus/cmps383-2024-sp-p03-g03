import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';

const SignInScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    if (isFocused) {
      console.log('Reloading login page');
    }
  }, [isFocused]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      const loginResponse = await axios.post('https://selu383-sp24-p03-g03.azurewebsites.net/api/authentication/login', {
        username: username,
        password: password,
      });

      if (loginResponse.status === 200) {
        const userDataResponse = await axios.get('https://selu383-sp24-p03-g03.azurewebsites.net/api/authentication/me');
        setUserData(userDataResponse.data);
        setUsername('');
        setPassword('');
      } else {
        console.error('Login failed');
        setError('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      setError(null);

      const logoutResponse = await axios.post('https://selu383-sp24-p03-g03.azurewebsites.net/api/authentication/logout');
      if (logoutResponse.status === 200) {
        setUserData(null);
        setUsername('');
        setPassword('');
      } else {
        console.error('Logout failed');
        setError('Logout failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await axios.get('https://selu383-sp24-p03-g03.azurewebsites.net/api/authentication/me');
        setUserData(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
          console.log('User is not logged in');
          setUserData(null);
        } else {
          console.error('Error checking if user is logged in:', error);
        }
      }
    };

    checkLoggedIn();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={text => setPassword(text)}
      />
      {userData ? (
        <TouchableOpacity style={styles.button} onPress={handleLogout} disabled={loading}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      )}
      {loading && <ActivityIndicator size="large" color="#10b981" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {userData && (
        <View>
          <Text style={styles.loginText}>Hello {userData.userName}!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d9d9d9',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#10b981',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    color: 'black',
    fontSize: 35,
    fontWeight: 'bold',
  },
});

export default SignInScreen;