const express = require('express');
const router = express.Router();
const request = require('request');
const models = require("../models");
const jwt = require("jsonwebtoken");

require('dotenv').config();
const access_key = process.env.ACCESS_KEY;

// get app detail
router.get('/', async function(req, res) {
  const ID = req.query.app_id;
  const data = await new Promise(function(resolve, reject) {
    var options = {
      'method' : 'GET',
      'url' : `https://api.appmonsta.com/v1/stores/android/details/${ID}.json?country=US`,
      'headers' : {
        'Authorization': `Basic ${access_key}`
      }
    }
    request(options, function(error, response) {
      if (error) reject(new Error(error));
      else resolve(JSON.parse(response.body));
    });
  });
  res.json(data);
});

  
//Tambahan MING
router.get('/recommendation', async function(req, res) {
const token = req.header("x-auth-token");
var user = {};
if (!token) return res.status(401).send("Token not found");
try { user = jwt.verify(token, "lastofkelasB"); } 
catch (err) { console.log(err); return res.status(401).send("Token Invalid"); } //401 not authorized

user_logon = await models.getUser(user.email);
if(user_logon[0].api_hit > 0){
    const top = await new Promise(function(resolve, reject) {
    var options = {
        'method' : 'GET',
        'url' : `https://api.appmonsta.com/v1/stores/android/rankings.json?country=US&date=2020-06-15`,
        'headers' : {
        'Authorization': `Basic ${access_key}`
        }
    }
    
    request(options, function(error, response) {
        if (error) reject(new Error(error));
        else resolve((response.body).split("\n"));
    });
    });
    data = [];

    for (let i = 0; i < top.length; i++) {
    let stringW = top[i].substring(top[i].search("app_id"),top[i].length);
    let app_id = stringW.substring(stringW.search("app_id"),stringW.search(","));
    let rank = stringW.substring(stringW.search("rank"),stringW.search(","));
    let appid = app_id.substring(9,app_id.length-1);

    data.push({
        "rank" : i+1,
        "app_id" : appid
    });
    }

    var output = {
    "status":200,
    "error" : "",
    "data" : data
    };

    return res.status(200).send(output);
}else{
    return res.status(400).send("API Hit anda sudah habis");
}
});

module.exports = router;