<template>
	<view>
		<z-nav-bar title="登录"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<!-- 主体部分 -->
		<view class="container">
			<!-- #ifdef MP-WEIXIN -->
			<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
			  <image class="avatar" :src="avatarUrl"></image>
			</button>
			<input type="nickname" @input="handlerInput" class="weui-input" placeholder="请输入昵称"/>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inputValue: '',
				avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
			}
		},
		methods:{
			onChooseAvatar(e) {
				console.log(e)
				const { avatarUrl } = e.detail
				this.avatarUrl = avatarUrl
			},
			handlerInput(e) {
				console.log('handlerInput====', e)
				const { value } = e.detail
				this.inputValue = value
			}
		}
	}
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
.container {
	text-align: center;
	margin-top: 60rpx;
	.avatar-wrapper {
		text-align: center;
		.avatar {
			display: inline-block;
			width: 120rpx;
			height: 120rpx;
			object-fit: cover;
		}
	}
}

</style>