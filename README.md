# Porto Recanati Portal Web Application
Web platform referring to the city of Porto Recanati, where users can register and upload meaningful photos

## Development
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.10.
The backend is costructed using Nodejs with Expressjs (https://expressjs.com).
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Library Used
Project is created with:
* Leaflet.js: open-source JavaScript library for mobile-friendly interactive maps (https://leafletjs.com)
* Multer:  middleware for uploading files (https://www.npmjs.com/package/multer)
* Jimp: image processing library for Node written entirely in JavaScript (https://www.npmjs.com/package/jimp)
* mysql2: MySQL client for Node.js with focus on performance (https://www.npmjs.com/package/mysql2)
* bcrypt: A library to help you hash passwords (https://www.npmjs.com/package/bcrypt) 
* bootstrap: a powerful, feature-packed frontend toolkit (https://getbootstrap.com)

## Running the project

In the first place, it is necessary to generate the database structure, using the files present in the "database" folder.
To run this project, install the dependencies using npm:

```
npm install
```

To run the front-end

```
ng serve --o
```

Open a second terminal and run the backend

```
cd backend
```
```
node index.js
```


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io). To run selenium test in the first place you have to install on your pc ChromeDrivers(https://chromedriver.chromium.org/downloads). After that, open a terminal:

```
cd selenium-test
```
```
node index.js
```


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
