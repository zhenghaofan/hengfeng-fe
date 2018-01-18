import axios from './axios';

const uploadPre = '/manage/resource/push/';
const updatePre = '/manage/resource/person/push/update/';

export default {
	uploadResources(attr, params, template) {
		let url = template ? uploadPre + attr + '?template=' + template : uploadPre + attr;
		return axios.postJson(url, params)
	},
	// batchUploadExam(params) {
	// 	return axios.postFormData('/manage/resource/import/exercises', params)
	// },
	// updateResources(attr, params) {
	// 	return axios.postJson(updatePre + attr, params)
	// }
}
