import { defineStore } from "pinia";
import { computed, ref } from "vue";

const useStoreListStore = defineStore("storeListStore", () => {

  // 1. state
  const filterStores = ref([]);
  const isLastPage = ref(false);
  const totalItems = ref(0);
  const currentPage = ref(1);

  // TODO: 리미트 값 변경?
  const limit = 10;

  // 2. getter
  // totalPages: 총 페이지 수
  const totalPages = computed(() => {
    return Math.ceil(totalItems.value / limit);
  });

  // 3. actions
  // "업체 목록"에 들어갈 업체리스트

  // TODO:params에 체크리스트스토어의 filterParam랑 이 스토어의 page&limit도 넣어줘야 함
  const getMatchingStores = async (filterParams) => {

    if(!isLastPage.value) {
      try {
        const url = '/api/stores';
        const params = filterParams;

        const res = await axios.get(url, {params});
        const data = res.data;
  
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }

})