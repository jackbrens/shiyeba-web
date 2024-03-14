'use strict';
const { uni } = require('config')

exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	const { appid, appsecret } = uni['mp-weixin'].oauth.weixin
	
	// jscode2session 微信小程序登录接口，获取openid
	const { code } = event
	// 云函数中如需要请求其他http服务，则使用uniCloud.httpclient.request(URL,requestOptions)
	const res = await uniCloud.httpclient.request(
	`https://api.weixin.qq.com/sns/jscode2session?grant_type=authorization_code&appid=${appid}&secret=${appsecret}&js_code=${code}`, {
	      // 返回的数据格式
	      dataType: "json"
	})
	
	//返回数据给客户端
	return res.data
};
