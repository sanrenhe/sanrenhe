<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Inject } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue';

@Component({
	components: {
		HelloWorld,
	},
})
export default class Index extends Vue {

}
</script>