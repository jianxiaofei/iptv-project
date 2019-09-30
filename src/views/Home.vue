<template>
  <div class="home">
      <!-- 左对齐 -->
      <van-row type="flex">
          <van-col span="6">span: 6</van-col>
          <van-col span="6">span: 6</van-col>
          <van-col span="6">span: 6</van-col>
      </van-row>

      <!-- 居中 -->
      <van-row type="flex" justify="center">
          <van-col span="6">span: 6</van-col>
          <van-col span="6">span: 6</van-col>
          <van-col span="6">span: 6</van-col>
      </van-row>

      <!-- 右对齐 -->
      <van-row type="flex" justify="end">
          <van-col span="6">span: 6</van-col>
          <van-col span="6">span: 6</van-col>
          <van-col span="6">span: 6</van-col>
      </van-row>

      <!-- 两端对齐 -->
      <van-row type="flex" justify="space-between">
          <van-col span="6">span: 6</van-col>
          <van-col span="6">span: 6</van-col>
          <van-col span="6">span: 6</van-col>
      </van-row>

      <!-- 每个元素的两侧间隔相等 -->
      <van-row type="flex" justify="space-around">
          <van-col span="6">span: 6</van-col>
          <van-col span="6">span: 6</van-col>
          <van-col span="6">span: 6</van-col>
      </van-row>
      <van-swipe :autoplay="3000" indicator-color="white">
          <van-swipe-item>1</van-swipe-item>
          <van-swipe-item>2</van-swipe-item>
          <van-swipe-item>3</van-swipe-item>
          <van-swipe-item>4</van-swipe-item>
      </van-swipe>
      <van-dropdown-menu>
          <van-dropdown-item v-model="value1" :options="option1" />
          <van-dropdown-item v-model="value2" :options="option2" />
      </van-dropdown-menu>
      <van-steps direction="vertical" :active="0">
          <van-step>
              <h3>【城市】物流状态1</h3>
              <p>2016-07-12 12:40</p>
          </van-step>
          <van-step>
              <h3>【城市】物流状态2</h3>
              <p>2016-07-11 10:00</p>
          </van-step>
          <van-step>
              <h3>快件已发货</h3>
              <p>2016-07-10 09:30</p>
          </van-step>
      </van-steps>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 1,
      value1: 0,
      value2: 'a',
      option1: [
        { text: '全部商品', value: 0 },
        { text: '新款商品', value: 1 },
        { text: '活动商品', value: 2 }
      ],
      option2: [
        { text: '默认排序', value: 'a' },
        { text: '好评排序', value: 'b' },
        { text: '销量排序', value: 'c' }
      ],
      images: [
        'https://img.yzcdn.cn/vant/apple-1.jpg',
        'https://img.yzcdn.cn/vant/apple-2.jpg'
      ]
    }
  }
}
</script>
