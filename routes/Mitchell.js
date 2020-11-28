const express = require('express');
const router = express.Router();
const request = require('request');
const models = require("../models");
const jwt = require("jsonwebtoken");

require('dotenv').config();
const access_key = process.env.ACCESS_KEY;

// Wishlist
router.get('/', async function(req, res) {
  const token = req.header("x-auth-token");
  var user = {};
  if (!token) return res.status(401).send("Token not found");
  try { user = jwt.verify(token, "lastofkelasB"); } 
  catch (err) { return res.status(401).send("Token Invalid"); }
  const email = user.email;
  const wishlists = await models.getWishlist(email);
  const result = [];
  wishlists.forEach(wishlist => { result.push(wishlist.app_id); });
  if (result) res.status(200).send({app_id: result});
});
router.post('/', async function(req, res) {
  const token = req.header("x-auth-token");
  var user = {};
  if (!token) return res.status(401).send("Token not found");
  try { user = jwt.verify(token, "lastofkelasB"); }
  catch (err) { return res.status(401).send("Token Invalid"); }
  const email = user.email;
  const app_id = req.body.app_id;
  const appCheck = await new Promise(function(resolve, reject) {
    var options = {
      'method' : 'GET',
      'url' : `https://api.appmonsta.com/v1/stores/android/details/${app_id}.json?country=US`,
      'headers' : {
        'Authorization': `Basic ${access_key}`
      }
    }
    request(options, function(error, response) {
      if (error) reject(new Error(error));
      else resolve(JSON.parse(response.body));
    });
  });
  if (appCheck.message) return res.status(400).send({message:"Aplikasi tidak ditemukan"});
  const wishlists = await models.getWishlist(email);
  wishlists.forEach(wishlist => { if (wishlist.app_id == app_id) return res.status(400).send({message:"Aplikasi sudah ada di wishlist"}); });
  const result = await models.insertWishlist(email, app_id);
  if (result) res.status(200).send({message:"app berhasil ditambahkan ke wishlist"});
});
router.delete('/', async function(req, res) {
  const token = req.header("x-auth-token");
  var user = {};
  if (!token) return res.status(401).send("Token not found");
  try { user = jwt.verify(token, "lastofkelasB"); } 
  catch (err) { return res.status(401).send("Token Invalid"); }
  const email = user.email;
  const app_id = req.body.app_id;
  const appCheck = await models.getWishlist(email, app_id);
  if (appCheck.length == 0) return res.status(400).send({message:"Aplikasi tidak ditemukan"});
  const result = await models.deleteWishlist(email, app_id);
  if (result) res.status(200).send({message:"app berhasil dibuang dari wishlist"});
});

module.exports = router;