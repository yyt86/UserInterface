const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment')
const app = express()
const fetch = require('node-fetch')
const base64 = require('base-64')

let username = "";
let password = "";
let token = "";

USE_LOCAL_ENDPOINT = false;
// set this flag to true if you want to use a local endpoint
// set this flag to false if you want to use the online endpoint
ENDPOINT_URL = ""
if (USE_LOCAL_ENDPOINT){
ENDPOINT_URL = "http://127.0.0.1:5000"
} else{
ENDPOINT_URL = "https://mysqlcs639.cs.wisc.edu"
}






async function getToken () {

  let request = {
    method: 'GET',
    headers: {'Content-Type': 'application/json',
              'Authorization': 'Basic '+ base64.encode(username + ':' + password)},
    redirect: 'follow'
  }

  const serverReturn = await fetch(ENDPOINT_URL + '/login',request)
  const serverResponse = await serverReturn.json()
  
  token = serverResponse.token
  console.log(token)

  return token;
}

async function getMessage (isUser, text) {
  let request = {
    method: 'POST',
    headers: {'Content-Type': 'application/json',
              'x-access-token': token},
    body: JSON.stringify({ 
      "date": (new Date()).toISOString(),
      "isUser": isUser,
      "text": text,
    }),
    redirect: 'follow'
  }

  const serverReturn = await fetch(ENDPOINT_URL + '/application/messages',request)
  const serverResponse = await serverReturn.json()
  
  message = serverResponse.message
  
  return message;
}

async function clearMessage () {
  let request = {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json',
              'x-access-token': token},
    redirect: 'follow'
  }

  const serverReturn = await fetch(ENDPOINT_URL + '/application/messages',request)
  const serverResponse = await serverReturn.json()
}


