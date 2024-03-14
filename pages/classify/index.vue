<template>
	<view>
		<z-nav-bar title="菜谱分类"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<!-- 主体部分 -->
		<view class="page">
			<scroll-view  @scroll="leftScroll" class="left_view p_r" scroll-y :style="{ height: scrollH + 'px' }" :scroll-into-view="leftScrollTop()">
				<block v-for="(item, index) in dataArr" :key="index">
					<view :class="[left_selectIndex == index ? 'left_item_s' : '', 'left_item']" :id="'left_' + index" @click="leftTap({ item, index })">{{ item.name }}</view>
				</block>
				<view class="seletItem" :style="{ top: left_selectIndex * 60 + 'px' }"></view>
				<view class="" style="height: 80px;"><!-- 站位 --></view>
			</scroll-view>
		
			<scroll-view @scroll="rightScroll" class="right_view" scroll-y :style="{ height: scrollH + 'px' }" :scroll-into-view="'left_' + right_selectIndex" scroll-with-animation>
				<block v-for="(item, index) in dataArr" :key="index">
					<view :ref="'left_' + index" class="right_item " :id="'left_' + index">
						<text class="right_item_title ">{{ item.name }}</text>
						<view class="right_item_view">
							<view class="item" v-for="(subitem, subindex) in item.subArr" :key="subindex" @click="rightTap(item, subitem)">
								<template v-if="subitem.img">
									<image :src="urlTobase64(subitem.img)" :style="{ width: '100%', height: subItemW + 'px' }"></image>
									<text>{{ subitem.name }}</text>
								</template>
								
								<view v-else 
									style="background-color: #eee; display: flex; justify-content: center; align-items: center;"
									:style="{ width: '100%', height: subItemW + 'px' }">
									{{ subitem.name }}
								</view>
								<!-- <image src="/static/demo/1.jpg" :style="{ width: '100%', height: subItemW + 'px' }"></image> -->
							</view>
						</view>
					</view>
				</block>
				<view class="" :style="{ height: placeholderH + 'px' }"><!-- 站位 --></view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import classify from './classify.js'
export default {
	data() {
		return {
			left_scrolly: 0,
			// 底部有tabar-88 scrollH: uni.getSystemInfoSync().screenHeight-88
			scrollH: uni.getSystemInfoSync().screenHeight,
			subItemW: parseInt((uni.getSystemInfoSync().screenWidth * (2 / 3) - 15 * 2 - 24) / 3),
			left_selectIndex: 0,
			right_selectIndex: 0,
			ttscrollH: 0, //总高度
			placeholderH: 0, //占位高度

			heighArr: [],
			dataArr: classify
		};
	},
	onLoad() {
		let self = this;
		setTimeout(function() {
			self.computerH();
		}, 100);
	},
	methods: {
		urlTobase64(folder) {
			let img = `/static/${folder}`,
				imgBase64 = wx.getFileSystemManager().readFileSync(img, "base64"),
				base64Url = `data:image/png;base64,${imgBase64}`
			return base64Url
		},
		leftTap: function(e) {
			this.left_selectIndex = e.index;
			this.right_selectIndex = e.index;
		},
		// 左侧滚动
		leftScroll: function(e) {
			this.left_scrolly = e.detail.scrollTop;
		},
		// 左侧顶部高度
		leftScrollTop: function(e) {
			let b = this.left_selectIndex * 60 + 80;
			let c = b - this.scrollH;

			if (c > 0) {
				return 'left_' + this.left_selectIndex;
			}

			if (this.left_scrolly > b - 80) {
				return 'left_' + this.left_selectIndex;
			}
		},

		// 右边点击
		rightTap: function(item, subitem) {
			// uni.showModal({
			// 	title: `一级:${item.name}\n二级:${subitem.name}`,
			// 	showCancel: false
			// });
			uni.navigateTo({ 
				url: '/pages/search/index?name=' + subitem.name
			})
		},
		rightScroll: function(e) {
			let scrollH = e.detail.scrollTop + 30;
			let cc = this.ttscrollH - this.scrollH;

			let a = 0;
			let findInx = this.heighArr.findIndex(function(itemH, i) {
				a = a + itemH;
				return a > scrollH;
			});

			this.left_selectIndex = findInx;
		},

		// 计算高度
		computerH: function() {
			this.ttscrollH = 0;
			for (let item of this.dataArr) {
				let title_lineH = 49; //rpx
				let subNum = item.subArr.length;
				let subImgH = this.subItemW; //rpx
				let subTitleH = 40; //rpx
				let rowSpecH = 8; //rpx
				let rowN = subNum % 3;
				let rowSpecNum = parseInt(subNum / 3) + parseInt(rowN > 0 ? 1 : 0);
				let totalRpx = title_lineH + (subImgH + subTitleH) * rowSpecNum + rowSpecH * (rowSpecNum - 1);
				this.heighArr.push(totalRpx);
				this.ttscrollH = this.ttscrollH + totalRpx;
			}

			this.placeholderH = this.scrollH - this.heighArr[this.heighArr.length - 1];

			//以下方法也可以  但是通用性不高 上面方法 计算麻烦但是适合各种平台
			// let self=this
			// var selectorQuery = uni.createSelectorQuery()
			// selectorQuery.selectAll('.right_item').boundingClientRect(data => {
			// 	self.heighArr = data.map(item => {
			// 		return {
			// 			top: Math.round(item.top),
			// 			height: Math.round(item.height)
			// 		}
			// 	})
			// }).exec()
			// console.log('ttscrollH',this.$refs.left_0)
		}
	}
};
</script>

<style lang="scss" scoped>
* {
	box-sizing: border-box;
}
.page {
	display: grid;
	grid-template-columns: 1fr 2fr;
	grid-template-rows: auto;
	position: absolute;
	left: 0rpx;
	bottom: 0rpx;
	right: 0rpx;
	top: 130rpx;
	overflow: hidden;
}
.left_view {
	background-color: #f8f8f8;
	position: relative;
	// 蒙版
	.seletItem {
		height: 60px;
		position: absolute;
		top: 0rpx;
		left: 0rpx;
		z-index: 10;
		right: 0rpx;
		background-color: rgba(255, 255, 255, 0.3);
		transition: top 0.2s linear;
		display: flex;
		align-items: center;

		&::before {
			content: '';
			width: 6rpx;
			height: 60%;
			background-color: #FA6650;
			left: 0rpx;
			border-radius: 0px 100rpx 100rpx 0px;
		}
	}
	.left_item {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60px;
		margin-bottom: 0rpx;
		position: relative;
		font-size: 28rpx;
	}
	.left_item_s {
		background-color: #ffffff;
		color: #FA6650;
		position: relative;
	}
}

.right_view {
	background-color: #ffffff;
	padding: 0rpx 12px;
	.right_item {
		.right_item_title {
			display: block;
			line-height: 49px;
			font-size: 28rpx;
			font-weight: bold;
		}
		.right_item_view {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-template-rows: auto;
			grid-gap: 8px 8px;
			.item {
				display: flex;
				flex-flow: column nowrap;
				align-items: center;
				border-radius: 16rpx;
				overflow: hidden;
				position: relative;
				font-size: 28rpx;
				text {
					position: absolute;
					bottom: 8rpx;
					font-weight: bolder;
					color: #fff;
				}
			}
		}
	}
}
</style>
