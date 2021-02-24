<template>
	<view class="bg-white flex align-stretch"
	      hover-class="bg-light"
		  @click="$emit('click')">
		<view class="flex align-center justify-center py-2 px-3">
			<image mode="widthFix"
				   style="width: 75rpx; height:75rpx;"
			       :src="cover" v-if="cover"></image>
		</view>
		<view class="flex-1 border-bottom flex align-center">
			<text class="font-normal text-dark">{{title}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			cover: { // 封面
				type: String, 
				default: ""
			},
			title: { // 标题
				type: String,
				default: ""
			}
		},
	}
</script>

<style>
</style>
