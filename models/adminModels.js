// Basic Lib Imports
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    avatar: {
      type: String,
      default: 'https://cdn2.iconfinder.com/data/icons/users-6/100/USER6-512.png',
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    isAdmin: {
      index: true,
      type: Boolean,
      default: false,
    }, 
  },
  { timestamps: true },
  { versionKey: false }
);

userSchema.pre("save", async function (next) {
  const user = this;
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = mongoose.model("Admin", adminSchema);
