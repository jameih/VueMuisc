<template>
  <div id="app">
    <mheader @login = 'addUser'></mheader>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import Mheader from "./components/m-header/m-header";
import Tab from "./components/tab/tab";
import player from "./components/player/player";
import axios from "axios";
export default {
  name: "app",
  components: {
    Tab,
    Mheader,
    player
  },
  methods: {
    addUser() {
      var username = "wch";
      var password = "88798";
      this.$http
        .post("/api/user/addUser", {
          username,
          password
        })
        .then(response => {
          console.log(response);
        });
    }
  }
};
</script>

<style>

</style>
