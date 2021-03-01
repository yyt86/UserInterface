import React from 'react';
import './App.css';
import Course from './Course';

class CourseArea extends React.Component {
  getCourses() {
    let courses = [];
    for(const course of Object.values(this.props.data)) {
      // console.log(course)
      // console.log(course.sections, 2)
      courses.push (
        <Course key={course.name} data={course} addtocart={this.props.onaddtocart} removecart={this.props.onremovecart} cartMode={this.props.cartMode}/>
      )
    }

    return courses;
  }

  render() {
    return (
      <div style={{margin: '5px'}}>
        {this.getCourses()}
      </div>
    )
  }
}

export default CourseArea;
