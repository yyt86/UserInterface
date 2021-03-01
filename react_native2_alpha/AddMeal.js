import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Dimensions , Modal,} from 'react-native';
import TimePicker from './TimePicker';
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";

class AddMeal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          name: "",
          date:  (new Date()).toISOString(),
          id: '',
          accessToken: '',
          modalVisible: this.props.visible,
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

     

     handleAddMeal() {
        fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': this.props.accessToken
            },
            body: JSON.stringify({
              name: this.state.name,
                date: moment(this.state.date).format(),
            })
          })
        .then(res => res.json())
        .then(res => {
            this.props.updateData();
            alert("One meal is added!");
            this.props.hideModal()
        })
        .catch(err => {
            alert("Something went wrong! Verify you have filled out the fields correctly.");
        });
      
    }

    getDateTime(date){
        this.setState({
          date:date// moment(date).utcOffset(-6).format()
        })
    }
      
      
    render(){
        return (
            <Modal  visible= {this.props.visible}  transparent={true}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.bigText}>Meal Details</Text>
                        <View style={styles.space} />
                        <View>
                        <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Meal Name</Text>
                        </View>
                        <TextInput style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#d9bebd"
                        onChangeText={(name) => this.setState({ name: name })}
                        defaultValue={this.state.name}
                        autoCapitalize="none" />
                    
                        <View style={styles.space} />
                        <View>
                        <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Meal Data and Time</Text>    
                        </View>
                        <View style={styles.spaceSmall}></View>
                        <TimePicker  date={this.state.date}  getDateTime={(date) =>this.getDateTime(date)}/>
                        <View style={styles.space} />
                        <View>
                        <Text style={{ textAlignVertical: "center", fontWeight: "400" }}>Looks good! Ready to save your work?</Text>
                        </View>
                        
                        <View style={styles.space} />  
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Button color="#942a21" style={styles.buttonInline} title="SAVE MEAL"  onPress={() => this.handleAddMeal()} />
                        <View style={styles.spaceHorizontal} />
                        <Button color="#a1635f" style={styles.buttonInline} title="NEVER MIND" onPress={() => this.props.hideModal()} />
                        </View>
                    </View>

                 </View>
            </Modal> 
    );}
  
};

const styles = StyleSheet.create({
    scrollView: {
      height: Dimensions.get('window').height
    },
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
    bigText: {
      fontSize: 20,
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
    inputInline: {
      flexDirection: "row",
      display: "flex",
      width: 200,
      padding: 10,
      margin: 5,
      height: 40,
      borderColor: '#c9392c',
      borderWidth: 1
    }
  });
  
  export default AddMeal;
