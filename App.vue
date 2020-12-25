<script>
	export default {
		onLaunch: function() {
			// #ifdef APP-PLUS-NVUE
			var domModule = weex.requireModule('dom');
			domModule.addRule('fontFace', {
				'fontFamily': "iconfont",
				'src': "url('https://at.alicdn.com/t/font_1365296_vumpzwvr0z.ttf')"
			})
			// #endif
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
	@import "./common/wx-free.css";
	@import "./common/wx-common.css";
	/* #ifndef APP-PLUS-NVUE */
	@import "./common/wx-icon.css";
	/* #endif */
</style>
