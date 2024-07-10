import { Schema, model } from "mongoose";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

const UserSchema = new Schema(
  {
    avatar: { type: String, default: "" },
    name: { type: String, required: true,unique:true},
    email: { type: String, required: true, unique: true },
    password: { type: String},
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, required: false },
    admin: { type: Boolean, default: false },
    editor: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    subscribers: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    subscribedUsers: { type: [String] },
    status: { type: String, default: "" },
    fromGoogle: { type: Boolean, default: false},
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
    return next();
  }
  return next();
});

UserSchema.methods.generateJWT = async function () {
  return await sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

const User = model("User", UserSchema);
export default User;
