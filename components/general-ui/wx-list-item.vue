<template>
	<view class="bg-white flex align-stretch"
	      hover-class="bg-light"
		  @click="$emit('click')">
		 <!-- 图标 -->
		<view v-if="showLeftIcon" class="flex align-center justify-center py-2 pl-2">
			<slot name="icon"></slot>
			<image mode="widthFix" :style="coverStyle" :src="cover" v-if="cover"></image>
		</view>
		<!-- 内容 -->
		<view class="flex-1 border-bottom flex align-center justify-between px-2 py-3">
			<slot name="title">
				<text class="font-normal text-dark">{{title}}</text>
			</slot>
			<view class="flex align-center" v-if="showRight">
				<slot name="right"></slot>
				<!-- 右边箭头 -->
				<text v-if="showRightIcon" class="iconfont text-light-muted font-normal">&#xe60c;</text>
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
			showLeftIcon: { // 是否显示左边图标
				type: Boolean,
				default: true
			},
			showRight: { // 右边
				type: Boolean,
				default: false
			},
			showRightIcon: {// 右边箭头
				type: Boolean,
				default: true
			}
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
