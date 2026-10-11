<template>
	<view class="page">
		<!-- 未登录：提示去登录 -->
		<view class="login-tip" v-if="!isLogin">
			<text class="tip-icon">📋</text>
			<text class="tip-text">登录后查看您的订单</text>
			<button class="tip-btn" @tap="goLogin">去登录</button>
		</view>

		<template v-else>
			<!-- 状态筛选 -->
			<view class="status-bar">
				<view
					class="status-tab"
					:class="{ active: currentStatus === '全部' }"
					@tap="switchStatus('全部')"
				>全部</view>
				<view
					class="status-tab"
					:class="{ active: currentStatus === s }"
					v-for="s in statusList"
					:key="s"
					@tap="switchStatus(s)"
				>{{ s }}</view>
			</view>

			<!-- 订单列表：仿参考图卡片式布局 -->
			<view class="card order-item" v-for="o in filteredOrders" :key="o.id" @tap="goDetail(o)">
				<!-- 头部：服务图标+名称 | 订单编号 -->
				<view class="order-head">
					<view class="svc">
						<view class="svc-icon" :style="{ background: iconMeta(o).color }">{{ iconMeta(o).icon }}</view>
						<text class="svc-name">{{ o.title }}</text>
					</view>
					<text class="order-no">订单编号：{{ o.id }}</text>
				</view>

				<!-- 主体：左侧信息列 | 右侧状态/价格列 -->
				<view class="order-main">
					<view class="info-col">
						<view class="info-row">
							<text class="label">就诊人：</text>
							<text class="val">{{ o.patient }}</text>
						</view>
						<view class="info-row">
							<text class="label">医　院：</text>
							<text class="val">{{ o.hospital }}</text>
						</view>
						<view class="info-row">
							<text class="label">科　室：</text>
							<text class="val">{{ o.department }}</text>
						</view>
						<view class="info-row">
							<text class="label">类　别：</text>
							<text class="val">{{ o.title }}（{{ o.date }}）</text>
						</view>
						<view class="info-row">
							<text class="label">下单时间：</text>
							<text class="val">{{ o.createTime }}</text>
						</view>
					</view>
					<view class="side-col">
						<text class="side-status" :class="statusClass(o.status)">{{ o.status }}</text>
						<text class="side-price">¥{{ o.price }}</text>
						<text class="side-pay">在线支付</text>
					</view>
				</view>

				<!-- 底部操作按钮 -->
				<view class="btn-row">
					<button class="mini-btn" @tap.stop="contact">联系客服</button>
					<button v-if="o.status === '待服务'" class="mini-btn danger" @tap.stop="cancelOrder(o)">取消预约</button>
					<button v-else-if="o.status === '已完成'" class="mini-btn" @tap.stop="reOrder(o)">再约一单</button>
				</view>
			</view>

			<!-- 已登录但暂无订单 -->
			<view v-if="filteredOrders.length === 0" class="empty">
				<text class="empty-icon">📭</text>
				<text class="empty-text">暂无相关订单</text>
				<button class="tip-btn outline" @tap="goHome">去预约服务</button>
			</view>
		</template>
	</view>
</template>

<script>
import { services, categories } from '@/common/data.js'

