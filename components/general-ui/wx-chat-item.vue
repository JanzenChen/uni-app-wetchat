<template>
	<view>
		<!-- 时间显示 -->
		<view v-if="showTime" class="flex align-center justify-center pb-1 pt-2">
			<text class="font-samll text-light-muted">{{showTime}}</text>
		</view>
		<!-- 聊天气泡 -->
		<view class="flex align-start my-1 position-relative" :class="isSelf ? 'justify-end' : 'justify-start' " @longpress="onLongpress">
			<!-- 左边 - 好友 -->
			<template v-if="!isSelf">
				<wx-avatar size="70" :src="item.avatar"></wx-avatar>
				<text class="iconfont text-white font-normal position-absolute chat-left-icon">&#xe609;</text>
			</template>
			<!-- 中间内容 -->
			<div class="py-2 px-2 rounded" style="max-width:500rpx" :class="isSelf ? 'bg-chat-item mr-3' : 'bg-white ml-3'">
				<text class="font-normal ">{{item.data}}</text>
			</div>
			<!-- 右边 - 本人 -->
			<template v-if="isSelf">
				<text class="iconfont text-chat-item font-normal position-absolute chat-right-icon">&#xe640;</text>
				<wx-avatar size="70" :src="item.avatar"></wx-avatar>
			</template>
		</view>	
	</view>
</template>

<script>
	import wxBase from '@/common/wx-base.js'
	import wxAvatar from '@/components/general-ui/wx-avatar.nvue'
	import wxTimeUtil from '@/common/util/wx-time.js'
	export default {
		mixins:[wxBase],
		components: {
			wxAvatar,
		},
		props: {
			item: {
				type: Object,
			},
			pretime: [Number, String],
		},
		computed: {
			isSelf() {
				//获取本人的id
				let myId = 1
				return this.item.user_id === myId	 
			},
			showTime() {
				return wxTimeUtil.getChatTime(this.item.created_time, this.pretime)
			}
		},
		methods: {
			onLongpress(e) {
				let x = 0
				let y = 0
				// #ifdef APP-PLUS-NVUE
				if (Array.isArray(e.changedTouches) && e.changedTouches.length > 0) {
					x = e.changedTouches[0].screenX
					y = e.changedTouches[0].screenY
				}
				// #endif
				
				// #ifdef MP
				x = e.detail.x
				y = e.detail.y
				// #endif
				this.$emit('onLongpress', {x:x, y:y, item:this.item})
			}
		}
	}
</script>

<style>
.chat-left-icon {
	left: 80rpx; top:20rpx;
}

.chat-right-icon {
	right: 80rpx; top:20rpx;
}
</style>
