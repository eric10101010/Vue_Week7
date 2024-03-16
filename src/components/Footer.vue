<template>
  <div class="footer bg-primary py-5">
    <div class="container">
      <ul class="footer footer-expend-lg d-flex justify-content-evenly pb-7 mb-5 border-bottom ">
        <li>
          <h4 class="text-light mb-5 ps-3 h5">
            公司資訊
          </h4>
          <ul class="ps-3">
            <li class="mb-4">
              <a class="text-light text-decoration-none" href="/about">關於我們</a></li>
            <li class="mb-4">
              <router-link to="/about" class="text-light text-decoration-none">
                商品選購
              </router-link>
            </li>
            <li class="mb-4">
              <router-link to="/contact" class="text-light text-decoration-none">
                門市資訊
              </router-link>
            </li>
          </ul>
        </li>

        <li>
          <h4 class="text-light mb-5 ps-3 h5">
            服務範圍
          </h4>
          <ul class="ps-3">
            <li class="mb-4">
              <router-link to="/contact" class="text-light text-decoration-none">
                維修保固
              </router-link>
            </li>
            <li class="mb-4">
              <router-link to="/contact" class="text-light text-decoration-none">
                客服諮詢
              </router-link>
            </li>
             <li class="mb-4">
              <router-link to="/contact" class="text-light text-decoration-none">
                軟體支援
              </router-link>
            </li>
          </ul>
        </li>

        <li>
          <h4 class="text-light mb-5 ps-3 h5">
            後台管理
          </h4>
          <ul class="ps-3">
            <li class="mb-2">
              <router-link v-if="checkSuccess" to="/admin/product">
                管理後台
              </router-link>
              <router-link class="text-light text-decoration-none" v-else to="/login">
                登入後台
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
      <div class="d-flex flex-column align-items-center justify-content-center px-3">
        <p class="text-light">© 2021 Whalebeat</p>
        <p class="text-light">僅供個人學習使用 無商業用途</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.footer {
padding: 50px 0;
}
</style>
