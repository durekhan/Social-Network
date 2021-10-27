import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
export type UserDocument = User & Document;
// export const UserSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       unique: true,
//       required: [true, "can't be blank"],
//       lowercase: true,
//     },
//     age: { type: Number, required: true },
//     email: {
//       type: String,
//       unique: true,
//       required: [true, "can't be blank"],
//       lowercase: true,
//     },
//     password: { type: String, required: true },
//     followers: { type: Array, default: [] },
//     followings: { type: Array, default: [] },
//   },
//   { timestamps: true },
// );

@Schema({ timestamps: true })
export class User {
  @Prop({ required: [true, "can't be blank"], unique: true, lowercase: true })
  username: string;
  @Prop({ required: true })
  age: number;
  @Prop({ unique: true, required: [true, "can't be blank"], lowercase: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  followers: User[];
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  followings: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);
