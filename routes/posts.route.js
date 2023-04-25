// routes/posts.route.js

const express = require('express');
const { Posts } = require('../models');
const authMiddleware = require('../middlewares/auth-middleware');
const router = express.Router();

// 게시글 생성
router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user; //사용자 인증이 완료된
    const { title, content } = req.body;

    // title이나 content가 없는 경우 예외 처리
    if (!title || !content) {
      return res
        .status(412)
        .json({ message: '제목과 내용은 필수 입력 항목입니다.' });
    }

    const post = await Posts.create({
      UserId: userId,
      title,
      content,
    });

    return res.status(201).json({ data: post });
  } catch (err) {
    // 예외 처리되지 않은 모든 에러는 이곳에서 처리합니다.
    console.error(err);
    return res.status(400).json({ message: '게시글 작성에 실패하였습니다.' });
  }
});

// routes/posts.route.js

// 게시글 목록 조회
router.get('/posts', async (req, res) => {
  try {
    const posts = await Posts.findAll({
      attributes: ['postId', 'title', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ data: posts });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: '게시글 조회에 실패하였습니다.' });
  }
});

// routes/posts.route.js

// 게시글 상세 조회
router.get('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Posts.findOne({
      attributes: ['postId', 'title', 'content', 'createdAt', 'updatedAt'],
      where: { postId },
    });

    return res.status(200).json({ data: post });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ errorMessage: '게시글 조회에 실패하였습니다.' });
  }
});

//게시글 수정
router.put('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;

    const post = await Posts.findOne({
      where: { postId },
    });
    if (!post) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다. ' });
    }

    post.title = title;
    post.content = content;
    post.updatedAt = new Date();
    await post.save();

    return res.status(200).json({ message: '게시글을 수정하였습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: '게시글 수정에 실패하였습니다.' });
  }
});

//게시글 삭제
router.delete('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Posts.findOne({
      where: { postId },
    });

    if (!post) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다. ' });
    }

    await post.destroy();
    return res.status(200).json({ message: '게시글을 삭제하였습니다.' });
  } catch (error) {
    return res.status(400).json({ message: '게시글 삭제에 실패하였습니다.' });
  }
});

module.exports = router;
