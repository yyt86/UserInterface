import React from 'react'
import './App.css'
import "./subsection.css"
import Table from 'react-bootstrap/Table';

class Subsection extends React.Component{

	getInfo = ( sub_sections) =>{
		return Object.keys(sub_sections).map((key,index) => {
			   return (
				<tr className="table"  key={this.props.data.number + this.props.section[this.props.num].number + sub_sections[key].number}>
				<td>{sub_sections[key].number}</td>
				<td>{sub_sections[key].location}</td>
				<td>{Object.keys(sub_sections[key].time).map((k, i) => (
					 <li key={k}>{k}: {sub_sections[key].time[k]}</li>))}</td>
			  </tr>  
			   )})
	}

	render(){

	let sub_sections = this.props.section[this.props.num].subsections;
   //  console.log(this.props.cartMode)
   return(
	<Table  striped bordered hover>
	<thead>
	  <tr className="tab_head">
		<th>Discussion</th>
		<th>Location</th>
		<th>Meeting Time</th>
	  </tr>
	</thead>
	<tbody>
		{this.getInfo( sub_sections)}
	</tbody>
	</Table>
   )
	
	 
 }
}

export default Subsection
