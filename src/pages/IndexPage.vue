<template>
  <q-page class="row q-pt-xl">
    <div class="full-width q-px-xl">
      <div class="q-mb-xl">
        <q-input v-model="tempData.name" label="姓名" />
        <q-input v-model="tempData.age" label="年齡" />
        <q-btn color="primary" class="q-mt-md" @click="handleClickOption({
          label: '新增',
          icon: 'add',
          status: 'add',
          }, tempData)"
          >新增
        </q-btn>
      </div>

      <q-table
        flat
        bordered
        ref="tableRef"
        :rows="blockData"
        :columns="(tableConfig as QTableProps['columns'])"
        row-key="id"
        hide-pagination
        separator="cell"
        :rows-per-page-options="[0]"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
            <q-th></q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              style="min-width: 120px"
            >
              <div>{{ col.value }}</div>
            </q-td>
            <q-td class="text-right" auto-width v-if="tableButtons.length > 0">
              <q-btn
                @click="handleClickOption(btn, props.row)"
                v-for="(btn, index) in tableButtons"
                :key="index"
                size="sm"
                color="grey-6"
                round
                dense
                :icon="btn.icon"
                class="q-ml-md"
                padding="5px 5px"
              >
                <q-tooltip
                  transition-show="scale"
                  transition-hide="scale"
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                >
                  {{ btn.label }}
                </q-tooltip>
              </q-btn>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:no-data="{ icon }">
          <div
            class="full-width row flex-center items-center text-primary q-gutter-sm"
            style="font-size: 18px"
          >
            <q-icon size="2em" :name="icon" />
            <span> 無相關資料 </span>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import axios from 'axios';
import { useQuasar } from 'quasar'
import { QTableProps } from 'quasar';
import { onMounted, ref } from 'vue';
import { useCounterStore } from 'stores/example-store'

interface btnType {
  label: string;
  icon: string;
  status: string;
}

interface rowType {
  ID?: string;
  name?: string;
  age?: number | string;
}

const userStore = useCounterStore()
const $q = useQuasar()

const blockData = ref([
  {
    name: 'test',
    age: 25,
  },
]);
const tableConfig = ref([
  {
    label: '姓名',
    name: 'name',
    field: 'name',
    align: 'left',
  },
  {
    label: '年齡',
    name: 'age',
    field: 'age',
    align: 'left',
  },
]);
const tableButtons = ref([
  {
    label: '編輯',
    icon: 'edit',
    status: 'edit',
  },
  {
    label: '刪除',
    icon: 'delete',
    status: 'delete',
  },
]);

const tempData = ref<rowType>({
  name: '',
  age: '',
});

onMounted(async() => {
  try {
    await getList()
  } catch (err) {
    console.log('err:: ', err)
  }
})

const getList = async() => {
  try {
    await userStore.getList()
    blockData.value = userStore.userList
  } catch (err) {
    console.log('err::', err)
  }
}

const handleClickOption = async(btn: btnType, data: rowType) => {
  try {
    console.log('btn:: ', btn)
    console.log('data:: ', data)
    switch(btn.status) {
      case 'add':
        const age = tempData.value.age
        if(!tempData.value.name || !age) {
          alert('姓名或年齡不能空白')
          return 
        }
        if(isNaN(+age) || +age <= 0 || !Number.isInteger(+age)) {
          alert('不得空白&限輸入數字(正整數) ')
          return
        }
        await userStore.addList(tempData.value)
        await getList()
        break
      case 'edit':
        $q.dialog({
          title: '提示',
          message: '是否確定修改此資料?',
          cancel: true,
          persistent: true
        }).onOk(async() => {
          await axios.patch('https://dahua.metcfire.com.tw/api/CRUDTest', data)
          await getList()
        }).onCancel(() => {
          console.log('>>>> Cancel')
        })
        break
      case 'delete':
        const { id } = data as { id: string }
        $q.dialog({
          title: '提示',
          message: '是否確定刪除此資料?',
          cancel: true,
          persistent: true
        }).onOk(async() => {
          await axios.delete(`https://dahua.metcfire.com.tw/api/CRUDTest/${id}`)
          await getList()
        }).onCancel(() => {
          console.log('>>>> Cancel')
        })
        break
      default:
        break
    }
  } catch (err) {
    console.log('err:: ', err)
  }
}
</script>

<style lang="scss" scoped>
.q-table th {
  font-size: 20px;
  font-weight: bold;
}

.q-table tbody td {
  font-size: 18px;
}
</style>
