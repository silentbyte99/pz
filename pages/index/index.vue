<template>
	<view class="page">
		<!-- 绿色自定义头部：地区 + 搜索 + 专员条 -->
		<view class="header" :style="{ paddingTop: statusBarHeight + 8 + 'px' }">
			<view class="header-row">
				<text class="location" @tap="chooseRegion">{{ region }} ›</text>
				<view class="search-box">
					<text class="search-icon">🔍</text>
					<input class="search-input" v-model="keyword" placeholder="找医院" placeholder-class="ph" confirm-type="search" @confirm="onSearch" />
					<text class="search-clear" v-if="keyword" @tap="clearKeyword">✕</text>
				</view>
			</view>
			<!-- 服务专员条 -->
			<view class="staff-bar">
				<view class="staff-avatar"><image class="img-fit" src="/static/icons/小猫.png" mode="aspectFill"></image></view>
				<view class="staff-info">
					<text class="staff-name">小安专员</text>
					<text class="staff-tip">我是您服务专员，欢迎随时咨询</text>
				</view>
				<button class="consult-btn" @tap="contact">咨询</button>
			</view>
		</view>

		<view class="body">
			<!-- 主 Banner：四图轮播 + 文案悬浮在图片之上 -->
			<view class="banner">
				<swiper class="banner-swiper" circular autoplay :interval="3000" :duration="500" indicator-dots indicator-color="rgba(255, 255, 255, 0.4)" indicator-active-color="#ffffff">
					<swiper-item v-for="(img, i) in bannerImgs" :key="i">
						<image class="banner-pic" :src="img" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
				<view class="banner-mask"></view>
				<view class="banner-left">
					<text class="banner-title">陪诊陪护\n让看病更简单</text>
					<text class="banner-pill">全程陪诊 一站式助医服务</text>
				</view>
			</view>

		<!-- 双入口卡片 -->
			<view class="entry-row">
				<view class="entry-card blue" @tap="goCate(1)">
					<text class="entry-title">就医陪诊</text>
					<text class="entry-sub">专业陪诊 全程无忧</text>
					<text class="entry-btn">立即进入</text>
					<view class="entry-icon"><image class="img-fit" src="/static/icons/疫苗.png" mode="aspectFit"></image></view>
			</view>
			<view class="entry-card purple" @tap="goCate(4)">
					<text class="entry-title">护理陪护</text>
					<text class="entry-sub">家人般的温暖</text>
					<text class="entry-btn">立即进入</text>
					<view class="entry-icon"><image class="img-fit" src="/static/icons/服务.png" mode="aspectFit"></image></view>
				</view>
			</view>

			<!-- 金刚区：5个分类入口 -->
			<view class="cate-row">
				<view class="cate-item" v-for="c in quickCates" :key="c.id" @tap="goCate(c.id)">
					<view class="cate-icon" :style="{ background: c.color }">{{ c.icon }}</view>
					<text class="cate-name">{{ c.name }}</text>
				</view>
			</view>

			<!-- 热门医院列表 -->
			<view class="section-title">热门医院</view>
			<view class="card hospital" v-for="h in filteredHospitals" :key="h.id" @tap="hospitalTap(h)">
				<view class="h-img"><image class="img-fit" :src="h.img" mode="aspectFill"></image></view>
				<view class="h-info">
					<text class="h-name">{{ h.name }}</text>
					<view class="h-tags">
						<text class="h-tag">{{ h.level }}</text>
						<text class="h-type">{{ h.type }}</text>
					</view>
					<text class="h-desc">{{ h.desc }}</text>
				</view>
			</view>
			<view v-if="filteredHospitals.length === 0" class="empty">未找到相关医院</view>
		</view>

		<!-- 悬浮客服按钮 -->
		<view class="float-service" @tap="contact">
			<text class="float-icon">💬</text>
			<text class="float-text">客服</text>
		</view>
	</view>
</template>

<script>
import { categories, quickCateIds, hospitals } from '@/common/data.js'

