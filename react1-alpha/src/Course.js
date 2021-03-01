import React, { createRef } from 'react';
import './App.css';
import Section from './Section'
import "./course.css"
import Card from 'react-bootstrap/Card';
import { Col, Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import down from './arrow-down.png';

class Course extends React.Component {
  constructor(props) {
    super(props);
    this.secref = React.createRef();
    this.subsecref = React.createRef();

    this.state = {
      addSection: "",
      addSubsection: "",
      cart: [],
      section_selected:"All",
      subsection_selected:"All",
      sec_index: null,
      subsec_index: null,
      showing: false
    }

  
    // this.getIndex=this.getIndex.bind(this);
    this.func1=this.func1.bind(this)
    this.func2=this.func2.bind(this)
}
  
  

  getReq (arr){
    if (arr.length === 0){
      return "None"
    }
    else if(arr[0].constructor === Array){
      
      let list=[];
      for(const item of arr.values()){
        if(item.length > 1)
          list.push(item.join(" OR "))
        else
          list.push(item)
      }
      let list1 = list.map(x =>("("+x+")"))
      return list1.join(" AND ")
    }
    
  }

 
  handleChangeSec= (event)=>{    this.setState({section_selected: event.target.value})  ; console.log("change")}
  handleChangeSubsec =(event)=>{    this.setState({subsection_selected: event.target.value})  }
  show = () =>{this.setState(prevState => ({showing: !prevState.showing}))}


  getSectionOptions(){
    let sects = [];
    let sectionOptions = [];
    let data = this.props.data
   

		sects.push("All");
		for(const section of Object.values(data.sections)) {
		  if(sects.indexOf(section.number) === -1)
		  	sects.push(section.number);
		}

    for(const sect of sects) {
      sectionOptions.push(<option key={sect}>{sect}</option>);
    }

    return sectionOptions;
  }
  
  getSubsectionOptions(){
    let subsects = [];
    let sec_id = 0;
    let subSectionOptions = [];
    let sectionSelection = this.state.section_selected;
    let data = this.props.data
    // console.log(sectionSelection)
    
    subsects.push("All");
    if(sectionSelection !== 'All'){
      for(const [key,section] of Object.entries(data.sections)) {
        if(section.number === sectionSelection){
          sec_id = key;}
      }
   
      if(Object.values(data.sections[sec_id].subsections).length !== 0){
        for(const subsection of Object.values(data.sections[sec_id].subsections)) {
          
          if(subsects.indexOf(subsection.number) === -1){
            subsects.push(subsection.number);}
        }

        for(const subsect of subsects) {
          subSectionOptions.push(<option key={subsect}>{subsect}</option>);
        }
      }
      else{
        subSectionOptions.push(<option key={'All'}>{'All'}</option>);
      }
    }
    else{
      subSectionOptions.push(<option key={'All'}>{'All'}</option>);
    }
  
    return subSectionOptions;
  }  

  async  getIndex () {
    let sectionSelection = this.state.section_selected;
    let subsectionSelection = this.state.subsection_selected;
    let data = this.props.data;
   
    if(sectionSelection === 'All'){
      await this.setState({sec_index: null})
      await this.setState({subsec_index: null})
    }
    else{
      for(const [key,section] of Object.entries(data.sections)) {
        if(section.number === sectionSelection){
     
        await this.setState({sec_index: key});
        
        }
      }

      if(subsectionSelection === 'All'){
        await this.setState({subsec_index: null})
      }
      else{
        for(const [key,subsection] of Object.entries(data.sections[this.state.sec_index].subsections)) {
          if(subsection.number === subsectionSelection){
          
            await this.setState({subsec_index: key});}
       
        }
      }
    }
  }

  async func1 (event){
    
    await this.setState({section_selected: event.target.value});
    this.getIndex()
  }

  async func2 (event){
    await this.setState({subsection_selected: event.target.value})
    this.getIndex()
  }



  render(){
    // console.log(this.props.data.number);
    const course = this.props.data;
   
   
    return (
      <>
      <Card style={{marginTop: '5px', marginBottom:'5px'}}>
          <Card.Body>
          
      
          
            <Form >
            <Form.Row className="align-items-center">
          <Col className="my-1">
            <img src={down} alt="down" style={{float:"left"}} onClick={this.show}/ >
            <Card.Title >{course.number}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted"> {course.name} </Card.Subtitle>
            </Col>
            
            
            <Col  xs="auto" className="my-1">
            <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref" style={{width:'37px', height:'37px', fontSize:'24px', borderRadius:'50%', backgroundColor: "lightgray", marginRight:"10px"}}>
            {course.credits}cr </Form.Label>
              </Col>
              <Col xs="auto"  style={{width:'137px'}}>
              <Form.Group  style={{marginRight:"10px"}}  onChange={this.func1}>
                <Form.Label style={{marginBottom:"2px"}} >Sections</Form.Label>
                <Form.Control as="select"  ref={this.secref} className="my-1 mr-sm-2" id="inlineFormCustomSelectPref" custom >
                  {this.getSectionOptions()}
                </Form.Control>
              </Form.Group>
              </Col>
              <Col xs="auto"  style={{width:'137px'}}>
              <Form.Group   style={{marginRight:"15px"}} onChange={this.func2}>
                <Form.Label style={{marginBottom:"2px"}}>Subsections</Form.Label>
                <Form.Control as="select" ref={this.secref}  className="my-1 mr-sm-2" id="inlineFormCustomSelectPref" custom >
                  {this.getSubsectionOptions()}
                </Form.Control>
              </Form.Group>
              </Col>
              <Col xs="auto"  className="my-1">
              {this.props.cartMode ? <Button variant="outline-primary"  onClick={() =>{this.props.removecart(this.props.data, this.state.sec_index, this.state.subsec_index)}}>Remove from Cart</Button> : 
              <Button variant="outline-primary"  onClick={() =>{this.props.addtocart(this.props.data, this.state.sec_index, this.state.subsec_index)}} >Add to Cart</Button>}
              
              </Col>
              </Form.Row>
            </Form>
            
            
            {this.state.showing?  
            <div> 
              <p className="subject">Subject: {course.subject}</p>
              <p className="des">{course.description}</p>
              <p className="req"><span className="req_title">Requisites: </span><span>{this.getReq(course.requisites)}</span></p>
              <p className="key"><u>Keywords: </u> <span> {course.keywords.join(', ')}</span></p>
              <br></br>
              <Section key={course.sections.number} data={this.props.data} />
            </div>  
            : null}
            
            
          </Card.Body>
      </Card>
     </>
     

     
    )
  
  }
}


export default Course
