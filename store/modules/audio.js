
export default {
	state: {
		// 存放全局事件
		events:[],
		Recorder: null,
		recorderOnStart: null,
		recorderOnStop: null,
	},
	mutations: {
		initRecorder(state) {
			state.Recorder = uni.getRecorderManager()
			
			// 录音开始
			state.Recorder.onStart(()=> {
				if (typeof state.recorderOnStart === 'function') {
					state.recorderOnStart()
				}
			})
			
			// 监听录音结束
			state.Recorder.onStop((e)=> {
				if (typeof state.recorderOnStop === 'function') {
					state.recorderOnStop(e)
				}
			})
			
		},
		//注册 录音开始事件
		regRecorderStart(state, event) {
			state.recorderOnStart = event
		},
		//注册 录音结束事件
		regRecorderStop(state, event) {
			state.recorderOnStop = event
		},
		//注册全局事件
		regEvent(state, event){
			state.events.push(event)
		},
		runEvent(state, params) {
			state.events.forEach(e=> {
				e(params)
			})
		},
		removeEvent(state, event) {
			let idx = state.events.findIndex(e => {
				return e === event
			})
			if (idx !== -1) {
				state.events.splice(idx, 1)
			}
		},
	},
	actions: {
		// 分发全局注册事件
		audioOn({commit}, event) {
			commit("regEvent", event)
		},
		// 分发全局执行事件
		audioEmit({commit}, event) {
			commit("runEvent", event)
		},
		audioOff({commit}, event) {
			commit("removeEvent", event)
		}
	}
}