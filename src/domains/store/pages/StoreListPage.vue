<script setup>
import { useRouter } from 'vue-router';
import StoreCard from '../components/StoreCard.vue';
import axios from 'axios';
import { onBeforeMount } from 'vue';
import { useChecklistStore } from '../../checklist/stores/useChecklistStore.js';
import { useStoreListStore } from '../stores/useStoreListStore.js';

const checklistStore = useChecklistStore();
const router = useRouter();
const storeListStore = useStoreListStore();

// 화면 로드 시, 필터링된 업체 목록 받아오기 
onBeforeMount(() => {
  storeListStore.getMatchingStores(checklistStore.filterParams);
});

</script>

<template>
  <hr style="margin-top: 50px;">

  <div class="main">

    <!-- 페이지 제목 + 필터링한 조건 -->
    <div class="page-header">
      <h1>맞춤 트럭 목록</h1>
      <p style="margin: 30px;">스토어필터칩</p>
    </div>

    <!-- 결과 없음 -->
    <div v-if="false" class="empty-state">
      <div class="empty-state-title">조건에 맞는 트럭이 없어요</div>
      <div class="empty-state-desc">조건을 변경해보세요.</div>
      <button
        @click="router.push('/checklist')"
      >
        조건 다시 입력
      </button>
    </div>

    <!-- 업체 목록 카드 출력 -->
     <!-- TODO: store.값 변경 -->
    <div v-else class="store-card-list">
      <StoreCard
        v-for="store in storeListStore.filterStores"
        :key="store.storeId"
        :store="store"
        @select="selectStore"
      />
       <!-- <p style="margin: 30px;">목록 컴포넌트</p> -->
    </div>

    <!-- 업체 목록 페이지네이션 -->
    <div class="pagination">
      <button 
        type="button"
        :disabled="storeListStore.currentPage === 1"
        @click="storeListStore.changePage(storeListStore.currentPage - 1, checklistStore.filterParams)"
      >
        이전
      </button>

      <!-- active: currentPage === page : 지금 몇 페이지를 보고 있는지 버튼에 색깔 -->
      <button 
        v-for="page in storeListStore.pageRange"
        :key="page"
        type="button"
        :class="{active: storeListStore.currentPage === page}"  
        @click="storeListStore.changePage(page, checklistStore.filterParams)"
      >
        {{ page }}
      </button>
      
      <button 
        type="button"
        :disabled="storeListStore.currentPage === storeListStore.totalPages" 
        @click="storeListStore.changePage(currentPage + 1, checklistStore.filterParams)"
      >
        다음
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>