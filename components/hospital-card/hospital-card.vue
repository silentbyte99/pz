<template>
	<view class="card hospital" @tap="onTap">
		<view class="h-img"><image class="img-fit" :src="hospital.img" mode="aspectFill"></image></view>
		<view class="h-info">
			<text class="h-name">{{ hospital.name }}</text>
			<view class="h-tags">
				<text class="h-tag">{{ hospital.level }}</text>
				<text class="h-type">{{ hospital.type }}</text>
			</view>
			<text class="h-desc">{{ hospital.desc }}</text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'hospital-card',
	props: {
		hospital: {
			type: Object,
			required: true
		}
	},
	methods: {
		onTap() {
			this.$emit('tap', this.hospital)
		}
	}
}
</script>

<style scoped>
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
.img-fit {
	width: 100%;
	height: 100%;
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
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	font-size: 24rpx;
	color: #999999;
	line-height: 1.6;
	margin-top: 12rpx;
}
</style>
