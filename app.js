const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
const request = require('request');
const mc = require("./routes/mc");
const mitchell = require("./routes/Mitchell");
const nestor = require("./routes/Nestor");
const likeRoutes = require("./routes/Like");
const appRoutes = require("./routes/App");
const profileRoutes = require("./routes/Profile");
const votingRoutes = require("./routes/Voting");
require('dotenv').config()

//Ming
const post = require("./routes/post");

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use("/api/user" , mc);
app.use("/api/profile", profileRoutes);
app.use("/api/voting",votingRoutes);
app.use(express.static('./public'));

app.set('view engine','ejs');
const access_key = process.env.ACCESS_KEY;
const stripe_secret_key = process.env.STRIPED_SECRET_KEY;
const stripe_public_key = process.env.STRIPED_PUBLIC_KEY;

//nestor
app.use("/api/rating",nestor);
app.use("/api/like",likeRoutes);

//Mitchell
app.use("/api/wishlist", mitchell);
app.use("/api/app", appRoutes);

//Ming
app.use("/api/post",post);

app.listen(port, () => {
  console.log(`listening port ${port}`);
});