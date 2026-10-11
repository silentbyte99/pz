<template>
	<view class="page" v-if="hospital">
		<!-- 医院头部信息：图片 + 名称 + 等级 -->
		<view class="card head-card">
			<image class="h-img" :src="hospital.img" mode="aspectFill"></image>
			<view class="h-info">
				<text class="h-name">{{ hospital.name }}</text>
				<view class="h-tags">
					<text class="h-tag">{{ hospital.level }}</text>
					<text class="h-type">{{ hospital.type }}</text>
				</view>
			</view>
		</view>

		<!-- 地址 + 导航 -->
		<view class="card addr-card" @tap="goNav">
			<text class="addr-icon">📍</text>
			<text class="addr-text">{{ hospital.address }}</text>
			<text class="addr-nav">导航 ›</text>
		</view>

		<!-- 在线预约服务：图三卡片式布局 -->
		<view class="section-title">在线预约您需要的服务</view>
		<view class="card service-item" v-for="s in services" :key="s.id" @tap="goDetail(s.id)">
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
	</view>
</template>

<script>
import { hospitals, services, categories } from '@/common/data.js'
import { requireLogin } from '@/common/auth.js'

export default {
	data() {
		return {
			hospital: null,
			services
		}
	},
	onLoad(options) {
		this.hospital = hospitals.find(h => h.id === Number(options.id))
		if (this.hospital) {
			uni.setNavigationBarTitle({ title: this.hospital.name })
		}
	},
	methods: {
		// 服务所属分类的图标与底色
		cateMeta(s) {
			const cate = categories.find(c => c.id === s.categoryId)
			return cate || { icon: '🏥', color: '#e8f7f2' }
		},
		// 跳转地图导航
		goNav() {
			uni.openLocation({
				latitude: 0,
				longitude: 0,
				name: this.hospital.name,
				address: this.hospital.address,
				scale: 18
			})
		},
		// 跳转服务详情
		goDetail(id) {
			uni.navigateTo({ url: `/pages/service-detail/service-detail?id=${id}` })
		},
		// 直接预约下单，未登录先提示登录
		goBook(s) {
			requireLogin(() => {
				uni.navigateTo({
					url: `/pages/order-confirm/order-confirm?id=${s.id}&title=${s.title}&price=${s.price}&hospital=${encodeURIComponent(this.hospital.name)}`
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
.card {
	background: #ffffff;
	border-radius: 20rpx;
}
.head-card {
	display: flex;
	padding: 28rpx;
}
.h-img {
	width: 160rpx;
	height: 160rpx;
	border-radius: 16rpx;
	background: #eef2f0;
	flex-shrink: 0;
}
.h-info {
	flex: 1;
	margin-left: 24rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
}
.h-name {
	font-size: 34rpx;
	font-weight: bold;
	color: #333333;
}
.h-tags {
	display: flex;
	align-items: center;
	margin-top: 16rpx;
}
.h-tag {
	font-size: 22rpx;
	color: #2e9e83;
	background: #e8f7f2;
	border-radius: 6rpx;
	padding: 6rpx 14rpx;
}
.h-type {
	font-size: 22rpx;
	color: #f39c12;
	background: #fff6e5;
	border-radius: 6rpx;
	padding: 6rpx 14rpx;
	margin-left: 12rpx;
}
.addr-card {
	margin-top: 24rpx;
	padding: 28rpx;
	display: flex;
	align-items: center;
}
.addr-icon {
	font-size: 32rpx;
}
.addr-text {
	flex: 1;
	font-size: 26rpx;
	color: #333333;
	margin-left: 12rpx;
}
.addr-nav {
	font-size: 26rpx;
	color: #2e9e83;
}
.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin: 36rpx 0 24rpx;
	display: block;
}
.service-item {
	display: flex;
	padding: 30rpx;
	margin-bottom: 20rpx;
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
</style>
