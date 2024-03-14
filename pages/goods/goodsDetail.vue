<template>
	<view>
		<z-nav-bar title="菜品详情"></z-nav-bar>
		<image class="banner-img" :src="goods.photo" mode="aspectFill"></image>
		<view class="wrapper">
			<h1 class="goods-name">{{ goods.name }}</h1>
			<view class="score">7.5平分 · 156人做过</view>
			<view class="bottom-line"></view>
			<view class="desc">{{ goods.desc }}</view>
			<view class="material">
				<view class="header">
					<h2>用料</h2>
					<button>换算</button>
				</view>
				<ul class="material-content">
					<li class="material-item" v-for="(item, index) in goods.ingredient" :key="index">
						<text>{{ item.name }}</text>
						<text>{{ item.amount }}</text>
					</li>
				</ul>
			</view>
			<view class="steps">
				<view class="steps-item" v-for="(step, idx) in goods.instruction" :key="idx">
					<view class="steps-title">步骤 {{ Number(step.step) + 1 }}</view>
					<image class="steps-img" :src="step.photo800" mode="aspectFill"></image>
					<view class="steps-desc">{{ step.text }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { httpRequest } from '@/api'
	export default {
		onLoad({ id }) {
			console.log('option===', id)
			this.id = id
		},
		data() {
			return {
				// 商品 id
				id: '',
				
				// 商品对象
				goods: {}
			}
		},
		async onShow() {
			const goods = await this.getGoodsDetail(this.id)
			this.goods = goods
			console.log('goods', this.goods)
		},
		methods: {
			async getGoodsDetail(id) {
				const data = await httpRequest({
					url: '/juno/api/v2/recipes/show_v2.json?id=' + id,
					method: 'GET',
				})
				return data?.content?.recipe
			}
		}
	}
</script>

<style lang="scss" scoped>
.banner-img {
	width: 750rpx;
	height: 560rpx;
}

.goods-name {
	font-size: 40rpx;
	font-weight: bolder;
	margin: 40rpx 0;
}

.score {
	text-align: center;
	align-items: center;
	
}

.bottom-line {
	margin: 40rpx 0;
	height: 2rpx;
	background-color: #E5E5E3;
}

.desc {
	line-height: 2;
	margin-bottom: 40rpx;
}

.material {
	.header {
		display: flex;
		justify-content: space-between;
		h2 {
			display: flex;
			align-items: center;
			font-weight: bolder;
		}
		button {
			background-color: #eee;
			border-radius: 40rpx;
			padding: 1px 18px;
			font-size: 28rpx;
		}
	}
	.material-content {
		.material-item {
			display: flex;
			justify-content: space-between;
			border-bottom: 2rpx dashed #E5E5E3;
			padding: 20rpx 0;
			&:last-of-type {
				border-bottom: none;
			}
		}
	}
}

.steps {
	margin-top: 40rpx;
	.steps-item {
		.steps-title {
			font-weight: bolder;
			margin-bottom: 40rpx;
		}
		.steps-img {
			border-radius: 20rpx;
			width: 100%;
			// height: 100%;
			object-fit: cover;
		}
		.steps-desc {
			padding: 20rpx 0 40rpx;
			margin-bottom: 40rpx;
			border-bottom: 2rpx solid #E5E5E3;
		}
	}
}
</style>
