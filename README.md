# ThrillHunter

> A Node.js web application project, dedicated to adrenaline seekers, who love roller coasters and amusement parks

## Live Demo
To see the app in action, go to [ThrillHunter](https://thrillhunter.herokuapp.com/)

## Features

* Authentication:
  
  * User login with username and password

* Authorization:

  * One cannot manage posts and view user profile without being authenticated

  * One cannot edit or delete posts and comments created by other users

* Manage Roller Coasters posts with basic functionalities, such as create, edit and delete posts and comments

* Manage user account with basic functionalities

* Flash messages responding to users' interaction with the app

* Responsive web design


## Services

* A list of the best roller coasters, from all over the world.

* Adding reviews/comments to the roller coasters

* Adding roller coasters to wishlist / visited list.

* "Make Me Thrilled" - randomly choose a roller coaster.


## Getting Started

> This app contains API secrets and passwords that have been hidden deliberately, so the app cannot be run with its features on your local machine. However, feel free to clone this repository if necessary.
If you do want to make this work, you'll need:<br/> <br/> 
> On App.js:
> * set process.env.DATABASEURL to your own MongoDB database server.
> * set process.env.SECRETKEY to your own secret HASH key.<br/><br/>
>
> On initDB.js:
> * set PROCESS.ENV.x_auth_token to your own x_auth_token, by signing up to [Captain Coaster](https://captaincoaster.com/) and getting that API key.


### Clone or download this repository

```sh
git clone https://github.com/amirf2/ThrillHunter.git
```

### Install dependencies

```sh
npm install
```

or

```sh
yarn install
```


## Built with

### Front-end

* [ejs](http://ejs.co/)
* [Bootstrap](https://getbootstrap.com/docs/4.4/getting-started/introduction/)
* [Jquery] (https://code.jquery.com/)

### Back-end


* [express](https://expressjs.com/)
* [express-session](https://github.com/expressjs/session#express-session)
* [method-override](https://github.com/expressjs/method-override#method-override)
* [moment](https://momentjs.com/)
* [mongoose](http://mongoosejs.com/)
* [mongoDB](https://www.mongodb.com/)
* [node-fetch](https://github.com/node-fetch/node-fetch)
* [passport](http://www.passportjs.org/)
* [passport-local](https://github.com/jaredhanson/passport-local#passport-local)
* [passport-local-mongoose](https://github.com/jaredhanson/passport-local#passport-local)
* [connect-flash](https://github.com/jaredhanson/connect-flash#connect-flash)
* [body-parser](https://github.com/expressjs/body-parser)
* [node-url](https://github.com/defunctzombie/node-url)

### Platforms

* [Heroku](https://www.heroku.com/)
