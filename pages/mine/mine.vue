<template>
	<view class="page">
		<!-- 用户信息头部：头像居中，未登录点击跳登录页 -->
		<view class="user-header" @tap="goLogin">
			<view class="avatar">
				<image v-if="userInfo && userInfo.avatar" class="avatar-img" :src="userInfo.avatar" mode="aspectFill"></image>
				<text v-else>{{ userInfo ? userInfo.name.slice(0, 1) : '客' }}</text>
			</view>
			<text class="user-name">{{ userInfo ? userInfo.name : '未登录用户' }}</text>
			<text class="user-tip">{{ userInfo ? maskedPhone : '点击登录后可同步订单信息' }}</text>
		</view>

		<view class="content">
			<!-- 数据统计卡片：已登录才显示，向上叠压头部 -->
			<view class="stats-card" v-if="userInfo">
				<view class="stats-item" @tap="goOrder">
					<text class="stats-num">{{ stats.total }}</text>
					<text class="stats-label">全部订单</text>
				</view>
				<view class="stats-divider"></view>
				<view class="stats-item" @tap="goOrder">
					<text class="stats-num">{{ stats.pending }}</text>
					<text class="stats-label">待服务</text>
				</view>
				<view class="stats-divider"></view>
				<view class="stats-item" @tap="goOrder">
					<text class="stats-num">{{ stats.done }}</text>
					<text class="stats-label">已完成</text>
				</view>
				<view class="stats-divider"></view>
				<view class="stats-item">
					<text class="stats-num price">¥{{ stats.totalFee }}</text>
					<text class="stats-label">累计费用</text>
				</view>
			</view>

			<!-- 菜单列表 -->
			<view class="card menu-card">
				<view class="menu-item" @tap="goOrder">
					<text class="menu-icon">📋</text>
					<view class="menu-text">
						<text class="menu-name">我的订单</text>
						<text class="menu-sub">查看全部预约记录</text>
					</view>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item" @tap="goService">
					<text class="menu-icon">🧑‍⚕️</text>
					<view class="menu-text">
						<text class="menu-name">全部服务</text>
						<text class="menu-sub">陪诊取药助浴一站搞定</text>
					</view>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item" @tap="goProfileEdit">
					<text class="menu-icon">✏️</text>
					<view class="menu-text">
						<text class="menu-name">编辑资料</text>
						<text class="menu-sub">维护个人信息与健康档案</text>
					</view>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item" @tap="contact">
					<text class="menu-icon">☎️</text>
					<view class="menu-text">
						<text class="menu-name">联系客服</text>
						<text class="menu-sub">7×24 小时贴心服务</text>
					</view>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item" @tap="about">
					<text class="menu-icon">ℹ️</text>
					<view class="menu-text">
						<text class="menu-name">关于我们</text>
						<text class="menu-sub">了解安心陪诊</text>
					</view>
					<text class="menu-arrow">›</text>
				</view>
			</view>

			<!-- 弹性占位：把退出登录推到页面底部，布满全屏 -->
			<view class="flex-fill"></view>

			<!-- 退出登录：登录状态才显示 -->
			<view class="card logout-card" v-if="userInfo" @tap="logout">
				<text class="logout-text">退出登录</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: null,
			stats: {
				total: 0,
				pending: 0,
				done: 0,
				totalFee: 0
			}
		}
	},
	computed: {
		// 手机号脱敏：138****1111
		maskedPhone() {
			return this.userInfo.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
		}
	},
	onShow() {
		// 每次进入页面时读取登录状态（登录页成功后写入）
		const raw = uni.getStorageSync('userInfo')
		this.userInfo = raw ? JSON.parse(raw) : null
		if (this.userInfo) {
			this.loadStats()
		}
	},
	methods: {
		// 统计订单数据
		loadStats() {
			const key = 'orders_' + this.userInfo.phone
			const raw = uni.getStorageSync(key)
			const list = raw ? JSON.parse(raw) : []
			this.stats.total = list.length
			this.stats.pending = list.filter(o => o.status === '待服务' || o.status === '服务中').length
			this.stats.done = list.filter(o => o.status === '已完成').length
			this.stats.totalFee = list.reduce((sum, o) => sum + Number(o.price || 0), 0)
		},
		// 我的订单：未登录先去登录，已登录跳订单页
		goOrder() {
			if (!this.userInfo) {
				uni.navigateTo({ url: '/pages/login/login' })
			} else {
				uni.switchTab({ url: '/pages/order/order' })
			}
		},
		// 未登录则跳登录页，已登录则跳个人信息编辑页
		goLogin() {
			if (this.userInfo) {
				uni.navigateTo({ url: '/pages/profile-edit/profile-edit' })
			} else {
				uni.navigateTo({ url: '/pages/login/login' })
			}
		},
		// 编辑资料：已登录直达个人信息编辑页
		goProfileEdit() {
			this.goLogin()
		},
		// 普通页面用 navigateTo 跳转
		goService() {
			uni.navigateTo({ url: '/pages/service/service' })
		},
		contact() {
			uni.makePhoneCall({ phoneNumber: '4000000000' })
		},
		about() {
			uni.showModal({
				title: '关于我们',
				content: '安心陪诊 · 让每一次就医都有温度',
				showCancel: false
			})
		},
		logout() {
			uni.showModal({
				title: '提示',
				content: '确定退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						uni.removeStorageSync('userInfo')
						this.userInfo = null
						uni.showToast({ title: '已退出登录', icon: 'none' })
					}
				}
			})
		}
	}
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background: #f5f6f8;
}
/* 头部：绿色渐变通栏，头像居中 */
.user-header {
	background: linear-gradient(160deg, #2e9e83, #56c2a4);
	padding: 90rpx 32rpx 110rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.avatar {
	width: 150rpx;
	height: 150rpx;
	border-radius: 50%;
	background: #ffffff;
	color: #2e9e83;
	font-size: 56rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	border: 6rpx solid rgba(255, 255, 255, 0.6);
	box-sizing: content-box;
}
.avatar-img {
	width: 100%;
	height: 100%;
}
.user-name {
	font-size: 38rpx;
	color: #ffffff;
	font-weight: bold;
	margin-top: 26rpx;
}
.user-tip {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.85);
	margin-top: 10rpx;
}
/* 内容区：占满剩余高度，弹性分布 */
.content {
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: 0 24rpx 40rpx;
	box-sizing: border-box;
}
/* 统计卡片：向上叠压绿色头部 */
.stats-card {
	position: relative;
	z-index: 2;
	background: #ffffff;
	border-radius: 20rpx;
	margin-top: -60rpx;
	display: flex;
	padding: 40rpx 0;
	box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.06);
}
.stats-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.stats-num {
	font-size: 42rpx;
	font-weight: bold;
	color: #333333;
}
.stats-num.price {
	color: #ff5b3b;
	font-size: 32rpx;
}
.stats-label {
	font-size: 22rpx;
	color: #999999;
	margin-top: 10rpx;
}
.stats-divider {
	width: 1rpx;
	background: #f0f0f0;
	margin: 8rpx 0;
}
.card {
	background: #ffffff;
	border-radius: 20rpx;
	margin-top: 24rpx;
}
/* 菜单：双行布局更饱满 */
.menu-item {
	display: flex;
	align-items: center;
	padding: 34rpx 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
}
.menu-item:last-child {
	border-bottom: none;
}
.menu-icon {
	font-size: 38rpx;
	margin-right: 22rpx;
}
.menu-text {
	flex: 1;
	display: flex;
	flex-direction: column;
}
.menu-name {
	font-size: 30rpx;
	color: #333333;
}
.menu-sub {
	font-size: 22rpx;
	color: #bbbbbb;
	margin-top: 6rpx;
}
.menu-arrow {
	font-size: 34rpx;
	color: #cccccc;
}
/* 弹性占位撑满剩余屏幕 */
.flex-fill {
	flex: 1;
	min-height: 24rpx;
}
.logout-card {
	padding: 30rpx;
	display: flex;
	justify-content: center;
}
.logout-text {
	font-size: 30rpx;
	color: #ff5b3b;
}
</style>
