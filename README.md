Steps to use this project (there may be other pathways):

1. Visit http://firebase.google.com and create an account if you don't have one, using your google account.
2. Create a new project in your console.
3. Enable Realtime Database, Hosting, and Authentication by e-mail and password. Add a user in the Authentication section.
3. On your computer, open a terminal window and type `npm install -g firebase-tools`
4. Once that completes, type `firebase login` . A browser window should open up to let you log in to Firebase.
5. Use the `cd` and `mkdir` commands in your command line to navigate to an empty folder where you can store your project.
   1. For example, you might type `cd ibcs` to get in your ibcs folder, then `mkdir web-app` to make a folder called web-app, then `cd web-app` to navigate to the web-app folder.
6. Type `firebase init`. It will give you several prompts. Make sure to enable Realtime Database and Hosting, and "Connect to an existing project", where you can choose the project you made in steps 2-3 . Accept the default for all other prompts.
7. Open the folder in Visual Studio Code. You can usually do this by typing `code .` or you can open VS Code yourself and chooce "File->Open Folder" then navigate to the folder you just made.
8. Copy and paste the code in `public/index.html` from github into the `public/index.html` in the project on VS Code, overwriting the old code.
9. Create new files in `public` on your computer called `main.css` and `main.js` and copy the code from this project into those files
10. Go back to VS Code, open a Terminal with `Terminal -> New Terminal` and in that terminal type `firebase serve`. After a minute, a link should show up like `https://localhost:5000`. Navigate to the site to test the app
11. Have fun tweaking and coding! I added comments to help as much as I could.