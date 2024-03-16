<template>
    <div class="container">
        <div class="row d-flex justify-content-center">
            <div class="col-md-10 gx-0">
                <div class="mt-5">
                    <h2 class="h3">訂單列表管理</h2>
                </div>  
            <table class="table table-hover mt-4 border">
                <thead>
                    <tr>
                        <th class="col-2 bg-secondary text-white">購買時間</th>
                        <th class="col-3 bg-secondary text-white">Email</th>
                        <th class="col-3 bg-secondary text-white">訂單編號</th>
                        <th class="col bg-secondary text-white">應付金額</th>
                        <th class="col bg-secondary text-white text-center">付款狀態</th>
                        <th class="col bg-secondary text-white text-center">編輯</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in ordersList" :key="item.id">
                        <td class="col">{{ $filters.date(item.create_at) }}</td>
                        <td class="col" v-if="item.user">{{ item.user.email }}</td>
                        <td class="col">{{ item.id }}</td>
                        <td class="col">{{ item.total }}</td>
                        <td class="col">
                            <div class="form-check form-switch d-flex justify-content-center">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    :id="`paidSwitch${item.id}`"
                                    v-model="item.is_paid"
                                    @change="updateOrder(item)"
                                />
                                <label class="form-check-label ms-2" :for="`paidSwitch${item.id}`">
                                    <span v-if="item.is_paid" class="text-success">已付款</span>
                                    <span v-else class="text-danger">未付款</span>
                                </label>
                            </div>
                        </td>
                        <td class="col text-center">
                            <button type="button" class="btn btn-outline-primary btn-sm"
                                @click="openModal('edit', item)">編輯</button>
                            <button type="button" class="btn btn-outline-danger btn-sm" 
                                @click="openModal('delete', item)">刪除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p>目前已有 <span class="text-success">{{ ordersList.length }}</span> 個訂單</p>
            <Pagination :pages="pages" @emit-pages="getOrders"></Pagination>
            </div>
        </div>
    </div>
    <OrderModal :tempOrder="tempOrder" :isSwitch="isSwitch" @update-temp-order="changeTempOrder" ref="changeModal"></OrderModal>
    <DelOrderModal :del-order="delOrder" :tempOrder="tempOrder" ref="delModal"></DelOrderModal>
</template>
<script>

import axios from 'axios'
import OrderModal from '../../components/OrderModal.vue';
import DelOrderModal from '../../components/DelOrderModal.vue';
import Pagination from '../../components/pagination.vue';

const { VITE_API, VITE_PATH } = import.meta.env

export default {
    data() {
        return {
            ordersList: [],
            tempOrder: {},
            pages: {},
            isSwitch: false,
            is_paid: 0,
        }
    },
    methods: {
        //確認登入
        checkUser() {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("hexToken="))
                ?.split("=")[1];
            axios.defaults.headers.common['Authorization'] = token;
            axios.post(`${VITE_API}/api/user/check`, null)
                .then(() => {
                    this.getOrders();
                })
                .catch(err => {
                    console.dir(err);
                })
        },
        //取得訂單列表
        getOrders(page = 1) {
            const api =`${VITE_API}/api/${VITE_PATH}/admin/orders?page=${page}`;
            axios.get(api)
            .then(res => {
                this.ordersList = res.data.orders;
                this.pages = res.data.pagination;
                // console.dir(res.data.orders[0]);
            })
            .catch(err => {
                console.dir(err);
            })
        },
        //彈跳視窗
        openModal(status, item) {
            if(status === 'edit') {
                this.tempOrder = { ...item }; //顯示已有產品資訊
                this.isSwitch = true;
                this.$refs.changeModal.openModal();
            } else if (status === 'delete') {
                this.tempOrder = { ...item }; 
                this.isSwitch = false;
                this.$refs.delModal.openModal();
                // console.log(this.tempOrder.title);
            }
        },
        //編輯訂單
        updateOrder() {
            let api =  `${VITE_API}/api/${VITE_PATH}/admin/order/${this.tempOrder.id}`;
            let name = this.tempOrder.title;
            let method = 'put';
            if(!this.isSwitch) {
                method = 'delete';
                alert('刪除訂單資料成功');
            } else {
                alert('修改訂單資料成功');
            }
            axios[method](api, { data:this.tempOrder })
            .then(res => {
                // console.log(res.data);
                this.getOrders();
                this.$refs.changeModal.closeModal();
            })
            .catch(err => {
                console.dir(err);
                alert('請正確填寫欄位資料');
            })
        },
        //存入已有資料
        changeTempOrder (updateTempOrder) {
            this.tempOrder = updateTempOrder;
            this.updateOrder();
        },
        //刪除訂單
        delOrder() {
            const api = `${VITE_API}/api/${VITE_PATH}/admin/order/${this.tempOrder.id}`; 
            axios.delete(api)
            .then(res => {
                console.log(res);
                this.$refs.delModal.closeModal();
                this.getOrders();
            })
            .catch(err => {
                alert('刪除產品失敗');
                console.dir(err);
            })
        }
    },
    mounted() {
        this.checkUser();
    },
    
    components: {
        OrderModal,
        DelOrderModal,
        Pagination
    }
}
</script>