app.get('/', (req, res) => res.send('online'))
app.post('/', express.json(), (req, res) => {
const agent = new WebhookClient({ request: req, response: res })

  function welcome () {
    agent.add('Webhook works!')
    console.log(ENDPOINT_URL)
  }

  async function login () {
    // You need to set this from `username` entity that you declare in DialogFlow
    username = agent.parameters.username
    // You need to set this from password entity that you declare in DialogFlow
    password = agent.parameters.password
    console.log(username)
    await getToken()
    await clearMessage()
    await getMessage(true, agent.query)
    

    if(token == "" || typeof token == 'undefined'){
      agent.add("Login unsuccessfully.") 
    }
    else{
      await getMessage(false, "Welcome back " + username)
      agent.add("Welcome back " + username) 
    }

  }

 

  async function category() {
      let request = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        redirect: 'follow'
      }
    
      const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/categories',request)
      const serverResponse = await serverReturn.json()
      
      return serverResponse;
    
  }

  async function getCategory(){
    await getMessage(true, agent.query)
    let serverResponse = await category();
    let categories = serverResponse.categories.join(',')
    
    await getMessage(false, "Our categories are: " + categories + ".")
    agent.add("Our categories are: " + categories + ".")
  }




  async function tags(category) { 
    let request = {
      method: 'GET',
      redirect: 'follow'
    }
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/categories/' + category + '/tags',request)
    const serverResponse = await serverReturn.json()
    
    return serverResponse;
  }

  async function getTags () {
    let category = agent.parameters.category;
    await getMessage(true, agent.query)
    let request = {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      redirect: 'follow'
    }
  
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/categories',request)
    const allCategory = await serverReturn.json()
    if(!allCategory.categories.includes(category)){
      agent.add("Category" + category + "does not exist.")
      await getMessage(false, "Category" + category + "does not exist.")
    }
    let request1 = {
      method: 'GET',
      redirect: 'follow'
    }
    const serverReturn1 = await fetch('https://mysqlcs639.cs.wisc.edu/categories/' + category + '/tags',request1)
    const serverResponse = await serverReturn1.json()
    
    console.log(category)
    
    let tags = serverResponse.tags.join(', ')

    
    await getMessage(false, "Tags in category " + category + " are: " + tags + ".")
    agent.add("Tags in category " + category + " are: " + tags + ".")
  }

  async function getCart () {
    await getMessage(true, agent.query)
    if(token == "" || typeof token == 'undefined'){
      agent.add("You haven't logged in.") 
      return
    }
    let request = {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
  
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/application/products', request)
    const serverResponse = await serverReturn.json()

    
    let totalPrice = 0.0
    let count = 0
    let cartItems = ""
    let cartMessage = ""

    if(serverResponse.products == null || typeof serverResponse.products == 'undefined'){
      cartMessage = "Nothing in you cart."
    }
    else{
      for(const item of serverResponse.products.values()){
        count += item.count;
        totalPrice += item.price*item.count;
        cartItems += " " + item.count + " " + item.name + ","
      }
      cartMessage = "There are " + count + " items in your cart, they are:" + cartItems + 
       "the total price is " + totalPrice
    }
    
    
    await getMessage(false, cartMessage)
    agent.add(cartMessage)
  }


  async function getProduct () {
    let productName = agent.parameters.product;
    await getMessage(true, agent.query)
    let request = {
      method: 'GET',
      redirect: 'follow'
    }
    console.log(productName)
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/products', request)
    const serverResponse = await serverReturn.json()
    
    let productItems = ""
    let found = false
    if(serverResponse.products == null || typeof serverResponse.products == 'undefined'){
      productItems = "No products."
    }
    else{
      console.log(serverResponse.products.length)
      for(const item of serverResponse.products.values()){
        
        if(item.name == productName ){
          productItems = item.name + ", " + item.description + ", belongs to " + item.category + 
          ". The price of it is " + item.price + " ."
          found = true

          let request1 = {
            method: 'GET',
            redirect: 'follow'
          }
        
          const serverReturn1 = await fetch('https://mysqlcs639.cs.wisc.edu/products/' + item.id + '/reviews', request1)
          const serverResponse1 = await serverReturn1.json()
          if(serverResponse1.reviews == null || typeof serverResponse1.reviews == 'undefined'){
            productItems += " No reviews for " + item.name
          }
          else{
            let reviewNum = 0
            let totalRating = 0.0
            for(const review of serverResponse1.reviews.values()){
              reviewNum += 1
              totalRating += review.stars
            }
            productItems += "The average rating is " + totalRating/reviewNum + " ."
          }
          break
        }
      }
      if(!found){
        productItems = "Product doesn't exist."
      }
    }
    
    
    await getMessage(false, productItems)
    agent.add(productItems)

  }


  async function postTags (tag) {
    let request = {
      method: 'POST',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
  
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/application/tags/' + tag, request)
    const serverResponse = await serverReturn.json()
  }

  async function narrowTag () {
    let tagName = agent.parameters.tag
    let tagMess = ""
    await getMessage(true, agent.query)
    let request = {
      method: 'GET',
      redirect: 'follow'
    }
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/tags',request)
    const serverResponse = await serverReturn.json()
    


    if(token == "" || typeof token == 'undefined'){
      agent.add("You haven't logged in.") 
      return
    }
    let request1 = {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
    const serverReturn1 = await fetch('https://mysqlcs639.cs.wisc.edu/application/tags',request1)
    const serverResponse1 = await serverReturn1.json()

    if(serverResponse.tags == null || typeof serverResponse.tags == 'undefined'){
      tagMess = "No tags."
    }
    else{
      let found = false
      console.log(serverResponse.tags.length)
      for(const tag of serverResponse.tags.values()){
        
        if(tag == tagName){
          found = true
          
          if(typeof serverResponse1.tags == 'undefined' || !serverResponse1.tags.includes(tagName)){
            await postTags(tagName)
            tagMess = "We add tag" + tagName + " for you."
          }
          else{
            tagMess = "Tag " + tagName + " is existing."
          }
          break
        }
        
      }
      if(!found){
        tagMess = tagName + " not found."
      }
    }
    
    await getMessage(false, tagMess)
    agent.add(tagMess)
  }

  async function deleteTags (tag) {
    let request = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
  
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/application/tags/' + tag, request)
    const serverResponse = await serverReturn.json()
  }

  async function deleteAppTag () {
    let tagName = agent.parameters.tag
    let tagMess = ""
    await getMessage(true, agent.query)

    if(token == "" || typeof token == 'undefined'){
      agent.add("You haven't logged in.") 
      return
    }
    let request = {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
    const serverReturn1 = await fetch('https://mysqlcs639.cs.wisc.edu/application/tags',request)
    const serverResponse1 = await serverReturn1.json()

    if(serverResponse1.tags == null || typeof serverResponse1.tags == 'undefined'){
      tagMess = "No tags."
    }
    else{
      let found = false
      for(const tag of serverResponse1.tags.values()){
        if(tag == tagName){
          
          found = true
            await deleteTags(tagName)
            tagMess = "Tag " + tagName + " is deleted."
          break
        }
        
      }
      if(!found){
        tagMess = tagName + " not found."
      }
    }
    
    await getMessage(false, tagMess)
    agent.add(tagMess)
  }


  async function clearAppTag () {
    let tagMess = "all tags in application are cleared."
    await getMessage(true, agent.query)
    if(token == "" || typeof token == 'undefined'){
      agent.add("You haven't logged in.") 
      return
    }
    let request = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
  
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/application/tags', request)
    const serverResponse = await serverReturn.json()

    
    await getMessage(false, tagMess)
    agent.add(tagMess)

  }

  async function postCart (productID) {
    let request = {
      method: 'POST',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
  
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/application/products/' + productID, request)
    const serverResponse = await serverReturn.json()
  }


  async function addToCart () {
    let productName = agent.parameters.product;
    let count = agent.parameters.number;
    await getMessage(true, agent.query)
    
    let request = {
      method: 'GET',
      redirect: 'follow'
    }
    console.log(productName)
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/products', request)
    const serverResponse = await serverReturn.json()

    if(token == "" || typeof token == 'undefined'){
      agent.add("You haven't logged in.") 
      return
    }
    let request1 = {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
  
    const serverReturn1 = await fetch('https://mysqlcs639.cs.wisc.edu/application/products', request1)
    const serverResponse1 = await serverReturn1.json()
    
    let productItems = ""
    let found = false
    if(serverResponse.products == null || typeof serverResponse.products == 'undefined'){
      productItems = "No products."
    }
    else{
      for(const item of serverResponse.products.values()){
        
        if(item.name == productName ){
          found = true
          // if(typeof serverResponse1.products != 'undefined' && serverResponse1.products.includes(productName)){
            for(let i = 0; i<count; i++){
              await postCart(item.id)
              console.log("add 1 item")
            }
            productItems = count + productName + " are added into cart."
            break
          }
          
          
        }
        if(!found){
          productItems = productName + " not in product items."
        }
      
    }
    await navigation("/" + username + "/cart")
    
    await getMessage(false, productItems)
    agent.add(productItems)
  }

  async function removeCart (productID) {
    let request = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
  
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/application/products/' + productID, request)
    const serverResponse = await serverReturn.json()
  }


  async function removeFromCart () {
    let productName = agent.parameters.product;
    let count = agent.parameters.number;
    await getMessage(true, agent.query)
    await navigation("/" + username + "/cart")
    if(token == "" || typeof token == 'undefined'){
      agent.add("You haven't logged in.") 
      return
    }
    let request1 = {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
  
    const serverReturn1 = await fetch('https://mysqlcs639.cs.wisc.edu/application/products', request1)
    const serverResponse1 = await serverReturn1.json()
    
    
    let productItems = ""
    let found = false
    if(serverResponse1.products == null || typeof serverResponse1.products == 'undefined'){
      productItems = "No products in cart."
    }
    else{
      for(const item of serverResponse1.products.values()){
        
        if(item.name == productName ){
          found = true
          if(count <= item.count){
            for(let i = 0; i<count; i++){
              await removeCart(item.id)
            }
            productItems = count + productName + " are removed."
          }
          else{
            productItems = "No more than " + count +" "+ productName + " are in cart."
          }
          break
        }
      }
      if(!found){
        productItems = productName + " is not in cart."
      }
    }
    
    await getMessage(false, productItems)
    agent.add(productItems)
  }


  async function clearCart () {
    let productItems = "All product in are cleared."
    await getMessage(true, agent.query)
    await navigation("/" + username + "/cart")
    if(token == "" || typeof token == 'undefined'){
      agent.add("You haven't logged in.") 
      return
    }
    let request = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
  
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/application/products', request)
    const serverResponse = await serverReturn.json()

    
    await getMessage(false, productItems)
    agent.add(productItems)

  }

  async function navigation(page) {
    
    let request = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      body: JSON.stringify({
        "back": false,
        "dialogflowUpdated": true,
        "page": page}),
      redirect: 'follow'
    }
  
    const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/application', request)
    const serverResponse = await serverReturn.json()
    
  }

  async function cartReview () {
    let productMess = ""
    await getMessage(true, agent.query)
    if(token == "" || typeof token == 'undefined'){
      agent.add("You haven't logged in.") 
      return
    }
    let request = {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
  
    const serverReturn1 = await fetch('https://mysqlcs639.cs.wisc.edu/application/products', request)
    const serverResponse1 = await serverReturn1.json()
    
    if(serverResponse1.products == null || typeof serverResponse1.products == 'undefined' || serverResponse1.products.length == 0){
      productMess = "No products in cart."
    }
    else{
      await navigation("/" + username + "/cart-review")
      productMess = "Please review your cart."
    }
    
    await getMessage(false, productMess)
    agent.add(productMess)
  }

  async function cartConfirm () {
    await getMessage(true, agent.query)
    let productMess = "Pleasure confirm your cart."
    if(token == "" || typeof token == 'undefined'){
      agent.add("You haven't logged in.") 
      return
    }
    await navigation("/" + username + "/cart-confirmed")
    
    
    await getMessage(false, productMess)
    agent.add(productMess)
  }

  async function pageNavigation () {
 
    let category = agent.parameters.category
    let product = agent.parameters.product
    let pageIntent = agent.parameters.pageIntent
    let pageMess = ""
    await getMessage(true, agent.query)
    if(token == "" || typeof token == 'undefined'){
      agent.add("You haven't logged in, can't go to that page.") 
      return
    }

    if(pageIntent == "welcome"){
      await navigation("/")
      pageMess = "Welcome to the WiscShop."
    }
    else if(pageIntent == "sign in" || pageIntent == "log in"){
      await navigation("/signIn")
      pageMess = "Current page is sign in page."
    }
    else if(pageIntent == "sign up"){
      await navigation("/signUp")
      pageMess = "Current page is sign up page."
    }
    
    
    if(username != ""){

      if(category == "" &&  product == ""){
        if(pageIntent == "home"){
          await navigation("/" + username)
          pageMess = "Welcome to the your home page."
        }
        else if(pageIntent == "cart"){
          await navigation("/" + username + "/cart")
          pageMess = "Current page shows your products in cart."
        }
        else if(pageIntent == "review cart"){
          await navigation("/" + username + "/cart-review")
          pageMess = "Now you can review your products in cart."
        }
        else if(pageIntent == "confirm cart"){
          await navigation("/" + username + "/cart-confirmed")
          pageMess = "Please confirm your products in cart."
        }
      }
      else if(category != "" && product == ""){
        await navigation("/" + username + "/" + category)
        pageMess = "Current page shows the products in category " + category + " ."
      }
      else if((category == "" && product != "") || (category != "" && product != "")){
        let request = {
          method: 'GET',
          redirect: 'follow'
        }
        
        const serverReturn = await fetch('https://mysqlcs639.cs.wisc.edu/products', request)
        const serverResponse = await serverReturn.json()
        let found = false
        for(const item of serverResponse.products.values()){
          if(item.name == product){
            found = true
            await navigation("/" + username + "/" + item.category + "/products/" + item.id)
            pageMess = "This is the detail information of " + product + " ."
            break
          }
        }
        if(!found){
          pageMess = "We can't find the product name."
        }
      
      }
    }
    
    await getMessage(false, pageMess)
    agent.add(pageMess)
  }


 





  let intentMap = new Map()
  intentMap.set('Default Welcome Intent', welcome)
  // You will need to declare this `Login` content in DialogFlow to make this work
  intentMap.set('Login', login) 
  intentMap.set('getCategory', getCategory)
  intentMap.set('getTags', getTags)
  intentMap.set('getCart', getCart)
  intentMap.set('getProduct', getProduct)
  intentMap.set('narrowTag', narrowTag)
  intentMap.set('deleteAppTag', deleteAppTag)
  intentMap.set('clearAppTag', clearAppTag)
  intentMap.set('addToCart', addToCart)
  intentMap.set('removeFromCart', removeFromCart)
  intentMap.set('clearCart', clearCart)
  intentMap.set('cartReview', cartReview)
  intentMap.set('cartConfirm', cartConfirm)
  intentMap.set('pageNavigation', pageNavigation)
  agent.handleRequest(intentMap)
})

app.listen(process.env.PORT || 8080)
