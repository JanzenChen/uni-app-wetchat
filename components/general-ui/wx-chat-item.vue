<template>
	<view>
		<!-- 时间显示 -->
		<view v-if="showTime" class="flex align-center justify-center pb-1 pt-2">
			<text class="font-samll text-light-muted">{{showTime}}</text>
		</view>
		<!-- 消息撤回 -->
		<view v-if="item.isRemove" ref="isRemove" class="flex align-center justify-center pb-1 pt-2" :class="item.isRemove ? '' : 'chat-remove' ">
			<text class="font-samll text-light-muted">你撤回了一条消息</text>
		</view>
		<!-- 聊天气泡 -->
		<view v-if="!item.isRemove" class="flex align-start my-1 position-relative" :class="isSelf ? 'justify-end' : 'justify-start' " @longpress="onLongpress">
			<!-- 左边 - 好友 -->
			<template v-if="!isSelf">
				<wx-avatar size="70" :src="item.avatar"></wx-avatar>
				<text v-if="isNeedPaopao" class="iconfont font-normal position-absolute chat-left-icon" :class="paopaoTextColor">&#xe609;</text>
			</template>
			<!-- 中间内容 -->
			<div class="py-2 px-2 rounded" style="max-width:500rpx" :class="[isSelf ? 'mr-3' : 'ml-3', paopaoBgColor]">
				<text v-if="item.type === 'text'" class="font-normal ">{{item.data}}</text>
				<image v-if="item.type === 'emoticon' || item.type === 'image'"
						:class="item.type === 'image' ? 'rounded':''"
						class="p-2" :src="item.data"
						lazy-load mode="widthFix"
						:style="'width:' + w + 'rpx;'"
						@click="preview(item.data)"
						@load="loadImage"></image>
			</div>
			<!-- 右边 - 本人 -->
			<template v-if="isSelf">
				<text v-if="isNeedPaopao" class="iconfont font-normal position-absolute chat-right-icon" :class="paopaoTextColor">&#xe640;</text>
				<wx-avatar size="70" :src="item.avatar"></wx-avatar>
			</template>
		</view>	
	</view>
</template>

<script>
	import wxBase from '@/common/wx-base.js'
	import wxAvatar from '@/components/general-ui/wx-avatar.nvue'
	import wxTimeUtil from '@/common/util/wx-time.js'
	// #ifdef APP-PLUS-NVUE
	const animation = weex.requireModule('animation')
	// #endif
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
		data() {
			return {
				w: 250,
				h: 250,
			}
		},
		computed: {
			isSelf() {
				//获取本人的id
				let myId = 1
				return this.item.user_id === myId	 
			},
			isNeedPaopao() {
				return ["text", "audio"].findIndex((type)=>this.item.type === type) != -1
			},
			paopaoBgColor() {
				let bgColor = this.isSelf ? 'bg-chat-item' : 'bg-white'
				return this.isNeedPaopao ? bgColor : ''
			},
			paopaoTextColor() { // 尖角颜色
				let textColor = this.isSelf ? 'text-chat-item' : 'text-white'
				return this.isNeedPaopao ? textColor : ''
			},
			showTime() {
				return wxTimeUtil.getChatTime(this.item.created_time, this.pretime)
			}
		},
		mounted() { // 监听是否撤回
			this.$watch('item.isRemove', (newV, oldV)=>{
				if (newV) {
					// #ifdef APP-NVUE
					// 等待加载完成在执行
					this.$nextTick(() => {
						animation.transition(this.$refs.isRemove, {
							styles: {
								opacity: 1,
							},
							duration: 100, //ms
							timingFunction: 'ease',
							needLayout: false,
							delay: 0.2 //ms
						}, () => {
							console.log('动画执行完毕')
						})
					})
					// #endif
				}
			})
		},
		methods: {
			// 加载图片
			loadImage(e){
				let w = e.detail.width
				let h = e.detail.height
				
				let maxW = uni.upx2px(500) //最大宽度250
				let maxH = uni.upx2px(800) // 最大高度
				
				if (w === h) {
					w = MAth.min(maxW, w)
					h = MAth.min(maxH, h)
				} else if (w > h && w > maxW) {
					w =  maxW
					h = maxW/w * h
				} else  if (h > w && h > maxH) {
					console.log(w, h, maxH/h)
					w = maxH/h * w
					h =  maxH
					console.log(w, h)
				}
				
				this.w = w
				this.h = h
			},
			//预览图片
			preview(url) {
				this.$emit('preview', url)
			},
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

<style scoped>
.chat-left-icon {
	left: 80rpx; top:20rpx;
}

.chat-right-icon {
	right: 80rpx; top:20rpx;
}

.chat-remove {
	/* #ifdef APP-NVUE */
	opacity: 0;
	/* #endif */
}

</style>
