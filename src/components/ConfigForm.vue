<template>
  <div class="config-form">
    <!-- 主选项泡泡 -->
    <div v-if="showCategory">
      <h2 style="color: #e0f7fa">根据以下选项挑选你的汽车配件</h2>
      <div class="bubble-container">
        <div
          class="bubble"
          v-for="cate in categories"
          :key="cate"
          @click="openOptions(cate)"
        >
          <p>
            {{ cate.name }}<br />
            <span class="selected-value">{{
              selectedConfig[cate.name] || "未选择"
            }}</span>
          </p>
        </div>
      </div>
      <div class="action-container">
        <div class="bubble submit-bubble" @click="handleSubmit">
          <p>生成图片</p>
        </div>
      </div>
    </div>

    <!-- 子选项泡泡 -->
    <div v-else-if="showCategoryOptions">
      <h2 style="color: #e0f7fa">选择 {{ selectedCategoryName }}</h2>
      <div class="bubble-container">
        <div
          class="bubble"
          v-for="option in currentOptions"
          :key="option"
          @click="selectOption(option)"
        >
          <p>{{ option }}</p>
        </div>
      </div>
      <!-- 返回按钮 -->
      <div class="action-container">
        <div class="bubble back-bubble" @click="closeOptions">
          <p>返回</p>
        </div>
      </div>
    </div>

    <!-- 三级选项泡泡 -->
    <div v-else-if="showSubCategoryOptions">
      <h2 style="color: #e0f7fa">选择 {{ selectedOptionName }}</h2>
      <div class="bubble-container">
        <div
          class="bubble"
          v-for="subOption in currentSubCategory"
          :key="subOption"
          @click="selectSubOption(subOption)"
        >
          <p>{{ subOption }}</p>
        </div>
      </div>
      <!-- 返回按钮 -->
      <div class="action-container">
        <div class="bubble back-bubble" @click="closeSubCategory">
          <p>返回</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from "vue";
import { categories } from "@/configs/CategoryOptions";

const emit = defineEmits(["submit"]);
const selectedConfig = ref({
  整体风格: "豪华",
  车窗: "单门",
  车身造型: "经典轿车",
  车身颜色: "纯色/经典黑",
  装饰条: "镀铬",
  轮毂尺寸: "18寸",
  轮毂设计: "五辐设计",
  轮毂颜色: "红色",
  侧裙: "小尺寸侧裙",
  前唇: "小尺寸前唇",
  尾翼: "小尺寸尾翼",
  车顶选项: "科技透明",
  前脸及格栅: "大面积前格栅",
});

const showCategory = ref(true);
const showCategoryOptions = ref(false);
const showSubCategoryOptions = ref(false);

const currentCategory = ref(null); // 当前正在配置的字段
const currentOptions = ref(null); // 当前字段的选项
const currentSubCategory = ref(null); // 当前正在配置的子字段

const selectedCategoryName = ref(null);
const selectedOptionName = ref(null);

const openOptions = (cate: any) => {
  showCategory.value = false;
  showCategoryOptions.value = true; // 进入子选项模式
  currentCategory.value = cate;
  currentOptions.value = cate.keywords;
  selectedCategoryName.value = cate.name;
};

const closeOptions = () => {
  showCategory.value = true;
  showCategoryOptions.value = false;
  showCategoryOptions.value = false;
  currentCategory.value = null;
};

const selectOption = (option: any) => {
  selectedOptionName.value = option;
  selectedConfig.value[currentCategory.value.name] = option;
  // 如果当前选项有子选项，则进入子选项选择模式
  if (currentCategory.value.subcategories != null) {
    // 过滤出当前选项的子选项
    console.log(currentCategory.value.subcategories);
    currentCategory.value.subcategories.forEach((subCate: any) => {
      if (subCate.name === option) {
        currentSubCategory.value = subCate.subcategories;
      }
    });
    showCategoryOptions.value = false;
    showSubCategoryOptions.value = true;
  } else {
    showCategory.value = true;
  }
};

const closeSubCategory = () => {
  showSubCategoryOptions.value = false;
  showCategoryOptions.value = true;
  currentSubCategory.value = null;
};

const selectSubOption = (subOption: any) => {
  if (currentCategory.value.pathSave != null) {
    selectedConfig.value[currentCategory.value.name] =
      selectedConfig.value[currentCategory.value.name] + "/" + subOption;
  } else {
    selectedConfig.value[currentCategory.value.name] = subOption;
  }
  showSubCategoryOptions.value = false;
  showCategory.value = true;
  currentSubCategory.value = null;
};

const handleSubmit = () => {
  console.log(selectedConfig.value);
  emit("submit", selectedConfig.value);
};
</script>

<style scoped>
.config-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.bubble-container {
  max-width: 40vw;
  min-width: 40vw;
  min-height: 30vh;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-bottom: 20px;
}

.action-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  /* 调整提交和返回泡泡之间的间距 */
  margin-top: 20px;
  /* 与其他泡泡分隔 */
}

.bubble {
  background: linear-gradient(135deg, #f0f8ff, #e0f7fa);
  border: 2px solid #87ceeb;
  border-radius: 15px;
  /* 圆角矩形样式 */
  padding: 15px 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s, background 0.3s;
  min-width: 120px;
  /* 控制宽度 */
  max-width: 150px;
  min-height: 50px;
  max-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bubble:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #e0f7fa, #add8e6);
}

.submit-bubble {
  background: linear-gradient(135deg, #add8e6, #87ceeb);
  color: white;
  font-weight: bold;
}

.back-bubble {
  background: #ffcccb;
  color: white;
  font-weight: bold;
}

.selected-value {
  font-style: italic;
  color: #555;
}
</style>
