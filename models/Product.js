const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide product name"],
      maxlength: 120,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
      maxlength: [
        1000,
        "Description can not be longer than 1000 characters long",
      ],
      minlength: [20, "Description must be at least 20 characters long"],
    },
    image: {
      type: String,
      default: "/uploads/example.jpg",
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: ["office", "kitchen", "bedroom"],
    },
    company: {
      type: String,
      required: [true, "Please provide company"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not supported",
      },
    },
    colors: {
      type: [String],
      default: ["#222"],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    avarageRate: {
      type: Number,
      default: 0,
    },
    numsOfRevievs: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.pre("remove", { document: true }, async function (next) {
  await mongoose.model("Review").deleteMany({ product: this._id });
});

ProductSchema.virtual('reviews', { 
  ref: 'Review',
  localField: "_id",
  foreignField: "product",
  justOne: true
})

module.exports = mongoose.model("Product", ProductSchema);
