import React from 'react';

import LoginView from './LoginView';
import SignupView from './SignupView';

import TodayView from './TodayView'
import ExercisesView from './ExercisesView'
import MealsView from './MealsView'
import FoodsView from './FoodsView'
import ProfileView from './ProfileView'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { TouchableOpacity,  View } from 'react-native';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      accessToken: undefined,
      username: undefined,
      activityArray: []
    }

    this.login = this.login.bind(this);
    this.revokeAccessToken = this.revokeAccessToken.bind(this);

    this.SignoutButton = this.SignoutButton.bind(this);
  }

  /**
   * Store the username and accessToken here so that it can be
   * passed down to each corresponding child view.
   */
  login(username, accessToken) {
    this.setState({
      username: username,
      accessToken: accessToken
    });
  }

  /**
   * Revokes the access token, effectively signing a user out of their session.
   */
  revokeAccessToken() {
    this.setState({
      accessToken: undefined
    });
  }


  /**
   * Defines a signout button... Your first TODO!
   */
  SignoutButton = () => {
    return <>
      <View style={{ flexDirection: 'row', marginRight: 25 }}>
        <TouchableOpacity accessible={true}
            accessibilityLabel={"You will log out"}
            accessibilityHint={"You will navigate to the log in page"} onPress={() => this.setState({
      accessToken: undefined
    })}>
          {/* <Text> X</Text> */}
          <Ionicons name='ios-log-out' size={25} color='black' />
        </TouchableOpacity>
      </View>
    </>
  }

 

  /**
   * Note that there are many ways to do navigation and this is just one!
   * I chose this way as it is likely most familiar to us, passing props
   * to child components from the parent.
   * 
   * Other options may have included contexts, which store values above
   * (similar to this implementation), or route parameters which pass
   * values from view to view along the navigation route.
   * 
   * You are by no means bound to this implementation; choose what
   * works best for your design!
   */
  render() {

    // Our primary navigator between the pre and post auth views
    // This navigator switches which screens it navigates based on
    // the existent of an access token. In the authorized view,
    // which right now only consists of the profile, you will likely
    // need to specify another set of screens or navigator; e.g. a
    // list of tabs for the Today, Exercises, and Profile views.
    let AuthStack = createStackNavigator();
   

    return (
      <NavigationContainer>
        <AuthStack.Navigator>
          {!this.state.accessToken ? (
            <>
              <AuthStack.Screen
                name="SignIn"
                options={{
                  title: 'Fitness Tracker Welcome',
                }}
              >
                {(props) => <LoginView {...props} login={this.login} />}
              </AuthStack.Screen>

              <AuthStack.Screen
                name="SignUp"
                options={{
                  title: 'Fitness Tracker Signup',
                }}
              >
                {(props) => <SignupView {...props} />}
              </AuthStack.Screen>
            </>
          ) : (
              <>
                <AuthStack.Screen name="FitnessTracker" options={{
                  headerRight: this.SignoutButton
                }}>
                  {/* {(props) => <ProfileView {...props} username={this.state.username} accessToken={this.state.accessToken} revokeAccessToken={this.revokeAccessToken} />} */}
                  {(props) => <CreateTabNavigation />} 
                </AuthStack.Screen>

              </>

            )}
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }
}

const TodayStack = createStackNavigator();
function CreateTodayStack() {
    return (
      <TodayStack.Navigator
        initialRouteName="Today"
        screenOptions={{
          gestureEnabled: false,
        }}>
        <TodayStack.Screen name="Today"  
        component={TodayView} options={{}} />
       
      </TodayStack.Navigator>
    );
  }
  
const ExerciseStack = createStackNavigator();
function CreateExerciseStack() {
    return (
      <ExerciseStack.Navigator
        initialRouteName="Exercises"
        screenOptions={{ gestureEnabled: false }}>
        <ExerciseStack.Screen
          name="Exercises"
          component={ExercisesView}
          options={{}}
        />
      </ExerciseStack.Navigator>
    );
  }

  const MealStack = createStackNavigator();
function CreateMealStack() {
    return (
      <MealStack.Navigator
        initialRouteName="Meal"
        screenOptions={{ gestureEnabled: false }}>
        <MealStack.Screen
          name="Meal"
          component={MealsView}
          options={{}}
        />
        <MealStack.Screen
          name="Food"
          component={FoodsView}
          initialParams={{}}
        />
      </MealStack.Navigator>
    );
  }

const  ProfileStack = createStackNavigator();
function  CreateProfileStack() {
    return (
      <ProfileStack.Navigator
        initialRouteName="Profile"
        screenOptions={{ gestureEnabled: false }}>
        <ProfileStack.Screen
          name="Profile"
          component={ProfileView}
          options={{}}
        />
      </ProfileStack.Navigator>
    );
  }

const TabNavigation = createBottomTabNavigator();
function CreateTabNavigation() {
    return (
      <TabNavigation.Navigator
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}>
        <TabNavigation.Screen
          name="Today"
          component={CreateTodayStack}
          options={{
            tabBarLabel: 'Today',
            tabBarIcon: ({ focused, tintColor }) => {
              let iconName = 'md-today';//`md-home${focused ? '' : '-outline'}`;
              return <Ionicons name={iconName} size={25} color={tintColor} />;
            },
            tabBarOptions: {
              activeTintColor: 'tomato',
              inactiveTintColor: 'gray',
            },
            animationEnabled: true,
          }}
        />
        <TabNavigation.Screen
          name="Exercises"
          component={CreateExerciseStack}
          focusable={true}
        accessibilityLabel="Exercises list"
        accessibilityHint="Show exercises info"
          options={{
            tabBarLabel: 'Exercises',
            tabBarIcon: ({ focused, tintColor }) => {
              let iconName = 'md-walk'; //${focused ? '' : '-outline'}`;
              return <Ionicons name={iconName} size={25} color={tintColor} />;
            },
            tabBarOptions: {
              activeTintColor: 'tomato',
              inactiveTintColor: 'gray',
            },
            animationEnabled: true,
          }}
        />
  <TabNavigation.Screen
          name="Meals"
          component={CreateMealStack}
          focusable={true}
        accessibilityLabel="Meals list"
        accessibilityHint="Show meals info"
          options={{
            tabBarLabel: 'Meals',
            tabBarIcon: ({ focused, tintColor }) => {
              let iconName = 'md-nutrition'; //${focused ? '' : '-outline'}`;
              return <Ionicons name={iconName} size={25} color={tintColor} />;
            },
            tabBarOptions: {
              activeTintColor: 'tomato',
              inactiveTintColor: 'gray',
            },
            animationEnabled: true,
          }}
        />
        <TabNavigation.Screen
          name="Me"
          component={CreateProfileStack} 
          focusable={true}
        accessibilityLabel="User profile"
        accessibilityHint="Show user profile"
          options={{
            tabBarLabel: 'Me',
            tabBarIcon: ({ focused, tintColor }) => {
              let iconName = 'md-person';//${focused ? '' : '-outline'}`;
              return <Ionicons name={iconName} size={25} color={tintColor} />;
            },
            tabBarOptions: {
              activeTintColor: 'tomato',
              inactiveTintColor: 'gray',
            },
            animationEnabled: true,
          }}
        />
      </TabNavigation.Navigator>
    );
  }

export default App;
