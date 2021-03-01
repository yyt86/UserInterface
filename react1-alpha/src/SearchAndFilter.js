
class SearchAndFilter {
  
  searchAndFilter(courses, search, subject, minimumCredits, maximumCredits) {

    let res = [];
    let boolean2 = false;
    let boolean3 = false;
    
    for(const course of Object.values(courses)){
     
      const boolean1 = (course.subject.toLowerCase() === subject.toLowerCase()) || (subject === "") || (subject === "All")
      if(search === ""){
        boolean2 = true}
      else{
        const filtered = course.keywords.filter((str) => str.toLowerCase().includes(search.toLowerCase())) 
        boolean2 = (filtered.length !== 0)
      }
      

      if( minimumCredits === "" && maximumCredits === ""){
        boolean3 = true}
      else if(minimumCredits === "" && maximumCredits !== ""){
        boolean3 = (course.credits <= Number(maximumCredits))
        
      }
      else if(minimumCredits !== "" && maximumCredits === ""){
        boolean3 = (course.credits >= Number(minimumCredits))}
      else{
        boolean3 = (course.credits >= Number(minimumCredits)) && (course.credits <= Number(maximumCredits))}

      if(boolean1 && boolean2 && boolean3){
        res.push(course)
      }

    }
    
    
    return res;
  }
}

export default SearchAndFilter;
