<template>
  <div class="personalized">
    <div class="block myFM" key="myFM">
      <img
        id="test"
        class="logo"
        src="//7n.w3cschool.cn/statics/img/logo/indexlogo@2x.png"
      />
      <svg-icon name="tag" class="tag-icon"> </svg-icon>
      <h1 class="tag-title-line1">For</h1>
      <h1 class="tag-title-line2">You</h1>
      <a-avatar
        class="myFM-image"
        shape="square"
        :size="100"
        src="src/assets/logo.png"
      ></a-avatar>
      <div class="myFM-control">
        <span
          style="
            font-size: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          "
          >父亲写的散文诗</span
        >
        <br />
        <span style="font-size: 14px">许巍</span>
        <div style="margin-top: 10px">
          <svg-icon name="next" class="discolour" />
          <svg-icon name="love" class="discolour" style="margin-left: 10px" />
        </div>
      </div>
    </div>
    <div class="block daily" key="daily">daily</div>
    <div class="block new" key="new">new</div>
  </div>
</template>
  
<script lang="ts">
export default {
  mounted() {},
  methods: {},
};
</script>

<style scoped>
.personalized {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 660px;
  height: 150px;
}
.block {
  margin-right: 20px;
}
.myFM {
  align-self: center;
  flex: 2;
  background: rgba(221, 219, 218, 0.368);
  height: 100%;
  border-radius: 8px;
  position: relative;
}
.tag-icon {
  color: #1dcf9f;
  font-size: 150px;
  border-radius: 8px;
  position: absolute;
  z-index: 1;
}
.tag-title-line1 {
  position: absolute;
  left: 10px;
  top: -2px;
  color: #ffffff;
  font-size: 25pt;
  padding: 0;
  margin: 0;
  font-weight: bolde;
  z-index: 2;
}
.tag-title-line2 {
  position: absolute;
  left: 10px;
  top: 28px;
  color: #ffffff;
  font-size: 25pt;
  padding: 0;
  margin: 0;
  font-weight: bolde;
  z-index: 2;
}
.myFM-image {
  position: absolute;
  left: 30%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  background: aquamarine;
}
.myFM-control {
  position: absolute;
  left: 75%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
}
.daily {
  align-self: center;
  flex: 1;
  background: cornflowerblue;
  height: 100%;
}
.new {
  align-self: center;
  flex: 1;
  background: crimson;
  height: 100%;
}
.discolour {
  color: rgb(102, 102, 102);
}

.discolour:hover {
  color: #1dcf9f;
}
</style>