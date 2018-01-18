/* 常量表 */
const GL_CONST = {
	//学期类别
	TERM: [
		{
			id: 'LAST_TERM',
			name: '上学期',
		}, {
			id: 'NEXT_TERM',
			name: '下学期',
		}
	],
	TERMOBJ: {
		'LAST_TERM': '上学期',
		'NEXT_TERM': '下学期',
	},

	//资源类型
	RESOURCETYPES: [
		{
			id: 'TEACHING_PLAN',
			name: '教案',
		},
		{
			id: 'COURSEWARE',
			name: '课件',
		},
		{
			id: 'LEARNING_GUIDE',
			name: '导学案',
		},
		{
			id: 'MICRO_LESSON',
			name: '微课',
		},
		{
			id: 'COURSE_VIDEO',
			name: '课堂实录',
		},
		{
			id: 'EXERCISES',
			name: '习题',
		},
		{
			id: 'EXAM_PAPER',
			name: '试卷',
		},
		{
			id: 'MATERIAL',
			name: '素材',
		},
	],

	RESOURCETYPESOBJ: {
		'TEACHING_PLAN': '教案',
		'COURSEWARE': '课件',
		'LEARNING_GUIDE': '导学案',
		'MICRO_LESSON': '微课',
		'COURSE_VIDEO': '课堂实录',
		'EXERCISES': '习题',
		'EXAM_PAPER': '试卷',
		'MATERIAL': '素材',
	},

	//习题模板类别
	EXESTYPESARR: [
		{
			id: 'SINGLE_CHOICE',
			name: '单选',
		}, {
			id: 'MULTIPLE_CHOICE',
			name: '多选',
		}, {
			id: 'JUDGE',
			name: '判断',
		}, {
			id: 'GENERAL_GAP_FILLING',
			name: '填空',
		}, {
			id: 'CLOZE_GAP_FILLING',
			name: '完型填空',
		}, {
			id: 'LIGATURE',
			name: '连线',
		}, {
			id: 'ESSAY',
			name: '问答',
		}, {
			id: 'SYNTHESIS',
			name: '综合',
		},
	],
	//习题模板类别
	EXESTYPESOBJ: {
		'SINGLE_CHOICE': '单选',
		'MULTIPLE_CHOICE': '多选',
		'JUDGE': '判断',
		'GENERAL_GAP_FILLING': '填空',
		'CLOZE_GAP_FILLING': '完型填空',
		'LIGATURE': '连线',
		'ESSAY': '问答',
		'SYNTHESIS': '综合',
	},

	//习题难度
	EXESDIFCINFO: {
		'1': '简单',
		'2': '一般',
		'3': '偏难',
		'4': '困难',
		'5': '极难',
	},
	//课本类别
	TEXTBOOKTYPE: {
		'TEACHING_MATERIAL': '教材',
		'TEACHING_AUXILIARY': '教辅',
	},
	//册数类别
	VOLUMETYPE: {
		'LAST_VOLUME': '上册',
		'NEXT_VOLUME': '下册',
		'WHOLE_VOLUME': '全册',
		'ELECTIVE': '选修',
	},
};

export default GL_CONST;