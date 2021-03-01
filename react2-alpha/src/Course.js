import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';

class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      showModal: false,
      rating: "no rating",
      showAlert: false
    }

    this.rate = React.createRef();  
    
  }

  handleRatingChange=(e, course) =>{this.props.sendData(e.target.value, course)}

  render() {
    // console.log(this.rate.current.value)
    return (
      <Card style={{width: '33%', marginTop: '5px', marginBottom: '5px'}}>
        <Card.Body>
          <Card.Title>
            {/* <div style={{maxWidth: 250}}>
              {this.props.data.name}
            </div> */}
            {this.getName()}
            {this.getExpansionButton()}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{this.props.data.number} - {this.getCredits()}</Card.Subtitle>
          {this.getDescription()}
        </Card.Body>
          {this.getContent()}
      </Card>
    )
  }

 getContent(){
   if(this.props.completedmodel){
    // console.log(this.props.completedmodel)
     return(
          <Form.Group controlId="rating">
        <Form.Label>Course rating</Form.Label>
        <Form.Control as="select" ref={this.rate} onChange={(e) =>{this.props.sendData(e.target.value, this.props.data)}}>
          <option>No rating</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </Form.Control>
      </Form.Group>
     )
   }
   else if(this.props.recommandmode){
    return(
      <div></div>
    )
   }
   else{
    //  console.log(this.props.recommandmode)
     return(
       <>
        <Button variant='dark' style={{width:"130px"}} onClick={() => this.openModal()}>View sections</Button>
        <Modal show={this.state.showModal} onHide={() => this.closeModal()} centered>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.data.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.getSections()}
          </Modal.Body>
          <Modal.Footer>
            {this.getCourseButton()}
            <Button variant="secondary" onClick={() => this.closeModal()}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
     </> 
     )
   }
 }



  getRequisites(){
    let requisites = this.props.data.requisites
    let req = []
    if(requisites.length !== 0){
      req = requisites.falt()
    }
    return req
  }


  getCourseButton() {
    let buttonVariant = 'dark';
    let buttonOnClick = () => {this.addCourse()};
    let buttonText = 'Add Course';

    if(this.props.courseKey in this.props.cartCourses) {
      buttonVariant = 'outline-dark';
      buttonOnClick = () => this.removeCourse();
      buttonText = 'Remove Course'
    }

    return (
      <Button variant={buttonVariant} onClick={buttonOnClick}>
        {buttonText}
      </Button>
    )
  }

  getSections() {
    let sections = [];


    for (let i =0; i < this.props.data.sections.length; i++){
      sections.push (
          <Card key={i}>
            <Accordion.Toggle as={Card.Header} variant="link" eventKey={i} style={{height: 63, display: 'flex', alignItems: 'center'}}>
              {"Section " + i}
              {this.getSectionButton(i)}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={i}>
              <Card.Body>
                {JSON.stringify(this.props.data.sections[i].time)}
                {this.getSubsections(i, this.props.data.sections[i])}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
      )
    }

    return (
      <Accordion defaultActiveKey="0">
        {sections}
      </Accordion>
    )
  }

  getSectionButton(section) {
    let buttonVariant = 'dark';
    let buttonOnClick = (e) => this.addSection(e, section);
    let buttonText = 'Add Section';

    if(this.props.courseKey in this.props.cartCourses) {
      if(section in this.props.cartCourses[this.props.courseKey]) {
        buttonVariant = 'outline-dark';
        buttonOnClick = (e) => this.removeSection(e, section);
        buttonText = 'Remove Section';
      }
    }

    return <Button variant={buttonVariant} onClick={buttonOnClick} style={{position: 'absolute', right: 20}}>{buttonText}</Button>
  }

 
  getName(){
    if(this.props.cartmode && this.props.data.requisites.length !== 0){
        let boolean = []
        for(const names of this.props.data.requisites){
          boolean.push(names.some((name)=>{return (this.props.completed.findIndex((x) => {return x.number=== name}) !== -1) }))
        }
        if(boolean.some((element) => element===false)){
          return(
            <div style={{maxWidth: 250, color:"red"}}>
              {this.props.data.name}
            </div>
          )
        }
        else{
          return(
            <div style={{maxWidth: 250}}>
                  {this.props.data.name}
                </div>
          )
        }

      }
    
    
    else{
      return(
        <div style={{maxWidth: 250}}>
              {this.props.data.name}
            </div>
      )
    }
  
  }


  addCourse() {

    let courseId = (this.props.completed.findIndex((x) => {return x.number=== this.props.courseKey}))
    let req = this.props.data.requisites
    if(courseId !== -1){
      alert("This course has been completed.")
    }

    if(req.length !== 0){
      let boolean = []
    for(const names of req){
      boolean.push(names.some((name)=>{return (this.props.completed.findIndex((x) => {return x.number=== name}) !== -1) }))
    }
    if(boolean.some((element) => element===false))
        alert("Requisites have not been met.\n One way to take this course is " + this.props.getPath(this.props.data))
        
    }
    this.props.addCartCourse (
      {
        course: this.props.courseKey
      }
    );
  }

  removeCourse() {
    this.props.removeCartCourse (
      {
        course: this.props.courseKey
      }
    );
  }

  addSection(e, section) {
    let courseId = (this.props.completed.findIndex((x) => {return x.number=== this.props.courseKey}))
    let req = this.props.data.requisites
    if(courseId !== -1){
      alert("This course has been completed.")
    }

    if(req.length !== 0){
      let boolean = []
    for(const names of req){
      boolean.push(names.some((name)=>{return (this.props.completed.findIndex((x) => {return x.number=== name}) !== -1) }))
    }
    if(boolean.some((element) => element===false))
        alert("Requisites have not been met.\n One way to take this course is " + this.props.getPath(this.props.data))
        
    }
    e.stopPropagation();
    this.props.addCartCourse (
      {
        course: this.props.courseKey,
        section: section
      }
    );
  }

  removeSection(e, section) {
    e.stopPropagation();
    this.props.removeCartCourse (
      {
        course: this.props.courseKey,
        section: section
      }
    );
  }

  addSubsection(e, section, subsection) {
    let courseId = (this.props.completed.findIndex((x) => {return x.number=== this.props.courseKey}))
    let req = this.props.data.requisites
    if(courseId !== -1){
      alert("This course has been completed.")
    }

    if(req.length !== 0){
      let boolean = []
    for(const names of req){
      boolean.push(names.some((name)=>{return (this.props.completed.findIndex((x) => {return x.number=== name}) !== -1) }))
    }
    if(boolean.some((element) => element===false))
        alert("Requisites have not been met.\n One way to take this course is " + this.props.getPath(this.props.data))
        
    }
    e.stopPropagation();
    this.props.addCartCourse (
      {
        course: this.props.courseKey,
        section: section,
        subsection: subsection
      }
    );
  }

  removeSubsection(e, section, subsection) {
    e.stopPropagation();
    this.props.removeCartCourse (
      {
        course: this.props.courseKey,
        section: section,
        subsection: subsection
      }
    );

  }

  getSubsections(sectionKey, sectionValue) {
    let subsections = [];

    for (let i =0; i < sectionValue.subsections.length; i++){  
    subsections.push (
        <Card key={i}>
          <Accordion.Toggle as={Card.Header} variant="link" eventKey={i} style={{height: 63, display: 'flex', alignItems: 'center'}}>
            {i}
            {this.getSubsectionButton(sectionKey, i)}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={i}>
            <Card.Body>
              {JSON.stringify(sectionValue.subsections[i].time)}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      )
    }

    return (
      <Accordion defaultActiveKey="0">
        {subsections}
      </Accordion>
    )
  }

  getSubsectionButton(section, subsection) {
    let buttonVariant = 'dark';
    let buttonOnClick = (e) => this.addSubsection(e, section, subsection);
    let buttonText = 'Add Subsection';

    if(this.props.courseKey in this.props.cartCourses) {
      if(section in this.props.cartCourses[this.props.courseKey]) {
        if(this.props.cartCourses[this.props.courseKey][section].indexOf(subsection) > -1) {
          buttonVariant = 'outline-dark';
          buttonOnClick = (e) => this.removeSubsection(e, section, subsection);
          buttonText = 'Remove Subsection';
        }
      }
    }

    return <Button variant={buttonVariant} onClick={buttonOnClick} style={{position: 'absolute', right: 20}}>{buttonText}</Button>
  }

  openModal() {
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({showModal: false});
  }

  setExpanded(value) {
    this.setState({expanded: value});
  }

  getExpansionButton() {
    let buttonText = '▼';
    let buttonOnClick = () => this.setExpanded(true);

    if(this.state.expanded) {
      buttonText = '▲';
      buttonOnClick = () => this.setExpanded(false)
    }

    return (
      <Button variant='outline-dark' style={{width: 25, height: 25, fontSize: 12, padding: 0, position: 'absolute', right: 20, top: 20}} onClick={buttonOnClick}>{buttonText}</Button>
    )
  }

  getDescription() {
    if(this.state.expanded) {
      return (
        <div>
          {this.props.data.description}
        </div>
      )
    }
  }

  getCredits() {
    if(this.props.data.credits === 1)
      return '1 credit';
    else
      return this.props.data.credits + ' credits';
  }
}

export default Course;
