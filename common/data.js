// 公共模拟数据：各页面统一从这里取，后续可替换为接口请求

// 服务分类（首页金刚区/入口卡片，color 为图标底色）
export const categories = [
	{ id: 1, name: '就医陪诊', icon: '🏥', color: '#e8f7f2' },
	{ id: 2, name: '代跑取药', icon: '💊', color: '#fff1e3' },
	{ id: 3, name: '送取结果', icon: '📄', color: '#eef4ff' },
	{ id: 4, name: '护理陪护', icon: '💗', color: '#ffeef2' },
	{ id: 5, name: '上门助浴', icon: '🛁', color: '#e8f7f2' },
	{ id: 6, name: '诊前约号', icon: '📅', color: '#f3edff' },
	{ id: 7, name: '尊享陪诊', icon: '👑', color: '#fffbe8' }
]

// 首页金刚区展示的分类（5个）
export const quickCateIds = [2, 5, 3, 6, 7]

// 服务列表
export const services = [
	{
		id: 1,
		title: '半天全程陪诊',
		categoryId: 1,
		price: 168,
		unit: '次',
		desc: '陪诊师全程陪同挂号、候诊、缴费、取药，适合独自就诊的老人和孕妇。',
		tags: ['专人陪护', '异地可约'],
		rating: 4.9,
		orders: 326
	},
	{
		id: 2,
		title: '全天全程陪诊',
		categoryId: 1,
		price: 298,
		unit: '次',
		desc: '8小时全天候陪同就诊，覆盖检查、会诊等复杂就医流程。',
		tags: ['全天守护', '优先派单'],
		rating: 4.8,
		orders: 208
	},
	{
		id: 3,
		title: '代办取药',
		categoryId: 2,
		price: 88,
		unit: '次',
		desc: '凭处方代为排队缴费、取药并送药上门，节省排队时间。',
		tags: ['送药上门', '票据齐全'],
		rating: 4.9,
		orders: 512
	},
	{
		id: 4,
		title: '代取检查报告',
		categoryId: 3,
		price: 58,
		unit: '次',
		desc: '代取检验/检查报告，拍照或原件快递送达，当日出结果当日送达。',
		tags: ['当天送达', '电子+纸质'],
		rating: 4.7,
		orders: 431
	},
	{
		id: 5,
		title: '住院陪护(白天)',
		categoryId: 4,
		price: 200,
		unit: '天',
		desc: '白天8小时住院照护：打饭、翻身、陪同检查，减轻家属负担。',
		tags: ['持证护理员', '日结'],
		rating: 4.8,
		orders: 189
	},
	{
		id: 6,
		title: '住院陪护(全天)',
		categoryId: 4,
		price: 320,
		unit: '天',
		desc: '24小时一对一住院陪护，夜间照看，及时呼叫医护。',
		tags: ['一对一', '夜间照看'],
		rating: 5.0,
		orders: 96
	},
	{
		id: 7,
		title: '上门助浴',
		categoryId: 5,
		price: 268,
		unit: '次',
		desc: '专业护理员携带便携设备上门助浴，适合行动不便的长者。',
		tags: ['专业护理员', '上门服务'],
		rating: 4.8,
		orders: 132
	},
	{
		id: 8,
		title: '诊前约号',
		categoryId: 6,
		price: 48,
		unit: '次',
		desc: '提前帮您锁定专家号源，就诊当日按点到院即可。',
		tags: ['专家号源', '失败退款'],
		rating: 4.9,
		orders: 604
	},
	{
		id: 9,
		title: '尊享陪诊',
		categoryId: 7,
		price: 398,
		unit: '次',
		desc: '资深陪诊师一对一服务，含接送、代取报告、用药提醒等增值服务。',
		tags: ['一对一', '上门接送'],
		rating: 5.0,
		orders: 87
	}
]

// 热门医院（首页医院列表）
export const hospitals = [
	{
		id: 1,
		name: '重庆大坪医院',
		level: '三甲',
		type: '综合医院',
		desc: '陆军军医大学附属医院，创伤外科、高血压病科等为重点专科。',
		address: '重庆市渝中区大坪长江支路10号',
		img: '/static/icons/大坪医院.jpg'
	},
	{
		id: 2,
		name: '重庆市人民医院',
		level: '三甲',
		type: '综合医院',
		desc: '重庆市属大型综合性医院，心血管、神经内科实力雄厚。',
		address: '重庆市两江新区星光大道118号',
		img: '/static/icons/人民医院.jpg'
	},
	{
		id: 3,
		name: '重庆医科大学附属医院',
		level: '三甲',
		type: '综合医院',
		desc: '重庆医科大学直属附属医院，拥有多个国家级重点学科。',
		address: '重庆市渝中区袁家岗友谊路1号',
		img: '/static/icons/重庆医科.jpg'
	},
	{
		id: 4,
		name: '重庆市第三人民医院',
		level: '三甲',
		type: '综合医院',
		desc: '重庆市属三级甲等综合医院，老年医学、康复医学为特色专科。',
		address: '重庆市渝中区枇杷山正街104号',
		img: '/static/icons/重医三院.jpg'
	}
]

// 模拟订单数据（演示用，用户真实下单后会追加到本地存储）
export const mockOrders = [
	{
		id: 'DD20260909001',
		serviceId: 1,
		title: '半天全程陪诊',
		hospital: '重庆大坪医院',
		department: '心内科',
		patient: '张大爷',
		phone: '13800001111',
		date: '2026-09-12',
		status: '待服务',
		price: 168,
		createTime: '2026-09-09 10:23:00'
	},
	{
		id: 'DD20260820002',
		serviceId: 3,
		title: '代办取药',
		hospital: '重庆市人民医院',
		department: '骨科',
		patient: '李阿姨',
		phone: '13900002222',
		date: '2026-08-21',
		status: '已完成',
		price: 88,
		createTime: '2026-08-20 14:05:00'
	}
]
