<template>
	<view>
		<z-nav-bar title="菜谱搜索"/>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<!-- 主体部分 -->
		<d-search-log
			ref="dSearchLog"
			placeholder="今天想吃点什么？"
			:auto_focus="true"
			:is_show_more="showMore"
			:color_border="color_border"
			:color_text="color_border"
			:search_list_hot="search_list_hot"
			:store_key="store_key"
			@onClickDelAllApi="onClickDelAll"
			@onSearchNameApi="onSearchName"
		></d-search-log>
		<view v-if="search_list.length > 0">
			<uni-list>
			    <uni-list-item 
					v-for="(item, index) in search_list"
					:key="index" clickable
					@click="onGoodsDetail(item.content.id)"
				>
					<template v-slot:header>
						<view class="slot-box">
							<image class="goods-picture" :src="item.content.object.photo" mode="aspectFill"></image>
						</view>
					</template>
					<template v-slot:body>
						<view class="slot-box goods-content">
							<text class="goods-title">{{ item.content.object.name }}</text>
							<view style="overflow: hidden; white-space: nowrap;">
								<text class="goods-tag" v-for="(label, index) in item.content.object.labels" :key="index">{{ label.text }}</text>
							</view>
							<view>
								<text class="grade">{{ item.content.object.score }}分</text>
								<text class="count">{{ item.content.object.stats.n_cooked }}人做过</text>
							</view>
							<text class="author">{{ item.content.object.author.name }}</text>
						</view>
					</template>
				</uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script>
import { httpRequest } from '@/api/index'
export default {
	data() {
		return {
			color_border: '#aaa',
			
			// 搜索关键词
			keyword: '',
			
			cursorKey: ['MjA=', 'NDA=', 'NjA=', 'ODA=', 'MTAw', 'MTIw', 'MTQw', 'MTYw', 'MTgw', 'MjAw', 'MjIw', 'MjQw', 'MjYw', 'Mjgw', 'MzAw', 'MzIw'],
			
			cursorKeyIndex: 0,			
			// 综合，评分最高，做过最多
			order_by: ['', '-score', '-n_dishes'],
			
			// 热门搜索列表
			search_list_hot: [],
			
			// 搜索结果列表
			search_list: [],
			
			store_key: 'history_list',
			
			// 是否显示 搜索历史和热门搜索
			showMore: true
		};
	},
	onLoad({ name }) {
		this.search_list_hot = [
			'辣椒炒肉', 
			'辣子鸡',
			'八爪鱼', 
			'油爆虾', 
			'红薯粉', 
			'木耳菜', 
			'鸭腿', 
			'贝果',
			'冬瓜海带汤',
			'筒骨汤',
			'芹菜香干',
			'香菜牛肉'
		]
		
		if (name) {
			this.keyword  = name
			this.$refs.dSearchLog.onClickInputValue(name)
			this.onSearchName(name)
		}
	},
	methods: {
		onClickDelAll() {
			console.log('[父级接收事件]：删除全部搜索记录')
		},
		
		/**
		 * @description 产生随机字母串
		 * @param {Number}  多少位
		 * @param {String} 字母串类型  =>UPPER,LOWER,MIXED
		 *  默认
		 */
		randomLetter(count, type) {
			count = count || 26
			let lower = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
					'u', 'v', 'w', 'x', 'y', 'z'
				],
				upper = [],
				letters = [],
				res = ''
			// 小写字母转大写字母
			lower.forEach(item => {
				upper.push(item.toUpperCase())
			})
			letters = lower.concat(upper)
			switch (type) {
				case 'UPPER':
					{
						for (let i = 0; i < count; i++) {
							let index = Math.round(Math.random() * 25)
							res += upper[index];
						}
						console.log(type, count)
					}
					break;
				case 'LOWER':
					{
						for (let i = 0; i < count; i++) {
							let index = Math.round(Math.random() * 25)
							res += lower[index];
						}
					}
					break;
				case 'MIXED':
				default:
					{
						for (let i = 0; i < count; i++) {
							let index = Math.round(Math.random() * 51)
							res += letters[index]
						}
					}
					break;
		
			}
			return res
		},
		async getSearchListByKeyword(randomKey) {
			const data = await httpRequest({
				url: '/juno/api/v2/search/universal_search_v2.json',
				method: 'POST',
				data: {
					q: this.keyword,
					cursor: randomKey,
					order_by: '',
					size: 20,
					search_type: 1091,
					sk: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOjE1Njk2MjM1NCwidWlkIjoxNTczODQ3MjgsImlhdCI6MTY3OTUzNzE2Ni4wLCJvIjo1fQ.aO5BxW56MG7YxldHP7mt-qEgLC2O5Bl7IpQviuuz4Pc',
					is_weapp: 1,
					weapp_src: 'xcf'
					
				}
			})
			return data.content.content.filter(v => v.style != 'equipment_binding_tips_item')
									   .filter(v => v.style !== 'search_artical_ad_collection')
		},
		
		// 搜索关键词
		async onSearchName(e) {
			if (!e) return
			this.keyword = e
			uni.showLoading({
				title: '加载中...'
			})
			const list = await this.getSearchListByKeyword()
			if (list && list.length > 0) {
				uni.hideLoading()
				this.showMore = false
				this.search_list = list
			} else {
				uni.showToast({
					title: '查询失败！',
					icon: 'none'
				})
			}
		},
		
		// 跳转到商品详情
		onGoodsDetail(id) {
			uni.navigateTo({
				url: '/pages/goods/goodsDetail?id=' + id
			})
		}
	},
	
	//页面上拉触底
	async onReachBottom() {
		this.cursorKeyIndex++
		if (!this.cursorKey[this.cursorKeyIndex]) this.cursorKeyIndex = 0
		// const cursorKey = this.randomLetter(1, 'UPPER') + this.randomLetter(1) + 'A='
		const cursorKey = this.cursorKey[this.cursorKeyIndex]
		const list = await this.getSearchListByKeyword(cursorKey)
		if (list && list.length > 0) {
			this.search_list = [...this.search_list, ...list]
		}
	}
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
.slot-box {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
}

.goods-picture {
	/* #ifndef APP-NVUE */
	display: block;
	/* #endif */
	margin-right: 14px;
	width: 240rpx;
	height: 200rpx;
	border-radius: 10rpx;
	// object-fit: cover;
}

.goods-content {
	width: 200rpx;
	flex: 1;
	font-size: 24rpx;
	color: #383831;
	.goods-title {
		font-weight: bolder;
		font-size: 36rpx;
		margin-top: 4rpx;
		@include toe;
	}
	.goods-tag {
		display: inline-block;
		background-color: #F5F5F5;
		color: #666666;
		padding: 8rpx;
		margin: 16rpx 12rpx 16rpx 0;
	}
	.grade {
		margin-right: 16rpx;
	}
	.count {
	}
	.author {
		color: #B3B3AF;
		margin-top: 12rpx;
	}
}
</style>
