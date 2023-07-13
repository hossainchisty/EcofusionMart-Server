// Basic Lib Imports
const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    taxes: {
      type: Number,
    },
    shippingFees: {
      type: Number,
    },
    images: [{ type: String }],
    category: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
    brand: {
      type: String,
      trim: true,
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
      unique: true,
      required: true,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          required: true,
          minlength: 1,
          maxlength: 5,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    averageRating: {
      type: Number,
      required: false,
    },
  },

  { timestamps: true },
  { versionKey: false },
);

// static methods to the schema for filtering and sorting
productSchema.statics.filterAndSort = async function (
  filterOptions,
  sortOptions
) {
  const query = this.find();

  if (filterOptions) {
    const filters = {};

    if (filterOptions.category) {
      filters.category = filterOptions.category;
    }

    if (filterOptions.priceMin) {
      filters.price = { $gte: filterOptions.priceMin };
    }

    if (filterOptions.priceMax) {
      filters.price = { ...filters.price, $lte: filterOptions.priceMax };
    }

    if (filterOptions.brand) {
      filters.brand = filterOptions.brand;
    }

    if (filterOptions.title) {
      filters.title = filterOptions.title;
    }

    query.where(filters);
  }

  if (sortOptions) {
    switch (sortOptions.price) {
      case "asc":
        query.sort({ price: 1 });
        break;
      case "desc":
        query.sort({ price: -1 });
        break;
      default:
        // Handle default case or omit it if not necessary
    }

    switch (sortOptions.popularity) {
      case "asc":
        query.sort({ reviews: 1 });
        break;
      case "desc":
        query.sort({ reviews: -1 });
        break;
      default:
        // Handle default case or omit it if not necessary
    }
  }

  return await query.lean().exec();
};

module.exports = mongoose.model("Product", productSchema);
