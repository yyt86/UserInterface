import React from 'react';
import moment from "moment";
import { Headline, Title  } from 'react-native-paper';
import {StyleSheet, Text, View, ScrollView, TouchableHighlight, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MealCard from './MealCard'
import ActivityCard from './ActivityCard';
import ComparisonView from './ComparisonView';

class TodayView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todayExercises: [],
      todayMeals: [],
      currentDate: new Date(),
      dailyDuration: 0.0,
      dailyCalories: 0.0,
      dailyProtein: 0.0,
      dailyCarbo: 0.0,
      dailyActivity: 0,
      dailyFats: 0.0,
      dailyFoodCal: 0.0,
      accessToken: '',
      activityArray:'',
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

  getMeals(){
    let tempMeals = []
    let todayProteins = 0.0;
    let todayCarbo = 0.0;
    let todayFats = 0.0;
    let todayFoodCal = 0.0;
    fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
      method: 'GET',
      headers: { 'x-access-token': this.state.accessToken }
    })
    .then(res => res.json())
    .then(res => {
      this.setState({todayMeals: []});
      this.setState({dailyProtein: todayProteins})
      this.setState({dailyCarbo: todayCarbo})
      this.setState({dailyFats: todayFats})
      this.setState({dailyFoodCal: todayFoodCal})
      tempMeals = res.meals
      if(tempMeals !== null && (typeof tempMeals !== 'undefined')){
        for(let i = 0; i < tempMeals.length; i++){
        if(moment(tempMeals[i].date).format('DD-MM-YYYY') === moment(this.state.currentDate).format('DD-MM-YYYY')) {
          let meal = tempMeals[i]
          let mealProteins = 0.0;
          let mealCarbo = 0.0;
          let mealFats = 0.0;
          let mealFoodCal = 0.0;
          fetch('https://mysqlcs639.cs.wisc.edu/meals/' + meal.id + '/foods', {
            method: 'GET',
            headers: { 'x-access-token': this.state.accessToken }
          })
          .then(res2 => res2.json())
          .then(res2 => {
            tempMeals[i].foods = res2.foods;
            if(res2.foods !== null && (typeof res2.foods !== 'undefined')){
              for(const food of res2.foods.values()){
                mealProteins += food.protein;
                mealCarbo += food.carbohydrates;
                mealFats += food.fat;
                mealFoodCal += food.calories;
                todayProteins += food.protein;
                todayCarbo += food.carbohydrates;
                todayFats += food.fat;
                todayFoodCal = +food.calories;
              }
            }
            tempMeals[i].mealProteins = mealProteins; 
            tempMeals[i].mealCarbo = mealCarbo; 
            tempMeals[i].mealFats = mealFats; 
            tempMeals[i].mealFoodCal = mealFoodCal;  
            this.setState(prevState => ({
              todayMeals: [...prevState.todayMeals, tempMeals[i]] 
            }))

            this.setState({dailyProtein: todayProteins})
            this.setState({dailyCarbo: todayCarbo})
            this.setState({dailyFats: todayFats})
            this.setState({dailyFoodCal: todayFoodCal})
          })
        }
        }
      }
    })
    .catch(err =>{console.log(err)});
  }
    
  displayMeals(){
    let cardList = [];
    for (let i = 0; i < this.state.todayMeals.length; i++){
      let value = this.state.todayMeals[i];
      let currentDate = moment(value.date).format("MMMM D, YYYY");
      cardList.push(
      <MealCard key={i} name={value.name} date={value.date}
                food={value.food} mealProteins={value.mealProteins}
                id={value.id} accessToken={this.state.accessToken}
                mealCarbo={value.mealCarbo} mealFats={value.mealFats}
                mealFoodCal={value.mealFoodCal} foods={value.foods}
              todaymode = {true} mealmode={false}/>)}
    return cardList;
  }

  getExercises(){
    let todayDuration = 0;
    let todarCalorie = 0;
    fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
      method: 'GET',
      headers: { 'x-access-token': this.state.accessToken }
    })
    .then(res => res.json())
    .then(res => {
      this.setState({todayExercises: []});
      this.setState({dailyDuration: todayDuration})
      this.setState({dailyCalories: todarCalorie})
      if(res.activities !== null && (typeof res.activities !== 'undefined')){
        for(const activity of res.activities.values()){
          if(moment(activity.date).format("MMM Do YY") === moment(this.state.currentDate).format("MMM Do YY")) {
            this.setState(prevState => ({
                todayExercises: [...prevState.todayExercises, activity] 
            }));
            todayDuration += activity.duration;
            todarCalorie += activity.calories;
            this.setState({dailyDuration: todayDuration})
            this.setState({dailyCalories: todarCalorie})
          }
        }
      }
    });
  }



  displayExercises(){
    let cardList = [];
    for (let i = 0; i < this.state.todayExercises.length; i++){
      let value = this.state.todayExercises[i];
      cardList.push(<ActivityCard key={i} name={value.name} date={value.date}
                  duration={value.duration} calories={value.calories}
                  id={value.id} accessToken={this.state.accessToken}
                  todaymode = {true} mealmode={false}/>)
    }
    return cardList;
  }

  showModal = () => this.setState({visible: true});
  hideModal = () => this.setState({visible: false});
  getModal(){
    if(this.state.visible){
        return(
          <ComparisonView visible={this.state.visible} dailyDuration={this.state.dailyDuration}
            dailyCalories={this.state.dailyCalories} dailyProtein={this.state.dailyProtein}
            dailyCarbo={this.state.dailyCarbo} dailyFats={ this.state.dailyFats}
            dailyFoodCal={this.state.dailyFoodCal} hideModal={this.hideModal}/>
        )
    }
  }

  async componentDidMount() {
    await this.getStoredData("accessToken");
    await this.getStoredData("username");
    this.getExercises();
    this.getMeals();
  
    this.navListener = this.props.navigation.addListener('focus', () => {
      this.getExercises();
      this.getMeals();
    });
  }

  componentWillUnmount() {
    this.navListener();
  }


  render() {
    return (
      <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }} keyboardShouldPersistTaps='handled'>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Icon name="calendar-day" size={40} color="#900" style={{ marginRight: 20 }} />
          <Text style={styles.bigText}>Today</Text>
        </View>
        <Headline style = {{fontWeight: '600', color:'#900', fontSize:16} }>{moment(new Date()).format('YYYY/MM/DD, h:mm:ss a')}</Headline>
        <View style={styles.space} />
      
          <View>
              <Text style = {{fontWeight: '700',  fontSize:20} }> Exercises</Text>
              <View style={styles.spaceSmall} />
              {this.displayExercises()}
              <View style={styles.space} />
              <Title  style = {{fontWeight: '700',  fontSize:20} }> Meals</Title>
              {this.displayMeals()}
          </View>
          <View style={styles.space} />
          <TouchableHighlight
            style={styles.openButton}
            onPress={this.showModal}
          >
            <Text style={styles.textStyle}>SHOW PERFORMANCE</Text>
        </TouchableHighlight>
        {this.getModal()}
      </ScrollView>
      )
    }
}

const styles = StyleSheet.create({
  scrollView: {
    height: Dimensions.get('window').height
  },
  mainContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  spaceSmall: {
    width: 20,
    height: 10,
  },
  space: {
    width: 20,
    height: 20,
  },

  bigText: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 5
  },

  
  opacity:{
    height: 30,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width *0.8,
    backgroundColor: '#900',
  },

  openButton: {
    backgroundColor: "#900",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});

export default TodayView;