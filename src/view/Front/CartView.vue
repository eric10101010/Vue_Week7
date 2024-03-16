<template>
    <h2 class="text-danger">購物車列表</h2>
    <div class="my-5 row justify-content-center">
            <Form ref="form" class="col-md-6" v-slot="{ errors }" @submit="createOrder" >
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <Field id="email" name="email" type="email" class="form-control" :class="{ 'is-invalid': errors['email'] }"
                            placeholder="請輸入Email" rules="email|required" v-model="form.user.email">
                    </Field>
                    <Error-message name="email" class="invalid-feedback"></Error-message>
                </div>
                <div class="mb-3">
                    <label for="name" class="form-label">收件人姓名</label>
                    <Field id="name" name="姓名" type="text" class="form-control" :class="{ 'is-invalid': errors['姓名'] }"
                            placeholder="請輸入姓名" rules="required" v-model="form.user.name"></Field>
                    <Error-message name="姓名" class="invalid-feedback"></Error-message>
                </div>
                <div class="mb-3">
                    <label for="tel" class="form-label">收件人電話</label>
                    <Field id="tel" name="電話" type="tel" class="form-control" :class="{ 'is-invalid': errors['電話'] }"
                            placeholder="請輸入電話" rules="required|min:8|max:10"  v-model="form.user.tel"></Field>
                    <Error-message name="電話" class="invalid-feedback"></Error-message>
                </div>
                <div class="mb-3">
                    <label for="address" class="form-label">收件人地址</label>
                    <Field id="address" name="地址" type="text" class="form-control" :class="{ 'is-invalid': errors['地址'] }"
                            placeholder="請輸入地址" rules="required" v-model="form.user.address"></Field>
                    <Error-message name="地址" class="invalid-feedback"></Error-message>
                </div>
                <div class="mb-3">
                    <label for="message" class="form-label">留言</label>
                    <textarea id="message" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
                </div>
                <div class="text-end">
                    <button type="submit" class="btn btn-danger">
                        送出訂單
                    </button>
                </div>
            </Form>
        </div>
</template> 

<script>

import axios from 'axios';
import ProductModal from '../../components/ProductModal.vue';
const { VITE_API, VITE_PATH } = import.meta.env


export default {
    data() {
        return {
            products: [],
            tempProduct: {},
            carts: {},
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },
            status: {
                addCartLoading: '',
                cartQtyLoading: ''
            }
        }
    },
    methods: {
        getProducts() {
            const api =`${VITE_API}/api/${VITE_PATH}/products/all`;
                axios.get(api)
                    .then(res => {
                        this.products = res.data.products;
                        // console.log(res.data);
                    })
                    .catch(err => {
                        console.log(err.response.data);
                    })
        },
        openModal(product) {
            this.tempProduct = product;
            console.log(product);
            this.$refs.ProductModal.openModal();
        },
        addCart(product_id, qty = 1) {
            const order = {
                product_id,
                qty,
            };
            this.status.addCartLoading = product_id;
            const api =`${VITE_API}/api/${VITE_PATH}/cart`;
                axios.post(api, {data: order})
                    .then(res => {
                        // console.log(res.data);
                        this.status.addCartLoading = '';
                        this.getCart();
                        this.$refs.ProductModal.hideModal();
                    })
                    .catch(err => {
                        console.log(err.response.data);
                    });
        },
        getCart() {
            const api =`${VITE_API}/api/${VITE_PATH}/cart`;
                axios.get(api)
                    .then(res => {
                        this.carts = res.data.data;
                        // console.log(this.carts.carts);
                    })
                    .catch(err => {
                        console.log(err.response.data);
                    });
        },
        editCart(item, qty = 1) {
            const order = {
                product_id: item.product.id,
                qty,
            };
            this.status.cartQtyLoading = item.id;
            const api =`${VITE_API}/api/${VITE_PATH}/cart/${item.id}`;
                axios.put(api, {data: order})
                    .then(res => {
                        // console.log(res);
                        this.status.cartQtyLoading = '';
                        this.getCart();
                    })
                    .catch(err => {
                        console.log(err.response.data);
                    });
        },
        delCartItem(id) {
            this.status.cartQtyLoading = id;
            const api =`${VITE_API}/api/${VITE_PATH}/cart/${id}`;
                axios.delete(api)
                    .then(res => {
                        console.log(res);
                        this.status.cartQtyLoading = '';
                        this.getCart();
                    })
                    .catch(err => {
                        console.log(err.response.data);
                    });
        },
        delCartAll() {
            const api =`${VITE_API}/api/${VITE_PATH}/carts`;
                axios.delete(api)
                    .then(res => {
                        // console.log(res);
                        this.getCart();
                    })
                    .catch(err => {
                        console.log(err.response.data);
                    });
        },
        createOrder() {
            // this.isLoading = true;
            const api =`${VITE_API}/api/${VITE_PATH}/order`;
            const order = this.form;
                axios.post(api, { data: order }).then((res) => {
                    // this.$router.push(`/user/checkout/${response.data.orderId}`);
                    this.$refs.form.resetForm(res.data);
                    this.getCart();
                    // this.isLoading = false;
            }).catch((err) => {
                console.dir(err);
            });
    },
    },
    components: {
        ProductModal,
    },
    mounted() {
        this.getProducts();
        this.getCart();
    }
}
</script>