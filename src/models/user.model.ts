import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcrypt'

const SALT_WORK_FACTOR: number = 10

export interface IUser extends Document {
  email: string
  name: string
  password: string
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
})

UserSchema.pre<IUser>('save', function(next) {
  const user: IUser = this
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err: Error, salt: string) {
    if (err) return next(err)
    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err: Error, hash: string) {
      if (err) return next(err)
      // override the cleartext password with the hashed one
      user.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = function(candidatePassword: string) {
  const userPassword = this.password
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, userPassword, function(
      err: Error,
      isMatch: boolean,
    ) {
      if (err) return reject(err)
      resolve(isMatch)
    })
  })
}

export default mongoose.model('User', UserSchema)
