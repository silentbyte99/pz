// 登录态工具：统一处理未登录拦截

// 判断当前是否已登录
export function isLogin() {
	const raw = uni.getStorageSync('userInfo')
	return !!raw
}

// 获取当前登录用户信息，未登录返回 null
export function getUser() {
	const raw = uni.getStorageSync('userInfo')
	return raw ? JSON.parse(raw) : null
}

/**
 * 登录拦截：已登录直接执行回调，未登录弹窗提示并跳登录页
 * @param {Function} onLogin 已登录时执行的操作
 */
export function requireLogin(onLogin) {
	if (isLogin()) {
		onLogin && onLogin()
		return
	}
	uni.showModal({
		title: '提示',
		content: '请先登录后再预约服务',
		confirmText: '去登录',
		cancelText: '再逛逛',
		success: (res) => {
			if (res.confirm) {
				uni.navigateTo({ url: '/pages/login/login' })
			}
		}
	})
}
