var fs = require("fs");
var inquirer = require("inquirer")
var axios = require("axios");
var convertFactory = require("electron-html-to");
var conversion = convertFactory({
  converterPath: convertFactory.converters.PDF
});
const path = require("path");


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
    var favColor = response.color 
    console.log (favColor)
    var {username} = response;
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
    starCount = 0;
    // stars = ???? SEPARATE API CALL?? 

    axios.get("https://api.github.com/users/ellevpark/repos").catch(function(error){
      console.log("BOO! ERROR")
    })
    .then(function(repos){
     
    var repos = repos.data;
    var starCount = 0;
      repos.forEach(repo => {
          starCount += repo.stargazers_count;
        });
        console.log (starCount)
    });
    var generateHTML = `
    <!DOCTYPE html>
   
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link rel="stylesheet" href="style.css">
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
      <script src="https://code.jquery.com/jquery.js"></script>
    
      <title>HW9</title>
      <style>
  
      html, body {
        -webkit-print-color-adjust:exact !important; 
      }
      .color-blue {
        background-color: #00BFFF;
        
      }
    
      .color-green {
        background-color: #006400;
        -webkit-print-color-adjust:exact !important;
    
      }
    
      .color-pink {
        background-color: #FFB6C1;
        -webkit-print-color-adjust:exact !important;
    
      }
      .color-purple {
        background-color: #9370DB;
        -webkit-print-color-adjust:exact !important;
      }
      .links {
        text-align: center; 
      }
      span {
          padding: 20px; 
      }
      #bio {
        text-align: center; 
      }
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
    </head>
    <body>
      <nav class="navbar navbar-light bg-light">
        <a class="navbar-brand" href="#">Navbar</a>
      </nav>
      <div class="container-fluid color-${favColor}">
        <img class= "center circular--square" src="${profImage}" class="rounded mx-auto d-block" alt="GitHub Profile Image">
        <h1>Hi! ${name}</h1>
        <p id= "bio">${bio}</p>
        <div class = "container links">
        <span><a href="https://maps.google.com/?q=${location}">${location}</a></span> <span><a href="${userPage}">GitHub</a></span>
        <span><a href="${blog}">Blog</a></span>
      </div>
      </div>
      <div class="container">
        <div class="row row-cols-2">
          <div class="col card text-white color-${favColor} mb-3" style="max-width: 25rem;">
            <div class="card-body">
              <h5 class="card-title">Public Repositories</h5>
              <p class="card-text"> ${repos}</p>
          </div>
        </div>
        <div class="col card text-white color-${favColor} mb-3" style="max-width: 25rem;">
          <div class="card-body">
            <h5 class="card-title">Followers</h5>
            <p id= "followers" class="card-text">${followers}</p>
        </div>
      </div>
      <div class="col card text-white color-${favColor} mb-3" style="max-width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">GitHub Stars</h5>
          <p id = "stars" class="card-text">${starCount}</p>
      </div>
    </div>
    <div class="col card text-white color-${favColor} mb-3" style="max-width: 25rem;">
      <div class="card-body">
        <h5 class="card-title">Following</h5>
        <p class="card-text">${following}</p>
    </div>
    </div>    
    </div>
      </div>
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