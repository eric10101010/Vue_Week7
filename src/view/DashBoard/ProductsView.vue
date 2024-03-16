<template>
    <VueLoading :active="isLoading" :z-index="1060" />
    <div class="container">
        <div class="row d-flex justify-content-center">
            <div class="col-10 gx-0">
                <div class="d-flex justify-content-between align-items-center mt-5">
                    <h2 class="h3">商品列表管理</h2>
                    <button class="btn btn-primary text-white" @click="openModal('new')">建立新產品</button>
                </div>  
                <table class="table table-hover mt-4 border">
                <thead>
                    <tr>
                        <th class="col-2 bg-secondary text-white text-center">產品縮圖</th>
                        <th class="col-2 bg-secondary text-white text-center">產品名稱</th>
                        <th class="col-1 bg-secondary text-white text-center">原價</th>
                        <th class="col-1 bg-secondary text-white text-center">售價</th>
                        <th class="col-2 bg-secondary text-white text-center">是否啟用</th>
                        <th class="col-2 bg-secondary text-white text-center">編輯產品</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in productsList" :key="item.id">
                        <td class="text-center border">
                            <img :src="`${item.imageUrl}`" alt="productPhot" class="w-50 object-fit-cover" style="max-height:50px;">
                        </td>
                        <td class="text-center">{{ item.title }}</td>
                        <td class="text-center">{{ item.origin_price }}</td>
                        <td class="text-center">{{ item.price }}</td>
                        <td class="text-center">
                            <span v-if="item.is_enabled" class="text-success" >啟用</span>
                            <span v-else class="text-danger">未啟用</span>
                        </td>
                        <td class="text-center">
                            <button type="button" class="btn btn-outline-primary btn-sm"
                                    @click="openModal('edit', item)">編輯
                            </button>
                            <button type="button" class="btn btn-outline-danger btn-sm" 
                                @click="openModal('delete', item)">刪除
                            </button>
                        </td>
                    </tr>
                </tbody>
                </table>
                <p>目前有 <span class="text-success">{{ productsList.length }}</span> 項產品</p>
                <Pagination :pages="pages" @emit-pages="getProducts"></Pagination>
            </div>
        </div>
    </div>
    <ProductModal :tempProduct="tempProduct" :isNew="isNew" @update-temp-product="changeTempProduct" ref="changeModal"></ProductModal>
    <DelProductModal :del-product="delProduct" :tempProduct="tempProduct" ref="delModal"></DelProductModal>
</template>
<script>

import { mapActions } from 'pinia';
import { useToastMessageStore } from "../../store/toastMessage";
import axios from 'axios'
import ProductModal from '../../components/ProductModal.vue';
import DelProductModal from '../../components/DelProductModal.vue';
import Pagination from '../../components/pagination.vue';


const { VITE_API, VITE_PATH } = import.meta.env

export default {
    data() {
        return {
            productsList: [],
            tempProduct: {
                imagesUrl: [],
                imageUrl:'',
            },
            pages: {},
            isNew: false,
            isLoading: false,
        }
    },
    methods: {
        ...mapActions(useToastMessageStore, ['pushMessage']),
        //確認登入
        checkUser() {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("hexToken="))
                ?.split("=")[1];
            axios.defaults.headers.common['Authorization'] = token;
            
            axios.post(`${VITE_API}/api/user/check`, null)
                .then(() => {
                    this.getProducts();
                })
                .catch(err => {
                    console.dir(err);
                })
        },
        //取得產品列表
        getProducts(page = 1) {
            const api =`${VITE_API}/api/${VITE_PATH}/admin/products?page=${page}`;
            axios.get(api)
            .then(res => {
                this.currentPage = page;
                this.productsList = res.data.products;
                this.pages = res.data.pagination;
                // console.log(res.data);
                //console.log(this.pages);
                this.isLoading = false;
                this.pushMessage({
                    style: 'success',
                    title: '成功取得產品資訊',
                    content: res.data.message,
                });
            })
            .catch(err => {
                this.isLoading = false;
                this.pushMessage({
                    style: 'danger',
                    title: '取得產品資訊失敗',
                    content: err.response.data.message,
                });
            })
        },
        //彈跳視窗
        openModal(status, item) {
            if(status === 'new') {
                this.tempProduct = {
                    imagesUrl: [],
                }
                this.isNew = true;
                this.$refs.changeModal.openModal();
            } else if (status === 'edit') {
                this.tempProduct = { ...item }; //顯示已有產品資訊
                if(!Array.isArray(this.tempProduct.imagesUrl)) {
                    this.tempProduct.imagesUrl = [];
                }
                this.isNew = false;
                this.$refs.changeModal.openModal();
            } else if (status === 'delete') {
                this.tempProduct = { ...item }; 
                this.isNew = false;
                this.$refs.delModal.openModal();
                console.log(this.tempProduct.title);
            } 
        },
        //更新產品
        updateProduct() {
            let api = `${VITE_API}/api/${VITE_PATH}/admin/product`; // 新增
            let method ='post'; //方便切換的方法，此為新增
            let name = this.tempProduct.title;
            this.isLoading = true;
            if(!this.isNew) {
                api = `${VITE_API}/api/${VITE_PATH}/admin/product/${this.tempProduct.id}`;
                method = 'put';
            } else {
                alert(`成功新增 ${name} 加入到產品列表`);
            }
            axios[method](api, { data:this.tempProduct })
            .then(res => {
                // console.log(res.data);
                this.getProducts();
                this.$refs.changeModal.closeModal();
                this.isLoading = false;
                this.pushMessage({
                    style: 'success',
                    title: '更新商品',
                    content: res.data.data,
                })
            })
            .catch(err => {
                console.dir(err);
                alert('請正確填寫欄位資料');
            })
        },
        //存入已有資料
        changeTempProduct (updateTempProduct) {
            this.tempProduct = updateTempProduct;
            this.updateProduct();
        },
        //刪除產品
        delProduct() {
            const api = `${VITE_API}/api/${VITE_PATH}/admin/product/${this.tempProduct.id}`; 
            axios.delete(api)
            .then(res => {
                // console.log(res);
                this.$refs.delModal.closeModal();
                this.getProducts();
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
        ProductModal,
        DelProductModal,
        Pagination
    }
}
</script>



