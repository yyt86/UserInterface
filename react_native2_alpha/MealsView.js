import React from 'react';
import { FAB } from 'react-native-paper';
import {StyleSheet, Text, View,  ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MealCard from './MealCard';
import AddMeal from './AddMeal';

class MealView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        name: "",
        date: "",
        foodArray:[],
        mealArray: [],
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

  deleteMeal(id){
    fetch('https://mysqlcs639.cs.wisc.edu/meals/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.state.accessToken
      },
    })
      .then(res => res.json())
      .then(res => {
        alert("Meal has been deleted!");
        this.updateData();
      })
      .catch(err => {
        alert("Something went wrong! ");
      });
  }

  hideModal = () => this.setState({visible: false});
  handleAddMeal(){
      this.setState({visible: true});
  }

  getModal(){
    if(this.state.visible){
      return(
        <AddMeal visible={this.state.visible} updateData = {() =>this.updateData() } hideModal={this.hideModal} accessToken={this.state.accessToken} />
      )
    }
  }


  updateData(){
    let tempMeals = []
      fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
        method: 'GET',
        headers: { 'x-access-token': this.state.accessToken }
      })
      .then(res => res.json())
      .then(res => {
        this.setState({mealArray: []});
        tempMeals = res.meals
        if(tempMeals !== null && (typeof tempMeals !== 'undefined')){
          for(let i = 0; i < tempMeals.length; i++){
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
                }
              }
              tempMeals[i].mealProteins = mealProteins; 
              tempMeals[i].mealCarbo = mealCarbo; 
              tempMeals[i].mealFats = mealFats; 
              tempMeals[i].mealFoodCal = mealFoodCal;  
              this.setState(prevState => ({
                mealArray: [...prevState.mealArray, tempMeals[i]] 
              }))
            })
          }
        }
        this.getMeals();
      })
      .catch(err =>{console.log(err)});
  }

  getMeals(){
    let cardList = [];
    for (let i = 0; i < this.state.mealArray.length; i++){
      let value = this.state.mealArray[i];
      cardList.push(<MealCard key={i} name={value.name} date={value.date}
                      food={value.food} mealProteins={value.mealProteins}
                      id={value.id} accessToken={this.state.accessToken}
                      mealCarbo={value.mealCarbo} mealFats={value.mealFats}
                      mealFoodCal={value.mealFoodCal} foods={value.foods}
                      deleteMeal = {(id)=>this.deleteMeal(id)} select={(food)=>this.select(food)}
                    updateData = {() =>this.updateData() }  navigation={this.props.navigation} 
                    todaymode = {false} mealmode={true}
                    />)
    }
    return cardList;
  }
   

  async componentDidMount() {
    await this.getStoredData("accessToken");
    await this.getStoredData("username");
    await this.updateData(); 
    this.navListener = this.props.navigation.addListener('focus', () => {
        this.updateData();
    })    

  }

  componentWillUnmount() {
    this.navListener();
  }
  

  render() {
      return (
      <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }} keyboardShouldPersistTaps='handled'>
          <View style={styles.space} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Icon name="utensils" size={40} color="#900" style={{ marginRight: 20 }} />
            <Text style={styles.bigText}>Meals</Text>
          </View>
          <View style={styles.spaceSmall}></View>
            <Text>Have a look your meals!</Text>
            <Text>Record your meals below.</Text>
      
          <FAB
            icon="plus"
            medium
            style={styles.fab}
            onPress={() => this.handleAddMeal()}
          />
          {this.getModal()}
          <View>{this.getMeals()}</View>
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

export default MealView;