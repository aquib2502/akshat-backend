import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Expert Schema
const expertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: false,
    },
    // Add other fields like profile image, phone number, etc. as needed
  },
  {
    timestamps: true,
  }
);

// 🔒 Hash the password before saving the expert document
expertSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Hashed Password on Save: ", this.password); // This logs the hashed password
    next();
  });
  

// 🔑 Method to compare entered password with stored hash
expertSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);  
};

// 📚 Create Expert Model
const Expert = mongoose.model('Expert', expertSchema);
export default Expert;
