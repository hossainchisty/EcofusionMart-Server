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
  sortOptions,
) {
  let query = this.find();

  if (filterOptions) {
    if (filterOptions.category) {
      query = query.where("category", filterOptions.category);
    }

    if (filterOptions.priceMin) {
      query = query.where("price").gte(filterOptions.priceMin);
    }

    if (filterOptions.priceMax) {
      query = query.where("price").lte(filterOptions.priceMax);
    }

    if (filterOptions.brand) {
      query = query.where("brand", filterOptions.brand);
    }

    if (filterOptions.title) {
      query = query.where("title", filterOptions.title);
    }
  }

  if (sortOptions) {
    if (sortOptions.price === "asc") {
      query = query.sort({ price: 1 });
    } else if (sortOptions.price === "desc") {
      query = query.sort({ price: -1 });
    }

    if (sortOptions.popularity === "asc") {
      query = query.sort({ reviews: 1 });
    } else if (sortOptions.popularity === "desc") {
      query = query.sort({ reviews: -1 });
    }
  }

  return await query.exec();
};

module.exports = mongoose.model("Product", productSchema);
