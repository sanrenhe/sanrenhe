<template>
    <div class="home">
        <img
            alt="Vue logo"
            src="../assets/logo.png"
        >
        <HelloWorld msg="Welcome to Your Vue.js App" />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Inject } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue';
import $ from 'jquery'

@Component({
    components: {
        HelloWorld,
    },
})
export default class Index extends Vue {
    created() {
        $.getJSON('https://raw.githubusercontent.com/sanrenhe/sanrenhe/master/data.json', function (result1) {
            console.log(result1);
        });
    }
}
</script>