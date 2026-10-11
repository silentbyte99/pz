<template>
	<view class="page">
		<!-- 分类筛选 -->
		<scroll-view scroll-x class="cate-scroll">
			<view
				class="cate-tab"
				:class="{ active: currentCate === 0 }"
				@tap="switchCate(0)"
			>全部</view>
			<view
				class="cate-tab"
				:class="{ active: currentCate === c.id }"
				v-for="c in categories"
				:key="c.id"
				@tap="switchCate(c.id)"
			>{{ c.name }}</view>
		</scroll-view>

		<!-- 服务列表：图三卡片式布局，点击进入详情 -->
		<view class="card service-item" v-for="s in filteredList" :key="s.id" @tap="goDetail(s.id)">
			<view class="s-icon" :style="{ background: cateMeta(s).color }">{{ cateMeta(s).icon }}</view>
			<view class="s-body">
				<view class="s-top">
					<text class="s-title">{{ s.title }}</text>
					<view class="s-price">
						<text class="price-symbol">¥</text>
						<text class="price-num">{{ s.price }}</text>
						<text class="price-unit">/{{ s.unit }}</text>
					</view>
				</view>
				<text class="s-desc">{{ s.desc }}</text>
				<view class="s-btns">
					<button class="btn-detail" @tap.stop="goDetail(s.id)">查看详情</button>
					<button class="btn-book" @tap.stop="goBook(s)">立即预约</button>
				</view>
			</view>
		</view>

		<view v-if="filteredList.length === 0" class="empty">该分类暂无服务</view>
	</view>
</template>

<script>
import { categories, services } from '@/common/data.js'
import { requireLogin } from '@/common/auth.js'

export default {
	data() {
		return {
			categories,
			currentCate: 0
		}
	},
	computed: {
		filteredList() {
			if (!this.currentCate) return services
			return services.filter(s => s.categoryId === this.currentCate)
		}
	},
	onLoad(options) {
		// 支持从首页带分类参数进入
		if (options.cateId) {
			this.currentCate = Number(options.cateId)
			if (options.name) {
				uni.setNavigationBarTitle({ title: options.name })
			}
		}
	},
	methods: {
		switchCate(id) {
			this.currentCate = id
		},
		// 服务所属分类的图标与底色
		cateMeta(s) {
			const cate = categories.find(c => c.id === s.categoryId)
			return cate || { icon: '🏥', color: '#e8f7f2' }
		},
		// 跳转服务详情页
		goDetail(id) {
			uni.navigateTo({ url: `/pages/service-detail/service-detail?id=${id}` })
		},
		// 直接预约下单，未登录先提示登录
		goBook(s) {
			requireLogin(() => {
				uni.navigateTo({
					url: `/pages/order-confirm/order-confirm?id=${s.id}&title=${s.title}&price=${s.price}`
				})
			})
		}
	}
}
</script>

<style scoped>
.page {
	padding: 24rpx;
}
.cate-scroll {
	white-space: nowrap;
}
.cate-tab {
	display: inline-block;
	font-size: 28rpx;
	color: #666666;
	padding: 12rpx 28rpx;
	background: #ffffff;
	border-radius: 32rpx;
	margin-right: 16rpx;
}
.cate-tab.active {
	color: #ffffff;
	background: #2e9e83;
}
.card {
	background: #ffffff;
	border-radius: 20rpx;
	margin-top: 24rpx;
}
.service-item {
	display: flex;
	padding: 30rpx;
	margin-top: 24rpx;
}
.s-icon {
	width: 130rpx;
	height: 130rpx;
	border-radius: 20rpx;
	font-size: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}
.s-body {
	flex: 1;
	margin-left: 24rpx;
	overflow: hidden;
}
.s-top {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
}
.s-title {
	flex: 1;
	font-size: 31rpx;
	font-weight: bold;
	color: #333333;
	line-height: 1.4;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.s-price {
	flex-shrink: 0;
	margin-left: 16rpx;
	display: flex;
	align-items: baseline;
}
.price-symbol {
	font-size: 22rpx;
	color: #ff5b3b;
	font-weight: bold;
}
.price-num {
	font-size: 36rpx;
	color: #ff5b3b;
	font-weight: bold;
}
.price-unit {
	font-size: 22rpx;
	color: #999999;
}
.s-desc {
	display: block;
	font-size: 24rpx;
	color: #999999;
	line-height: 1.65;
	margin-top: 12rpx;
	/* 两行截断保持卡片整齐 */
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}
.s-btns {
	display: flex;
	justify-content: flex-end;
	margin-top: 20rpx;
}
.btn-detail {
	font-size: 26rpx;
	color: #666666;
	background: #ffffff;
	border: 1rpx solid #dddddd;
	border-radius: 32rpx;
	line-height: 60rpx;
	padding: 0 34rpx;
	margin: 0;
}
.btn-book {
	font-size: 26rpx;
	color: #ffffff;
	background: linear-gradient(135deg, #2e9e83, #45b394);
	border-radius: 32rpx;
	line-height: 60rpx;
	padding: 0 34rpx;
	margin: 0 0 0 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(46, 158, 131, 0.25);
}
.empty {
	text-align: center;
	color: #999999;
	font-size: 26rpx;
	padding: 80rpx 0;
}
</style>
