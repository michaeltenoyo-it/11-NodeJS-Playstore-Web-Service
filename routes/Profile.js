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

router.put("/update_profile" , upload,  async function(req,res){
    var username  = req.body.username;
    var password = req.body.password;
    var profile_picture = req.file;
    const token = req.header("x-auth-token");
    var user = 1;
    if(!token) res.status(400).send({message : "Anda harus melakukan login terlebih dahulu."})
    else{
        try{
            user = jwt.verify(token,"lastofkelasB");
        }catch(err){
            console.log(token)
            return res.status(401).send({message : "Token Invalid harap lakukan login ulang"});
        }
        let result = await models.update_profile(username, password, user.email + path.extname(req.file.originalname).toLowerCase(), user.email)
        if(result)res.status(200).send({message : "Profile berhasil di update"})
        else res.status(404).send({message : "user dengan email tersebut tidak ditemukan"})
    }
});

router.put("/upgrade_premium", async function(req,res){
    var credit_card_number = req.body.credit_card_number;
    var expired_month = req.body.expired_month;
    var expired_year = req.body.expired_year;
    var cvc = req.body.cvc;
    const token = req.header("x-auth-token");
    var user = 1;
    if(!token) res.status(400).send("Anda harus melakukan login terlebih dahulu.")
    else{
        try{
            user = jwt.verify(token,"lastofkelasB");
        }catch(err){
            return res.status(401).send("Token Invalid harap lakukan login ulang");
        }
        if(user.level == 1){
            stripe.tokens.create(
                {
                  card: {
                    number: credit_card_number,
                    exp_month: expired_month,
                    exp_year: expired_year,
                    cvc: cvc,
                  },
                },
                async function(err, token) {
                    if(err)res.status(400).send(err)
                    else{
                        console.log(token)
                        var biaya = 10000000;
                        var charge = stripe.charges.create({
                            amount : biaya,
                            currency : "idr",
                            source : token.id
                        }, async function(err,charge){
                            if(err && err.type ==="stripeCardError"){
                                res.status(400).send("Kartu anda telah ditolak")
                            }
                            else{
                                let result = upgrade_user(user.email);
                                if(result) res.status(200).send({message : "Pembayaran telah berhasil dilakukan, anda telah menjadi premium member"})
                                else res.status(404).send({message : "user dengan email tersebut tidak ditemukan"})
                            }
                        })
                    }
                }
              );
        }
        else{
            return res.send(400).send("anda sudah terdaftar sebagai premium member")
        }
    }
});

module.exports = router;