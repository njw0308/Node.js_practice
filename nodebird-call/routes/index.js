const express = require('express');
const axios = require('axios');
const router = express.Router();

const URL = 'http://localhost:3123/v2';

const request =  async (req, api) => {
  try {
    if (!req.session.jwt) { // 세션에 토큰이 없으면 토큰 발급 받기. post 요청에 비밀키를 실어서 보내기.
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: process.env.CLIENT_SECRET,
      });
      if (tokenResult.data && tokenResult.data.code === 200) { // 토큰 발급 성공
        req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
      } 
    }
    // 발급받은 토큰 테스트
    return await axios.get(`${URL}${api}`, {
      headers: { authorization: req.session.jwt },
    });
  } catch (error) {
    if (error.response.status === 419) { // 토큰 만료 시
      return error.response;
    }
    throw error
  }
};

// mypost --> nodebird-api 의 /posts/my 로 요청 with 토큰
router.get('/mypost', async (req, res, next) => {
  try {
    const result = await request(req, '/posts/my');
    res.json(result.data);
  } catch (err) {
    console.error(err.response.data) // 에러메세지가 너무 길어서 파싱.
    next(err);
  }
});

// search/노드 --> nodebird-api 의 /posts/hashtag/노드 로 요청 
router.get('/search/:hashtag', async (req, res, next) => {
  try {
    const result = await request(req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`); // 한글 쓰는거 오류나는거 막기 위해.
    res.json(result.data);

  } catch (err) {
      if (err.code) {
        console.error(err);
        next(err);
      }
  }
});

module.exports = router