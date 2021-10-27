import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/user.model';
export type PostDocument = Post & Document;
@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  content: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.index({ content: 'text' });
