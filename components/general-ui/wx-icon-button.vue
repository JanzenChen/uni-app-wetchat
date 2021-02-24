<template>
	<view class="flex align-center justify-start"
	      hover-class="bg-hover-light"
		  :style="getStyle"
		  @click="$emit('click_action')">
			  <text class="iconfont font-normal">{{icon}}</text>
	</view>
</template>

<script>
	export default {
		props: {
			icon: {
				type: String,
				default: ''
			},
			size: {
				type: [Number, String],
				default: 90
			}
		},
		computed: {
			getStyle() {
				return `height: ${this.size}rpx; width: ${this.size}rpx;`
			}
		}
		
	}
</script>

<style>

</style>
