const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// DESC:  프로필(Profile) 관련 스키마 생성
const ProfileSchema = new Schema({
  // MORE:  유저 정보 [Populate OId][users collection 참고]
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  // MORE:  유저 프로필 명 [String Type][필수 입력]
  profileName: {
    type: String,
    required: true,
    maxlength: 15,
  },
  // MORE:  현재 직장 또는 회사 정보 [String Type]
  company: {
    type: String,
  },
  // MORE:  소유 웹사이트 및 홈페이지 URL 정보 [String Type]
  website: {
    type: String,
  },
  // MORE:  거주지 정보 [String Type]
  location: {
    type: String,
  },
  // MORE:  신분 정보 [String Type][필수 입력]
  status: {
    type: String,
    required: true,
  },
  // MORE:  다룰 수 있는 스킬(언어 외 컴퓨팅 스킬 등) 정보 [String Type][필수 입력]
  skills: {
    type: [String],
    required: true,
  },
  // MORE:  자기소개 [String Type]
  bio: {
    type: String,
  },
  // MORE:  깃허브 정보 [String Type]
  githubUsername: {
    type: String,
  },
  // MORE:  경력 정보 [String Array Type]
  experience: [
    {
      // MORE:  해당 경력 항목 정보 [String Type][필수 입력]
      title: {
        type: String,
        required: true,
      },
      // MORE:  경력 직장 정보 [String Type][필수 입력]
      company: {
        type: String,
        required: true,
      },
      // MORE:  경력 근무지 정보 [String Type]
      location: {
        type: String,
      },
      // MORE: 일을 시작한 기간 정보 [Date] Type][필수 입력]
      from: {
        type: Date,
        required: true,
      },
      // MORE: 일을 끝낸 기간 정보 [Date Type]
      to: {
        type: Date,
      },
      // MORE:  현재 상황 정보 [Boolean Type][Default: false]
      current: {
        type: Boolean,
        default: false,
      },
      // MORE:  관련 경력 상세 정보 [String Type]
      description: {
        type: String,
      },
    },
  ],
  // MORE:  소셜 미디어 관련 정보
  social: {
    //MORE: 유튜브 URL [String Type]
    youtube: {
      type: String,
    },
    //MORE: 트위터 URL [String Type]
    twitter: {
      type: String,
    },
    //MORE: 페이스북 URL [String Type]
    facebook: {
      type: String,
    },
    //MORE: 인스타그램 URL [String Type]
    instagram: {
      type: String,
    },
  },
  // MORE:  프로필 생성시간 정보 [Date Type][Default: 생성 시가]
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Profile = mongoose.model('profiles', ProfileSchema);
