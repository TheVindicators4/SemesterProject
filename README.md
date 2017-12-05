# DJ E-LO GLOBAL - Business Management Website
This is a website built and designed to fulfill the needs of DJ ELO, an artist based in Gainesville, Florida. It's purpose is to increase DJ E-LO's online presence, and give him a central location for interacting with fans and spreading awareness about his music through a personal site outside of modern social networks.
This entire site was built on the MEAN.JS stack, and as such requires the use of the technologies described in the section below for development to occur.

## Link to Deployed Page
You can find the deployed page at http://djelo-sprint-3.herokuapp.com/

## Technologies Used
_This section was derived from the original README of a base-version of a MEAN.JS stack application_
To continue development on this MEAN.JS application, please make sure you have the following on your development machine:

* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower - Use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

```bash
$ npm install -g bower
```

## Major Implemented features
![Alt text](/README-IMG/landing.png?raw=true "Landing Page") Landing Page


## Running The Application Locally

Before running this application, make sure all dependencies are installed by running:

```bash
$ npm install
```

After installing all dependencies, run the application using npm:

```bash
$ npm start
```

The application should run on port 3000 with the *development* environment configuration, so in your browser just go to [http://localhost:3000](http://localhost:3000)


## Testing Your Application
The full test suite included with MEAN.JS can be run with the test task:

```bash
$ npm test
```
This will run both the server-side tests (located in the `app/tests/` directory) and the client-side tests (located in the `public/modules/*/tests/`).

To execute only the server tests, run the test:server task:

```bash
$ npm run test:server
```

To execute only the server tests and run again only changed tests, run the test:server:watch task:

```bash
$ npm run test:server:watch
```

And to run only the client tests, run the test:client task:

```bash
$ npm run test:client
```

## Running the application with Gulp

The MEAN.JS project integrates Gulp as build tools and task automation.

To use Gulp directly, you need to first install it globally:

```bash
$ npm install gulp -g
```

Then start the development environment with:

```bash
$ gulp
```

To run the application with *production* environment configuration, execute gulp as follows:

```bash
$ gulp prod
```

It is also possible to run any Gulp tasks using npm's run command and therefore use locally installed version of gulp, for example: `npm run gulp eslint`



## Credits
This application was made possible by the MEAN.JS stack. Big thanks to Bootstrap, Spotify, and Google Calendars for allowing us to implement some of the many cool features within this application.

## License
