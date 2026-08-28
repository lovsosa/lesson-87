import mongoose, { HydratedDocument, Model } from 'mongoose';
import { UserFields } from '../types';
import bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';

const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

type UserModel = Model<UserFields, {}, UserMethods>;

const UserSchema = new Schema<UserFields, UserModel, UserMethods>({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (
        this: HydratedDocument<any>,
        value: string,
      ): Promise<boolean> {
        if (!this.isModified('username')) return true;

        const user = await User.findOne({ username: value });
        return !Boolean(user);
      },
      message: 'This user is already registered',
    },
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  const hash = await bcrypt.hash(this.password, salt);

  this.password = hash;
});

UserSchema.set('toJSON', {
  transform: (_, ret: Partial<UserFields>) => {
    delete ret.password;
    return ret;
  },
});

UserSchema.methods.checkPassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
  this.token = randomUUID();
};

const User = mongoose.model<UserFields, UserModel>('User', UserSchema);
export default User;
