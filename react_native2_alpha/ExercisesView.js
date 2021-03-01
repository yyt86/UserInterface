import React from 'react';
import moment from "moment";
import { FAB } from 'react-native-paper';
import {StyleSheet, Text, View, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ActivityCard from './ActivityCard';
import AddActivity from './AddActivity';


class ExercisesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      duration: 0.0,
      date: "",
      calories: 0.0,
      activityArray: [],
      accessToken: "",
      username: "",
      visible: false,
    }
  }

  async getStoredData(key){
    try{
        let value = await AsyncStorage.getItem(key);
        this.setState({[key]: value});
      } catch (error) {
        console.log(error);
      }
  }

  deleteExercise(id){
    fetch('https://mysqlcs639.cs.wisc.edu/activities/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.state.accessToken
      },
    })
      .then(res => res.json())
      .then(res => {
        this.updateData();
        alert("Exercise is deleted!");
      })
      .catch(err => {
        alert("Something went wrong! ");
      });
  }

  hideModal = () => this.setState({visible: false});
  handleAddActivity(){
    this.setState({visible: true});
  }

  getModal(){
    if(this.state.visible){
      return(
        <AddActivity visible={this.state.visible} updateData = {() =>this.updateData() } hideModal={this.hideModal} accessToken={this.state.accessToken} />
      )
    }
  }

  updateData(){
    fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
      method: 'GET',
      headers: { 'x-access-token': this.state.accessToken }
    })
      .then(res => res.json())
      .then(res => {
        // console.log(res, "res")
        this.setState({activityArray:  res.activities});
        this.getExercises();
      })
      .catch(err =>{console.log(err)});
  }

  getExercises(){
    let cardList = [];
    for (let i = 0; i < this.state.activityArray.length; i++){
      let value = this.state.activityArray[i];
      cardList.push(<ActivityCard key={i} name={value.name} date={value.date}
                        duration={value.duration} calories={value.calories}
                        id={value.id} accessToken={this.state.accessToken}
                        deleteExercise = {(id)=>this.deleteExercise(id)} 
                      updateData = {() =>this.updateData() }
                        todaymode = {false} mealmode={true}/>)
    }
    return cardList;
  }
   

  async componentDidMount() {
      await this.getStoredData("accessToken");
      await this.getStoredData("username");
      this.updateData();
      this.navListener = this.props.navigation.addListener('focus', () => {
        this.updateData();
      });
    }
  
  componentWillUnmount() {
    this.navListener();
  }

  render() {
     
        return (
        <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }} 
        keyboardShouldPersistTaps='handled'  >
          <View style={styles.space} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }} accessible={true}
            accessibilityLabel={"Exercises title"}
            accessibilityHint={"Show activity info"}>
            <Icon name="walking" size={40} color="#900" style={{ marginRight: 20 }} />
            <Text style={styles.bigText}>Exercises</Text>
          </View>
          <View style={styles.spaceSmall}></View>
          <Text>Let's get to work!</Text>
          <Text>Record your exercises below.</Text>
      
          <FAB
            icon="plus"
            medium
            style={styles.fab}
            onPress={() => this.handleAddActivity()}
          />
          {this.getModal()}
          <View>{this.getExercises()}</View>
      </ScrollView>)
    }
}

const styles = StyleSheet.create({
    scrollView: {
        height: Dimensions.get('window').height
      },
      mainContainer: {
        flex: 1
      },
      scrollViewContainer: {},
      container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      bigText: {
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 5
      },
      spaceSmall: {
        width: 20,
        height: 10,
      },
      space: {
        width: 20,
        height: 20,
      },
      buttonInline: {
        display: "flex"
      },

      fab: {
        alignSelf: 'flex-end',
        position: 'absolute',
        top: 55,
        right: 15,
        backgroundColor: '#900',
     },
      
});

export default ExercisesView;
