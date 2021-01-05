const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// DESC:  포스트(Post) 관련 스키마 생성
const PostSchema = new Schema({
  // MORE:  유저 정보 [Populate OId][users collection 참고]
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  // MORE:  유저 프로필 이름 [String Type][필수 입력]
  profileName: {
    type: String,
    required: true,
  },
  // MORE:  포스트 생성 날짜 정보 [Date Type][Default: 생성 시간]
  date: {
    type: Date,
    default: Date.now,
  },
  // MORE:  포스트 제목 정보 [String Type][필수 입력]
  title: {
    type: String,
    required: true,
  },
  // MORE:  포스트 내용 정보 [String Type][필수 입력]
  text: {
    type: String,
    required: true,
  },
  // MORE:  해당 포스트 'likes' 관련 정보 [user collections Array Type]
  likes: [
    {
      // MORE:  유저 정보 [Populate OId][users collection 참고]
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
    },
  ],
  // MORE:  해당 포스트 코멘트 관련 정보 [Array Type]
  comments: [
    {
      // MORE:  유저 정보 [Populate OId][users collection 참고]
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
      // MORE:  해당 코멘트 내용 [String Type][필수 입력]
      text: {
        type: String,
        required: true,
      },
      // MORE:  해당 코멘트 작성자 프로필명 [String Type][필수 입력]
      profileName: {
        type: String,
        required: true,
      },
      // MORE:  해당 코멘트 작성 시간 [Date Type][Default: 생성 시간]
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = Post = mongoose.model('posts', PostSchema);
