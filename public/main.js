// global variables

//***** Setting up Event Triggers *******/
document.getElementById("login_submit_button").onclick = login_to_firebase;
document.getElementById("register_button").onclick = see_registration_screen;
document.getElementById("see_registry_button").onclick = see_registry_screen;
//This line prevents weird behavior from the form, not sure why it happens
document.getElementById("submit_data_content").onsubmit = (event) => register_new_animal(event);

/** Because I have multiple logout_links and return_homes, use a loop to set them all */
let logout_links = document.getElementsByClassName("logout_link");
for (let link of logout_links) {
    link.onclick = logout_of_firebase;
}

let home_links = document.getElementsByClassName("return_home");
for (let link of home_links) {
    link.onclick = go_home;
}

/*** FUNCTIONS THAT CHANGE SCREENS ***/

function see_registry_screen() {
    update_registry();
    switch_to_screen("show_data_screen");
}

function see_registration_screen() {
    switch_to_screen("submit_data_screen");
}

function go_home() {
    switch_to_screen("home_screen");
}

/** FUNCTIONS THAT WORK WITH THE DATABASE */

function update_registry() {
    // reads in the 'patients" section of our database,
    // loops through it, and adds it to the HTML.

    let database = firebase.database();
    let list = document.getElementById("patient_list");
    list.innerHTML=""; //clear the list
    // this strange-looking ".then" setup is necessary because of the way
    // network code works - since it might take a while, we have to program the possibility
    // of needing to wait for it.
    firebase.database().ref("/patients").once("value").then(
        function(snapshot) {
            //snapshot.val holds an object with all the information
            let patients = snapshot.val();
            
            //Object.keys(patients) gives an array that holds all the possible keys
            // in this case that means each of the patient ID numbers
            for (p of Object.keys(patients)) {
                var newHTML = "<li><details><summary>" + patients[p].name + "</summary>";
                newHTML += "<ul class='w3-ul'><br>";
                newHTML += "<li>Name: " + patients[p].name + "</li>"
                newHTML += "<li>Species: " + patients[p].species + "</li>"
                newHTML += "<li>Color: " + patients[p].color + "</li>"
                newHTML += "<li>Birth Date: " + patients[p].birthdate + "</li>"
                newHTML += "<li>Owner Name: " + patients[p].ownername + "</li>"
                newHTML += "<li>Owner Email: " + patients[p].owneremail + "</li>"
                newHTML += "<li>Unique ID: " + p + "</li>"
                newHTML += "</details></li>\n";
                
                list.innerHTML += newHTML;
            }

            
        }
    )


}

function register_new_animal(event) {
    // this annoying line is needed because forms are weird
    event.preventDefault();
    // but this line is why I used one - nice to get all the inputs at once!
    let elements = document.forms["registration_form"].elements;
    // make a blank new Animal object
    let newAnimal = {};
    // This code will find all input elements inside the form that have
    // a "name" attribute and build an object from the names
    // It's a nice piece of code that should work for ANY form you might make!
    for (el of elements) {
        if (el.name) {
            newAnimal[el.name] = el.value;
        }
    }

    //newAnimal is now an object of the form {name:"Bob", species:"cat", owner:"David", ...}
    
    // now we write this as a new patient to the patients section of our database
    let database = firebase.database();
    // get a reference to the patients database section
    let p = database.ref("/patients");
    // the .push() method automatically gives the record a unique ID and creates a reference to it
    var newPatientRef = p.push();
    // the .set() method actually puts the data in the database
    newPatientRef.set(newAnimal);
    go_home();
    

}

/***** FUNCTIONS THAT DEAL WITH AUTHENTICATION ***/

// detects when a user signs in our out

function login_to_firebase() {
    let email = document.getElementById("login_email_input").value;
    let password = document.getElementById("login_password_input").value;

    //see https://firebase.google.com/docs/auth/web/password-auth
    firebase.auth().signInWithEmailAndPassword(email,password)
    .catch(
        function login_error(error) {
            alert(error);
            console.log(error);
        }
    );
    // the observer below handles what happens when users sign in our oout
}

function logout_of_firebase() {
    firebase.auth().signOut();
}

firebase.auth().onAuthStateChanged(
    // from https://firebase.google.com/docs/auth/web/manage-users
    function (user) {
        if (user) {
            // user just signed in!
            switch_to_screen("home_screen");
        } else {
            // user just signed out!
            switch_to_screen("login_screen");
        }
    }
);

// Utility Functions

function add_username_everywhere() {
    // This function adds the user's name everywhere in the HTML there is is a span with class "username"
    let user = firebase.auth().currentUser;
    let name = user.displayName;
    if (!name) name = "user";
    let allUsernameSpans = document.getElementsByClassName("username");
    for (let i = 0; i < allUsernameSpans.length; i++) {
        allUsernameSpans[i].innerHTML = name;
    }
}

function switch_to_screen(screenId) {
    let newScreen = document.getElementById(screenId);
    // just log it if the screenId is not valid
    if (!newScreen) {
        console.log("Attempted to switch to an invalid screen ID, " + screenId);
        return;
    }

    // get a list of all the screens so we can make sure they are all invisible
    let allScreens = document.getElementsByClassName("screen");

    // loop through the screens and hide them all
    for (let i = 0; i < allScreens.length; i++) {
        allScreens[i].style.display = "none";
    }

    // display the screen we want
    newScreen.style.display = "block";
}