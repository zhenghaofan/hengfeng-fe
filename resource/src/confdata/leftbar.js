//资源管理
const resourceLeftbarMenus = [
													{
													  href: 'avairesource.html',
													  name: '可用资源',
													  id: 'lb-avaire',
													  authId: 'RESOURCE_AVAILABLE',
													},
													{
													  href: 'upload.html',
													  name: '上传资源',
													  id: 'lb-upload',
													  authId: 'RESOURCE_UPLOAD',
													}, 
													{
													  href: 'myresin.html',
													  name: '我的资源',
													  id: 'lb-my',
													  authId: '',
													  isNeccesary: true,
													  menus: [
													 		{
													 			href: 'myresin.html',
													  		name: '已经入库',
													  		id: 'lb-myresin',
													 		},
													 		{
													 			href: 'myunaudited.html',
													  		name: '正在候审',
													  		id: 'lb-myunaudited',
													 		},
													 		{
													 			href: 'myrejected.html',
													  		name: '需要复核',
													  		id: 'lb-myrejected',
													 		},
													 		{
													 			href: 'myresoff.html',
													  		name: '已下架的',
													  		id: 'lb-myresoff',
													 		},
													  ]
													}, 
													{
													  href: 'auditres.html',
													  name: '资源审核',
													  id: 'lb-auditres',
													  authId: 'RESOURCE_AUDIT',
													}, 
													{
													  href: 'errorres.html',
													  name: '报错处理',
													  id: 'lb-errorres',
													  authId: 'RESOURCE_ERROR_HANDLE',
													},
													{
													  href: 'offres.html',
													  name: '下架资源',
													  id: 'lb-offres',
													  authId: 'RESOURCE_CLOSED',
													},
													{
													  href: 'tempres.html',
													  name: '暂存资源',
													  id: 'lb-tempres',
													  authId: 'RESOURCE_TEMPORARY',
													},
												];

const resourceLeftbarCls =  {
									      'lb-avaire': 'i-avai',
								        'lb-upload': 'i-upload',
								        'lb-myres': 'i-mine',
								        'lb-myresin': '',
								        'lb-myunaudited': '',
								        'lb-myrejected': '',
								        'lb-myresoff': '',
								        'lb-auditres': 'i-mang',
								        'lb-errorres': 'i-wait',
								        'lb-offres': 'i-down',
								        'lb-temp': 'i-down',
									    };
//建设管理
const buildLeftbarMenus = [
													{
													  href: 'classeslist.html',
													  name: '课本信息',
													  id: 'lb-classes',
    												authId: 'RESOURCE_BUILD_TEXTBOOK',
													}, 
													{
													  href: 'knwlgtreelist.html',
													  name: '知识点树',
													  id: 'lb-knwlgtree',
    												authId: 'RESOURCE_BUILD_KNOWLEDGE_POINT',
													},
													{
													  href: 'categorylist.html',
													  name: '资源类别',
													  id: 'lb-category',
    												authId: 'RESOURCE_BUILD_CATEGORY',
													},
												];

const buildLeftbarCls =  {
									      'lb-classes': 'i-book',
									      'lb-knwlgtree': 'i-conf',
									      'lb-category': 'i-user-plus',
									    };
//账号管理
const accountLeftbarMenus = [
													{
													  href: 'accountlist.html',
													  name: '账号列表',
													  id: 'lb-account',
													  authId: 'ACCOUNT',
													},
													{
													  href: 'roleslist.html',
													  name: '角色列表',
													  id: 'lb-role',
  													authId: 'ACCOUNT_ROLE',
													},
													{
													  href: 'authoritylist.html',
													  name: '权限列表',
													  id: 'lb-authority',
													  authId: 'ACCOUNT_AUTHORITY',
													},
													{
													  href: 'personaldata.html',
													  name: '个人账号',
													  id: 'lb-personal',
													  isNeccesary: true,
													  authId: '',
													},
													{
													  href: 'editpwd.html',
													  name: '修改密码',
													  isNeccesary: true,
													  id: 'lb-editpwd',
													  authId: '',
													},
												];

const accountLeftbarCls =  {
									      'lb-account': 'i-acct',
								        'lb-role': 'i-role',
								        'lb-authority': 'i-permission',
								        'lb-personal': 'i-acct2',
								        'lb-editpwd': 'i-edit1'
									    };
export default {
	//资源管理
	resource: {
		menus: resourceLeftbarMenus,
    clsNameObj: resourceLeftbarCls
	},
	//建设管理
	build: {
		menus: buildLeftbarMenus,
    clsNameObj: buildLeftbarCls
	},
	//账号管理
	account: {
		menus: accountLeftbarMenus,
    clsNameObj: accountLeftbarCls
	},
}