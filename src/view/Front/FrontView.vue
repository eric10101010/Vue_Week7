<template>
    <nav class="bg-primary d-flex justify-content-between align-items-center py-3">
        <ul class="header d-flex list-unstyled mt-3">
            <li class="mx-3 headerItem">
                <routerLink to="/" class="text-white text-decoration-none h3">首頁</routerLink>
            </li>
            <li class="me-3 headerItem">
                <routerLink to="/about" class="text-white text-decoration-none h3">關於我們</routerLink> 
            </li>
            <li class="me-3 headerItem">
                <routerLink to="/products" class="text-white text-decoration-none h3">產品列表</routerLink> 
            </li>
        </ul>
        <ul class="me-3 list-unstyled mt-3 d-flex">
            <li class="headerItem me-4">
                <routerLink to="/login" class="text-white text-decoration-none h3">登入頁</routerLink>
            </li>
        </ul>
    </nav>
    <RouterView></RouterView>
</template>
