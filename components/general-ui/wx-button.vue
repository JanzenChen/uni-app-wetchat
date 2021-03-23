<template>
	<view class="main-bg-color rounded mx-2 px-2 py-1" @click="$emit('click')">
		<text class="text-white font-samll">{{name}}</text>
	</view>
</template>

<script>
	export default {
		props: {
			name: {
				type: String,
				default: ""
			},
		},
	}
</script>

<style>

</style>
