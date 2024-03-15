import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Schema()
export class Url extends Document {
  @Prop({ required: true })
  originalUrl: string;

  @Prop({ required: true, unique: true })
  shortId: string;

  @Prop({ default: 0 })
  clicks: number;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User | string;
}

export const UrlSchema = SchemaFactory.createForClass(Url);