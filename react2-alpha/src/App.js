import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [],
      filteredCourses: [],
      subjects: [],
      cartCourses: {},
      preCourses:[],
      interestarea: [],
      // relations: {}
      Ratingcouse:{},
      recommand: []
      
    };
  }



  componentDidMount() {
   this.loadInitialState()
   this.loadPreviousState()
  
  }

  async loadInitialState(){
    let courseURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/classes";
    let courseData = await (await fetch(courseURL)).json()


    this.setState({allCourses: courseData, filteredCourses: courseData, subjects: this.getSubjects(courseData), interestarea: this.getInterest(courseData)});
  }

  async loadPreviousState(){
    let precourseURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed";


    let precourseData = await (await fetch(precourseURL)).json()

    for(const name of Object.values(precourseData.data)){
      let courseId = (this.state.allCourses.findIndex((x) => {return x.number=== name}))
      if (courseId !== -1){
        this.setState(prevState => ({preCourses: [...prevState.preCourses, this.state.allCourses[courseId]]
        }))
      }

    }

  }
 
  



  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for(let i = 0; i < data.length; i++) {
      if(subjects.indexOf(data[i].subject) === -1)
        subjects.push(data[i].subject);
    }

    return subjects;
  }

  getInterest(data){
    // let relations = this.getRelations(data)
    let InterestArea = []
    InterestArea.push("All")
    for(let i = 0; i < data.length; i++) {
      for(const key of data[i].keywords){
        if(InterestArea.indexOf(key) === -1)
          InterestArea.push(key);
      }
    }
    return InterestArea
  }


  setCourses(courses) {
    this.setState({filteredCourses: courses})
  }

  addCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))// I think this is a hack to deepcopy
    let courseIndex = this.state.allCourses.findIndex((x) => {return x.number===data.course})
    if (courseIndex === -1)
    {
      return 
    }

    if('subsection' in data) {
      if(data.course in this.state.cartCourses) {
        if(data.section in this.state.cartCourses[data.course]) {
          newCartCourses[data.course][data.section].push(data.subsection);
        }
        else {
          newCartCourses[data.course][data.section] = [];
          newCartCourses[data.course][data.section].push(data.subsection);
        }
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        newCartCourses[data.course][data.section].push(data.subsection);
      }
    }
    else if('section' in data) {
      if(data.course in this.state.cartCourses) {
        newCartCourses[data.course][data.section] = [];

        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) {
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      
      
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) { 
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      }
    }
    else {
      newCartCourses[data.course] = {};


      for (let i = 0; i < this.state.allCourses[courseIndex].sections.length; i++){
        newCartCourses[data.course][i] = [];

         for(let c= 0; c < this.state.allCourses[courseIndex].sections[i].subsections.length; c ++){
          newCartCourses[data.course][i].push(this.state.allCourses[courseIndex].sections[i].subsections[c]);
        }

      }


    }
    this.setState({cartCourses: newCartCourses});
  }

  removeCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))

    if('subsection' in data) {
      newCartCourses[data.course][data.section].splice(newCartCourses[data.course][data.section].indexOf(data.subsection), 1);
      if(newCartCourses[data.course][data.section].length === 0) {
        delete newCartCourses[data.course][data.section];
      }
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else if('section' in data) {
      delete newCartCourses[data.course][data.section];
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else {
      delete newCartCourses[data.course];
    }
    this.setState({cartCourses: newCartCourses});
  }

  getCartData() {
    let cartData = [];

    for(const courseKey of Object.keys(this.state.cartCourses)) {
      let course = this.state.allCourses.find((x) => {return x.number === courseKey})

      cartData.push(course);
    }
    return cartData;
  }

  getRatings(rating, course){
    let newRatingcouse = Object.assign({}, this.state.Ratingcouse)
    let rate = 0
    // let interestArea = this.getInterest(this.state.allCourses)
    
    if(rating === "No rating"){
       rate = 0
    }
    else{
      rate = Number(rating)
    }
    
   
    

    newRatingcouse[course.number] = rate
    // console.log("course rating", rate, newRatingcouse)

    let interestArea = this.getInterest(this.state.allCourses)
    const  keyRating = interestArea.reduce((o, key) => Object.assign(o, {[key]: []}), {})
    for(const course of this.state.preCourses){
      if(course.number in newRatingcouse){ 
        for(const keyword of course.keywords.values()){
          keyRating[keyword].push(newRatingcouse[course.number])
        }
      }
    }
    // console.log(keyRating)
    for(const [key, value] of Object.entries(keyRating)){
      if(value.length !== 0){
        let average = (array) => array.reduce((a, b) => a + b) / array.length;
        keyRating[key] = average(value)
      }
      else{
        keyRating[key] = 0
      }
    }
    // console.log(keyRating)

    let ratedcourse= {}
    for(const course of this.state.allCourses.values()){
      let courseIndex = this.state.preCourses.findIndex((x) => {return x.number===course.number})
        if (courseIndex === -1){
          let sum = 0
          for(const key_word of course.keywords.values()){
            sum = sum + keyRating[key_word]
          }
          ratedcourse[course.number] = sum 
        }
    }
    // console.log( ratedcourse)
    let recommanded = []
    let keysSorted = Object.keys(ratedcourse).sort(function(a,b){return ratedcourse[b]-ratedcourse[a]})
    for(const name of keysSorted){
      let courseId = (this.state.allCourses.findIndex((x) => {return x.number=== name}))
      // console.log(name)
      if (courseId !== -1 && ratedcourse[name] !== 0){
        recommanded.push(this.state.allCourses[courseId])
        
      }
    }
    this.setState({Ratingcouse: newRatingcouse});
    this.setState({recommand:recommanded})
   
  }


  getPath(course){
    let queue = []
    let res = []

    queue.push(course)
    
    while(queue.length > 0){
      let current = queue[0]
      // console.log(current.requisites)
      let req = current.requisites
      if(req.length === 0){
        break
      }
      else{
        let boolean = []
        for(const names of req){
          boolean.push(names.some((name)=>{return (this.state.preCourses.findIndex((x) => {return x.number=== name}) !== -1) }))
        }
        if(boolean.every((element) => element===true)){
          break 
        }
        else{
          let index = boolean.indexOf(false)
          for(const number of req[index]){
            if(this.state.preCourses.findIndex((x) => {return x.number=== number}) === -1){
              queue.push(this.state.allCourses.find((x) => {return x.number === number}))
              res.push(number)
              // console.log("course need" + number)
              break
            }
          }
        }
      }
      queue.shift()
    }
    // console.log(res)
    if(res.length === 0){
      return ""
    }
    else if(res.length === 1){
      return res[0] + "->" + course.number
    }
    else{
      // console.log(res.join("->")  + "->" + course.number)
      return res.reverse().join("->")  + "->" + course.number
    }
          
  }

  getCartRecommand(){
    let data = this.getCartData()

    // console.log("cart data", data)
    let cartrec = []
    for(const course of data){
      let req = course.requisites
      if(req.length !== 0){
        let boolean = []
        for(const names of req){
          boolean.push(names.some((name)=>{return (this.state.preCourses.findIndex((x) => {return x.number=== name}) !== -1) }))
        }
        if(boolean.some((element) => element===false)){
          cartrec =  cartrec.concat(this.getPath(course).split('->'))  

        }
      }
    }

    console.log("cart recommand")
    console.log(cartrec)
    
    let CartCompletedRecommand = []
    for(const item of cartrec){
      if(CartCompletedRecommand.findIndex((x) => {return x.number=== item}) === -1){
        CartCompletedRecommand.push(this.state.allCourses.find((x) => {return x.number=== item}))
      } 
    }
    
    for(const cour of this.state.recommand){
      if(CartCompletedRecommand.findIndex((x) => {return x.number=== cour.number}) === -1){
        CartCompletedRecommand.push(this.state.recommand.find((x) => {return x.number=== cour.number}))
      } 
    }

    return(
      <CourseArea data={CartCompletedRecommand} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses} completedmodel={false} getRatings={(rating,course) =>this.getRatings(rating,course)} recommandmode={true} completed={this.state.preCourses} allCourses={this.state.allCourses} getPath={(course)=>this.getPath(course)}/> 
    )

  }

  render() {
    console.log(this.state.preCourses)
    // console.log(this.state.interestarea)
    console.log(this.state.recommand)
    return (
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />

        <Tabs defaultActiveKey="search" style={{position: 'fixed', zIndex: 1, width: '100%', backgroundColor: 'white'}}>
          <Tab eventKey="search" title="Search" style={{paddingTop: '5vh'}}>
            <Sidebar setCourses={(courses) => this.setCourses(courses)} courses={this.state.allCourses} subjects={this.state.subjects} interestarea={this.state.interestarea}  />
            <div style={{marginLeft: '20vw'}}>
              <CourseArea data={this.state.filteredCourses} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses} completedmodel={false} getRatings={(rating,course) =>this.getRatings(rating,course)} recommandmode={false} completed={this.state.preCourses} allCourses={this.state.allCourses} getPath={(course)=>this.getPath(course)} cartmode={false}/>
            </div>
          </Tab>
          <Tab eventKey="cart" title="Cart" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea data={this.getCartData()} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses} completedmodel={false} getRatings={(rating,course) =>this.getRatings(rating,course)} recommandmode={false} completed={this.state.preCourses} allCourses={this.state.allCourses} getPath={(course)=>this.getPath(course)} cartmode={true}/>
            </div>
          </Tab>
          <Tab eventKey="completed" title="Completed Courses" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea data={this.state.preCourses} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses} completedmodel={true} getRatings={(rating,course) =>this.getRatings(rating,course)} recommandmode={false} completed={this.state.preCourses} allCourses={this.state.allCourses} getPath={(course)=>this.getPath(course)} cartmode={false}/>
            </div>
          </Tab>

          <Tab eventKey="recomand" title="Recommanded Courses" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
             <div >
             <h3>Not considering the cart courses</h3>
              <CourseArea data={this.state.recommand} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses} completedmodel={false} getRatings={(rating,course) =>this.getRatings(rating,course)} recommandmode={true} completed={this.state.preCourses} allCourses={this.state.allCourses} getPath={(course)=>this.getPath(course)} cartmode={false}/>
            </div>
            <div >
              <br></br>
              <br></br>
              <h3>Considering the cart courses</h3>
              {this.getCartRecommand()}
            </div>
            </div>
          </Tab>
        </Tabs>
      </>
    )
  }
}

export default App;
