<template>
	<view class="card order-item" @tap="onTap">
		<view class="order-head">
			<text class="order-no">订单号 {{ order.id }}</text>
			<text class="order-status" :class="statusClass">{{ order.status }}</text>
		</view>
		<text class="order-title">{{ order.title }}</text>
		<view class="order-row">
			<text class="order-info">{{ order.hospital }} · {{ order.date }}</text>
			<text class="order-price">¥{{ order.price }}</text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'order-card',
	props: {
		order: {
			type: Object,
			required: true
		}
	},
	computed: {
		statusClass() {
			if (this.order.status === '已完成') return 'done'
			if (this.order.status === '服务中') return 'serving'
			return ''
		}
	},
	methods: {
		onTap() {
			this.$emit('tap', this.order)
		}
	}
}
</script>

<style scoped>
.card {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 28rpx;
	margin-top: 24rpx;
}
.order-head {
	display: flex;
	justify-content: space-between;
}
.order-no {
	font-size: 24rpx;
	color: #999999;
}
.order-status {
	font-size: 24rpx;
	color: #2e9e83;
}
.order-status.done {
	color: #52c41a;
}
.order-status.serving {
	color: #f39c12;
}
.order-title {
	display: block;
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
	margin-top: 16rpx;
}
.order-row {
	display: flex;
	justify-content: space-between;
	margin-top: 12rpx;
}
.order-info {
	font-size: 24rpx;
	color: #999999;
}
.order-price {
	font-size: 28rpx;
	color: #ff5b3b;
	font-weight: bold;
}
</style>
