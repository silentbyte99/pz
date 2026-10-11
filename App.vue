<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	page {
		background: #f2f7f5;
		font-size: 28rpx;
		color: #333333;
	}

	/* 全局柔和卡片：白卡片 + 浅绿底呈现层次 */
	.card {
		box-shadow: 0 4rpx 20rpx rgba(46, 158, 131, 0.06);
	}

	/* #ifdef H5 */
	/* 桌面浏览器中内容限宽居中，两侧留白呈现手机屏效果 */
	@media screen and (min-width: 481px) {
		body {
			background-color: #dfe9e5;
		}
	}
	/* 底部 tabBar 跟随限宽居中 */
	uni-tabbar {
		left: var(--window-left, 0) !important;
		right: var(--window-right, 0) !important;
		width: auto !important;
	}
	/* #endif */
</style>