export default {
	data() {
		return {
			statusBarHeight: 0,
			region: '重庆地区',
			keyword: '',
			bannerImgs: [
				'/static/icons/陪诊1.jpg',
				'/static/icons/陪诊2.jpg',
				'/static/icons/陪诊3.jpg',
				'/static/icons/陪诊4.jpg'
			],
			quickCates: quickCateIds.map(id => categories.find(c => c.id === id)),
			hospitals
		}
	},
	computed: {
		// 搜索框多字段过滤医院列表
		filteredHospitals() {
			if (!this.keyword) return this.hospitals
			const kw = this.keyword.trim()
			return this.hospitals.filter(h =>
				h.name.includes(kw) ||
				(h.address || '').includes(kw) ||
				(h.level || '').includes(kw) ||
				(h.type || '').includes(kw) ||
				(h.desc || '').includes(kw)
			)
		}
	},
	onLoad() {
		// 自定义导航栏需要预留状态栏高度
		this.statusBarHeight = (uni.getSystemInfoSync().statusBarHeight || 0)
	},
	methods: {
		// 切换地区（模拟）
		chooseRegion() {
			const regions = ['重庆', '渝中区', '江北区', '渝北区']
			uni.showActionSheet({
				itemList: regions,
				success: (res) => {
					this.region = regions[res.tapIndex]
				}
			})
		},
		// 跳转服务列表页（携带分类参数）
		goCate(id) {
			const cate = categories.find(c => c.id === id)
			uni.navigateTo({ url: `/pages/service/service?cateId=${id}&name=${cate.name}` })
		},
		hospitalTap(h) {
			// 跳转医院详情页，传 hospitalId，详情页从同一份数据源取完整信息
			uni.navigateTo({ url: `/pages/hospital-detail/hospital-detail?id=${h.id}` })
		},
		contact() {
			uni.makePhoneCall({ phoneNumber: '4000000000' })
		},
		// 搜索确认：滚动到医院列表区域
		onSearch() {
			if (!this.keyword.trim()) return
			// 有结果则提示匹配数量，无结果提示未找到
			const count = this.filteredHospitals.length
			if (count === 0) {
				uni.showToast({ title: '未找到相关医院', icon: 'none' })
			}
		},
		// 清除搜索关键词
		clearKeyword() {
			this.keyword = ''
		}
	}
}
</script>

