<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ChangePasswordValidator from '../util/ChangePasswordValidator'

const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref('')

const formData = reactive({ currentPassword: '', newPassword: '', newPasswordConfirm: '' })

const handleChange = async () => {
  const isPasswordValid = ChangePasswordValidator.password(formData.newPassword);
  const isPasswordChkValid = passwordChk(formData.newPassword, formData.newPasswordConfirm);
  
  if (isPasswordValid || isPasswordChkValid) {
    errorMessage.value = isPasswordValid || isPasswordChkValid
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''
    
    await changePasswordApi({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    })
    
    alert('비밀번호가 성공적으로 변경되었습니다. 🔒')
    router.replace('/users/info')
  } catch (error) {
    if (error.response?.data?.code === 'E34') {
      errorMessage.value = '현재 비밀번호가 일치하지 않습니다.'
    } else {
      errorMessage.value = '비밀번호 변경 중 오류가 발생했습니다.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="edit-container">
    <h2 class="page-title">비밀번호 변경</h2>

    <form @submit.prevent="handleChange" class="edit-card">
      <div class="input-group">
        <label>현재 비밀번호</label>
        <input type="password" v-model="formData.currentPassword" placeholder="현재 비밀번호 입력" required />
      </div>

      <div class="input-group" style="margin-top: 24px;">
        <label>새 비밀번호</label>
        <input type="password" v-model="formData.newPassword" placeholder="영문, 숫자, 특수문자 6~20자" required />
      </div>

      <div class="input-group">
        <label>새 비밀번호 확인</label>
        <input type="password" v-model="formData.newPasswordConfirm" placeholder="새 비밀번호 재입력" required />
      </div>

      <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

      <div class="button-group">
        <button type="button" class="btn-cancel" @click="router.back()">취소</button>
        <button type="submit" class="btn-submit" :disabled="isLoading">변경하기</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* 이전 정보 수정(MyPageEdit) 컴포넌트와 동일한 스타일 적용 (생략됨) */
.edit-container { max-width: 480px; margin: 60px auto; padding: 0 20px; }
.page-title { font-size: 28px; font-weight: 800; color: #2B2119; margin-bottom: 24px; }
.edit-card { background: #FFFFFF; border-radius: 20px; padding: 32px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04); }
.input-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.input-group label { font-size: 13px; color: #9CA3AF; font-weight: 600; }
.input-group input { font-size: 16px; padding: 14px 16px; font-weight: 600; color: #374151; background: #F9FAFB; border: none; border-radius: 12px; outline: none; transition: background 0.2s; box-sizing: border-box;}
.input-group input:focus { background: #F3F4F6; }
.error-msg { font-size: 13px; color: #D5402A; text-align: center; margin-top: 16px; }
.button-group { display: flex; gap: 12px; margin-top: 32px; }
button { flex: 1; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 700; border: none; cursor: pointer; }
.btn-cancel { background-color: #F3F4F6; color: #6B7280; }
.btn-submit { background-color: #E0902A; color: white; }
</style>