<template>
	<view>
		<z-nav-bar
			type="transparentFixed"
			back-state="2000"
			:scrollTop="scrollTop"
		>
			<text class="top-title">食嘢吧</text>
			<view slot="left" class="search_box" @click="onPageJump('/pages/search/index')"></view>
		</z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<!-- 主体部分 -->
		<view class="logo">食嘢吧</view>
		<view class="input-btn" @click="onPageJump('/pages/search/index')">
			<image src="../../static/demo/home_ic_search.png"></image>
			今天想吃点什么？
		</view>
		<view class="eat-text">用食物传达爱的感情</view>
		<view class="wrapper">
			<view class="classify">
				<view class="header">
					<text>热门分类</text>
					<text @click="onPageJump('/pages/classify/index')">全部分类</text>
				</view>
				<ul class="container">
					<li class="item" v-for="(item, index) in hot" :key="index" @click="onPageJump('/pages/search/index', item.name)">
						<image :src="urlTobase64(item.img)"></image>
						<text>{{ item.name }}</text>
					</li>
				</ul>
			</view>
		</view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" @up="upCallback">
			<stable-waterfall-goods :list="dataList" />
		</mescroll-body>
		<!-- 导航栏 -->
		<z-navigation />
	</view>
</template>

<script>
import allList from '@/demo/waterfall/data'
import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js"
import { httpRequest } from '../../api'
// import { urlTobase64 } from '@/config/urlToBase64.js'
export default {
	mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
	data() {
		return {
			downOption: {
				auto: false ,//是否在初始化后,自动执行downCallback; 默认true
			},
			
			// 热门分类
			hot: [
				{
					img: 'classify/家常菜.jpg',
					name: '家常菜'
				},
				{
					img: 'classify/快手菜.jpg',
					name: '快手菜'
				},
				{
					img: 'classify/懒人食谱.png',
					name: '懒人食谱'
				},
				{
					img: 'classify/下饭菜.jpg',
					name: '下饭菜'
				},
				{
					img: 'classify/宵夜.jpg',
					name: '宵夜'
				},
				{
					img: 'classify/小吃.jpg',
					name: '小吃'
				},
				{
					img: 'classify/一人食.jpg',
					name: '一人食'
				},
				{
					img: 'classify/早餐.jpg',
					name: '早餐'
				},
			],
			dataList: [],
			scrollTop: 0
		};
	},
	//第一次加载
	onLoad(e) {
		// 隐藏原生的tabbar
		uni.hideTabBar()
	},
	//页面显示
	onShow() {
		// 隐藏原生的tabbar
		uni.hideTabBar()
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop
	},
	//方法
	methods: {
		urlTobase64(folder) {
			let img = `/static/${folder}`,
				imgBase64 = wx.getFileSystemManager().readFileSync(img, "base64"),
				base64Url = `data:image/png;base64,${imgBase64}`
			return base64Url
		},
		onPageJump(url, name = '') {
			if (name) {
				url = url + '?name=' + name
			}
			uni.navigateTo({ url })
		},
		
		/*下拉刷新的回调 */
		downCallback() {
			//联网加载数据
			this.loadData(1)
		},
		
		/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
		upCallback(page) {
			//联网加载数据
			this.loadData(page.num)
		},
		
		// 请求数据
		async getGoodsList() {
			const newList = []
			const data = await httpRequest({
				url: '/juno/api/v2/homepage/paged_waterfall_recommendations.json?size=20',
				methods: 'GET'
			})
			data?.content?.cells.forEach(item => {
				const imgUrl = item.image.url_pattern.substring(0, item.image.url_pattern.indexOf('?'))
				newList.push({
					id: item.click_sensor_events[0].properties.target_id,
					name: item.title_1st,
					img: imgUrl,
					objId: Math.floor(Math.random() * 1000)
				})
			})
			return newList
		},
		async loadData(pageNo) {
			const list = await this.getGoodsList()
			this.dataList = list;
			// let dataList = allList.slice((pageNo - 1) * pageSize, pageNo * pageSize);
			// this.mescroll.endByPage(newList.length, Math.ceil(newList.length / pageSize)); //必传参数(当前页的数据个数, 总页数)
			// if (pageNo == 1) {
			// 	this.dataList = newList;
			// } else {
			// 	this.dataList = this.dataList.concat(newList);
			// }
		},
		onJumpWebview(url){
			// #ifdef H5
			window.open(url);
			// #endif
			// #ifndef H5
			this.$store.commit("setWebViewUrl", url);
			uni.navigateTo({
				url: '/pages/template/webView'
			});
			// #endif
		}
	},
	//页面隐藏
	onHide() {},
	//页面卸载
	onUnload() {},
	//页面下来刷新
	onPullDownRefresh() {},
	//页面上拉触底
	async onReachBottom() {
		console.log('ddddddddddd')
		const list = await this.getGoodsList()
		this.dataList = this.dataList.concat(list);
	},
	//用户点击分享
	onShareAppMessage(e) {
		return this.wxShare();
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
/* #ifndef APP-NVUE */
.top-title {
	font-weight: lighter;
	letter-spacing: 4rpx;
}
.search_box {
	width: 35upx;
	height: 35upx;
	background-image: url('@/static/demo/home_ic_search.png');
	background-position: center center;
	background-repeat: no-repeat;
	background-size: 100% 100%;
	margin-right: 15upx;
	margin-left: 20rpx;
}
/* #endif */

.logo {
	text-align: center;
	margin-top: 20vh;
	margin-bottom: 100rpx;
	font-size: 60rpx;
	font-weight: bolder;
	// letter-spacing: 20rpx;
	
	color: transparent;
	background: linear-gradient(to right, #8BCCDC, #E23326, #EF8A64);
	-webkit-text-fill-color: transparent;
	background-clip: text;
	-webkit-background-clip: text;
	position: relative;
	letter-spacing: 0.4rem;
}

.input-btn {
	color: #383831;
	font-size: 40rpx;
	font-weight: lighter;
	border-radius: 60rpx;
	box-shadow: 0 2px 6px #ccc;
	padding: 20rpx 0;
	margin: 0 60rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
	}
}

.eat-text {
	text-align: center;
	padding: 40rpx 0;
	color: #ccc;
	font-size: 28rpx;
}
.classify {
	.header {
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		text {
			&:nth-child(1) {
				font-weight: bolder;
				font-size: 36rpx;
			}
			&:nth-child(2) {
				font-size: 28rpx;
				color: #909090;
				border-radius: 60rpx;
				background-color: #F6F6F6;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 12rpx 20rpx;
			}
		}
		
	}
	.container {
		list-style: none;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-gap: 30rpx 30rpx;
		.item {
			box-sizing: border-box;
			display: flex;
			justify-content: center;
			align-items: flex-end;
			font-size: 28rpx;
			font-weight: 600;
			color: #fff;
			border-radius: 20rpx; 
			height: 160rpx;
			background-color: hotpink;
			background-size: cover;
			position: relative;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
			text {
				position: absolute;
				bottom: 12rpx;
			}
		}
	}
}
</style>
