require('dotenv').config()
const express = require("express");
const router = express.Router();
const request = require('request');
const fs = require('fs');
const path = require('path');
const multer = require("multer");
const models = require("../models");
const jwt = require("jsonwebtoken");
const stripe = require('stripe')(process.env.STRIPED_SECRET_KEY);
const midtransClient = require('midtrans-client');
const access_key = process.env.ACCESS_KEY;

//SET STORAGE ENGINE
const storage=multer.diskStorage({
    destination:'./public/uploads',
    filename:function(req,file,cb){
        cb(null,req.body.email + path.extname(file.originalname));
    }
});

const upload=multer({
    storage:storage,
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
}).single('profile_picture');

function checkFileType(file,cb){
    const filetypes= /jpeg|jpg|png|gif/;
    const extname=filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype=filetypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null,true);
    }else{
        cb('Error: Image Only!');
    }
}

async function upgrade_user(email){
    let result = await models.upgrade_user(email)
    return result
}

async function insert_to_vote(id_app, id_list_vote, indeks_pilihan_vote){
    const data = await new Promise(function(resolve, reject) {
        var options = {
            'method' : 'GET',
            'url' : `https://api.appmonsta.com/v1/stores/android/details/${id_app}.json?country=US`,
            'headers' : {
            'Authorization': `Basic ${access_key}`
            }
        }
        request(options,function(error, response) {
            if (error) reject(new Error(error));
            else resolve(JSON.parse(response.body));
        });
        });
    await models.insert_vote(data, id_list_vote, indeks_pilihan_vote)
    return true;
}

router.post('/register',async function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    
    if(username == ""|| password == "" || email == "") res.status(400).send({message : "ada field yang tidak diisi"});
    let result = await models.register_user(username, password, email);
    if(!result) res.status(400).send({message : "register gagal email pernah digunakan"})
    else res.status(200).send({
        message : "register berhasil"
    })
});

router.post("/login" ,async function(req,res){
    var email = req.body.email;
    var password = req.body.password;

    let result = await models.login_user(email, password);
    if(!result) res.status(400).send({message : "Login gagal user tidak ditemukan"})
    else{
        const token = jwt.sign({    
            "email":result.email,
            "level":result.tipe_user
        }   ,"lastofkelasB", {expiresIn : '1h'});
        res.status(200).send(token);
    }
});

router.get('/test', function(req,res){
    res.status(200).send("waow")
});

module.exports = router;