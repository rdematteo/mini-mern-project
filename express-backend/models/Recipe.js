const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  name:  String,
  ingredients: [String],
  method: String,
  image: String,
});


const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe