<script setup>
// 공통 모달 컴포넌트
// Teleport를 사용해 모달을 body 바로 아래에 렌더링합니다.
// show prop이 true일 때 모달이 열립니다.
// 배경(오버레이)을 클릭하면 'close' 이벤트를 발생시킵니다.
//
// size 옵션:
//   'md' - 기본 크기 (최대 너비 420px)
//   'sm' - 작은 크기 (최대 너비 380px)

defineProps({
  show: { type: Boolean, default: false },
  size: { type: String,  default: 'md' },
})

defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="modal-overlay"
      @click.self="$emit('close')"
    >
      <div :class="['modal-box', { 'modal-box--sm': size === 'sm' }]">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* 글로벌 스타일(style.css)에 .modal-overlay, .modal-box 정의되어 있습니다. */
/* 이 컴포넌트 고유의 추가 스타일이 필요하다면 여기에 작성하세요. */
</style>
