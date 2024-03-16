<template>
    <div class="container">
        <div class="row d-flex justify-content-center mt-5">
            <div class="col-10 gx-0">
                <div class="d-flex justify-content-between">
                    <h2 class="h3">優惠券列表管理</h2>
                    <button class="btn btn-primary text-white" type="button"
                        @click="openModal('new')">
                        建立新的優惠券
                    </button>
                </div>
                <table class="table mt-4 border">
                <thead>
                    <tr>
                        <th class="col-3 bg-secondary text-white">名稱</th>
                        <th class="col-3 bg-secondary text-white">折扣百分比</th>
                        <th class="col bg-secondary text-white">到期日</th>
                        <th class="col bg-secondary text-white text-center">是否啟用</th>
                        <th class="col bg-secondary text-white text-center">編輯</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, key) in couponsList" :key="key">
                        <td> {{ item.title }}</td>
                        <td>{{ item.percent }}%</td>
                        <td>{{ $filters.date(item.due_date) }}</td>
                        <td class="text-center">
                            <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
                            <span v-else class="text-danger">未啟用</span>
                        </td>
                        <td class="text-center">
                            <div class="btn-group">
                                <button type="button" class="btn btn-outline-primary btn-sm"
                                    @click="openModal('edit', item)">編輯</button>
                                <button type="button" class="btn btn-outline-danger btn-sm" 
                                    @click="openModal('delete', item)">刪除</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
                </table>
                <p>目前有 <span class="text-success">{{ couponsList.length }}</span> 張優惠券</p>
                <Pagination :pages="pages" @emit-pages="getCoupons"></Pagination>
            </div>
        </div>
    </div>
    <CouponModal :tempCoupon="tempCoupon" :is-new="isNew"  @update-temp-coupon="changeTempCoupon" ref="changeModal"/>
    <DelCouponModal :del-coupon="delCoupon" :tempCoupon="tempCoupon" ref="delModal"></DelCouponModal>
</template>

<script>
import axios from 'axios'
import CouponModal from '../../components/CouponModal.vue';
import DelCouponModal from '../../components/DelCouponModal.vue';
import Pagination from '../../components/pagination.vue';

const { VITE_API, VITE_PATH } = import.meta.env

export default {
    data() {
        return {
            couponsList: {},
            tempCoupon: {
                title: '',
                is_enabled: 0,
                percent: 100,
                code: '',
            },
            pages: {},
            isNew: false,
        };
    },
    methods: {
        //確認登入
        checkUser() {
            const token = document.cookie
                .split("; ").find((row) => row.startsWith("hexToken="))?.split("=")[1];

            axios.defaults.headers.common['Authorization'] = token;
            axios.post(`${VITE_API}/api/user/check`, null)
                .then(() => {
                    this.getCoupons();
                })
                .catch(err => {
                    console.dir(err);
                })
        },
        getCoupons(page = 1) {
            const api =`${VITE_API}/api/${VITE_PATH}/admin/coupons?page=${page}`;
            axios.get(api)
            .then(res => {
                this.couponsList = res.data.coupons;
                this.pages = res.data.pagination;
                // console.log(this.couponsList);
            })
            .catch(err => {
                console.dir(err);
            })
        },
        //彈跳視窗
        openModal(status, item) {
            if(status === 'new') {
                this.tempCoupon = {
                    due_date: new Date().getTime() / 1000,
                };
                this.isNew = true;
                this.$refs.changeModal.openModal();
            } else if (status === 'edit') {
                this.tempCoupon = { ...item };
                this.isNew = false;
                this.$refs.changeModal.openModal();
            } else if (status === 'delete') {
                this.tempCoupon = { ...item }; 
                this.isNew = false;
                this.$refs.delModal.openModal();
                // console.log(this.tempCoupon.title);
            } 
        },
        updateCoupon() {
            let api = `${VITE_API}/api/${VITE_PATH}/admin/coupon`;
            let method ='post';
            let name = this.tempCoupon.title;
            if(!this.isNew) {
                api = `${VITE_API}/api/${VITE_PATH}/admin/coupon/${this.tempCoupon.id}`;
                method = 'put';
            }
            axios[method](api, { data:this.tempCoupon })
            .then(res => {
                // console.log(res.data);
                if(!this.isNew) {
                    alert(`成功修改優惠券資料`);
                } else {
                    alert(`成功新增 ${name} 加入到優惠券列表`);
                }
                this.getCoupons();
                this.$refs.changeModal.closeModal();
            })
            .catch(err => {
                console.dir(err);
                alert('請正確填寫欄位資料');
            })
        },
        //存入已有資料
        changeTempCoupon (updateTempCoupon) {
            this.tempCoupon = updateTempCoupon;
            this.updateCoupon();
        },
        delCoupon() {
            const api = `${VITE_API}/api/${VITE_PATH}/admin/coupon/${this.tempCoupon.id}`; 
            axios.delete(api)
            .then(res => {
                // console.log(res);
                this.$refs.delModal.closeModal();
                this.getCoupons();
            })
            .catch(err => {
                alert('刪除優惠券失敗');
                console.dir(err);
            })
        }
    },
    created() {
        this.checkUser();
    },
    components: { 
        CouponModal,
        DelCouponModal,
        Pagination
    }
};
</script>
