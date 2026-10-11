<template>
	<view class="page">
		<!-- 头像 -->
		<view class="card avatar-card" @tap="chooseAvatar">
			<text class="label">头像</text>
			<view class="avatar">
				<image v-if="form.avatar" class="avatar-img" :src="form.avatar" mode="aspectFill"></image>
				<text v-else class="avatar-text">{{ form.nickname ? form.nickname.slice(0, 1) : '用' }}</text>
			</view>
			<text class="arrow">›</text>
		</view>

		<!-- 基本信息 -->
		<view class="card">
			<text class="section-title">基本信息</text>
			<view class="form-item">
				<text class="form-label">昵称</text>
				<input class="form-input" v-model="form.nickname" placeholder="请输入昵称" maxlength="20" />
			</view>
			<view class="form-item">
				<text class="form-label">真实姓名</text>
				<input class="form-input" v-model="form.realName" placeholder="请输入真实姓名" />
			</view>
			<view class="form-item">
				<text class="form-label">手机号</text>
				<text class="form-input disabled">{{ maskedPhone }}</text>
			</view>
			<view class="form-item">
				<text class="form-label">性别</text>
				<picker :range="genderList" :value="genderIndex" @change="onGenderChange">
					<view class="form-input picker">{{ form.gender || '请选择' }}</view>
				</picker>
			</view>
			<view class="form-item">
				<text class="form-label">生日</text>
				<picker mode="date" :value="form.birthday" @change="onBirthdayChange">
					<view class="form-input picker">{{ form.birthday || '请选择生日' }}</view>
				</picker>
			</view>
			<view class="form-item">
				<text class="form-label">所在地区</text>
				<picker :range="regionList" :value="regionIndex" @change="onRegionChange">
					<view class="form-input picker">{{ form.region || '请选择地区' }}</view>
				</picker>
			</view>
		</view>

		<!-- 证件与紧急联系人 -->
		<view class="card">
			<text class="section-title">证件与紧急联系人</text>
			<view class="form-item">
				<text class="form-label">身份证号</text>
				<input class="form-input" v-model="form.idCard" type="idcard" maxlength="18" placeholder="请输入身份证号" />
			</view>
			<view class="form-item">
				<text class="form-label">紧急联系人</text>
				<input class="form-input" v-model="form.emergencyName" placeholder="请输入紧急联系人姓名" />
			</view>
			<view class="form-item">
				<text class="form-label">紧急电话</text>
				<input class="form-input" v-model="form.emergencyPhone" type="number" maxlength="11" placeholder="请输入紧急联系电话" />
			</view>
		</view>

		<!-- 健康信息 -->
		<view class="card">
			<text class="section-title">健康信息</text>
			<view class="form-item">
				<text class="form-label">血型</text>
				<picker :range="bloodList" :value="bloodIndex" @change="onBloodChange">
					<view class="form-input picker">{{ form.bloodType || '请选择血型' }}</view>
				</picker>
			</view>
			<view class="form-item textarea-item">
				<text class="form-label">过敏史</text>
				<textarea class="form-textarea" v-model="form.allergy" placeholder="如：青霉素过敏（无则填无）" maxlength="100" />
			</view>
			<view class="form-item textarea-item">
				<text class="form-label">慢性病史</text>
				<textarea class="form-textarea" v-model="form.chronic" placeholder="如：高血压、糖尿病（无则填无）" maxlength="100" />
			</view>
		</view>

		<!-- 账号信息（只读） -->
		<view class="card">
			<text class="section-title">账号信息</text>
			<view class="form-item">
				<text class="form-label">账号ID</text>
				<text class="form-input disabled">{{ accountId }}</text>
			</view>
			<view class="form-item">
				<text class="form-label">注册时间</text>
				<text class="form-input disabled">{{ registerTime }}</text>
			</view>
		</view>

		<button class="save-btn" @tap="save">保存</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			genderList: ['男', '女', '保密'],
			genderIndex: -1,
			regionList: ['渝中区', '江北区', '南岸区', '九龙坡区', '沙坪坝区', '大渡口区', '渝北区', '巴南区', '北碚区', '万州区', '涪陵区'],
			regionIndex: -1,
			bloodList: ['A型', 'B型', 'AB型', 'O型', '不清楚'],
			bloodIndex: -1,
			form: {
				avatar: '',
				nickname: '',
				realName: '',
				phone: '',
				gender: '',
				birthday: '',
				region: '',
				idCard: '',
				emergencyName: '',
				emergencyPhone: '',
				bloodType: '',
				allergy: '',
				chronic: ''
			},
			accountId: '',
			registerTime: ''
		}
	},
	computed: {
		maskedPhone() {
			return this.form.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
		}
	},
	onLoad() {
		// 从本地读取已保存的用户信息
		const raw = uni.getStorageSync('userInfo')
		if (raw) {
			const info = JSON.parse(raw)
			Object.keys(this.form).forEach(key => {
				if (info[key] !== undefined) this.form[key] = info[key]
			})
			// 兼容旧字段：昵称存在 name 字段
			if (info.name) this.form.nickname = info.name
			// 下拉索引回显
			if (info.gender) this.genderIndex = this.genderList.indexOf(info.gender)
			if (info.region) this.regionIndex = this.regionList.indexOf(info.region)
			if (info.bloodType) this.bloodIndex = this.bloodList.indexOf(info.bloodType)
			// 账号信息
			this.accountId = info.accountId || ('UID' + info.phone.slice(-6) || '000000')
			this.registerTime = info.registerTime || new Date().toISOString().slice(0, 10)
		}
	},
	methods: {
		chooseAvatar() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					this.form.avatar = res.tempFilePaths[0]
				}
			})
		},
		onGenderChange(e) {
			this.genderIndex = Number(e.detail.value)
			this.form.gender = this.genderList[this.genderIndex]
		},
		onBirthdayChange(e) {
			this.form.birthday = e.detail.value
		},
		onRegionChange(e) {
			this.regionIndex = Number(e.detail.value)
			this.form.region = this.regionList[this.regionIndex]
		},
		onBloodChange(e) {
			this.bloodIndex = Number(e.detail.value)
			this.form.bloodType = this.bloodList[this.bloodIndex]
		},
		save() {
			if (!this.form.nickname) return uni.showToast({ title: '请输入昵称', icon: 'none' })
			if (this.form.idCard && !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.form.idCard)) {
				return uni.showToast({ title: '身份证号格式不正确', icon: 'none' })
			}
			if (this.form.emergencyPhone && this.form.emergencyPhone.length !== 11) {
				return uni.showToast({ title: '紧急电话需11位', icon: 'none' })
			}
			// 保存到本地存储
			const raw = uni.getStorageSync('userInfo')
			const info = raw ? JSON.parse(raw) : {}
			Object.keys(this.form).forEach(key => {
				info[key] = this.form[key]
			})
			info.name = this.form.nickname // 昵称同步到 name 字段供「我的」页使用
			info.accountId = info.accountId || this.accountId
			info.registerTime = info.registerTime || this.registerTime
			uni.setStorageSync('userInfo', JSON.stringify(info))
			uni.showToast({ title: '保存成功', icon: 'success' })
			setTimeout(() => uni.navigateBack(), 800)
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
.avatar-card {
	display: flex;
	align-items: center;
}
.label {
	font-size: 28rpx;
	color: #333333;
	width: 160rpx;
}
.avatar {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
}
.avatar-img {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
}
.avatar-text {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	background: #2e9e83;
	color: #ffffff;
	font-size: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.arrow {
	font-size: 32rpx;
	color: #cccccc;
}
.section-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
	display: block;
	margin-bottom: 12rpx;
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
.textarea-item {
	align-items: flex-start;
}
.form-label {
	width: 180rpx;
	font-size: 28rpx;
	color: #333333;
	flex-shrink: 0;
}
.form-input {
	flex: 1;
	font-size: 28rpx;
	color: #333333;
}
.form-input.disabled {
	color: #999999;
}
.form-textarea {
	flex: 1;
	font-size: 28rpx;
	color: #333333;
	min-height: 100rpx;
	line-height: 1.6;
}
.picker {
	color: #333333;
}
.save-btn {
	margin-top: 48rpx;
	background: #2e9e83;
	color: #ffffff;
	font-size: 30rpx;
	border-radius: 44rpx;
}
</style>
