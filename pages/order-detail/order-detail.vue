<template>
	<view class="page" v-if="order">
		<!-- 状态卡片 -->
		<view class="status-card">
			<text class="status-text">{{ order.status }}</text>
			<text class="status-desc">{{ statusDesc }}</text>
			<!-- 倒计时 -->
			<text class="countdown" v-if="order.status === '待服务' && countdownText">{{ countdownText }}</text>
		</view>

		<!-- 订单进度时间轴 -->
		<view class="card timeline-card">
			<text class="label">订单进度</text>
			<view class="timeline">
				<view class="t-item" v-for="(step, idx) in steps" :key="idx">
					<view class="t-dot" :class="{ active: idx <= currentStep, done: idx < currentStep }">
						<text class="t-dot-text" v-if="idx < currentStep">✓</text>
						<text class="t-dot-text" v-else>{{ idx + 1 }}</text>
					</view>
					<view class="t-line" v-if="idx < steps.length - 1" :class="{ active: idx < currentStep }"></view>
					<view class="t-content">
						<text class="t-title" :class="{ active: idx <= currentStep }">{{ step.title }}</text>
						<text class="t-desc">{{ step.desc }}</text>
						<text class="t-time" v-if="step.time">{{ step.time }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 服务信息：点击跳转服务详情 -->
		<view class="card" @tap="goService">
			<view class="card-head">
				<text class="label">服务信息</text>
				<text class="link">查看服务 ›</text>
			</view>
			<text class="service-title">{{ order.title }}</text>
			<view class="info-row">
				<text class="info-label">医院</text>
				<text class="info-value">{{ order.hospital }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">就诊日期</text>
				<text class="info-value">{{ order.date }}</text>
			</view>
		</view>

		<!-- 就诊人信息 -->
		<view class="card">
			<text class="label">就诊人信息</text>
			<view class="info-row">
				<text class="info-label">就诊人</text>
				<text class="info-value">{{ order.patient }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">联系电话</text>
				<text class="info-value">{{ order.phone }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">科室</text>
				<text class="info-value">{{ order.department }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">订单编号</text>
				<text class="info-value">{{ order.id }}</text>
			</view>
		</view>

		<!-- 费用明细 -->
		<view class="card">
			<text class="label">费用明细</text>
			<view class="info-row">
				<text class="info-label">服务费</text>
				<text class="info-value">¥{{ order.price }}</text>
			</view>
			<view class="info-row total">
				<text class="info-label">实付款</text>
				<text class="total-price">¥{{ order.price }}</text>
			</view>
		</view>

		<!-- 评价区（已完成订单显示） -->
		<view class="card" v-if="order.status === '已完成'">
			<text class="label">服务评价</text>
			<view class="review-area" v-if="order.review">
				<view class="stars">
					<text class="star" v-for="n in 5" :key="n" :class="{ filled: n <= order.review.stars }">★</text>
				</view>
				<text class="review-text">{{ order.review.text }}</text>
			</view>
			<view class="review-area" v-else>
				<view class="stars">
					<text class="star" v-for="n in 5" :key="n" :class="{ filled: n <= reviewStars }" @tap="reviewStars = n">★</text>
				</view>
				<textarea class="review-input" v-model="reviewText" placeholder="说说您的服务体验..." maxlength="200" />
				<button class="review-btn" @tap="submitReview">提交评价</button>
			</view>
		</view>

		<!-- 底部操作 -->
		<view class="footer">
			<button class="footer-btn ghost" @tap="contact">联系客服</button>
			<button class="footer-btn" v-if="order.status === '待服务'" @tap="completeOrder">确认完成</button>
			<button class="footer-btn" v-else @tap="bookAgain">再约一单</button>
		</view>
	</view>

	<!-- 订单不存在（退出登录/换账号后旧链接） -->
	<view class="not-found" v-else>
		<text class="nf-icon">🔍</text>
		<text class="nf-text">{{ notFoundText }}</text>
		<button class="nf-btn" @tap="goBack">{{ notFoundBtn }}</button>
	</view>
</template>

<script>
import { requireLogin } from '@/common/auth.js'

export default {
	data() {
		return {
			order: null,
			notFoundText: '订单不存在',
			notFoundBtn: '返回订单列表',
			reviewStars: 5,
			reviewText: '',
			countdownText: '',
			countdownTimer: null
		}
	},
	computed: {
		statusDesc() {
			if (this.order.status === '待服务') return '陪诊师确认中，请保持电话畅通'
			if (this.order.status === '服务中') return '陪诊师已到达，正在为您服务'
			return '服务已完成，感谢您的信任'
		},
		// 进度步骤定义
		steps() {
			if (!this.order) return []
			const steps = [
				{ title: '提交订单', desc: '订单已提交', time: this.order.createTime || '' },
				{ title: '陪诊师接单', desc: '专员确认中', time: this.order.acceptTime || '等待接单' },
				{ title: '服务中', desc: '陪诊服务进行中', time: this.order.serviceTime || '待开始' },
				{ title: '服务完成', desc: '服务已结束', time: this.order.finishTime || '待完成' }
			]
			return steps
		},
		// 当前步骤索引（0~3）
		currentStep() {
			if (!this.order) return 0
			if (this.order.status === '待服务') return 1
			if (this.order.status === '服务中') return 2
			if (this.order.status === '已完成') return 3
			return 0
		}
	},
	onLoad(options) {
		const userRaw = uni.getStorageSync('userInfo')
		const user = userRaw ? JSON.parse(userRaw) : null
		if (!user) {
			this.notFoundText = '登录后可查看订单详情'
			this.notFoundBtn = '去登录'
			return
		}
		const key = 'orders_' + user.phone
		const raw = uni.getStorageSync(key)
		const list = raw ? JSON.parse(raw) : []
		this.order = list.find(o => o.id === options.no) || null
		if (this.order && this.order.status === '待服务') {
			this.startCountdown()
		}
	},
	onUnload() {
		if (this.countdownTimer) clearInterval(this.countdownTimer)
	},
	onHide() {
		if (this.countdownTimer) clearInterval(this.countdownTimer)
	},
	methods: {
		// 距就诊日期倒计时
		startCountdown() {
			this.updateCountdown()
			this.countdownTimer = setInterval(() => {
				this.updateCountdown()
			}, 1000)
		},
		updateCountdown() {
			if (!this.order || !this.order.date) return
			const target = new Date(this.order.date + ' 09:00:00').getTime()
			const now = Date.now()
			const diff = target - now
			if (diff <= 0) {
				this.countdownText = '已到就诊日期'
				if (this.countdownTimer) clearInterval(this.countdownTimer)
				return
			}
			const days = Math.floor(diff / 86400000)
			const hours = Math.floor((diff % 86400000) / 3600000)
			const mins = Math.floor((diff % 3600000) / 60000)
			const secs = Math.floor((diff % 60000) / 1000)
			if (days > 0) {
				this.countdownText = `距就诊还有 ${days}天 ${hours}小时 ${mins}分`
			} else if (hours > 0) {
				this.countdownText = `距就诊还有 ${hours}小时 ${mins}分 ${secs}秒`
			} else {
				this.countdownText = `距就诊还有 ${mins}分 ${secs}秒`
			}
		},
		// 确认完成订单
		completeOrder() {
			uni.showModal({
				title: '确认',
				content: '确认该陪诊服务已完成？',
				success: (res) => {
					if (!res.confirm) return
					this.order.status = '已完成'
					this.order.finishTime = new Date().toLocaleString()
					this.saveOrder()
					if (this.countdownTimer) clearInterval(this.countdownTimer)
					this.countdownText = ''
					uni.showToast({ title: '已完成', icon: 'success' })
				}
			})
		},
		// 提交评价
		submitReview() {
			if (!this.reviewText.trim()) return uni.showToast({ title: '请填写评价内容', icon: 'none' })
			this.order.review = {
				stars: this.reviewStars,
				text: this.reviewText.trim()
			}
			this.saveOrder()
			uni.showToast({ title: '评价成功', icon: 'success' })
		},
		// 保存订单到本地
		saveOrder() {
			const userRaw = uni.getStorageSync('userInfo')
			const user = userRaw ? JSON.parse(userRaw) : null
			if (!user) return
			const key = 'orders_' + user.phone
			const raw = uni.getStorageSync(key)
			const list = raw ? JSON.parse(raw) : []
			const idx = list.findIndex(o => o.id === this.order.id)
			if (idx > -1) {
				list[idx] = this.order
				uni.setStorageSync(key, JSON.stringify(list))
			}
		},
		goService() {
			uni.navigateTo({ url: `/pages/service-detail/service-detail?id=${this.order.serviceId}` })
		},
		contact() {
			uni.makePhoneCall({ phoneNumber: '4000000000' })
		},
		bookAgain() {
			requireLogin(() => {
				uni.navigateTo({
					url: `/pages/order-confirm/order-confirm?id=${this.order.serviceId}&title=${this.order.title}&price=${this.order.price}`
				})
			})
		},
		goBack() {
			if (this.notFoundBtn === '去登录') {
				uni.redirectTo({ url: '/pages/login/login' })
			} else {
				uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/order/order' }) })
			}
		}
	}
}
</script>

<style scoped>
.page {
	padding: 24rpx 24rpx 140rpx;
}
.status-card {
	background: linear-gradient(135deg, #2e9e83, #56c2a4);
	border-radius: 20rpx;
	padding: 40rpx 32rpx;
	color: #ffffff;
	display: flex;
	flex-direction: column;
}
.status-text {
	font-size: 40rpx;
	font-weight: bold;
}
.status-desc {
	font-size: 26rpx;
	margin-top: 12rpx;
	opacity: 0.9;
}
.countdown {
	font-size: 24rpx;
	margin-top: 8rpx;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 8rpx;
	padding: 6rpx 16rpx;
	align-self: flex-start;
}
/* 时间轴 */
.timeline-card {
	padding-bottom: 12rpx;
}
.timeline {
	margin-top: 24rpx;
}
.t-item {
	display: flex;
	position: relative;
	min-height: 100rpx;
}
.t-dot {
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	background: #e0e0e0;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	z-index: 1;
}
.t-dot.active {
	background: #2e9e83;
}
.t-dot.done {
	background: #2e9e83;
}
.t-dot-text {
	font-size: 24rpx;
	color: #ffffff;
	font-weight: bold;
}
.t-line {
	position: absolute;
	left: 23rpx;
	top: 48rpx;
	width: 2rpx;
	height: 80rpx;
	background: #e0e0e0;
}
.t-line.active {
	background: #2e9e83;
}
.t-content {
	margin-left: 20rpx;
	display: flex;
	flex-direction: column;
	padding-bottom: 28rpx;
}
.t-title {
	font-size: 28rpx;
	color: #999999;
	font-weight: bold;
}
.t-title.active {
	color: #333333;
}
.t-desc {
	font-size: 24rpx;
	color: #bbbbbb;
	margin-top: 4rpx;
}
.t-time {
	font-size: 22rpx;
	color: #cccccc;
	margin-top: 4rpx;
}
/* 评价 */
.stars {
	display: flex;
	margin-top: 16rpx;
}
.star {
	font-size: 44rpx;
	color: #dddddd;
	margin-right: 8rpx;
}
.star.filled {
	color: #ffc107;
}
.review-input {
	width: 100%;
	min-height: 120rpx;
	background: #f9f9f9;
	border-radius: 12rpx;
	padding: 20rpx;
	font-size: 26rpx;
	margin-top: 20rpx;
	box-sizing: border-box;
}
.review-btn {
	background: #2e9e83;
	color: #ffffff;
	font-size: 28rpx;
	border-radius: 44rpx;
	margin-top: 20rpx;
}
.review-text {
	font-size: 26rpx;
	color: #666666;
	margin-top: 12rpx;
	line-height: 1.6;
}
.card {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 28rpx;
	margin-top: 24rpx;
}
.card-head {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.label {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
}
.link {
	font-size: 24rpx;
	color: #999999;
}
.service-title {
	display: block;
	font-size: 30rpx;
	color: #333333;
	font-weight: bold;
	margin-top: 16rpx;
}
.info-row {
	display: flex;
	justify-content: space-between;
	padding: 16rpx 0 0;
}
.info-label {
	font-size: 26rpx;
	color: #999999;
}
.info-value {
	font-size: 26rpx;
	color: #333333;
}
.info-row.total {
	border-top: 1rpx solid #f0f0f0;
	margin-top: 16rpx;
	padding-top: 20rpx;
}
.total-price {
	font-size: 32rpx;
	color: #ff5b3b;
	font-weight: bold;
}
.footer {
	position: fixed;
	left: var(--window-left, 0);
	right: var(--window-right, 0);
	bottom: 0;
	background: #ffffff;
	display: flex;
	padding: 16rpx 32rpx;
	padding-bottom: calc(16rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
}
.footer-btn {
	flex: 1;
	background: #2e9e83;
	color: #ffffff;
	font-size: 28rpx;
	border-radius: 44rpx;
	margin-left: 20rpx;
}
.footer-btn.ghost {
	background: #ffffff;
	color: #2e9e83;
	border: 1rpx solid #2e9e83;
	margin-left: 0;
}
.not-found {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 200rpx 0 80rpx;
}
.nf-icon {
	font-size: 100rpx;
}
.nf-text {
	font-size: 28rpx;
	color: #999999;
	margin-top: 24rpx;
}
.nf-btn {
	margin-top: 40rpx;
	background: #2e9e83;
	color: #ffffff;
	font-size: 28rpx;
	border-radius: 44rpx;
	padding: 0 80rpx;
	line-height: 80rpx;
}
</style>
