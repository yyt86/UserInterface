import React from 'react';
import { ProgressBar, Headline } from 'react-native-paper';
import {StyleSheet, Text, View, Modal, Button} from 'react-native';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';


class ComparisonView extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          dailyDuration: this.props.dailyDuration,
          dailyCalories: this.props.dailyCalories,
          dailyProtein: this.props.dailyProtein,
          dailyCarbo: this.props.dailyCarbo,
          dailyFats: this.props.dailyFats,
          dailyFoodCal: this.props.dailyFoodCal,
          goalDailyCalories: 0.0,
          goalDailyProtein: 0.0,
          goalDailyCarbohydrates: 0.0,
          goalDailyFat: 0.0,
          goalDailyActivity: 0.0,
          accessToken: "",
          username: "",
          
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
    

    async componentDidMount() {
      await this.getStoredData("accessToken");
      await this.getStoredData("username");
      fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.state.username, {
        method: 'GET',
        headers: { 'x-access-token': this.state.accessToken }
      })
        .then(res => res.json())
        .then(res => {
          this.setState({
            goalDailyCalories: res.goalDailyCalories,
            goalDailyProtein: res.goalDailyProtein,
            goalDailyCarbohydrates: res.goalDailyCarbohydrates,
            goalDailyFat: res.goalDailyFat,
            goalDailyActivity: res.goalDailyActivity
          });

          this.setState({
            goalDailyCalories: parseFloat(this.state.goalDailyCalories),
            goalDailyProtein: parseFloat(this.state.goalDailyProtein),
            goalDailyCarbohydrates: parseFloat(this.state.goalDailyCarbohydrates),
            goalDailyFat: parseFloat(this.state.goalDailyFat),
            goalDailyActivity: parseFloat(this.state.goalDailyActivity)
          })
        });
    }

    calculate(){
        let compareArray = [];
        let obj = {}
        obj.name = 'Daily Activity'
        obj.goal = this.state.goalDailyActivity;
        obj.today = this.state.dailyDuration;
        if(this.state.goalDailyActivity !== 0 &&  this.state.dailyDuration/this.state.goalDailyActivity < 1){
          obj.progress = this.state.dailyDuration/this.state.goalDailyActivity
        }
        else{
          obj.progress = 1
        }
        compareArray.push(obj);

        let obj1 = {}
        obj1.name = 'Daily Calories'
        obj1.goal = this.state.goalDailyCalories;
        obj1.today = this.state.dailyCalories;
        if(this.state.goalDailyCalories !== 0 && this.state.dailyCalories/this.state.goalDailyCalories < 1){
          obj1.progress = this.state.dailyCalories/this.state.goalDailyCalories
        }
        else{
          obj1.progress = 1
        }
        compareArray.push(obj1);

        let obj2 = {}
        obj2.name = 'Daily Protein'
        obj2.goal = this.state.goalDailyProtein;
        obj2.today = this.state.dailyProtein;
        if(this.state.goalDailyProtein !== 0 && this.state.dailyProtein/this.state.goalDailyProtein < 1){
          obj2.progress = this.state.dailyProtein/this.state.goalDailyProtein
        }
        else{
          obj2.progress =  1
        }
        compareArray.push(obj2);

        let obj3 = {}
        obj3.name = 'Daily Carbohydrates'
        obj3.goal = this.state.goalDailyCarbohydrates;
        obj3.today = this.state.dailyCarbo;
        if(this.state.goalDailyCarbohydrates !== 0 && this.state.dailyCarbo/this.state.goalDailyCarbohydrates < 1 ){
          obj3.progress = this.state.dailyCarbo/this.state.goalDailyCarbohydrates
        }
        else{
          obj3.progress =  1
        }
        compareArray.push(obj3);

        let obj4 = {}
        obj4.name = 'Daily Fats'
        obj4.goal = this.state.goalDailyFat;
        obj4.today = this.state.dailyFats;
        if(this.state.goalDailyFat !== 0 &&  this.state.dailyFats/this.state.goalDailyFat < 1){
          obj4.progress = this.state.dailyFats/this.state.goalDailyFat
        }
        else{
          obj4.progress =  1
        }
        compareArray.push(obj4); 
        return compareArray;


    }

    
    displayComparison(){
      let cardList = [];
      let compareArray = this.calculate()
      
      for (let i = 0; i < compareArray.length; i++){
        let value = compareArray[i];
          cardList.push(
            <View key={i}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  <Text style={{ flex:1.8,justifyContent: 'flex-start',   fontWeight: "700", fontSize: 16 }}>{value.name}</Text>
                  <Text style={{ flex:1, justifyContent: 'flex-end',  marginLeft: 60,fontWeight: "700", fontSize: 16 }}>{value.today}/{value.goal}</Text>
              </View>
              <ProgressBar style={styles.bar} progress={value.progress} color={'#900'}/>
              <View style={styles.spaceSmall} />
            </View>)
      }
      return cardList;
    }
      
    render() {
      return (
        
          <Modal
          animationType="slide"
          transparent={true}
          visible= {this.props.visible}
        >
           <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Headline>Degree of Completion</Headline>
              <View style={styles.spaceSmall} />
              <View style={styles.spaceSmall} />
                  {this.displayComparison()}
                  <View style={styles.spaceSmall} />
              <Button color="#900" style={styles.buttonInline} title="GO BACK" onPress={() => this.props.hideModal()} />
            </View>
            
          </View> 
        </Modal>
     
      )
    }
  }

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
      
      container: {
        flex: 1,
        backgroundColor: '#fff',
      },
    
      spaceSmall: {
        width: 20,
        height: 20,
      },
      space: {
        width: 20,
        height: 30,
      },

      bar:{
        height: 20,
        width: Dimensions.get('window').width *0.8,
        borderRadius: 10,
      },
      icon:{
        alignSelf: 'flex-end',
        position: 'absolute',
        top: 25,
        left: 15,
      },

      buttonInline: {
        display: "flex"
      },
});

export default ComparisonView;