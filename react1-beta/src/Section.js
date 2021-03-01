import React from 'react'
import './App.css'
import Subsection from './Subsection.js'
import "./section.css"
import Carousel from 'react-bootstrap/Carousel';


class Section extends React.Component {

	
	getInfo = (sections) =>{
		var s = [];
		if(sections != null ){
			if(Object.values(sections).some(e => Object.keys(e.subsections).length !== 0)){
			  s.push(<h6  key="subsection_text" style={{marginLeft:"20px"}}>Subsections</h6>) 
			}
		  }
		return Object.keys(sections).map((key,index) => {
			   return (
				<Carousel.Item key = {this.props.data.number + sections[key].number}>
				<div style={{backgroundColor: "lightblue"}}>
					
					<div>
						<h5 style={{marginLeft:"4px"}}>Section: {sections[key].number}</h5>
						<p className="word">Instructor: {sections[key].instructor}</p>
						<p className="word">Location: {sections[key].location}</p>
						<p className="word">Metting Times:</p>
						<ul className="word">
						{Object.keys(sections[key].time).map((k, i) => (
						<li key={k}>{k}: {sections[key].time[k]}</li>))}
						</ul>
					</div>
					<br></br>
					{s}
					
					<div style={{marginRight:"20px", marginLeft:"20px", marginBottom:"20px",float:"middle"}}>
						<Subsection data={this.props.data} section={sections} num={key}/>
						<br></br>
					</div>
				</div>
				</Carousel.Item>
				
			   )})
	}


	render(){
		let sections = this.props.data.sections
		

	
	 return(
		<Carousel>
			{this.getInfo(sections)}
		</Carousel>
	 )
	
	}
  }
        
  export default Section
        



