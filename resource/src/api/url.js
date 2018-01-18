import axios from './axios';

export default {
  //用户登录
  login (params) {
    return axios.post('/login', params);
  },
  //修改密码
  resetPwd (params) {
    return axios.post('/manage/account/person/updatepassword', params);
  },
  //用户退出
  logout (params) {
    return axios.post('/logout', params);
  },
  //用户列表
  getAccountList (params) {
    return axios.post('/manage/account/user/list', params);
  },
  //冻结账号
  disableAccount (params) {
    return axios.post('/manage/account/user/disable/' + params);
  },
  //解冻账号
  enableAccount (params) {
    return axios.post('/manage/account/user/enable/' + params);
  },
  //课本列表
  getTextbookList (params) {
    return axios.post('/manage/build/textbook/querys', params);
  },
  //课本类别
  getTextbookTypes (params) {
    return axios.post('/manage/build/textbook/options', params);
  },
  //课本预览
  getTextbookPreview (params) {
    return axios.post('/manage/build/textbook/preview/' + params);
  },
  //课本编辑
  getTextbookUpdate (params) {
    return axios.postJson('/manage/build/textbook/update', params);
  },
  //资源类型
  getResourceCategoryList (params) {
    return axios.post('/manage/build/resourcecategory/querys', params);
  },
  //编辑资源
  eidtResourceCategory (params) {
    return axios.postJson('/manage/build/resourcecategory/push', params);
  },

  //知识点学段年级选项卡
  getKnwlgSubjectOptions (params) {
    return axios.post('/manage/build/knowledgepoint/options', params);
  },
  //获取知识点树列表
  getKnwlgtreeList (params) {
    return axios.post('/manage/build/knowledgepoint/querys', params);
  },
  //知识点树预览
  getKnwlgtreePreview (params) {
    return axios.post('/manage/build/knowledgepoint/preview/' + params);
  },
  //新增知识点树
  addKnwlgtree (params) {
    return axios.postJson('/manage/build/knowledgepoint/push', params);
  },
  //编辑知识点树
  updateKnwlgtree (params) {
    return axios.postJson('/manage/build/knowledgepoint/update', params);
  },
  //创建账号
  createAccount (params) {
    return axios.postJson('/manage/account/user/push/create', params);
  },
  //获取角色
  getRoles (params) {
    return axios.post('/manage/account/role/options', params);
  },
  //获取用户
  getUsers (params) {
    return axios.post('/manage/account/user/options', params);
  },
  //账号详细信息
  getUserInfo (params) {
    return axios.post('/manage/account/user/preview/' + params);
  },
  //账号编辑
  updateAccount (params) {
    return axios.postJson('/manage/account/user/push/edit', params);
  },
  //获取角色列表
  getRolesList (params) {
    return axios.post('/manage/account/role/querys', params);
  },
  //获取个人信息
  getPersonalInfo (params) {
    return axios.post('/manage/account/person/info', params);
  },
  //获取账号权限配置
  getAuthorityInfo (params) {
    return axios.post('/manage/account/user/authority/preview/' + params);
  },
  //获取特定角色信息
  getRoleInfo (params) {
    return axios.post('/manage/account/role/preview/' + params);
  },
  //获取特定角色权限
  getRoleAuth (params) {
    return axios.post('/manage/account/authority/roleauth/' + params);
  },
  //修改电话号码
  saveTelephone (params){
  	return axios.post('/manage/account/person/updateinfo', params);
  },
  //创建角色
  createRole (params) {
    return axios.postJson('/manage/account/role/push/create', params);
  },
  //编辑角色
  editRole (params) {
    return axios.postJson('/manage/account/role/push/edit', params);
  },
  //获取权限列表
  getAuthoritylist(params) {
  	return axios.post('/manage/account/authority/querys', params);
  },
  //获取权限用户列表
  getAuthorityUserList(params) {
    return axios.post('/manage/account/authority/userlist', params);
  },
  //配置权限
  configauth (params) {
    return axios.postJson('/manage/account/authority/user/grant', params);
  },
  //匹配角色权限
  patternRoleAuth (params) {
    return axios.post('/manage/account/authority/role/pattern', params);
  },
  //学科段选项菜单
  getSubjectOptions (params) {
    return axios.post('/manage/resource/menuoption/subjectselection', params);
  },
  //获取年级信息
  getGradeOptions (params) {
    return axios.post('/manage/resource/menuoption/gradeselection', params);
  },
  //教材信息选项菜单
  getTextbookOptions (params) {
    return axios.post('/manage/resource/menuoption/querytextbook', params);
  },
  //知识点选项菜单
  getKnwlegOptions (params) {
    return axios.post('/manage/resource/menuoption/queryknowledgepoint', params);
  },
  //资源类型以及其二级标签
  getResourceTypes (params) {
    return axios.post('/manage/resource/menuoption/querydict', params);
  },
  //获取资源标签
  getResourceTags (params) {
    return axios.post('/manage/resource/menuoption/querytag', params);
  },
  //等待处理
  getResourceNeedhandle (params) {
    return axios.post('/manage/resource/error/needhandle', params);
  },
  //处理记录
  getHandlelist (params) {
    return axios.post('/manage/resource/error/log', params);
  },
  //错误处理统计
  getErrorStatistics (params) {
    return axios.post('/manage/resource/error/statistics', params);
  },
  //待审资源
  getResourceUnaudited (params) {
    return axios.post('/manage/resource/audit/queryunaudited', params);
  },
  //我退回的
  getResourceRejected (params) {
    return axios.post('/manage/resource/audit/queryrejected', params);
  },
  //获取审核负责的科目
  getAuditSubjects (params, status) {
    if (status === 'my') {
    //正在候审
      return axios.post('/manage/resource/person/querysubjects', params);
    } else {
    //审核资源
      return axios.post('/manage/resource/audit/querysubjects', params);
    }
  },
  //获取资源
  getResourceList (params, status) {
    if (status === 'avaliable')  {
    //可用资源
      return axios.post('/manage/resource/available/search', params);
    } else if (status === 'off') {
    //下架资源
      return axios.post('/manage/resource/closed/search', params);
    } else if (status === 'myoff') {
    //我的资源 已下架
      return axios.post('/manage/resource/person/closed/search', params);
    } else if (status === 'myin') {
    //我的资源 已入库
      return axios.post('/manage/resource/person/search', params);
    } else if (status === 'myunaudited') {
    //我的资源 正在候审
      return axios.post('/manage/resource/person/unaudited', params);
    } else if (status === 'myrejected') {
    //我的资源 需要复核
      return axios.post('/manage/resource/person/rejected', params);
    } else if (status === 'temporary') {
    //暂存资源
      return axios.post('/manage/resource/temporary/querylist', params);
    } else {
    //可用资源
      return axios.post('/manage/resource/available/search', params);
    }
  },
  //资源详情
  getResourceDetail (params, status) {
    if (status === 'myin' || status === 'myoff')  {
    //我的资源 已入库||已下架
      return axios.post('/manage/resource/person/view/' + params);
    } else if (status === 'unauited' || status === 'rejected') {
    //我退回的以及待审核的资源详情
      return axios.post('/manage/resource/audit/view/' + params);
    }  else if (status === 'errorlog' || status === 'waithandler') {
    //报错处理 处理记录||等待处理
      return axios.post('/manage/resource/error/view/' + params);
    } else if (status === 'off') {
    //下架资源
      return axios.post('/manage/resource/closed/view/' + params);
    } else if (status === 'avail')  {
    //可用资源
      return axios.post('/manage/resource/available/view/' + params);
    } else if (status === 'temp')  {
    //暂存资源
      return axios.post('/manage/resource/temporary/view/' + params);
    } else {
    //可用资源
      return axios.post('/manage/resource/available/view/' + params);
    }
  },
  //下架
  getOff (params, status) {
    if (status === 'my') {
    //我的资源－“已入库” 下架
      return axios.postJson('/manage/resource/person/closed', params);
    } else {
      return axios.postJson('/manage/resource/available/closed', params);
    }
  },
  //上架
  getOn (params) {
    return axios.postJson('/manage/resource/closed/setapproved', params);
  },
  //资源审核
  auditUpdate (params) {
    return axios.post('/manage/resource/audit/push', params);
  },
  //获取上传者
  getUploaders (params) {
    return axios.post('/manage/resource/menuoption/queryuser', params);
  },

  //首页
  getSummary() {
    return axios.get('/manage/homepage/resource/statistics/summary');
  },
  getNews(params) {
    return axios.post('/manage/homepage/resource/statistics/summarynew', params);
  },
  getRanks(params) {
    return axios.post('/manage/homepage/resource/statistics/leaderboard', params);
  },

  //V2 二期
  //更新资源
  updateResources(resourceId, params, status) {
    if (status !== 'temp') {
    //我的资源下
      return axios.postJson('/manage/resource/person/push/update/' + resourceId, params);
    } else {
    //暂存资源下
      return axios.postJson('/manage/resource/temporary/push/update/' + resourceId, params);
      
    }    
  },
  //审核资源
  auditResources(resourceId, params) {
    return axios.postJson('/manage/resource/audit/push/' + resourceId, params);
  },
};
