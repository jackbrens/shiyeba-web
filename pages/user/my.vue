<template>
	<view>
		<z-nav-bar backState="2000" title="我的"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<!-- 主体部分 -->
		<view class="container">
			<view class="logo">食嘢吧</view>
			<view class="desc color">唯有美食与爱不可孤负</view>
			<view class="desc">根本就没有食神，或者人人都是食神。</view>
			<button @click="login">登录</button>
		</view>
		
		
		<!-- 导航栏 -->
		<z-navigation></z-navigation>
	</view>
</template>

<script>
// #ifdef MP-WEIXIN
import { onLogin } from '@/config/login'
// #endif
export default {
	data() {
		return {
			
		}
	},
	methods: {
		login() {
			uni.showModal({
				mask: true,
				title: '温馨提示',
				content: '授权登录获取用户信息',
				success(res) {
					if (res.confirm) {
						uni.showLoading({
							title: '正在登录...'
						})
						onLogin("judge",(data) => {
							uni.hideLoading()
							console.log("回调data===", data)
						})
					}
				}
			})

			return
			
			uni.navigateTo({
				url: '/pages/user/myLogin'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	text-align: center;
	margin-top: 20vh;
	.logo {
		text-align: center;
		margin-top: 20vh;
		// margin-bottom: 100rpx;
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
	.desc {
		font-size: 28rpx;
		margin: 40rpx;
	}
	.color {
		color: #ddd;
	}
	button {
		color: #fff;
		margin: 0 120rpx;
		background-color: #FA6650;
	}
}
</style>