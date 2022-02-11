const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "Please provide product rating"],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide comment title"],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, "Please provide comment message"],
      maxlength: 1000,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);
ReviewSchema.index({ product: 1, createdBy: 1 }, { unique: true });

ReviewSchema.pre("remove", { document: true }, async function (next) {
  await mongoose.model("Review").deleteMany({ product: this._id });
});

ReviewSchema.statics.calculateAvarageRating = async function (productId) {
  console.log(productId);

  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        avarageRate: {
          $avg: "$rating",
        },
        numsOfReviews: {
          $sum: 1,
        },
      },
    },
  ]);

  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        avarageRate: Math.ceil(result[0].avarageRate || 0),
        numsOfReviews: result[0]?.numsOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }

  console.log(result);
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAvarageRating(this.product);
});
ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAvarageRating(this.product);
});

module.exports = mongoose.model("Review", ReviewSchema);
