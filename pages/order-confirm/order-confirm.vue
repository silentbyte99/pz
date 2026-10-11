<template>
	<view class="page">
		<!-- 已选服务 -->
		<view class="card" v-if="serviceTitle">
			<text class="label">已选服务</text>
			<view class="picked-row">
				<text class="picked-title">{{ serviceTitle }}</text>
				<text class="picked-price">¥{{ price }}</text>
			</view>
		</view>

		<!-- 就诊信息表单 -->
		<view class="card">
			<text class="label">就诊信息</text>

			<!-- 常用就诊人一键填充 -->
			<view class="quick-row" v-if="defaultPatient.name" @tap="useDefault">
				<view class="quick-chip">
					<text class="quick-icon">👤</text>
					<view class="quick-text">
						<text class="quick-name">常用：{{ defaultPatient.name }}</text>
						<text class="quick-phone">{{ defaultPatient.phone }}</text>
					</view>
					<text class="quick-use">一键填充</text>
				</view>
			</view>

			<view class="form-item">
				<text class="form-label">就诊人</text>
				<input class="form-input" v-model="form.name" placeholder="请输入就诊人姓名" />
			</view>
			<view class="form-item">
				<text class="form-label">手机号</text>
				<input class="form-input" v-model="form.phone" type="number" maxlength="11" placeholder="请输入联系电话" />
			</view>
			<view class="form-item">
			<text class="form-label">医院</text>
			<picker v-if="!lockedHospital" :range="hospitalList" :value="hospitalIndex" @change="onHospitalChange">
				<view class="form-input picker">{{ form.hospital || '请选择就诊医院' }}</view>
			</picker>
			<view v-else class="form-input locked-hospital">{{ form.hospital }}</view>
		</view>
		<view class="form-item">
			<text class="form-label">科室</text>
			<picker :range="departmentList" :value="departmentIndex" @change="onDeptChange">
				<view class="form-input picker">{{ form.department || '请选择科室' }}</view>
			</picker>
		</view>
			<view class="form-item">
				<text class="form-label">就诊日期</text>
				<picker mode="date" :value="form.date" @change="onDateChange">
					<view class="form-input picker">{{ form.date || '请选择就诊日期' }}</view>
				</picker>
			</view>

			<!-- 设为常用就诊人 -->
			<view class="save-default" @tap="saveDefault = !saveDefault">
				<view class="checkbox" :class="{ checked: saveDefault }">{{ saveDefault ? '✓' : '' }}</view>
				<text class="save-default-text">设为常用就诊人，下次免填</text>
			</view>
		</view>

		<!-- 提交：跳转订单页 -->
		<button class="submit-btn" @tap="submit">提交订单</button>
	</view>
</template>

<script>
import { hospitals } from '@/common/data.js'

