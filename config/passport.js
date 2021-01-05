// DESC:  passport 관련 옵션 설정 (로그인 관련)
// MORE:  JWT 방식의 인증 절차(전략) 방식 채택
const JwtStrategy = require('passport-jwt').Strategy;
// MORE:  클라이언트 요청(Request)으로부터 JWT 데이터 추출을 위한 기능
//        # JWT 데이터는 HTTP Header 또는 URL의 파라미터로 전달 가능
//        # 전달 방식을 결정하기 위한 옵션
const ExtractJwt = require('passport-jwt').ExtractJwt;

// DESC:  로그인을 위해 사용할 DB Collection 모델 개체
// const mongoose = require('mongoose');
// const User = mongoose.model('users');
const User = require('../models/User');

// DESC:  JWT-Strategy 에서 다루는 Token의 암호화를 위한 문자열 (보안관련)
const keys = process.env.SECRETORKEY;

// DESC:  JWT-Strategy 전략의 옵션 설정
const options = {
  // MORE:  Authorization Header 에서 JWT를 추출 => { Authorization : 'Bearer [TOKEN]' } 의 형태
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys,
};

// DESC:  패스포트 모듈 전략 수립
module.exports = (passport) => {
  // MORE:  Strategy에 주어진 options의 값이 정상적이면 전략 실행 => 토큰 입력받은 후 해석하여 콜백에 전달
  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          // MORE:  정상적으로 아이디를 찾은 경우
          return done(null, user);
        } else {
          // MORE:  아이디가 없는 경우
          return done(null, false, { message: '존재하지 않는 아이디 입니다.' });
        }
      } catch (error) {
        // MORE:  findById() 로직 도중 오류가 발생한 경우
        return done(error, false);
      }
    })
  );
};
