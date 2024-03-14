// Imports for firebase connectivity 
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, onValue, push, ref, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

/* Firebase database link */
const appSettings = {
    databaseURL: 'https://realtime-database-8b01f-default-rtdb.europe-west1.firebasedatabase.app/'
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value

    push(shoppingListInDB, inputValue)

    clearInputField()
    
})

onValue(shoppingListInDB, function(snapshot){

    if(snapshot.exists()) {

    //Getting an array with ID and values
    let itemsArray = Object.entries(snapshot.val())

    console.log(snapshot.val())

    clearShoppingListEl()

    //Loop to iterate on itemsArray and console log every item
    for (let i =0; i < itemsArray.length;i++){
        //Getting the current item
        let currentItem = itemsArray[i]

        let currentItemID = currentItem[0]
        let currentItemValue = currentItem[1]

        appendItemToShoppingListEl(itemsArray[i])
    }
}
    else {
        shoppingListEl.innerHTML = "No items here... yet"
    }

})
//Clearing the previous listed item to avoid duplication 
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

//Input field will be cleared thanks to this function
function clearInputField() {
    inputFieldEl.value = ""
}
//Adding new item to the list
function appendItemToShoppingListEl(item) {
    // shoppingListEl.innerHTML += `<li>${itemValue}</li>`

    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")

    newEl.textContent = itemValue

    //Attaching event listener to the newEl, in order to allow us to remove items from the list
    newEl.addEventListener("click",function() {
        
       let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}` )

       remove(exactLocationOfItemInDB)
})

    shoppingListEl.append(newEl)

}
