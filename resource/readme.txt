��ϵͳ���õĿ��
MV*��ܣ�Vue 2.0
UI��ܣ�element-ui 1.4.8 �����Զ������⣬�������װָ�ϼ������������http://element-cn.eleme.io/#/zh-CN/component/custom-theme��
HTTP����axios 0.16.2
loginҳ��jquery-1.10.1(��ҳ��δʹ��)

�������(��Ҫ����IE9���£��Լ������ļ�û��Ҫ����webpack���������Բ�����Ϸ�ʽ)
webpack 2.6.1
gulp 3.9.1


���������
1.npm run build
2.(ɾ��dist/css/login.css��dist/css/global.css�ļ�[ѹ�����gulp css]
  ɾ��dist/views/login.html�ļ�[ѹ�����gulp html]
  ɾ��dist/static/js/views/login.js�ļ�[ѹ�����gulp js])��ɾ��Ҳ����ɾ�������gulp�����Ḳ��
 ���� gulp �����赥�����������ĳ�ļ����ɸ������������ָ���gulpfile.js��
3.�ύʱ�ǵ������ύ����һ��login.xxx.js����webpack���ɵ��ļ���



����ô�������װָ��

1.��װ����
���Ȱ�װ���������ɹ��ߡ�������ȫ�ְ�װ���߰�װ�ڵ�ǰ��Ŀ�£��Ƽ���װ����Ŀ�������� clone ��Ŀʱ��ֱ�Ӱ�װ������������������ȫ�ְ�װ����ʾ��

npm i element-theme -g

2.��װĬ�����⣬���Դ� npm ��װ���ߴ� GitHub ��ȡ���´��롣

# �� npm
npm i element-theme-default -D

# �� GitHub
npm i https://github.com/ElementUI/theme-default -D

3.���������ļ���
et

4.�ڵ�ǰĿ¼��theme�ļ��иĳ�theme-diy�ļ��зŵ�front\node_modules\element-ui\libĿ¼��

����ǰ��element-variables.css�Ǳ�ϵͳ�Զ�������ɵ��ļ��������޸��Զ������ݣ�������ڴ��ļ����������޸ģ������мǣ�������