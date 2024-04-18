require("dotenv").config();
const express = require("express");
const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");
const News = require("../models/news.js");
const { isLoggedin } = require("../views/middleware.js");
const router = express.Router();
const cloud_name = "ddkcibobs";
const cloudinary = require("cloudinary").v2;
const User = require("../models/user.js")

//cloudnari
const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDINARYSECRET,
  secure: true
})



//Read Route
router.get("/", asyncWrap(async (req, res) => {
  const data = await News.find().sort({ priority: -1 });
  const user = await User.find({});
  console.log(data);
  res.render("./News/index", {
    data, cloud_name,
    facebook: user[0].facebook,
    twitter: user[0].twitter,
    linkedin: user[0].linkedin,
  });
}));

//update Route
router.get("/edit",isLoggedin, asyncWrap(async (req, res) => {
  const data = await News.find().sort({ priority: -1 });
  console.log(data);
  res.render("./News/show", { data, cloud_name });
}));

// // Create Route --> its have to be before show or new will be detected as id
// router.get("/new",isLoggedin, (req, res) => {
//   let {type}=req.query;
//   res.render("./Publications/create",{type});
// });


router.post("/",isLoggedin, asyncWrap(async (req, res) => {
  const list = new News({ image: req.body.public_id, priority: 1 });
  await list.save()
  res.redirect("/news/edit");

}));

//Edit Route
router.get("/:id/edit",isLoggedin, asyncWrap(async (req, res) => {
  let { id } = req.params;
  const data = await News.find({ _id: id });
  console.log(data);
  res.render("./News/edit", { data: data[0] });
}));

router.patch("/:id",isLoggedin, asyncWrap(async (req, res) => {
  let { id } = req.params;
  let { location, description, year, priority } = req.body;
  await News.findByIdAndUpdate(id, { location, description, year, priority });
  res.redirect(`/news/edit`);
}));

//Delete Route
router.delete("/:id",isLoggedin, asyncWrap(async (req, res) => {
  let { id } = req.params;
  const data = await News.find({ _id: id });
  cloudinary.uploader.destroy(data[0].image);
  await News.findOneAndDelete({ _id: id });
  res.redirect("/news/edit");
}));




module.exports = router;