<style scoped>
.header {
	background: linear-gradient(180deg, #2e9e83, #35ab8e);
	padding-bottom: 24rpx;
}
.header-row {
	display: flex;
	align-items: center;
	padding: 12rpx 24rpx 20rpx;
}
.location {
	font-size: 30rpx;
	color: #ffffff;
	font-weight: bold;
	flex-shrink: 0;
}
.search-box {
	flex: 1;
	margin-left: 24rpx;
	background: #ffffff;
	border-radius: 36rpx;
	display: flex;
	align-items: center;
	padding: 14rpx 24rpx;
}
.search-icon {
	font-size: 26rpx;
	margin-right: 12rpx;
}
.search-input {
	flex: 1;
	font-size: 26rpx;
	color: #333333;
}
.search-clear {
	font-size: 28rpx;
	color: #cccccc;
	padding-left: 12rpx;
}
.ph {
	color: #bbbbbb;
}
.staff-bar {
	margin: 0 24rpx;
	background: #ffffff;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	padding: 20rpx;
}
.staff-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background: #e8f7f2;
	flex-shrink: 0;
	overflow: hidden;
}
.img-fit {
	width: 100%;
	height: 100%;
}
.staff-info {
	flex: 1;
	margin-left: 20rpx;
	display: flex;
	flex-direction: column;
}
.staff-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #2e9e83;
}
.staff-tip {
	font-size: 22rpx;
	color: #999999;
	margin-top: 6rpx;
}
.consult-btn {
	background: #ffffff;
	color: #2e9e83;
	border: 1rpx solid #2e9e83;
	font-size: 26rpx;
	border-radius: 12rpx;
	padding: 0 28rpx;
	line-height: 60rpx;
	margin: 0;
}
.body {
	padding: 24rpx;
}
.banner {
	position: relative;
	height: 300rpx;
	border-radius: 20rpx;
	overflow: hidden;
}
.banner-swiper {
	width: 100%;
	height: 100%;
}
.banner-pic {
	width: 100%;
	height: 100%;
}
/* 左侧渐变遮罩，保证白色文案在图片上清晰可读 */
.banner-mask {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(90deg, rgba(0, 82, 62, 0.62), rgba(0, 82, 62, 0.08) 62%);
	z-index: 2;
}
.banner-left {
	position: absolute;
	left: 36rpx;
	top: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	z-index: 3;
}
.banner-title {
	font-size: 44rpx;
	font-weight: bold;
	color: #ffffff;
	line-height: 1.4;
	text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.25);
}
.banner-pill {
	align-self: flex-start;
	font-size: 22rpx;
	color: #2e9e83;
	background: rgba(255, 255, 255, 0.85);
	border-radius: 24rpx;
	padding: 8rpx 20rpx;
	margin-top: 24rpx;
}
.entry-row {
	display: flex;
	margin-top: 24rpx;
}
.entry-card {
	flex: 1;
	border-radius: 20rpx;
	padding: 28rpx;
	position: relative;
	overflow: hidden;
	color: #ffffff;
}
.entry-card.blue {
	background: linear-gradient(135deg, #5b8ff9, #7ba7fb);
	margin-right: 20rpx;
}
.entry-card.purple {
	background: linear-gradient(135deg, #9b7ffb, #b39aff);
}
.entry-title {
	font-size: 32rpx;
	font-weight: bold;
	display: block;
}
.entry-sub {
	font-size: 22rpx;
	opacity: 0.9;
	display: block;
	margin-top: 8rpx;
}
.entry-btn {
	display: inline-block;
	font-size: 20rpx;
	background: rgba(255, 255, 255, 0.25);
	border-radius: 20rpx;
	padding: 6rpx 18rpx;
	margin-top: 20rpx;
}
.entry-icon {
	position: absolute;
	right: 20rpx;
	bottom: 20rpx;
	width: 80rpx;
	height: 80rpx;
	border-radius: 16rpx;
	background: rgba(255, 255, 255, 0.25);
	overflow: hidden;
}
.cate-row {
	display: flex;
	background: #ffffff;
	border-radius: 20rpx;
	padding: 32rpx 0;
	margin-top: 24rpx;
}
.cate-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.cate-icon {
	width: 84rpx;
	height: 84rpx;
	border-radius: 24rpx;
	font-size: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.cate-name {
	font-size: 24rpx;
	color: #333333;
	margin-top: 12rpx;
}
.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-top: 36rpx;
	display: block;
}
.card {
	background: #ffffff;
	border-radius: 20rpx;
	margin-top: 24rpx;
}
.hospital {
	display: flex;
	padding: 28rpx;
}
.h-img {
	width: 160rpx;
	height: 160rpx;
	border-radius: 16rpx;
	background: #eef2f0;
	flex-shrink: 0;
	overflow: hidden;
}
.h-info {
	flex: 1;
	margin-left: 24rpx;
	overflow: hidden;
}
.h-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}
.h-tags {
	display: flex;
	align-items: center;
	margin-top: 10rpx;
}
.h-tag {
	font-size: 20rpx;
	color: #2e9e83;
	background: #e8f7f2;
	border-radius: 6rpx;
	padding: 4rpx 12rpx;
}
.h-type {
	font-size: 20rpx;
	color: #f39c12;
	background: #fff6e5;
	border-radius: 6rpx;
	padding: 4rpx 12rpx;
	margin-left: 12rpx;
}
.h-desc {
	display: block;
	font-size: 24rpx;
	color: #999999;
	line-height: 1.6;
	margin-top: 12rpx;
	/* 两行截断 */
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}
.empty {
	text-align: center;
	color: #999999;
	font-size: 26rpx;
	padding: 80rpx 0;
}
.float-service {
	position: fixed;
	right: var(--window-right, 0);
	bottom: 30%;
	background: #ffffff;
	border-radius: 20rpx 0 0 20rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 16rpx 16rpx;
	z-index: 99;
}
.float-icon {
	font-size: 36rpx;
}
.float-text {
	font-size: 20rpx;
	color: #2e9e83;
	margin-top: 4rpx;
}
</style>
