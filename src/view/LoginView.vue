<template>
    <div class="container">
        <VueLoading :active="isLoading" :z-index="1060" />
        <div class="row d-flex justify-content-center align-items-center vh-100">
            <div class="col-8">
                <h1 class="h3 mb-3 font-weight-normal text-center mb-4">會員登入</h1>
                <form id="form" class="form-signin" @submit.prevent="userLogin">
                    <div class="form-floating mb-3">
                        <input type="email" class="form-control" id="username"
                            placeholder="name@example.com" v-model="user.username" required autofocus>
                        <label for="username">Email address</label>
                    </div>
                    <div class="form-floating">
                        <input type="password" class="form-control" id="password"
                            placeholder="Password" v-model="user.password" required>
                        <label for="password">Password</label>
                    </div>
                    <button class="btn btn-lg btn-primary w-100 mt-3 text-white" type="submit">登入</button>
                </form>
                <p class="mt-5 h4 text-center">&copy; 2023~∞ - 六角學院VueWeek2</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { mapActions } from 'pinia';
import { useToastMessageStore } from "../store/toastMessage";
import ToastMessages from '../components/ToastMessages.vue';

const { VITE_API } = import.meta.env

export default {
    data() {
        return {
            isLoading: false,
            user: {
                username: '',
                password: '',
            }
        };
    },
    ...mapActions(useToastMessageStore, ['pushMessage']),
    methods: {
        userLogin() {
            this.isLoading = true;
            axios.post(`${VITE_API}/admin/signin`, this.user)
                .then(res => {
                    const { token, expired } = res.data;
                    document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
                    this.$router.push('admin/products');
                    this.isLoading = false;
                    alert('恭喜!成功登入');
                    this.$router.push('/admin/products')
                })
                .catch(err => {
                    this.pushMessage({
                        style: 'danger',
                        title: '登入失敗',
                        content: error.response.data.message,
                    })
                    console.dir(err.response.data);
                })
        }
    },
    components: {
        ToastMessages,
    },
}
</script>