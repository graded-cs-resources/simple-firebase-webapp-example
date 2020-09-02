// #region --- GLOBAL VARIABLES --- //
var patient_register = {}
// #endregion

// #region --- EVENT TRIGGER SETUP --- //
document.getElementById("login_submit_button").onclick = login_to_firebase;
document.getElementById("register_button").onclick = see_registration_screen;
document.getElementById("see_registry_button").onclick = see_registry_screen;
//This line prevents weird behavior from the form, not sure why it happens
document.getElementById("submit_data_content").onsubmit = (event) => register_new_animal(event);

/* Because I have multiple logout_links and return_homes, use a loop to set them all */
let logout_links = document.getElementsByClassName("logout_link");
for (let link of logout_links) {
    link.onclick = logout_of_firebase;
}

let home_links = document.getElementsByClassName("return_home");
for (let link of home_links) {
    link.onclick = go_home;
}
//#endregion

// #region --- NAVIGATION FUNCTIONS --- //

/** runs when "see registry" is called */
function see_registry_screen() {
    switch_to_screen("show_data_screen");
}

function see_registration_screen() {
    switch_to_screen("submit_data_screen");
}

function go_home() {
    switch_to_screen("home_screen");
}

function go_to_login() {
    switch_to_screen("login_screen");
}
// #endregion

// #region --- PATIENT REGISTRY READ AND WRITE FUNCTIONS --- //

/** Read in the initial database when the program first runs */

/** 
 * Listens for new patients and updates the register as they are added 
 * Surprisingly, this gets called for all children on load, so no need
 * for an official load!
 * */

firebase.database().ref("/patients").on('child_added',
    function (data) {
        patient_register[data.key] = data.val();
        add_patient_html(data.key);
    }
);

/** Makes the HTML in the patient register match the database */
function add_patient_html(p) {

    var list = document.getElementById("patient_list");
    var newHTML = "<li><details><summary>" + patient_register[p].name + "</summary>";
    newHTML += "<ul class='w3-ul'><br>";
    newHTML += "<li>Name: " + patient_register[p].name + "</li>"
    newHTML += "<li>Species: " + patient_register[p].species + "</li>"
    newHTML += "<li>Color: " + patient_register[p].color + "</li>"
    newHTML += "<li>Birth Date: " + patient_register[p].birthdate + "</li>"
    newHTML += "<li>Owner Name: " + patient_register[p].ownername + "</li>"
    newHTML += "<li>Owner Email: " + patient_register[p].owneremail + "</li>"
    newHTML += "<li>Unique ID: " + p + "</li>"
    newHTML += "</details></li>\n";

    list.innerHTML += newHTML;
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

    // get a reference to the patients database section
    let patient_ref = firebase.database().ref("/patients");
    // the .push() method automatically gives the record a unique ID and creates a reference to it
    var newPatientRef = patient_ref.push();
    // the .set() method actually puts the data in the database
    newPatientRef.set(newAnimal);
    go_home();
}
// #endregion

// #region --- AUTHENTICATION FUNCTIONS --- //

/** Logs in to firebase */
function login_to_firebase() {
    let email = document.getElementById("login_email_input").value;
    let password = document.getElementById("login_password_input").value;

    //see https://firebase.google.com/docs/auth/web/password-auth
    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(
            function login_error(error) {
                alert(error);
                console.log(error);
            }
        );
    // the observer below handles what happens when users sign in our oout
}

/** Logs out of firebase */
function logout_of_firebase() {
    firebase.auth().signOut();
}

/** Listens for a login, logout, or load event and navigates user to the proper page */
firebase.auth().onAuthStateChanged(
    // from https://firebase.google.com/docs/auth/web/manage-users
    function (user) {
        if (user) {
            // user just signed in!
            go_home();
        } else {
            // user just signed out!
            go_to_login();
        }
    }
);
// #endregion

// #region --- UTILITY FUNCTIONS --- //

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
// #endregion