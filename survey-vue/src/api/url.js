import axios from './axios';

export default {
  login (params) {
    return axios.post('/login', params);
  },
  //用户退出
  logout (params) {
    return axios.post('/logout', params);
  },

  getTodoCount() {
    return axios.get('/survey/qnaire/count');
  },

  getPublishList(params) {
    return axios.get('/survey/qnaire/list/mobile', params)
  },

  getAnswerList(params) {
    return axios.post('/survey/qnaire/list', params)
  }
};
