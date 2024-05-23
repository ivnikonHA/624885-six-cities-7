import { defaultClasses ,getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

import { createSHA256 } from '../../helpers/index.js';
import { UserCategoryType, UserType } from '../../types/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity implements UserType {
  @prop({ unique: true, required: true })
  public email: string;

  @prop({ required: false, default: ''})
  public avatar: string;

  @prop({ required: true })
  public name: string;

  @prop({ required: true })
  private password?: string;

  @prop({
    required: true,
    type: () => String,
    enum: UserCategoryType
  })
  public userType: UserCategoryType;

  constructor(userData: UserType) {
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.name = userData.name;
    this.userType = userData.userType;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);