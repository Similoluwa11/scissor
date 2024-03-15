import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcryptjs from 'bcryptjs';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  // Optional: Fields for email verification
  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  emailVerificationToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save hook to hash the password before saving
UserSchema.pre<User>('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  // Generate a salt
  const salt = await bcryptjs.genSalt(10);
  // Hash the password using our new salt
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

// Instance method to compare a candidate password with the user's hashed password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcryptjs.compare(candidatePassword, this.password);
};


