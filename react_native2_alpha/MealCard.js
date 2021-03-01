import React from 'react';
import { Button, Card, Paragraph, Chip } from 'react-native-paper';
import {StyleSheet, View, Dimensions} from "react-native";
import MealModal from "./MealModal"
import moment from "moment";
class MealCard extends React.Component {
    constructor(props){
        super(props)
        this.state={
            visible: false,
        }  
    }

    delete = () =>{
        this.props.deleteMeal(this.props.id);
    }


    showModal = () => this.setState({visible: true});
    hideModal = () => this.setState({visible: false});

    getModal(){
        if(this.state.visible){
            return(
                <MealModal visible={this.state.visible} updateData = {this.props.updateData} hideModal={this.hideModal} 
                id={this.props.id} date={this.props.date} accessToken={this.props.accessToken} name={this.props.name} 
                 />
            )
        }
    }

    randomColor = () => {
        let color = ['red', '#66CCFF', '#FFCC00', '#1C9379', '#8A7BA7'];
        let col = color[Math.floor(Math.random() * color.length)];
        return col;
    };

    foodChips(food){
        if(food !== null && (typeof food !== 'undefined')){
        return(
            <View style = {{flex:1}}>{
                food.map((item, index) => {
                    return (
                        <View key={index} style={{margin: 5,flexWrap: 'wrap',}}>
                        <Chip key={index} mode="outlined" height={30} 
                        textStyle={{ color:'white',fontSize: 15 }} 
                        style={{ backgroundColor: '#1C9379' }} 
                        >
                        {item.name}
                        </Chip>
                    </View>
                    );
                 })}
            </View>
        )
        }
    }

    render(){
        let currentDate = moment(this.props.date).format('MMMM Do YYYY, h:mm:ss a')
        return(
            <Card style={styles.card}>
            <Card.Title stytle={{fontWeight: "700", fontSize: 18}} title={this.props.name} />
                 <Card.Content>
                    <View style={{flexDirection: 'column'}}>
                        <View style={styles.left}>
                            {this.props.mealmode ? <Paragraph style={styles.para}>{currentDate} </Paragraph> : <View></View>}
                            <Paragraph style={styles.para}>Meal calories: {this.props. mealFoodCal} (kcal)</Paragraph>
                            <Paragraph style={styles.para}>Meal proteins: {this.props. mealProteins} (grams)</Paragraph>
                            <Paragraph style={styles.para}>Meal fats: {this.props. mealFats} (grams)</Paragraph>
                            <Paragraph style={styles.para}>Meal carbohydrates: {this.props. mealCarbo} (grams)</Paragraph>
                        </View>
                        <View style={styles.spaceSmall}></View>
                        {this.foodChips(this.props.foods)}
                    </View>
                     
                 </Card.Content>
                 {this.props.mealmode ? <Card.Actions>
                 <Button onPress={this.showModal}>Edit</Button>
                 <Button onPress={this.delete}>Delete</Button>
                 <Button onPress={()=>{this.props.navigation.navigate(
                     'Food', {foods: this.props.foods, id: this.props.id})}}>Select_food</Button>
                 
                {this.getModal()}
                </Card.Actions>
                :<View></View>}
             </Card>  
        );
    }
}

const styles = StyleSheet.create({
    card:{
        margin: 4,
        backgroundColor: "#fff",
        borderRadius: 5,
        width: Dimensions.get('window').width *0.9,
    },
   
    left:{
        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    cal:{
        alignItems: 'center',
        justifyContent: 'flex-start',
        fontWeight: "600",
         fontSize: 16 ,
    },
    mainContainer: {
        flex: 1
      },

      para:{
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: "400",
         fontSize: 14 ,
    },
    
});

export default MealCard;