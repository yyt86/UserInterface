class SearchAndFilter {
  searchAndFilter(courses, search, subject, area, minimumCredits, maximumCredits) {

    let dic = {}
    for(let i = 0; i < courses.length; i++) {
      let keys = courses[i].keywords
      for(let keyword of keys.values()){
        if(keyword in dic){
          dic[keyword].push(courses[i].subject)
        }
        else{
          dic[keyword] = [courses[i].subject]
        }
      }
    }
  
    if(subject !== '' && search !== null) {
      let coursesAfterSearch = [];

      for(const course of courses) {
        for(const keyword of course.keywords)
        {
          if(keyword.includes(search)){
          coursesAfterSearch.push(course);
          break;
          }
        } 
      }
      courses = coursesAfterSearch;
    }
    
    if(area !== 'All'){
      let coursesAfterArea = [];
        for(const course of courses) {
          for(const keyword of course.keywords)
          {
            if(keyword.includes(area)){
            coursesAfterArea.push(course);
            break;
            }
          } 
        }
        courses = coursesAfterArea;
      
    }

    if(subject !== 'All') {
      let coursesAfterSubject = [];

      for(const course of courses) { 
        if(course.subject === subject && dic[area].includes(subject))
          coursesAfterSubject.push(course);
      }
      courses = coursesAfterSubject;
    }

    if(minimumCredits !== '') {
      let coursesAfterMinimumCredits = [];

      for(const course of courses) { 
        if(course.credits >= parseInt(minimumCredits))
          coursesAfterMinimumCredits.push(course);
      }
      courses = coursesAfterMinimumCredits;
    }

    if(maximumCredits !== '') {
      let coursesAfterMaximumCredits = [];

      for(const course of courses) { 
        if(course.credits <= parseInt(maximumCredits))
          coursesAfterMaximumCredits.push(course);
      }
      courses = coursesAfterMaximumCredits;
    }

    return courses;
  }
}

export default SearchAndFilter;
