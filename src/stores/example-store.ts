import { defineStore } from 'pinia';
import { api } from '../boot/axios'

interface rowType {
  ID?: string;
  name?: string;
  age?: number | string;
}

export const useCounterStore = defineStore('counter', {
  state: () => ({
    counter: 0,
    userList: [],
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      this.counter++;
    },
    async getList() {
      try {
        const res = await api.get('/api/CRUDTest/a')
        this.userList = res.data
      } catch(err) {
        console.log('err::', err)
      }
    },
    async addList(params: rowType) {
      try {
        await api.post('/api/CRUDTest', params)
      } catch(err) {
        console.log('err::', err)
      }
    }
  },
});
