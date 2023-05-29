// Basic Lib Imports
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [
    {
      type: String,
      required: false,
    },
  ],
  category: {
    type: String,
    required: true,
    index: true,
  },
  brand: {
    type: String,
    required: false,
    index: true,
  },
  stock: {
    inStock: {
      type: Boolean,
      default: true,
    },
    remainingStock: {
      type: Number,
      default: 0,
    },
  },
  SKU: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    default: null
  }],
});

productSchema.pre('save', function (next) {
  const currentDate = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  this.SKU = `${random}_${currentDate}`;
  next();
});


module.exports = mongoose.model('Product', productSchema);


