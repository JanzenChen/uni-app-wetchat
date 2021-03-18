<template>
	<view>
		<!-- 时间显示 -->
		<view v-if="showTime" class="flex align-center justify-center pb-1 pt-2">
			<text class="font-samll text-light-muted">{{showTime}}</text>
		</view>
		<!-- 消息撤回 -->
		<view v-if="item.isRemove" ref="isRemove"
			  class="flex align-center justify-center pb-1 pt-2"
			  :class="item.isRemove ? '' : 'chat-remove' ">
			<text class="font-samll text-light-muted">你撤回了一条消息</text>
		</view>
		<!-- 聊天气泡 -->
		<view v-if="!item.isRemove"
			  class="flex align-start my-1 position-relative" 
			  :class="isSelf ? 'justify-end' : 'justify-start' "
			  @longpress="onLongpress">
			<!-- 左边 - 好友 -->
			<template v-if="!isSelf">
				<wx-avatar size="70" :src="item.avatar"></wx-avatar>
				<text v-if="isNeedPaopao"
				 class="iconfont font-normal position-absolute chat-left-icon"
				 :class="paopaoTextColor">&#xe609;</text>
			</template>
			<!-- 中间内容 -->
			<div class="py-2 px-2 rounded" style="max-width:500rpx" :class="[isSelf ? 'mr-3' : 'ml-3', paopaoBgColor]">
				<text v-if="item.type === 'text'" class="font-normal ">{{item.data}}</text>
				<!-- 图片 | 表情 -->
				<wx-image v-if="item.type === 'emoticon' || item.type === 'image'"
						:imageClass="item.type === 'image' ? 'rounded p-2':'p-2'"
						:src="item.data"
						:maxWidth="500" :maxHeight="800"
						@click="preview(item.data)"></wx-image>
						
				<!-- 音频 -->
				<view v-if="item.type === 'audio'"
					  class="flex align-center"
					  @click="openAudio">
					  <text v-if="isSelf" class="font ml-3">5'</text>
					  <image :src="audioPlay ? '/static/audio/play.gif': '/static/audio/audio3.png'"
							 style="width: 50rpx; height: 50rpx;"
							 class="mx-1"></image>
					  <text v-if="!isSelf" class="font mr-3">4'</text>
				</view>
				
				<!-- 视频 -->
				<view v-if="item.type === 'video'"
					  class="position-relative rounded"
					  @click="openVideo">
					<wx-image :imageClass="item.type === 'video' ? 'rounded p-2':'p-2'"
							:src="item.options.cover"
							:maxWidth="500" :maxHeight="800"
							@click="preview(item.data)"
							@imageSize="imageSize"></wx-image>
					<text class="iconfont text-white position-absolute"
					style="font-size: 80rpx;"
					:style="playIconStyle">&#xe737</text>
				</view>
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
	import wxImage from '@/components/general-ui/wx-image.vue'
	import { mapState, mapActions } from 'vuex'
	
	// #ifdef APP-PLUS-NVUE
	const animation = weex.requireModule('animation')
	// #endif
	export default {
		mixins:[wxBase],
		components: {
			wxAvatar,
			wxImage,
		},
		props: {
			item: {
				type: Object,
			},
			pretime: [Number, String],
		},
		data() {
			return {
				innerAudioContext: null,
				audioPlay: false,
				coverSize: {
					width: 250,
					height: 250,
				},
			}
		},
		destroyed() {
			if (this.item.type !== "audio") {
				return
			}
			
			this.audioOff(this.onPlayAudio)
			// 停止音频播放, 销毁音频
			if (this.innerAudioContext) {
				this.innerAudioContext.stop()
				this.innerAudioContext.destroy()
				this.innerAudioContext = null
			}
		},
		computed: {
			...mapState({
				audioStyle: state=>state.audio.audioStyle
			}),
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
			},
			playIconStyle() {
				return `left:${(this.coverSize.width - 80) * 0.5}rpx; top:${(this.coverSize.height - 80) * 0.5}rpx;` 
			}
		},
		mounted() { 
			if (this.item.type === "audio") {
				console.log(this.item.chatItemId)
				this.audioOn(this.onPlayAudio) // 注册播放事件
			}
			// 监听是否撤回
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
			...mapActions(['audioOn', 'audioEmit', 'audioOff']),
			// 打开视频
			openVideo() {
				uni.navigateTo({
					url: '/pages/chat/video/video?url='+this.item.data,
				})	
			},
			imageSize(e) {
				console.log(e)
				this.coverSize.width = e.w
				this.coverSize.height = e.h
			},
			// 全局语音播放事件
			onPlayAudio(res) {
				if (this.item.type !== 'audio') { return; }
				if (res === this.item.chatItemId) { return; }
				if (this.innerAudioContext !== null) {
					this.innerAudioContext.stop()
					this.innerAudioContext = null
				}
			},
			//播放音频
			openAudio() {
				
				if (this.item.type === 'audio' && this.item.data.length > 0) {
					if (this.innerAudioContext === null) {
						this.innerAudioContext = uni.createInnerAudioContext()
						this.innerAudioContext.src = this.item.data
						this.innerAudioContext.play()
						this.audioEmit(this.item.chatItemId)
						
						// 监听播放
						this.innerAudioContext.onPlay(()=> {
							this.audioPlay = true
						})
						// 监听暂停
						this.innerAudioContext.onPause(()=> {
							this.audioPlay = false
						})
						// 监听停止
						this.innerAudioContext.onStop(()=> {
							this.audioPlay = false
						})
						// 监听错误
						this.innerAudioContext.onError(()=> {
							this.audioPlay = false
						})
					} else {
						this.innerAudioContext.stop()
						this.innerAudioContext = null
					}
				}
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
