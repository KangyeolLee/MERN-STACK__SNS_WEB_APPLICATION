//-------------------------------------------------
// DESC:  모듈 로드
const express = require('express');
const dotenv = require('dotenv'); // MORE:  외부 env 파일로 Node JS 환경설정 모듈 로드
const morgan = require('morgan'); // MORE:  console 에 세부정보 표시 모듈 로드 (개발용)
const passport = require('passport'); // MORE:  패스포트 모듈 로드 (로그인 관리 모듈)

//-------------------------------------------------

//-------------------------------------------------
// DESC:  서버 생성 및 env 파일 등록
const app = express();
dotenv.config({ path: './config/config.env' });
//-------------------------------------------------

//-------------------------------------------------
// DESC:  몽고 DB 연결
const connectDB = require('./config/db'); // MORE:  몽고 DB 모듈 로드
connectDB();
//-------------------------------------------------

//-------------------------------------------------
// DESC:  미들웨어 적용
app.use(express.json()); // MORE:  Body-Parser 미들웨어 등록
app.use(morgan('dev')); // MORE:  console 세부정보 표시 미들웨어 등록
app.use(passport.initialize()); // MORE:  패스포트 미들웨어 등록
//-------------------------------------------------

//-------------------------------------------------
// DESC:  패스포트 모듈 설정
//        MORE: @ Jwt(JsonWebToken) 방식의 인증절차 사용
//              @ 따라서 passport-jwt Strategy 사용
//              @ 자세한 옵션 설정 관련 사항은 ./config/passport.js 파일 참조
const setPassportConfig = require('./config/passport');
setPassportConfig(passport);
//-------------------------------------------------

//-------------------------------------------------
// DESC:  라우터 등록
const users = require('./routes/users'); // MORE:  유저 관련 라우터 모듈 로드
const profile = require('./routes/profile'); // MORE:  프로필 관련 라우터 모듈 로드
const posts = require('./routes/posts'); // MORE:  포스트 관련 라우터 모듈 로드

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
//-------------------------------------------------

//-------------------------------------------------
// DESC:  기본 포트 등록 및 서버 수신 대기 설정
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `서버가 ${process.env.NODE_ENV} 모드로 ${PORT}번 포트에서 가동중입니다.`
  )
);
//-------------------------------------------------