export default {
	data() {
		return {
			serviceId: '',
			serviceTitle: '',
			price: 0,
			loginPhone: '',
			// 医院下拉：取数据源中的医院名称
			hospitalList: hospitals.map(h => h.name),
			hospitalIndex: -1,
			// 科室下拉：常用科室列表
			departmentList: ['心内科', '神经内科', '呼吸内科', '消化内科', '内分泌科', '骨科', '普外科', '儿科', '妇产科', '眼科', '耳鼻喉科', '皮肤科', '肿瘤科', '康复科', '中医科'],
			departmentIndex: -1,
			form: {
				name: '',
				phone: '',
				hospital: '',
				department: '',
				date: ''
			},
			defaultPatient: {
				name: '',
				phone: ''
			},
			saveDefault: false,
			lockedHospital: false
		}
	},
	onLoad(options) {
		this.serviceId = options.id || ''
		this.serviceTitle = options.title || ''
		this.price = options.price || 0
		// 从医院详情页进来时，自动锁定医院
		if (options.hospital) {
			const hName = decodeURIComponent(options.hospital)
			this.form.hospital = hName
			this.hospitalIndex = this.hospitalList.indexOf(hName)
			this.lockedHospital = true
		}
	},
	onShow() {
		// 每次进入都校验登录态：未登录跳登录页，登录/换账号后刷新常用就诊人
		const raw = uni.getStorageSync('userInfo')
		const user = raw ? JSON.parse(raw) : null
		if (!user) {
			uni.showModal({
				title: '提示',
				content: '请先登录后再预约服务',
				showCancel: false,
				success: () => uni.redirectTo({ url: '/pages/login/login' })
			})
			return
		}
		this.loginPhone = user.phone
		this.loadDefaultPatient()
	},
	methods: {
		// 读取当前账号的常用就诊人（仅展示在顶部，点击"一键填充"后才填入）
		loadDefaultPatient() {
			// 切换账号后重置表单和常用信息
			this.form.name = ''
			this.form.phone = ''
			this.defaultPatient = { name: '', phone: '' }
			this.saveDefault = false

			let raw = uni.getStorageSync('defaultPatient_' + this.loginPhone)
			// 兼容旧版全局 key
			if (!raw) raw = uni.getStorageSync('defaultPatient')
			if (raw) {
				this.defaultPatient = JSON.parse(raw)
				this.saveDefault = true // 已有常用信息，默认保持勾选
			}
		},
		// 一键填充常用就诊人
		useDefault() {
			this.form.name = this.defaultPatient.name
			this.form.phone = this.defaultPatient.phone
		},
		onDateChange(e) {
			this.form.date = e.detail.value
		},
		// 医院下拉选中
		onHospitalChange(e) {
			this.hospitalIndex = Number(e.detail.value)
			this.form.hospital = this.hospitalList[this.hospitalIndex]
		},
		// 科室下拉选中
		onDeptChange(e) {
			this.departmentIndex = Number(e.detail.value)
			this.form.department = this.departmentList[this.departmentIndex]
		},
		submit() {
			if (!this.form.name) return uni.showToast({ title: '请填写就诊人', icon: 'none' })
			if (!this.form.phone || this.form.phone.length !== 11) return uni.showToast({ title: '请填写11位手机号', icon: 'none' })
			if (!this.form.hospital) return uni.showToast({ title: '请选择医院', icon: 'none' })
			if (!this.form.department) return uni.showToast({ title: '请选择科室', icon: 'none' })
			if (!this.form.date) return uni.showToast({ title: '请选择就诊日期', icon: 'none' })

			// 生成订单，按账号手机号隔离保存
			const order = {
				id: 'DD' + Date.now(),
				serviceId: this.serviceId,
				title: this.serviceTitle,
				hospital: this.form.hospital,
				department: this.form.department,
				patient: this.form.name,
				phone: this.form.phone,
				date: this.form.date,
				status: '待服务',
				price: this.price,
				createTime: new Date().toLocaleString()
			}
			const orderKey = 'orders_' + this.loginPhone
			const list = uni.getStorageSync(orderKey)
			const all = list ? JSON.parse(list) : []
			all.unshift(order)
			uni.setStorageSync(orderKey, JSON.stringify(all))

			// 勾选了"设为常用"则保存到当前账号，取消勾选则清除
			const patientKey = 'defaultPatient_' + this.loginPhone
			if (this.saveDefault) {
				uni.setStorageSync(patientKey, JSON.stringify({
					name: this.form.name,
					phone: this.form.phone
				}))
			} else {
				uni.removeStorageSync(patientKey)
			}
			// 清理旧版全局 key
			uni.removeStorageSync('defaultPatient')

			uni.showToast({ title: '下单成功', icon: 'success' })
			setTimeout(() => {
				uni.switchTab({ url: '/pages/order/order' })
			}, 800)
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
	padding: 28rpx;
	margin-top: 24rpx;
}
.label {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
}
.picked-row {
	display: flex;
	justify-content: space-between;
	margin-top: 16rpx;
}
.picked-title {
	font-size: 28rpx;
	color: #333333;
}
.picked-price {
	font-size: 30rpx;
	color: #ff5b3b;
	font-weight: bold;
}
.form-item {
	display: flex;
	align-items: center;
	border-bottom: 1rpx solid #f0f0f0;
	padding: 24rpx 0;
}
.form-item:last-child {
	border-bottom: none;
}
.form-label {
	width: 160rpx;
	font-size: 28rpx;
	color: #333333;
}
.form-input {
	flex: 1;
	font-size: 28rpx;
	color: #333333;
}
.picker {
	color: #333333;
}
.locked-hospital {
	color: #2e9e83;
	font-weight: 500;
}
.quick-row {
	margin: 20rpx 0 8rpx;
}
.quick-chip {
	display: flex;
	align-items: center;
	background: #f0faf7;
	border: 1rpx solid #bfe5da;
	border-radius: 16rpx;
	padding: 20rpx 24rpx;
}
.quick-icon {
	font-size: 36rpx;
	margin-right: 16rpx;
}
.quick-text {
	flex: 1;
	display: flex;
	flex-direction: column;
}
.quick-name {
	font-size: 28rpx;
	color: #333333;
	font-weight: bold;
}
.quick-phone {
	font-size: 24rpx;
	color: #2e9e83;
	margin-top: 6rpx;
}
.quick-use {
	font-size: 26rpx;
	color: #2e9e83;
	border: 1rpx solid #2e9e83;
	border-radius: 28rpx;
	padding: 8rpx 24rpx;
}
.save-default {
	display: flex;
	align-items: center;
	margin-top: 28rpx;
	padding-top: 24rpx;
	border-top: 1rpx solid #f0f0f0;
}
.checkbox {
	width: 36rpx;
	height: 36rpx;
	border-radius: 50%;
	border: 2rpx solid #cccccc;
	font-size: 24rpx;
	color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: center;
}
.checkbox.checked {
	background: #2e9e83;
	border-color: #2e9e83;
}
.save-default-text {
	font-size: 26rpx;
	color: #666666;
	margin-left: 16rpx;
}
.submit-btn {
	margin-top: 48rpx;
	background: #2e9e83;
	color: #ffffff;
	font-size: 30rpx;
	border-radius: 44rpx;
}
</style>