export default {
	data() {
		return {
			isLogin: false,
			phone: '',
			statusList: ['待服务', '服务中', '已完成'],
			currentStatus: '全部',
			orders: []
		}
	},
	computed: {
		filteredOrders() {
			if (this.currentStatus === '全部') return this.orders
			return this.orders.filter(o => o.status === this.currentStatus)
		}
	},
	onShow() {
		// 每次进入页面都重新读取登录态，退出登录/切换账号后即时变化
		const raw = uni.getStorageSync('userInfo')
		const user = raw ? JSON.parse(raw) : null
		if (!user) {
			this.isLogin = false
			this.orders = []
			return
		}
		this.isLogin = true
		this.phone = user.phone
		this.loadOrders(user.phone)
	},
	methods: {
		// 订单按账号手机号隔离存储
		orderKey(phone) {
			return 'orders_' + phone
		},
		loadOrders(phone) {
			const key = this.orderKey(phone)
			let list = uni.getStorageSync(key)
			// 兼容旧版本：把全局 orders 迁移到当前登录账号下（仅一次）
			if (!list) {
				const legacy = uni.getStorageSync('orders')
				if (legacy) {
					uni.setStorageSync(key, legacy)
					uni.removeStorageSync('orders')
					list = legacy
				}
			}
			this.orders = list ? JSON.parse(list) : []
		},
		// 根据订单 serviceId 找到所属分类的图标与底色
		iconMeta(o) {
			const svc = services.find(s => String(s.id) === String(o.serviceId))
			const cate = categories.find(c => svc && c.id === svc.cateId)
			return cate || { icon: '🏥', color: '#e8f7f2' }
		},
		statusClass(status) {
			return status === '已完成' ? 'done' : (status === '服务中' ? 'doing' : 'wait')
		},
		switchStatus(s) {
			this.currentStatus = s
		},
		goDetail(o) {
			uni.navigateTo({ url: `/pages/order-detail/order-detail?no=${o.id}` })
		},
		// 再约一单：带原服务信息回到下单页
		reOrder(o) {
			uni.navigateTo({ url: `/pages/order-confirm/order-confirm?id=${o.serviceId}&title=${o.title}&price=${o.price}` })
		},
		// 取消预约：确认后从本地订单中移除
		cancelOrder(o) {
			uni.showModal({
				title: '提示',
				content: '确定取消该预约订单吗？',
				success: (res) => {
					if (!res.confirm) return
					const key = this.orderKey(this.phone)
					const list = this.orders.filter(item => item.id !== o.id)
					uni.setStorageSync(key, JSON.stringify(list))
					this.orders = list
					uni.showToast({ title: '订单已取消', icon: 'none' })
				}
			})
		},
		contact() {
			uni.makePhoneCall({ phoneNumber: '4000000000' })
		},
		goLogin() {
			uni.navigateTo({ url: '/pages/login/login' })
		},
		goHome() {
			uni.switchTab({ url: '/pages/index/index' })
		}
	}
}
</script>

<style scoped>
.page {
	padding: 24rpx;
}
.login-tip {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 160rpx 0 80rpx;
}
.tip-icon {
	font-size: 100rpx;
}
.tip-text {
	font-size: 28rpx;
	color: #999999;
	margin-top: 24rpx;
}
.tip-btn {
	margin-top: 40rpx;
	background: #2e9e83;
	color: #ffffff;
	font-size: 28rpx;
	border-radius: 44rpx;
	padding: 0 80rpx;
	line-height: 80rpx;
}
.tip-btn.outline {
	background: #ffffff;
	color: #2e9e83;
	border: 1rpx solid #2e9e83;
}
.status-bar {
	display: flex;
}
.status-tab {
	font-size: 28rpx;
	color: #666666;
	padding: 12rpx 28rpx;
	background: #ffffff;
	border-radius: 32rpx;
	margin-right: 16rpx;
}
.status-tab.active {
	color: #ffffff;
	background: #2e9e83;
}
.card {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 28rpx;
	margin-top: 24rpx;
}
/* 头部：图标 + 服务名 | 订单编号 */
.order-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}
.svc {
	display: flex;
	align-items: center;
	overflow: hidden;
}
.svc-icon {
	width: 52rpx;
	height: 52rpx;
	border-radius: 50%;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}
.svc-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
	margin-left: 14rpx;
}
.order-no {
	font-size: 22rpx;
	color: #999999;
	flex-shrink: 0;
	margin-left: 16rpx;
}
/* 主体：左信息列 + 右状态列 */
.order-main {
	display: flex;
	margin-top: 22rpx;
}
.info-col {
	flex: 1;
	overflow: hidden;
}
.info-row {
	display: flex;
	font-size: 26rpx;
	line-height: 1.75;
}
.label {
	color: #999999;
	flex-shrink: 0;
}
.val {
	color: #333333;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.side-col {
	width: 170rpx;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	justify-content: space-between;
	margin-left: 16rpx;
}
.side-status {
	font-size: 26rpx;
}
.side-status.done {
	color: #52c41a;
}
.side-status.doing {
	color: #5b8ff9;
}
.side-status.wait {
	color: #ff9500;
}
.side-price {
	font-size: 34rpx;
	color: #ff5b3b;
	font-weight: bold;
	margin-top: 14rpx;
}
.side-pay {
	font-size: 22rpx;
	color: #999999;
	margin-top: 4rpx;
}
/* 底部按钮 */
.btn-row {
	display: flex;
	justify-content: flex-end;
	margin-top: 24rpx;
}
.mini-btn {
	font-size: 24rpx;
	color: #666666;
	background: #ffffff;
	border: 1rpx solid #dddddd;
	border-radius: 12rpx;
	line-height: 56rpx;
	padding: 0 28rpx;
	margin: 0 0 0 16rpx;
}
.mini-btn.danger {
	color: #ff5b3b;
	border-color: #ffbebd;
}
.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 100rpx 0;
}
.empty-icon {
	font-size: 90rpx;
}
.empty-text {
	font-size: 26rpx;
	color: #999999;
	margin-top: 20rpx;
}
</style>
