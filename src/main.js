import "./assets/scss/all.scss";
import "/node_modules/bootstrap/dist/js/bootstrap.min";

import { createApp } from "vue";
import { createPinia } from "pinia";

import * as bootstrap from "bootstrap";

import App from "./App.vue";
import router from "./router";

import axios from "axios";
import VueAxios from "vue-axios";
import Loading from 'vue-loading-overlay';

import {
    Field, Form, ErrorMessage, defineRule, configure,
} from 'vee-validate';

import * as AllRules  from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';

import { date, currency } from '../src/components/methods/filter';
/**
 * 這裡是將所有 vee-validate 的規則載入
 */
Object.keys(AllRules).forEach((rule) => {
    defineRule(rule, AllRules[rule]);
});
/**
 * 這裡是設定 vee-validate 的語系
 */
configure({
    generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文語系
    validateOnInput: true, // 當輸入任何內容直接進行驗證
});
// 設定預設語系
setLocale('zh_TW');

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueAxios, axios);
app.component('VueLoading', Loading);
app.config.globalProperties.$filters = {
    date,
    currency,
};
//VeeValidation
app.component('Form', Form);
app.component('Field', Field);
app.component('ErrorMessage', ErrorMessage);

app.mount("#app");