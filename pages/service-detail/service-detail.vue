<template>
	<view class="page" v-if="service">
		<view class="card head-card">
			<text class="title">{{ service.title }}</text>
			<view class="price-row">
				<text class="price">¥{{ service.price }}</text>
				<text class="price-unit">/{{ service.unit }}</text>
			</view>
			<view class="meta-row">
				<text class="meta">评分 {{ service.rating }}</text>
				<text class="meta">已服务 {{ service.orders }} 单</text>
			</view>
			<view class="tag-row">
				<text class="tag" v-for="(t, i) in service.tags" :key="i">{{ t }}</text>
			</view>
		</view>

		<view class="card desc-card">
			<text class="section-title">服务介绍</text>
			<text class="desc">{{ service.desc }}</text>
			<text class="desc">1. 下单后客服电话确认就诊信息；\n2. 陪诊师提前一天与您沟通集合时间地点；\n3. 服务完成后提供电子服务单。</text>
		</view>

		<!-- 底部操作栏：跳转预约下单页 -->
		<view class="footer">
			<button class="book-btn" @tap="goBook">立即预约</button>
		</view>
	</view>
</template>

<script>
import { services } from '@/common/data.js'
import { requireLogin } from '@/common/auth.js'

export default {
	data() {
		return {
			service: null
		}
	},
	onLoad(options) {
		this.service = services.find(s => s.id === Number(options.id)) || services[0]
	},
	methods: {
		// 跳转预约下单页（携带服务id和服务名），未登录先提示登录
		goBook() {
			requireLogin(() => {
				uni.navigateTo({
					url: `/pages/order-confirm/order-confirm?id=${this.service.id}&title=${this.service.title}&price=${this.service.price}`
				})
			})
		}
	}
}
</script>

<style scoped>
.page {
	padding: 24rpx 24rpx 140rpx;
}
.card {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 28rpx;
	margin-top: 24rpx;
}
.title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333333;
}
.price-row {
	margin-top: 16rpx;
}
.price {
	font-size: 44rpx;
	color: #ff5b3b;
	font-weight: bold;
}
.price-unit {
	font-size: 24rpx;
	color: #999999;
}
.meta-row {
	margin-top: 16rpx;
}
.meta {
	font-size: 24rpx;
	color: #999999;
	margin-right: 32rpx;
}
.tag-row {
	margin-top: 16rpx;
}
.tag {
	display: inline-block;
	font-size: 20rpx;
	color: #2e9e83;
	background: #e8f7f2;
	border-radius: 6rpx;
	padding: 4rpx 12rpx;
	margin-right: 12rpx;
}
.section-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
	display: block;
	margin-bottom: 16rpx;
}
.desc {
	display: block;
	font-size: 26rpx;
	color: #666666;
	line-height: 1.7;
	margin-top: 8rpx;
}
.footer {
	position: fixed;
	left: var(--window-left, 0);
	right: var(--window-right, 0);
	bottom: 0;
	background: #ffffff;
	padding: 16rpx 32rpx;
	padding-bottom: calc(16rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
}
.book-btn {
	background: #2e9e83;
	color: #ffffff;
	font-size: 30rpx;
	border-radius: 44rpx;
}
</style>
