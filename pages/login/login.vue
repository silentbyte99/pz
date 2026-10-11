<template>
	<view class="page">
		<!-- Logo 区 -->
		<view class="logo-area">
			<image class="logo" src="/static/logo.png" mode="aspectFit" />
			<text class="app-name">安心陪诊</text>
			<text class="app-slogan">让每一次就医都有温度</text>
		</view>

		<!-- 登录表单 -->
		<view class="form-card">
			<view class="form-item">
				<input class="form-input" v-model="phone" type="number" maxlength="11" placeholder="请输入手机号" />
			</view>
			<view class="form-item">
				<input class="form-input" v-model="code" type="number" maxlength="4" placeholder="请输入验证码" />
				<text class="code-btn" :class="{ disabled: countdown > 0 }" @tap="getCode">
					{{ countdown > 0 ? countdown + 's后重发' : '获取验证码' }}
				</text>
			</view>
			<button class="login-btn" @tap="doLogin">登录</button>

			<view class="agree-row" @tap="agree = !agree">
				<view class="checkbox" :class="{ checked: agree }">✓</view>
				<text class="agree-text">已阅读并同意《用户协议》和《隐私政策》</text>
			</view>
		</view>

		<!-- 游客模式 -->
		<text class="skip" @tap="skip">先逛逛 ›</text>

		<!-- 其他登录方式 -->
		<view class="divider">
			<view class="divider-line"></view>
			<text class="divider-text">其他登录方式</text>
			<view class="divider-line"></view>
		</view>

		<view class="other-login">
			<!-- 微信登录 -->
			<view class="wx-btn" @tap="wxLogin">
				<image class="login-icon" src="/static/icons/微信.png" mode="aspectFit" />
				<text class="wx-label">微信登录</text>
			</view>

			<!-- 账号密码登录 -->
			<view class="other-btn" @tap="goAccountLogin">
				<image class="login-icon" src="/static/icons/-手机.png" mode="aspectFit" />
				<text class="other-label">账号登录</text>
			</view>
		</view>

		<!-- 账号密码登录弹层 -->
		<view class="account-mask" v-if="showAccount" @tap="showAccount = false">
			<view class="account-card" @tap.stop>
				<text class="account-title">账号密码登录</text>
				<view class="form-item">
					<input class="form-input" v-model="accountForm.phone" type="number" maxlength="11" placeholder="请输入手机号" />
				</view>
				<view class="form-item">
					<input class="form-input" v-model="accountForm.password" type="password" placeholder="请输入密码" />
				</view>
				<button class="login-btn" @tap="doAccountLogin">登录</button>
				<text class="account-tip">初始密码为手机号后6位</text>
				<text class="account-close" @tap="showAccount = false">取消</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			phone: '',
			code: '',
			agree: false,
			countdown: 0,
			timer: null,
			showAccount: false,
			accountForm: {
				phone: '',
				password: ''
			}
		}
	},
	onUnload() {
		if (this.timer) clearInterval(this.timer)
	},
	methods: {
		// 模拟发送验证码，启动倒计时
		getCode() {
			if (this.countdown > 0) return
			if (!/^1\d{10}$/.test(this.phone)) {
				return uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
			}
			// TODO: 调用后端发送验证码接口
			uni.showToast({ title: '验证码已发送（模拟：任意4位）', icon: 'none' })
			this.countdown = 60
			this.timer = setInterval(() => {
				this.countdown--
				if (this.countdown <= 0) clearInterval(this.timer)
			}, 1000)
		},
		doLogin() {
			if (!this.agree) return uni.showToast({ title: '请先勾选用户协议', icon: 'none' })
			if (!/^1\d{10}$/.test(this.phone)) return uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
			if (!/^\d{4}$/.test(this.code)) return uni.showToast({ title: '请输入4位验证码', icon: 'none' })

			// TODO: 调用后端登录接口，用返回的 token 替换本地模拟
			const userInfo = { name: `用户${this.phone.slice(-4)}`, phone: this.phone }
			uni.setStorageSync('userInfo', JSON.stringify(userInfo))
			uni.showToast({ title: '登录成功', icon: 'success' })
			setTimeout(() => this.backOrMine(), 800)
		},
		skip() {
			this.backOrMine()
		},
		// 微信一键登录
		wxLogin() {
			if (!this.agree) return uni.showToast({ title: '请先勾选用户协议', icon: 'none' })
			// #ifdef MP-WEIXIN
			uni.login({
				provider: 'weixin',
				success: (loginRes) => {
					// loginRes.code 传给后端换取 openid 和手机号
					uni.showLoading({ title: '登录中...' })
					// TODO: 调用后端接口 code2Session，用 code 换取用户信息
					setTimeout(() => {
						uni.hideLoading()
						const userInfo = { name: '微信用户', phone: '13800000000', avatar: '', wxLogin: true }
						uni.setStorageSync('userInfo', JSON.stringify(userInfo))
						uni.showToast({ title: '登录成功', icon: 'success' })
						setTimeout(() => this.backOrMine(), 800)
					}, 1000)
				},
				fail: () => {
					uni.showToast({ title: '微信登录失败', icon: 'none' })
				}
			})
			// #endif
			// #ifndef MP-WEIXIN
			// 非微信小程序环境，模拟微信登录
			uni.showLoading({ title: '登录中...' })
			setTimeout(() => {
				uni.hideLoading()
				const userInfo = { name: '微信用户', phone: '13800000000', avatar: '', wxLogin: true }
				uni.setStorageSync('userInfo', JSON.stringify(userInfo))
				uni.showToast({ title: '登录成功', icon: 'success' })
				setTimeout(() => this.backOrMine(), 800)
			}, 1000)
			// #endif
		},
		// 打开账号密码登录弹层
		goAccountLogin() {
			if (!this.agree) return uni.showToast({ title: '请先勾选用户协议', icon: 'none' })
			this.showAccount = true
		},
		// 账号密码登录
		doAccountLogin() {
			const f = this.accountForm
			if (!/^1\d{10}$/.test(f.phone)) return uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
			if (!f.password || f.password.length < 6) return uni.showToast({ title: '请输入6位以上密码', icon: 'none' })
			// TODO: 调用后端账号密码登录接口
			// 模拟：密码为手机号后6位则通过
			if (f.password !== f.phone.slice(-6)) {
				return uni.showToast({ title: '手机号或密码错误', icon: 'none' })
			}
			const userInfo = { name: `用户${f.phone.slice(-4)}`, phone: f.phone }
			uni.setStorageSync('userInfo', JSON.stringify(userInfo))
			this.showAccount = false
			uni.showToast({ title: '登录成功', icon: 'success' })
			setTimeout(() => this.backOrMine(), 800)
		},
		// 有上一页则返回，否则去"我的"页
		backOrMine() {
			const pages = getCurrentPages()
			if (pages.length > 1) {
				uni.navigateBack()
			} else {
				uni.switchTab({ url: '/pages/mine/mine' })
			}
		}
	}
}
</script>

