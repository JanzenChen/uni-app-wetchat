export default {
	// 经计算当前日期的星座
	getHoroscrope(date) {
		let c = ['摩羯', '水瓶', '双鱼', '白羊', '金牛', '双子', '巨蟹', '狮子', '处女', '天秤', '天蝎', '射手', '摩羯'];
		date = new Date(date);
		let month = date.getMonth() + 1;
		let day = date.getDate();
		let startMonth = month - (day - 14 < '86577899988'.charAt(month));
		return c[startMonth]
	},

	// 计算置顶时间与当前的时间差
	sumAge(date) {
		let dateBegin = new Date(date.replace(/-/g, "/"));
		let dateEnd = new Date();

		var dateDiff = dateEnd.getTime() - dateBegin.getTime()
		let days = Math.floor(dateDiff / (24 * 3600 * 1000))

		dateDiff = dateDiff % (24 * 3600 * 1000)
		let hours = Math.floor(dateDiff / (3600 * 1000))

		dateDiff = dateDiff % (3600 * 1000)
		let minutes = Math.floor(dateDiff / (60 * 1000))

		dateDiff = dateDiff % (60 * 1000)
		let seconds = leave1 % (60 * 1000)
		return {
			"days": days,
			"hours": hours,
			"minutes": minutes,
			"seconds": seconds
		}
	},
	
	// 获取距离当前的时间差 (秒)
	getDiffNow(timestamp) {
		timestamp = timestamp.toString().length < 13 ? timestamp * 1000 : timestamp;
		let curTimestamp = parseInt(new Date().getTime()); //当前时间戳
		return parseInt((curTimestamp - parseInt(timestamp))/1000)
	},
	// 获取聊天时间 (相差360秒内的信息不会显示时间)
	getChatTime(timeCur, timeOld, diffTime = 300) {
		timeCur = timeCur.toString().length < 13 ? timeCur * 1000 : timeCur;
		timeOld = timeOld.toString().length < 13 ? timeOld * 1000 : timeOld;
		
		let curDifTime = ((parseInt(timeCur) - parseInt(timeOld)) / 1000)
		if (curDifTime < 1 * 24 * 60 * 60 && this.getDiffNow(timeCur) > 1 * 24 * 60 * 60) { // 
			//不超出一天. 同一天, 不处理
		} else if (curDifTime > diffTime) {
			return this.getTime(timeCur)
		}
	},

	// 人性化时间格式
	getTime(shortTime) {
		shortTime = shortTime.toString().length < 13 ? shortTime * 1000 : shortTime;
		return this.timestampFormat(shortTime)
	},
	parseNumber(num) {
		return (String(num).length == 1 ? '0' : '') + num;
	},
	// 日期人性格式化
	timestampFormat(timestamp) {
		let curTimestamp = parseInt(new Date().getTime()); //当前时间戳
		let timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

		let curDate = new Date(curTimestamp); // 当前时间日期对象
		let tmDate = new Date(timestamp); // 参数时间戳转换成的日期对象
		
		let Y = tmDate.getFullYear(),
			m = tmDate.getMonth() + 1,
			w = this.getWeekNum(timestamp),
			d = tmDate.getDate(),
			h = tmDate.getHours(),
			i = tmDate.getMinutes(),
			s = tmDate.getSeconds();

		// console.log('--->:Y:' + Y + " m:" + m + " w:" + w + " d:" + d + " h:" + h + " i:" + i + " s:" + s)
		if (timestampDiff < 60) { // 一分钟以内
			return "刚刚";
		} else if (timestampDiff < 1800) { // 30分钟之内
			return Math.floor(timestampDiff / 60) + "分钟前";
		} else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && this.getWeekNum(curDate) == w && curDate.getDate() ==
			d) { // 当天
			return this.getQuantumInDay(timestamp) + this.getTimeInDay(timestamp);
		} else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && this.getWeekNum(curDate) == w && curDate.getDate() ==
			(d + 1)) {
			return '昨天' + this.parseNumber(h) + ':' + this.parseNumber(i);
		} else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && this.getWeekNum(curDate) == (w + 1) && tmDate.getDay() < curDate.getDay()) {
			return this.getWeek(timestamp)
		} else {
			return this.getYearMouthDay(timestamp);
		}
	},

	//获取一年中的第几周
	getWeekNum(timestamp) {
		let timestamp1 = timestamp.toString().length < 13 ? timestamp * 1000 : timestamp;
		let timestamp2 = timestamp.toString().length < 13 ? timestamp * 1000 : timestamp;
		let d1 = new Date(timestamp1)
		let d2 = new Date(timestamp2)
		d2.setMonth(0);
		d2.setDate(1);
		let rq = d1 - d2;
		let days = Math.ceil(rq / (24 * 60 * 60 * 1000));
		let num = Math.ceil(days / 7);
		return num + 1;
	},
	// 获取年月日
	getYearMouthDay(timestamp) {
		let tp = timestamp.toString().length < 13 ? timestamp * 1000 : timestamp;
		let tmDate = new Date(tp); // 参数时间戳转换成的日期对象

		let curTimestamp = parseInt(new Date().getTime()); //当前时间戳
		let curDate = new Date(curTimestamp); // 当前时间日期对象

		let Y = tmDate.getFullYear(),
			m = tmDate.getMonth() + 1,
			d = tmDate.getDate();
			
		if (curDate.getFullYear() == Y) {
			return this.parseNumber(m) + '月' + this.parseNumber(d) + '日';
		} else {
			return Y + '年' + this.parseNumber(m) + '月' + this.parseNumber(d) + '日';
		}
	},
	// 获取星期几
	getWeek(timestamp) {
		let tp = timestamp.toString().length < 13 ? timestamp * 1000 : timestamp;
		let date = new Date(tp); // 参数时间戳转换成的日期对象
		var week;
		if (date.getDay() == 0) week = "周日"
		if (date.getDay() == 1) week = "周一"
		if (date.getDay() == 2) week = "周二"
		if (date.getDay() == 3) week = "周三"
		if (date.getDay() == 4) week = "周四"
		if (date.getDay() == 5) week = "周五"
		if (date.getDay() == 6) week = "周六"
		return week;
	},
	// 获取当天时间段
	getQuantumInDay(timestamp) {
		let tp = timestamp.toString().length < 13 ? timestamp * 1000 : timestamp;
		let tmDate = new Date(tp); // 参数时间戳转换成的日期对象
		let h = tmDate.getHours();
		if (h >= 23 || h <= 3) {
			return "午夜"
		} else if (h < 8) {
			return "早上"
		} else if (h < 11) {
			return "上午"
		} else if (h < 14) {
			return "中午"
		} else if (h < 21) {
			return "下午"
		} else {
			return "晚上"
		}
	},
	// 获取当天具体时分
	getTimeInDay(timestamp) {
		let tp = timestamp.toString().length < 13 ? timestamp * 1000 : timestamp;
		let tmDate = new Date(tp); // 参数时间戳转换成的日期对象
		let h = tmDate.getHours(),
			i = tmDate.getMinutes();
		return h + ":" + this.parseNumber(i)
	}

}
