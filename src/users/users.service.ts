import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(email: string, password: string): Promise<User> {
    const hashedPassword = await bcryptjs.hash(password, 12);
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
    });
    return newUser.save();
  }
}

