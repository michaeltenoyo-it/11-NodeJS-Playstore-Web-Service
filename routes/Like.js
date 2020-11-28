const express = require('express');
const router = express.Router();
const request = require('request');
const models = require("../models");
const jwt = require("jsonwebtoken");

require('dotenv').config();
const access_key = process.env.ACCESS_KEY;

router.post('/', async function(req,res){
    let ratingID = req.body.ratingID;
    let comment = req.body.comment;
    if(!ratingID) res.status(400).send("ID Rating harus dicantumkan!");
    const token = req.header("x-auth-token");
    let user = {};
    if (!token) return res.status(401).send("Token not found");
    try { user = jwt.verify(token, "lastofkelasB"); } 
    catch (err) { return res.status(401).send("Token Invalid"); } //401 not authorized
    let email = user.email;
    let result = await models.insertLikeonRating(ratingID, comment, email); 
    if(result) res.status(200).send("Insert like pada rating dengan ID "+ratingID+" berhasil!")
    else res.status(400).send("Insert rating gagal.")
});

router.delete('/', async function(req,res){
    let likeID = req.body.likeID;
    if(!likeID) res.status(400).send("ID Rating harus dicantumkan!");
    const token = req.header("x-auth-token");
    let user = {};
    if (!token) return res.status(401).send("Token not found");
    try { user = jwt.verify(token, "lastofkelasB"); } 
    catch (err) { return res.status(401).send("Token Invalid"); } //401 not authorized
    let result = await models.deleteLikeonRatingbyID(likeID);
    if(result)res.status(200).send("Rating berhasil dihapus!");
});

module.exports = router;