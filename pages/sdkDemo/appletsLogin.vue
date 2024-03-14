<template>
	<view>
		<z-nav-bar title="小程序登录"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="table_box">
			<view class="table_title">使用前需要配置的参数</view>
			<view class="table_content">
				<text>登录获取的用户数据会自动储存到vuex里面config/store.js => state.userInfo</text>
			</view>
			<view class="table_head">
				<text>文件夹</text>
				<text>描述</text>
			</view>
			<view class="table_content">
				<text>config/baseUrl.js</text>
				<text>项目信息填写</text>
			</view>
			<view class="table_content">
				<text>config/login.js</text>
				<text>77配置小程序登录接口</text>
			</view>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<button type="primary" @click="onAppletsLogin">小程序登录</button>
		<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
		  <image class="avatar" :src="avatarUrl "></image>
		</button>
		<input type="nickname" class="weui-input" placeholder="请输入昵称"/>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<button type="primary">请在微信小程序环境尝试</button>
		<!-- #endif -->
	</view>
</template>

<script>
// #ifdef MP-WEIXIN
import { onLogin } from '@/config/login';
// #endif
export default {
	data() {
		return {
			avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
		};
	},
	//方法
	methods: {
		onAppletsLogin() {
			uni.navigateTo({
				url: '/pages/user/login'
			})
			
			return
			
			uni.showModal({
				mask: true,
				title: '温馨提示',
				content: '授权登录获取用户信息',
				success(res) {
					if (res.confirm) {
						uni.getUserProfile({
							desc: '获取你的昵称，头像地区及性别',
							success(res) {
								uni.showModal({
									title: '登录信息',
									content: '' + JSON.stringify(res)
								})
								console.log('获取用户信息res====', res)
							},
							fail(err) {
								console.log('获取用户信息err====', err)
							}
						})
					}
				}
			})
			return
			
			// 第一个参数强制登录，尝试登录
			// try 为尝试登录，当第一次登录，没有用户登录权限的时候不弹出登录框
			// judge 询问登录，当第一次登录，没有用户登录权限的时候先弹出提示是否要去登录
			onLogin("judge",() => {
				console.log("登录成功");
			});
		},
		onChooseAvatar(e) {
			console.log(e)
			uni.showModal({
				title: '登录信息',
				content: '' + JSON.stringify(e)
			})
			const { avatarUrl } = e.detail
			this.avatarUrl = avatarUrl
		}
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
</style>
