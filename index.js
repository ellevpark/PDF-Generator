var fs = require("fs");
var inquirer = require("inquirer")
var axios = require("axios");
var convertFactory = require("electron-html-to");
var conversion = convertFactory({
  converterPath: convertFactory.converters.PDF
});
const path = require("path");

var colors = {
  green: {
    background: "#006400",
  },
  blue: {
    background: "#00BFFF",
  },
  pink: {
    background: "#FFB6C1",
  },
  purple: {
    background: "#9370DB",
  }
};
// ​var username = ""; 
// var name = ""; 
// var profImage= ""; 
// var bio= ""; 
// var location= ""; 
// var blog = ""; 
// var favColor = ""; 
// var followers = ""; 
// var following = ""; 
// var repo= ""; 
// var userSite= "";
// var stars= "";
inquirer.prompt([
  {
      type: "input",
      message: "What is your GitHub username?",
      name: "username"
  },
  {
      type: "list",
      message: "What is your favorite color?",
      name: "color",
      choices: ["pink", "blue", "green", "purple"]
  }
])
.then(function(response){
    console.log(response.list)
    var favColor = response.color 
    // if (favColor === colors[]){
    // }
    var userColor = response.color;
    var {username} = response;
    //TODO: COLORS 
  var queryURL = `https://api.github.com/users/${username}`;
  axios.get(queryURL)
  .then(function(res){
    username = res.data.login;
    name = res.data.name || "Nobody in particular"; 
    profImage = res.data.avatar_url; 
    bio= res.data.bio;
    location = res.data.location;
    blog = res.blog;
    followers = res.data.followers;
    following = res.data.following;
    repos = res.data.public_repos;
    userPage = res.data.html_url;
    // stars = ???? SEPARATE API CALL?? 
    var generateHTML = `
    <!DOCTYPE html>
    <style>
    </style>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link rel="stylesheet" href="style.css">
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
      <script src="https://code.jquery.com/jquery.js"></script>
    
      <title>HW9</title>
      
    </head>
    <body>
      <nav class="navbar navbar-light bg-light">
        <a class="navbar-brand" href="#">Navbar</a>
      </nav>
      <div class="container-fluid ${favColor}">
        <img class= "center circular--square" src="${profImage}" class="rounded mx-auto d-block" alt="GitHub Profile Image">
        <h1>Hi! ${name}</h1>
        <p>${bio}</p>
        <span><a href="https://maps.google.com/?q=${location}">${location}</a></span> <span><a href="${userPage}">GitHub</a></span>
        <span><a href="${blog}">Blog</a></span>
      </div>
      <div class="container">
        <div class="row row-cols-2">
          <div class="col card text-white ${favColor} mb-3" style="max-width: 25rem;">
            <div class="card-body">
              <h5 class="card-title">Public Repositories</h5>
              <p class="card-text"> ${repos}</p>
          </div>
        </div>
        <div class="col card text-white ${favColor} mb-3" style="max-width: 25rem;">
          <div class="card-body">
            <h5 class="card-title">Followers</h5>
            <p id= "followers" class="card-text">${followers}</p>
        </div>
      </div>
      <div class="col card text-white ${favColor} mb-3" style="max-width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">GitHub Stars</h5>
          <p id = "stars" class="card-text"></p>
      </div>
    </div>
    <div class="col card text-white ${favColor} mb-3" style="max-width: 25rem;">
      <div class="card-body">
        <h5 class="card-title">Following</h5>
        <p class="card-text">${following}</p>
    </div>
    </div>    
    </div>
      </div>
    
      <style>
        
      nav {
        height: 5em;
        }
        
        .circular--square {
          border-radius: 50%;
          display: block;
          margin: 0 auto;
          position: relative;
          width: 10em;
          height: 10em; 
        }
        h1 {
          text-align: center;
        }
        
        .col{
          padding: 1em;
          margin: 1em;
        }
        
        .img-fluid, .img-thumbnail {
          max-width: 100%;
          height: auto;
        }
    </style>
    `
    conversion({ html: generateHTML}, function(err, result) {
        console.log("num of pages ", result.numberOfPages)
        console.log("num of pages ", result.logs)
      if (err) {
          return console.error(err);
      }
      result.stream.pipe(fs.createWriteStream(path.join(__dirname, "resume.pdf")));
      conversion.kill()
      })
    
  })
})