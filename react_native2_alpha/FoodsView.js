import React from 'react';
import { Card, Paragraph } from 'react-native-paper';
import { StyleSheet, Text, View, Button, Dimensions , FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';

class Item extends React.Component {
    shouldComponentUpdate(nextProps,nextState){
        return (this.props.item != nextProps.item || this.props.select != nextProps.select);
    }

    render() {
        const { item } = this.props;
            return (
                <View style={styles.mainContainer}>
                    <View>
                        <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
                            {
                                item.select ?
                                    <Icon name='check-square' size={20} color="#900"/>
                                    :
                                    <Icon name='square' size={20} color="#000"/>
                            }
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Card style={styles.card}>
                            <Card.Title stytle={{fontWeight: "700", fontSize: 16}} title={item.name} />
                            <Card.Content style={{flexDirection: 'column'}}>
                                <Paragraph style={styles.para}>Measure: {item.measure} </Paragraph>
                                <Paragraph style={styles.para}>Calories: {item.calories.toString()} (kcal)</Paragraph>
                                <Paragraph style={styles.cal}>Protein: {item.protein.toString()} (grams)</Paragraph>
                                <Paragraph style={styles.cal}>Carbohydrates: {item.carbohydrates.toString()} (grams)</Paragraph>
                                <Paragraph style={styles.cal}>Fat: {item.fat.toString()} (grams)</Paragraph>   
                            </Card.Content>
                        </Card>
                    </View>
                </View>

            );
    }
}


class FoodsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        foodArray: [],
        foodsList: [],
        accessToken: '',
        mealName: '',
        foods: this.props.route.params.foods,
        id: this.props.route.params.id,
        };
    }

    async getStoredData(key){
        try{
            let value = await AsyncStorage.getItem(key);
            this.setState({[key]: value});
         } catch (error) {
            console.log(error);
         }
    }

    getFoods(){
        fetch('https://mysqlcs639.cs.wisc.edu/foods/', {
          method: 'GET',
          headers: { 'x-access-token': this.state.accessToken }
        })
          .then(res => res.json())
          .then(res => {
            // console.log(res, "res")
            this.setState({foodArray:  res.foods})
            let newfoodsArray = this.state.foodArray;
            for(let i=0; i<newfoodsArray.length; i++){
                newfoodsArray[i].select = false;
            }
            this.setState({foodsList: newfoodsArray})
          })
          .catch(err =>{console.log(err)});
    }

    async componentDidMount() {
        await this.getStoredData("accessToken");
        await this.getStoredData("username");
        this.getFoods();
    }

    async select(){
        const {foods, id} = this.state
        const {foodsList} = this.state
        if(foods !== null && (typeof foods !== 'undefined')){
            for(let j=0; j<foods.length; j++){
               await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + id + '/foods/' + foods[j].id, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': this.state.accessToken
                    },
                    })
                    .then(res => res.json())
                    .catch(err => {console.log(err);});
            }   
            for(let i=0; i<foodsList.length; i++){
                let value = foodsList[i]
                if(value.select){
                   await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + id + '/foods/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': this.state.accessToken
                    },
                    body: JSON.stringify({
                        name:value.name,
                        calories:value.calories,
                        protein:value.protein,
                        carbohydrates:value.carbohydrates,
                        fat:value.fat
                        })

                })
                .then(res => res.json())
                .then(res=>{
                    alert("Your foods have been reselected.")
                })
                .catch(err => {
                    alert("Something went wrong! ");
                });
                }     
            }                
        }
       
        else{
            for(let i=0; i<foodsList.length; i++){
                let value = foodsList[i]
                if(value.select){
                    fetch('https://mysqlcs639.cs.wisc.edu/meals/' + id + '/foods/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': this.state.accessToken
                    },
                    body: JSON.stringify({
                        name:value.name,
                        calories:value.calories,
                        protein:value.protein,
                        carbohydrates:value.carbohydrates,
                        fat:value.fat
                        })

                })
                .then(res => res.json())
                .then(res=>{
                    alert("Your foods have been reselected.")
                });
                }   
            }           
        }
        this.props.navigation.navigate('Meal')
    }

    changeSelect(index, select) {
        const { foodsList } = this.state;
        foodsList[index].select = !select;
        this.setState({foodsList,})
    };

    render(){
        return(
            <View style={styles.mainContainer} >
                <Icon name="arrow-left" size={20} color="#000" style={styles.icon} onPress={() => this.props.navigation.navigate('Meal')} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' , marginTop: 20,}}>
                    <Icon name="hamburger" size={40} color="#900" style={{ marginRight: 20 }} />
                    <Text style={styles.bigText}>Foods</Text>
                </View>
                <View style={styles.spaceSmall}></View>

                <FlatList
                    data={this.state.foodsList}
        
                    keyExtractor={item => item.id.toString()}
                    // keyExtractor = {(item, index) => list-item-${index}}
                    renderItem={({ item, index }) => (
                    <Item
                        item={item}
                        select={item.select}
                        onPress={() => this.changeSelect(index, item.select)}
                    />)
                    }
                />
                <View style={styles.space} />  
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Button color="#942a21" style={styles.buttonInline} title="SELECT FOOD"  onPress={() => this.select()} />
                    <View style={styles.spaceHorizontal} />
                    <Button color="#a1635f" style={styles.buttonInline} title="NEVER MIND" onPress={() => this.props.navigation.navigate('Meal')} />
                </View>
            </View>
        )
        }

}

const styles = StyleSheet.create({
    scrollView: {
        height: Dimensions.get('window').height
      },
      mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column', flexWrap: 'wrap'
      },
      
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        marginLeft: 10,
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
      spaceHorizontal: {
        display: "flex",
        width: 20
      },
      card:{
        margin: 4,
        backgroundColor: "#fff",
        borderRadius: 10,
        width: Dimensions.get('window').width *0.8,
    },

    para:{
        alignItems: 'center',
        justifyContent: 'flex-start',
        fontWeight: "400",
         fontSize: 12 ,
    },

    icon:{
        alignSelf: 'flex-end',
        position: 'absolute',
        top: 15,
        left: 15,
      }
});

export default FoodsView ;