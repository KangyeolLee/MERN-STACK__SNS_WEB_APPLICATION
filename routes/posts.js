// DESC:  라우터 연동 관련 모듈 로드
const express = require('express');
const router = express.Router();

// DESC:  보안 관련 모듈 로드
const passport = require('passport'); //MORE: 패스포트 모듈

// DESC:  프로필 및 포스트 모델 스키마 로드
const Profile = require('../models/Profile');
const Post = require('../models/Posts');

// DESC:  포스트 작성 관련 입력 검증 모듈 로드
const validatePostInput = require('../validation/post');

// DESC:  라우트 연동 설정
// MORE:  @ 게시물 전체 조회
//        @route GET api/posts
//        @access Public
router.get('/', async (req, res) => {
  try {
    // MORE:  모든 Post Docs 조회 후 날짜 순으로 오름차순 => 최신정보 상위노출
    const posts = await Post.find().sort({ date: -1 });
    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      errors: {
        'access-error': error.message,
      },
    });
  }
});

// MORE:  @ 게시물 아이디로 게시물 얻기
//        @route GET api/posts/search/:id
//        @access Public
router.get('/search/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      errors: {
        'access-error': error.message,
      },
    });
  }
});

// MORE:  @ 내가 작성한 모든 게시물 조회
//        @route GET api/posts/myPosts
//        @access private
router.get(
  '/myPosts',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      return res.status(200).json({
        success: true,
        data: posts,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        errors: {
          'access-error': error.message,
        },
      });
    }
  }
);

// MORE:  @ 게시물 작성
//        @route POST api/posts
//        @access Private
router.post(
  '/',
  // MORE:  현재 유저가 로그인이 되어있음을 확인 후 콜백함수 진행
  // TODO:  로그인 시 해당 api 호출 정상적으로 jwt 인증 절차 후 진행되는지 체크 필요
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(404).json({
        success: false,
        errors,
      });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      const profileName = profile ? profile.profileName : '';

      const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        title: req.body.title,
        profileName,
      });

      const post = await newPost.save();

      return res.status(201).json({
        success: true,
        data: post,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        errors: {
          'access-error': error.message,
        },
      });
    }
  }
);

// MORE:  @ 게시물 수정
//        @ route POST api/posts/update/:id
//        @access Private
router.post(
  '/update/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(404).json({
        success: false,
        errors,
      });
    }

    try {
      const post = await Post.findById(req.params.id);
      await post.update(
        {
          $set: {
            title: req.body.title,
            text: req.body.text,
          }
        },
        { new: true }
      )

      return res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      return status(400).json({
        success: false,
        errors: {
          'access-error': error.message,
        }
      });
    }
  }
)

// MORE:  @ 게시물 아이디로 게시물 삭제
//        @route DELETE api/posts/delete/:id
//        @access Private
router.delete(
  '/delete/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const post = await Post.findOneAndRemove({ _id: req.params.id });
      if (post) {
        return res.status(200).json({
          success: true,
          message: '포스트 게시글 삭제 성공!',
        });
      } else {
        return res.status(404).json({
          success: false,
          errors: {
            'access-error': '잘못된 접근입니다.',
          },
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        errors: {
          'access-error': error.message,
        },
      });
    }
  }
);

// MORE:  @ 게시물 좋아요 클릭
//        @route POST api/posts/like/:id
//        @access Private
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (
        // MORE: like.user는 OId 객체이고, request의 user.id는 String 이기때문에 toString()을 통해 비교
        post.likes.filter((like) => like.user.toString() === req.user.id).length
      ) {
        const removeIndex = post.likes
          .map((like) => like.user.toString())
          .indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        const newPost = await post.save();

        return res.status(201).json({
          success: true,
          data: newPost,
        });
      } else {
        // TODO: 원본 데이터 변경 아닌지 + mongoose ODM 을 통해 바로 지울 수 있는지 체크 필요
        post.likes.unshift({ user: req.user.id });
        const newPost = await post.save();

        return res.status(201).json({
          success: true,
          data: newPost,
        });
      }
    } catch (error) {
      return res.status(404).json({
        success: false,
        errors: {
          noPostFound: '해당하는 글이 없습니다.',
          'error-message': error.message,
        },
      });
    }
  }
);

// MORE:  @ 게시물 좋아요 취소
//        @route DELETE api/posts/unlike/:id
//        @access Private
// HACK:  API 매커니즘 변경으로 더 이상 사용 X
router.delete(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (
        !post.likes.filter((like) => like.user.toString() === req.user.id)
          .length
      ) {
        return res.status(400).json({
          success: false,
          errors: {
            nonLiked: '이 글에 좋아요를 누르지 않았습니다.',
          },
        });
      } else {
        // TODO: 원본 데이터 변경 아닌지 + mongoose ODM 을 통해 바로 지울 수 있는지 체크 필요
        const removeIndex = post.likes
          .map((like) => like.user.toString())
          .indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        const newPost = await post.save();

        return res.status(201).json({
          success: true,
          data: newPost,
        });
      }
    } catch (error) {
      return res.status(404).json({
        success: false,
        errors: {
          noPostFound: '해당하는 글이 없습니다.',
          'error-message': error.message,
        },
      });
    }
  }
);

// MORE:  @ 댓글 달기
//        @route POST api/posts/comment/:id
//        @access Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(404).json({
        success: false,
        errors,
      });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      const profileName = profile ? profile.profileName : '';
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        user: req.user.id,
        profileName,
      };


      // TODO: 원본 데이터 변경 아닌지 + mongoose ODM 을 통해 바로 지울 수 있는지 체크 필요
      post.comments.push(newComment);
      const newPost = await post.save();

      return res.status(201).json({
        success: true,
        data: newPost,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        errors: {
          noPostFound: '해당하는 글이 없습니다.',
          'error-message': error.message,
        },
      });
    }
  }
);

// MORE:  @ 댓글 제거
//        @route DELETE api/posts/comment/:id/:comment_id
//        @access Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      const post = await Post.findById(req.params.id);
      if (
        !post.comments.filter(
          (comment) => comment._id.toString() === req.params.comment_id
        ).length
      ) {
        return res.status(404).json({
          success: false,
          errors: {
            notCommentFound: '해당하는 댓글이 없습니다.',
          },
        });
      }

      if (
        !post.comments.filter(
          (comment) => comment.profileName.toString() === profile.profileName.toString()
        ).length
      ) {
        return res.status(404).json({
          success: false,
          errors: {
            notAuthorized: '권한이 없습니다.',
          },
        });
      }

      const removeIndex = post.comments
        .map((item) => item._id.toString())
        .indexOf(req.params.comment_id);

      post.comments.splice(removeIndex, 1);

      const newPost = await post.save();
      return res.status(200).json({
        success: true,
        data: newPost,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        errors: {
          noPostFound: '해당하는 글이 없습니다.',
          'error-message': error.message,
        },
      });
    }
  }
);

module.exports = router;