<style scoped>
.page {
	padding: 0 48rpx;
}
.logo-area {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 100rpx 0 60rpx;
}
.logo {
	width: 140rpx;
	height: 140rpx;
	border-radius: 32rpx;
}
.app-name {
	font-size: 44rpx;
	font-weight: bold;
	color: #333333;
	margin-top: 24rpx;
}
.app-slogan {
	font-size: 26rpx;
	color: #999999;
	margin-top: 12rpx;
}
.form-card {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 40rpx 32rpx;
}
.form-item {
	display: flex;
	align-items: center;
	border-bottom: 1rpx solid #f0f0f0;
	padding: 28rpx 0;
}
.form-item:last-of-type {
	border-bottom: none;
}
.form-input {
	flex: 1;
	font-size: 28rpx;
	color: #333333;
}
.code-btn {
	font-size: 26rpx;
	color: #2e9e83;
	padding-left: 20rpx;
}
.code-btn.disabled {
	color: #999999;
}
.login-btn {
	margin-top: 40rpx;
	background: #2e9e83;
	color: #ffffff;
	font-size: 30rpx;
	border-radius: 44rpx;
}
.agree-row {
	display: flex;
	align-items: center;
	margin-top: 28rpx;
}
.checkbox {
	width: 32rpx;
	height: 32rpx;
	border: 2rpx solid #cccccc;
	border-radius: 50%;
	font-size: 20rpx;
	color: #ffffff;
	text-align: center;
	line-height: 32rpx;
}
.checkbox.checked {
	background: #2e9e83;
	border-color: #2e9e83;
}
.agree-text {
	font-size: 22rpx;
	color: #999999;
	margin-left: 12rpx;
}
.skip {
	display: block;
	text-align: center;
	font-size: 26rpx;
	color: #999999;
	margin-top: 48rpx;
}
/* 分割线 */
.divider {
	display: flex;
	align-items: center;
	margin: 56rpx 0 40rpx;
}
.divider-line {
	flex: 1;
	height: 1rpx;
	background: #e0e0e0;
}
.divider-text {
	font-size: 24rpx;
	color: #999999;
	padding: 0 24rpx;
}
/* 其他登录方式 */
.other-login {
	display: flex;
	justify-content: center;
	gap: 80rpx;
}
.wx-btn,
.other-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.login-icon {
	width: 96rpx;
	height: 96rpx;
	border-radius: 50%;
}
.wx-label,
.other-label {
	font-size: 24rpx;
	color: #666666;
	margin-top: 12rpx;
}
/* 账号密码登录弹层 */
.account-mask {
	position: fixed;
	top: 0;
	left: var(--window-left, 0);
	right: var(--window-right, 0);
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: flex-end;
	z-index: 999;
}
.account-card {
	width: 100%;
	background: #ffffff;
	border-radius: 32rpx 32rpx 0 0;
	padding: 40rpx 48rpx calc(40rpx + env(safe-area-inset-bottom));
}
.account-title {
	display: block;
	font-size: 34rpx;
	font-weight: bold;
	color: #333333;
	text-align: center;
	margin-bottom: 32rpx;
}
.account-tip {
	display: block;
	text-align: center;
	font-size: 22rpx;
	color: #cccccc;
	margin-top: 20rpx;
}
.account-close {
	display: block;
	text-align: center;
	font-size: 28rpx;
	color: #999999;
	margin-top: 32rpx;
}
</style>
