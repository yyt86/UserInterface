import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Dimensions , Modal,} from 'react-native';
import TimePicker from './TimePicker';
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";

class AddActivity extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        name: "",
        duration: 0.0,
        date:  (new Date()).toISOString(),
        calories: 0.0,
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

     

  handleAddExercise() {
    this.setState({
      duration: parseFloat(this.state.duration),
      calories: parseFloat(this.state.calories),  
    }, ()=>fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': this.props.accessToken
          },
          body: JSON.stringify({
            name: this.state.name,
              duration: this.state.duration,
              date: moment(this.state.date).format(),
              calories: this.state.calories,
          })
        })
          .then(res => res.json())
          .then(res => {
            // console.log(this.state.name, "name")
            // console.log(res, 'add res')
            this.props.updateData();
            alert("One exercise is added!");
            this.props.hideModal()
          })
          .catch(err => {
            alert("Something went wrong! Verify you have filled out the fields correctly.");
          }));
  }


  getDateTime(date){
    this.setState({
      date: date//moment(date).utcOffset(-6).format()
    })
  }
    
  render(){
    return (
      <Modal  visible= {this.props.visible}  transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.bigText}>Exercise Details</Text>
            <View style={styles.space} />

            <View>
            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Exercise Name</Text>
            </View>
            <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              placeholderTextColor="#d9bebd"
              onChangeText={(name) => this.setState({ name: name })}
              defaultValue={this.state.name}
              autoCapitalize="none" />
            <View style={styles.spaceSmall}></View>

            <View>
              <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Duration (minutes)</Text>
            </View>
            <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              placeholderTextColor="#d9bebd"
              onChangeText={(duration) => this.setState({ duration: duration })}
              defaultValue={this.state.duration + ""}
              autoCapitalize="none" />
            <View style={styles.spaceSmall}></View>
            <View>
              <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Calories Burnt (cal)</Text>
            </View>
            <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              placeholderTextColor="#d9bebd"
              onChangeText={(calories) => this.setState({ calories: calories })}
              defaultValue={this.state.calories + ""}
              autoCapitalize="none" />
        
            <View style={styles.space} />
            <View>
              <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Exercise Data and Time</Text>    
            </View>
            <View style={styles.spaceSmall}></View>
            <TimePicker  date={this.state.date}  getDateTime={(date) =>this.getDateTime(date)}/>
    
            <View style={styles.space} />
            <View>
            <Text style={{ textAlignVertical: "center", fontWeight: "400" }}>Looks good! Ready to save your work?</Text>
            </View>
              
            <View style={styles.space} />  
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Button color="#942a21" style={styles.buttonInline} title="SAVE EXERCISE"  onPress={() => this.handleAddExercise()} />
            <View style={styles.spaceHorizontal} />
              <Button color="#a1635f" style={styles.buttonInline} title="NEVER MIND" onPress={() => this.props.hideModal()} />
            </View>
        </View>

      </View>
    </Modal> );}
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
  
  export default AddActivity;
