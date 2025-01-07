<template>
  <!-- 一个图片按钮，在图片中居中偏上-->
  <!--  图片缩放-->
  <div class="image-button" @click="handleStart">
    <img src="@/assets/start.png" alt="汽车" />
  </div>

  <div v-if="showConfig" class="config-alter">
    <button class="close-button" @click="handleClose">X</button>
    <ConfigForm @submit="handleSubmit" class="config-form-container" />
  </div>

  <div v-if="showGeneratedImage" class="album-container">
    <button
      class="close-button"
      @click="handleCloseImage"
      style="background-color: #c0c0c0"
    >
      x
    </button>

    <div class="image-container">
      <div
        v-if="imageUrl === null"
        style="
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        "
      >
        <p>图片生成中...</p>
      </div>
      <img v-else-if="imageUrl" :src="imageUrl" alt="生成的图片" />
    </div>
    <div class="watermark">
      <div class="date-text">{{ currentDate }}</div>
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="logo" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import ConfigForm from "@/components/ConfigForm.vue";
import { OpenAI_API_KEY } from "@/configs/Key";

const showConfig = ref(false);
const showGeneratedImage = ref(false);
const currentDate = new Date().toLocaleDateString();

const imageUrl = ref<string | null>(null);
const loading = ref(true);

const handleStart = () => {
  showConfig.value = true;
};

const handleClose = () => {
  showConfig.value = false;
};

const handleCloseImage = () => {
  showGeneratedImage.value = false;
};

const handleSubmit = async (config: any) => {
  console.log(loading.value);
  showConfig.value = false;
  showGeneratedImage.value = true;

  imageUrl.value = null;

  const prompt = `请你展开想象为我设计一个概念车，并生成16:9的图片（图片要求以45°镜头完整呈现汽车外观，背景为末日废土风格），\
  具体车辆造型描述如下，可以适当展开想象发挥：\
  这辆车的整体风格为${config["整体风格"]},\
  是一辆${config["车窗"]} ${config["车身造型"]}，\
  车身主体采用${config["车身颜色"].split("/")[0]}\
  工艺，具体的颜色是${config["车身颜色"].split("/")[1]}，\
  它的车窗、门槛、前后保险杠上有${config["车窗"]}的装饰条，\
  它的轮毂是${config["轮毂尺寸"]}，轮辐设计师${config["轮毂设计"]}，\
  颜色为${config["轮毂颜色"]}，它的侧裙设计为${config["侧裙"]}；\
  前唇设计为${config["前唇"]}；尾翼设计为${config["尾翼"]}；\
  车顶装饰为${config["车顶选项"]}；前脸及格栅的造型为${config["前脸及格栅"]}。`;
  console.log(prompt);

  try {
    // 调用 OpenAI 的 DALL·E API
    const response = await axios.post(
      "/api/v1/images/generations",
      {
        prompt: prompt,
        n: 1,
        size: "1792x1024", // 图片分辨率
        // size: "512x512", // 图片分辨率
        model: "dall-e-3",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OpenAI_API_KEY}`,
        },
      }
    );
    imageUrl.value = response.data.data[0].url; // 获取生成的图片 URL
  } catch (error) {
    console.error("生成图片失败：", error);
    alert("生成图片失败，请稍后重试！");
  } finally {
    loading.value = false;
  }
};
</script>
<style scoped>
.image-button {
  position: absolute;
  top: 32%;
  left: 51%;
  transform: translate(-50%, -50%);
}

.image-button img {
  width: 13vw;
}

.config-alter {
  height: 90vh;
  width: 90vw;
  border-radius: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  border-radius: 20px;
  padding: 5px 10px;
  cursor: pointer;
}

.config-form-container {
  margin-top: 10%;
}

.album-container {
  min-width: 60vw;
  max-width: 80vw;
  min-height: 50vh;
  max-height: 100vh;
  padding: 30px;
  background-color: #edece4;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  display: flex;
  align-items: center;
}

.image-container {
  width: 90%;
  height: 100%;
}

.image-button div {
  width: 100%;
  height: 100%;
}

.image-container img {
  width: 100%;
}

.watermark {
  width: 8%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 20px;
}

.date-text {
  text-align: center;
  transform: rotate(180deg);
  writing-mode: vertical-lr;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20vh;
}

.logo-container img {
  height: 180px;
}
</style>
