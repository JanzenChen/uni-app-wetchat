<template>
	<view :style="'height:'+height+'rpx; background-color: #EFEDE9;'"></view>
</template>

<script>
	export default {
		props: {
			height: {
				type: [Number, String],
				default: 18
			},
		},
	}
</script>

<style>
</style>
