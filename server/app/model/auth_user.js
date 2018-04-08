'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.ObjectId;
  const conn = app.mongooseDB.get('back'); 

  const UserSchema = new Schema({
    name: { type: String },
    account: { type: String },
    password: { type: String },
    remark: { type: String },
    status: { type: Number },
    create_date: { type: Date, default: Date.now },
    update_date: { type: Date, default: Date.now },
    qq: { type: Number },
    sex: { type: Number },
    address: { type: String },
    mobile: { type: String },
    email: { type: String }
  }, {
    usePushEach: true,
    timestamps: {createdAt: 'create_date', updatedAt: 'update_date'}
  });

  UserSchema.index({ id: 1 });
  UserSchema.index({ update_date: -1 });

  return conn.model('User', UserSchema);
};