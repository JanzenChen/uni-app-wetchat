import wxTimeUtil from '@/common/util/wx-time.js'
export default {
	filters: {
		formatTime(value) {
			return wxTimeUtil.getTime(value)
		}
	},
}