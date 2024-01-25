var express = require('express');
var router = express.Router();
const userModel=require('./users')
const postModel=require('./post')
const localStrategy=require('passport-local');
const passport= require('passport');
const upload = require('./multer');


passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function(req, res) {
  res.render('index', {footer: false});
});

router.get('/login', function(req, res) {
  res.render('login', {footer: false});
});

router.get('/feed',isLoggedin, async function(req, res) {
  const user=await userModel.findOne({username:req.session.passport.user});
  const posts= await postModel.find().populate("user")

  res.render('feed', {footer: true, posts,user});
});

router.get('/profile',isLoggedin,async function(req, res) {
  const user=await userModel.findOne({username:req.session.passport.user}).populate("posts")
  res.render('profile', {footer: true,user});
});

router.get('/search',isLoggedin, function(req, res) {
  res.render('search', {footer: true});
});

router.get('/edit', isLoggedin,async function(req, res) {
  const user = await userModel.findOne({username:req.session.passport.user});
  res.render('edit', {footer: true, user});
});

router.get('/upload', isLoggedin,function(req, res) {
  res.render('upload', {footer: true});
});

router.post('/login',passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login"
}),function(req,res){})


router.post("/register", function(req,res){
  var userData= new userModel({
    username:req.body.username,
    fullname:req.body.fullname,
    email:req.body.email
  })
 userModel.register(userData,req.body.password)
 .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })
})

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedin(req,res,next){
  if(req.isAuthenticated()){return next()}
  res.redirect('/login')
}

router.post('/update',isLoggedin,upload.single("image"),async function(req,res){
  const user = await userModel.findOneAndUpdate(
  {username:req.session.passport.user},
  {username:req.body.username,fullname:req.body.fullname,bio:req.body.bio},
  {new:true}
  );  
  if(req.file){ user.profileImage=req.file.filename;}
 
  await user.save();
  res.redirect("/profile")
})

router.post('/upload',isLoggedin,upload.single("image"),async function(req,res){
  const user=await userModel.findOne({username:req.session.passport.user})
  const post = await postModel.create({
    picture:req.file.filename,
    caption:req.body.caption,
    user:user._id,
  })
   user.posts.push(post._id);
   await user.save();
   res.redirect("/feed")
})

router.get('/username/:username',isLoggedin,async function(req,res){
const regex=new RegExp(`^${req.params.username}`,'i')
const users= await userModel.find({username:regex})
res.json(users);
})

router.get("/like/post/:id",isLoggedin,async function(req,res){
  const user=await userModel.findOne({username:req.session.passport.user});
  const post=await postModel.findOne({_id:req.params.id});

  //if already liked remove else make a like

  if(post.likes.indexOf(user._id)=== -1)
  {
    post.likes.push(user._id)
  }
   else{
    post.likes.splice(post.likes.indexOf(user._id),1)
   }
   await post.save()
   res.redirect("/feed")
})
module.exports = router;
