const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// DESC:  유저(User) 관련 스키마 생성
const UserSchema = new Schema({
  // MORE:  유저 이름 [String Type][필수 입력]
  name: {
    type: String,
    required: true,
  },
  // MORE:  유저 메일 [String Type][필수 입력]
  email: {
    type: String,
    required: true,
  },
  // MORE:  유저 비밀번호 [String Type][필수 입력]
  password: {
    type: String,
    required: true,
  },
  // MORE:  유저 생성 날짜 [Date Type][Default: 생성 시간]
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model('users', UserSchema);
