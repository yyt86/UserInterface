import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import base64 from 'base-64';
import AsyncStorage from '@react-native-community/async-storage';

class LoginView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      accessToken: ""
    }

    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }

  /**
   * Logs in to the application.
   * 
   * Note that we have to follow the authorization rules; a header
   * with a base64-encoded username and password.
   * 
   * Upon response, we analyze whether or not we are successful.
   * If successful, we use a callback from App to log us in and
   * store the username and token in App.
   */
  handleLogin() {
    fetch('https://mysqlcs639.cs.wisc.edu/login', {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + base64.encode(this.state.username + ":" + this.state.password)
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.token) {
          AsyncStorage.setItem('accessToken',  res.token);
          AsyncStorage.setItem('username', this.state.username);
          // console.log(res);
          // console.log(res.token)
          this.props.login(this.state.username, res.token);
        } else {
          alert("Incorrect username or password! Please try again.");
        }
      });
  }

  /**
   * Use React Navigation to switch to the Sign Up page.
   */
  handleSignup() {
    this.props.navigation.navigate('SignUp');
  }

  /**
   * Displays and collects the login information.
   * 
   * The styling could definitely be cleaned up; should be consistent!
   */
  render() {
    return (
      <View style={styles.container} accessible={true}>
        <Text style={styles.bigText}>FitnessTracker</Text>
        <Text>Welcome! Please login or signup to continue.</Text>
        <View style={styles.space} />
        <View accessible={true}>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Username</Text>
        </View>
        <TextInput style={styles.input}
        // secureTextEntry={true}
         accessible={true}
            accessibilityLabel={"Please input your username"}
            accessibilityHint={"Swipe down to input your password"}
          underlineColorAndroid="transparent"
          // placeholder="Username"
          // defaultValue = "Username"
          // placeholderTextColor="#992a20"
          onChangeText={(username) => this.setState({ username: username })}
          value={this.state.username}
          autoCapitalize="none" />
          <View accessible={true}>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Password</Text>
        </View>
        <TextInput style={styles.input}
        accessible={true}
            accessibilityLabel={"Please input your password"}
            accessibilityHint={"Swipe left down to click login button and right down to sign up"}
          secureTextEntry={true}
          underlineColorAndroid="transparent"
          // placeholder="Password"
          // placeholderTextColor="#992a20"
          onChangeText={(password) => this.setState({ password: password })}
          value={this.state.password}
          autoCapitalize="none" />
        <View style={styles.space} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {/* <TouchableOpacity  style={styles.button} title="Login" accessible={true}
            accessibilityLabel={"welcome back" + this.state.username}
            accessibilityHint={"You will nevigate to the profile page"} onPress={this.handleLogin} >
            <Text style={{fontSize:16, fontWeight: "700", color:"#fff"}}>LOGIN</Text>
        </TouchableOpacity> */}
        <Button color="#942a21" style={styles.buttonInline}  accessible={true}
            accessibilityLabel={"welcome back" + this.state.username}
            accessibilityHint={"You will nevigate to the profile page"} title="login" onPress={this.handleLogin} />
          <View style={styles.spaceHorizontal} />
          <Button color="#942a21" style={styles.buttonInline}  accessible={true}
            accessibilityLabel={"welcome to fitness track app"}
            accessibilityHint={"You will nevigate to the sign up page"}  title="Signup" onPress={this.handleSignup} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigText: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 5
  },
  space: {
    width: 20,
    height: 20,
  },
  spaceHorizontal: {
    display: "flex",
    width: 20
  },
  buttonInline: {
    display: "flex"
  },
  input: {
    width: 200,
    padding: 10,
    margin: 5,
    height: 40,
    borderColor: '#c9392c',
    borderWidth: 1
  },

  button: {
    // alignItems: "center",
    display: "flex",
    // backgroundColor: "#DDDDDD",
    width: 80,
    height: 40,
    padding: 10,
    backgroundColor:"#942a21"
  },
});

export default LoginView;
