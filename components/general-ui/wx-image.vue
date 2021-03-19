<template>
	<image :class="imageClass" :src="src"
			lazy-load mode="widthFix"
			:style="imageStyle"
			@click="$emit('click')"
			@load="loadImage"></image>
</template>

<script>
	export default {
		props: {
			src: {
				type: String,
				default: ""
			},
			imageClass: {
				type: String,
				default: ""
			},
			maxWidth: {
				type: Number,
				default: 500 //rpx
			},
			maxHeight: {
				type: Number,
				default: 800 // rpx
			}
		},
		data() {
			return {
				w: 250,
				h: 250,
			}
		},
		computed: {
			imageStyle() {
				return `width:${this.w}rpx; height:${this.h}rpx;` // 
			}
		},
		methods: {
			// 加载图片
			loadImage(e){
				let w = e.detail.width
				let h = e.detail.height
				
				let maxW = uni.upx2px(this.maxWidth) //最大宽度250
				let maxH = uni.upx2px(this.maxHeight) // 最大高度
				
				if (w === h) {
					w = Math.min(maxW, w)
					h = Math.min(maxH, h)
				} else if (w > h && w > maxW) {
					h = maxW/w * h
					w =  maxW
				} else  if (h > w && h > maxH) {
					w = maxH/h * w
					h =  maxH
				}
				
				this.w = w
				this.h = h
				
				this.$emit('imageSize',{w:this.w, h: this.h})
			},
		},
		
	}
	
</script>

<style>
</style>
