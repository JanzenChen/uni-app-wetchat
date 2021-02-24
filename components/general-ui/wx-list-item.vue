<template>
	<view class="bg-white flex align-stretch"
	      hover-class="bg-light"
		  @click="$emit('click')">
		<view class="flex align-center justify-center py-2 px-3">
			<slot name="icon"></slot>
			<image mode="widthFix"
				   :style="coverStyle"
			       :src="cover" v-if="cover"></image>
		</view>
		<view class="flex-1 border-bottom flex align-center justify-between pr-2">
			<slot name="title">
				<text class="font-normal text-dark">{{title}}</text>
			</slot>
			<view class="flex align-center" v-if="showRight">
				<slot name="right"></slot>
				<!-- 右边箭头 -->
				<text class="iconfont text-light-muted font-normal">&#xe60c;</text>
			</view>
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
			coverSize: { // 封面大小
				style: [String, Number],
				default: 75
			},
			title: { // 标题
				type: String,
				default: ""
			},
			showRight: { // 右边箭头
				type: Boolean,
				default: false
			},
		},
		computed: {
			coverStyle() {
				return `width: ${this.coverSize}rpx; height:${this.coverSize}rpx;`
			},
		}
	}
</script>

<style>
</style>
