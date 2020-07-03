import mongoose, { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  salt: string;
  encry_password?: string;
  createdAt?: string;
  updatedAt?: string;
  _v?: number | string;
  timestamps?: string;
  userinfo?: string;
  authenticate?: (planepassword: string) => string;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    lastname: {
      type: String,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    userinfo: {
      type: String,
      trim: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.method({
  authenticate: function (planepassword) {
    return this.securePassword(planepassword) === this.encry_password;
  },
  securePassword: function (planepassword) {
    if (!planepassword) return "";
    try {
      return crypto.createHmac("sha256", this.salt).update(planepassword).digest("hex");
    } catch (err) {
      return "";
    }
  },
});

export default mongoose.model<IUser>("User", userSchema);
