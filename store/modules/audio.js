
export default {
	state: {
		// 存放全局事件
		events:[]
	},
	mutations: {
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
		}
	},
	actions: {
		// 分发全局注册事件
		$on({commit}, event) {
			commit("regEvent", event)
		},
		// 分发全局执行事件
		$emit({commit}, event) {
			commit("runEvent", event)
		},
		$off({commit}, event) {
			commit("removeEvent", event)
		}
	}
}