const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv').config()
const cors = require("cors");
const Recipe = require('./models/Recipe')
const multer = require ('multer')
const { uploadFile } = require('./utils/cloudinary')


const PORT = 5000
const app = new express();

const storage = multer.memoryStorage()
const upload = multer({ storage })

const nameOfDb = "recipes-database";
mongoose.connect(
  `mongodb://localhost:27017/${nameOfDb}`,
  { useNewUrlParser: true },
  err => {
    if (err) {
      console.log("database not connected");
    } else {
      console.log("database is connected");
    }
  }
);


app.use(express.json());
app.use(cors());

app.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find()
    res.send({
      recipes: recipes
    })
  } catch(err) {
    res.send({
      message: 'you got an error'
    })
  }
});



app.post("/recipeupload", upload.single('file'),  async (req,res) => {
 
  const { buffer } = req.file
  const data = JSON.parse(req.body.data)
  const { name } = data
  const { ingredients } = data
  const { method } = data

    await uploadFile(buffer)
    .then((resp) => {
      console.log(resp.secure_url)
      const imageUrl = resp.secure_url
      const newRecipe =  new Recipe ({
        name: name,
        ingredients: ingredients,
        method: method,
        image: imageUrl
      })
      console.log("im here 1");
      const savedRecipe = newRecipe.save()
      .then((recipe) => {
        console.log("Saved in databse");
        console.log(recipe)
        res.send(recipe)
      })
      .catch((err) => {
        res.send(err)
      })
    })
    .catch((err) => res.status(500).send(`There was an error with Cloudinary. Error:${err}`))

  
})

app.post("/upload", upload.single('file'),  async (req,res) => {
  const { buffer } = req.file
  console.log(buffer)
   await uploadFile(buffer)
    .then((resp) => {
      console.log(resp.secure_url)
      // const recipe = new Recipe ({ name: ingredient: image})
      // user.save(doc => res.send(doc)
      res.send(resp)
    })
    .catch((err) => res.status(500).send(`There was an error with Cloudinary. Error:${err}`))
})

app.post("/seed", (req, res) => {
  const { recipes }= req.body;
  console.log(recipes)
  recipes.forEach(async (recipe) => {
    const newRecipe = new Recipe ({
      name: recipe.name,
      ingredients: recipe.ingredients
    })
    const savedRecipe = await newRecipe.save();
    console.log(savedRecipe)
  })
  res.send('seeding complete')
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
