import React from 'react';
import { Button, Card, Paragraph} from 'react-native-paper';
import {StyleSheet, View, Dimensions} from "react-native";
import ActivityModal from './ActivityModal';
import moment from "moment";


class ActivityCard extends React.Component {
    constructor(props){
        super(props)
        this.state={
        visible: false,
        }
        
    }
    delete = () =>{
        this.props.deleteExercise(this.props.id);
    }

    showModal = () => this.setState({visible: true});
    hideModal = () => this.setState({visible: false});
    getModal(){
        if(this.state.visible){
            return(
                <ActivityModal visible={this.state.visible} updateData = {this.props.updateData} hideModal={this.hideModal} 
                id={this.props.id} date={this.props.date} accessToken={this.props.accessToken} name={this.props.name} 
                    duration={this.props.duration} calories={this.props.calories}/>
            )
        }
    }

    render(){
        // console.log(this.props.id, "card id")
        let currentDate = moment(this.props.date).format('MMMM Do YYYY, h:mm:ss a')
        return(
            <View  accessible={true}
            accessibilityLabel={"Exercises card"}
            accessibilityHint={"Show activity info"}>
            <Card style={styles.card}  >
                <Card.Title stytle={{fontWeight: "700", fontSize: 18}} title={this.props.name} />
                <Card.Content>
                    <View style={{flexDirection: 'column'}}>
                        <View style={styles.left}>
                        {this.props.mealmode ? <Paragraph style={styles.para}>{currentDate } </Paragraph> : <View></View>}
                            <Paragraph style={styles.para}>Duration: {this.props.duration} min</Paragraph>
                            <Paragraph style={styles.cal}>Calories Burnt: {this.props.calories} kcal</Paragraph>
                        </View>  
                    </View>   
                </Card.Content>
                {this.props.mealmode ?  <Card.Actions>
                <Button onPress={this.showModal}>Edit</Button>
                <Button onPress={this.delete}>Delete</Button>
                {this.getModal()}
                </Card.Actions>
                :<View></View>}
            </Card>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    card:{
        margin: 4,
        backgroundColor: "#FAFAD2",
        borderRadius: 10,
        width: Dimensions.get('window').width *0.9,
    },
    left:{
        alignItems: 'center',
        justifyContent: 'center'
    },

    cal:{
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: "600",
         fontSize: 16 ,
    },

    para:{
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: "400",
         fontSize: 14 ,
    },
    mainContainer: {
        flex: 1
      },
    
});

export default ActivityCard;