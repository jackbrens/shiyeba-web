
const BASE_URL = 'https://www.xiachufang.com'
export const httpRequest = (options) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET', //接收请求的方式,如果不传默认为GET
			data: options.data || {}, //接收请求的data,不传默认为空
			success: (res) => {
				const data = res.data
				if (data.status !== 'ok' && data.code) {
					uni.showToast({
						title: data.msg
					})
					return 
				}
				resolve(data) //成功,将数据返回
			},
			fail: (err) => { //失败操作
				uni.showToast({
					title: "请求接口失败！",
					icon: "none"
				})
				reject(err)
			}
		})
	})
}