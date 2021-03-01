import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';
import { Card } from 'react-bootstrap';
import UW from './UW.jpg';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      allCourses: {},
      filteredCourses: {},
      subjects: [],
      cart:{},
      showHome: true,
      showSearch: false,
      showCart: false

    };
  }

  componentDidMount() {
    fetch('http://mysqlcs639.cs.wisc.edu:53706/api/react/classes').then(
      res => res.json()
    ).then(data => this.setState({allCourses: data, filteredCourses: data, subjects: this.getSubjects(data)}));
  }

  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for(const course of Object.values(data)) {
      if(subjects.indexOf(course.subject) === -1)
        subjects.push(course.subject);
    }

    return subjects;
  }

  setCourses(courses) {
    this.setState({filteredCourses: courses})
  }


  
  add = (course, sec_index, subsec_index) => {
    console.log("update")
    console.log(sec_index, subsec_index)
  let course_selected = {
      number: course.number,
      name: course.name,
      credits: course.credits,
      subject: course.subject,
      description: course.description,
      requisites: course.requisites,
      keywords: course.keywords,
      sections: {}
    }

    // console.log("cart")
    // console.log(this.state.cart)
    let newcart = Object.assign({}, this.state.cart)
    
    if(sec_index == null){
      course_selected = course; 
      newcart[course_selected.number] = course_selected
    }
    else{
      if(subsec_index === null){
        if(!this.state.cart[course_selected.number]){
          course_selected.sections = {[sec_index]:course.sections[sec_index]};
          newcart[course_selected.number] = course_selected
        }
        else{
          newcart[course_selected.number].sections[sec_index] = course.sections[sec_index]
     
        }
      }

      else{
        let newsec = {
          number: course.sections[sec_index].number,
          instructor: course.sections[sec_index].instructor,
          location: course.sections[sec_index].location,
          time: course.sections[sec_index].time,
          subsections: {[subsec_index]: course.sections[sec_index].subsections[subsec_index]}
        }
        if(!this.state.cart[course_selected.number]){
          
          course_selected.sections = {[sec_index]: newsec}
          newcart[course_selected.number] = course_selected
        }
        else{
          
          if(Object.keys(this.state.cart[course_selected.number].sections).includes(sec_index)){
            newcart[course_selected.number].sections[sec_index].subsections[subsec_index] = course.sections[sec_index].subsections[subsec_index]
          }
          else{
            newcart[course_selected.number].sections[sec_index] = newsec
          }
        }
      }  
      
    }
    
    // console.log("newcart")
    // console.log(newcart)
    this.setState({cart: newcart})
    // console.log(newcart)
    
  }  

remove = (course, sec_index, subsec_index) => {
  // console.log("remove")
  //   console.log(sec_index, subsec_index)
    
  let newcart = Object.assign({}, this.state.cart)
  console.log(newcart)
    if(sec_index == null){
      delete newcart[course.number]
    }
    else{
      if(subsec_index === null){
        delete newcart[course.number].sections[sec_index]
      
        if(Object.entries(newcart[course.number].sections).length === 0){
          delete newcart[course.number]
        }
      }
      else{
        delete newcart[course.number].sections[sec_index].subsections[subsec_index]

        if(Object.entries(newcart[course.number].sections[sec_index].subsections).length === 0){
          delete newcart[course.number].sections[sec_index]
        }

        if(Object.entries(newcart[course.number].sections).length === 0){
          delete newcart[course.number]
        }
      }
    }
    // console.log("newcart")
    console.log(newcart)
    this.setState({cart: newcart})
}

 handleChangeNav(a, b, c) {this.setState({showHome: a, showSearch: b, showCart: c})}

 showContent(){
   if(this.state.showHome){
     return(
       <>
      <Card className="text-center">
                <Card.Body>
                  <Card.Title>Course Search & Enroll</Card.Title>
                  <img src={UW} alt="UW" style={{width:"40%", height:"40%", float:"middle"}} / >
            
                </Card.Body>
      </Card>
      </>
     )
   }
   else{
     if(this.state.showSearch){
       return(
        <>
      <Sidebar setCourses={(courses) => this.setCourses(courses)} courses={this.state.allCourses} subjects={this.state.subjects}/>
        <div style={{marginLeft: '20vw'}}>
        <CourseArea data={this.state.filteredCourses} allData={this.state.allCourses} cartMode={false} onaddtocart={this.add}/>
        </div>
        </>
       )
     }
     else{
      return(
        <div style={{marginLeft: '5vw'}}>
            <CourseArea data={Object.values(this.state.cart)} allData={this.state.allCourses} cartMode={true}  onremovecart = {this.remove}/>
        </div>
      )
     }
   }
 }


  render() {
    // console.log(Object.values(this.state.cart))
    return (
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />
      
        <Navbar bg="lightblue" variant="light" style={{backgroundColor:"lightblue"}}>
            <Navbar.Brand href="#home">Navbar</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link href="#home" onClick={()=>{this.handleChangeNav(true, false, false)}}>Home</Nav.Link>
              <Nav.Link href="#features"  onClick={()=>{this.handleChangeNav(false, true, false)}}>Search</Nav.Link>
              <Nav.Link href="#pricing" onClick={()=>{this.handleChangeNav(false, false, true)}}>Cart</Nav.Link>
            </Nav>
          </Navbar>
          {this.showContent()}
        </>  
    )
  }
}

export default App;
