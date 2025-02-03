import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  username: string;
  email: string;
  phone:number;
  nickname:string;
  location:string;
  profileimg:string;
  password: string;
  matchPassword(password: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone:{
    type:Number,
    required:false,
    unique:false
  },
  nickname:{
    type:String,
    required:false,
    unique:false
  },
  location:{
    type:String,
    required:false,
    unique:false
  },
  profileimg:{
    type:String,
    required:false,
    unique:false
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check if password matches
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
