<script setup>
import { reactive } from 'vue';
import ButtonComp from '../../components/buttons/ButtonComp.vue';
import InputBasicComp from '../../components/inputs/InputBasicComp.vue';
import registrationValidator from '../../validators/auth/registrationValidator.js';

const registrationData = reactive({
  email: ''
  , password: ''
  , passwordChk: ''
  , userName: ''
  , phone: ''
});

const handleSubmit = () => {
  // 유효성 검사
  const validationList = [
    registrationValidator.email(registrationData.email)
    , registrationValidator.password(registrationData.password)
    , registrationValidator.passwordChk(registrationData.password, registrationData.passwordChk)
    , registrationValidator.userName(registrationData.userName)
    , registrationValidator.phone(registrationData.phone)
  ];

  const errorList = validationList.filter(val => val);

  if(errorList.length > 0) {
    alert(errorList.join('\n'));
    return;
  }
}
</script>

<template>
  <div class="form-container">
    <h1><span>일반</span> 회원</h1>
    <form @submit.prevent="handleSubmit">
      <p>*필수 항목입니다.</p>
      <div class="input-container">
        <label for="email">이메일</label>
        <div class="email-wrap">
          <InputBasicComp
            id="email"
            :type="'email'"
            :placeholder="'이메일을 입력해주세요.'"
            :readonly="false"
            :required="true"
            :borderColor="'orange'"
            style="flex: 1;"
            v-model="registrationData.email"
          ></InputBasicComp>
          <ButtonComp
            :content="'중복 확인'"
            :color="'orange'"
            style="padding: 10px 15px;"
          ></ButtonComp>
        </div>
      </div>

      <div class="input-container">
        <label for="password">비밀번호</label>
        <InputBasicComp
          id="password"
          :type="'password'"
          :placeholder="'비밀번호를 입력해주세요.'"
          :readonly="false"
          :required="true"
          :borderColor="'orange'"
          v-model="registrationData.password"
        ></InputBasicComp>
      </div>

      <div class="input-container">
        <label for="passwordChk">비밀번호 확인</label>
        <InputBasicComp
          id="passwordChk"
          :type="'password'"
          :placeholder="'비밀번호를 한 번 더 입력해주세요.'"
          :readonly="false"
          :required="true"
          :borderColor="'orange'"
          v-model="registrationData.passwordChk"
        ></InputBasicComp>
      </div>

      <div class="input-container">
        <label for="userName">성함</label>
        <InputBasicComp
          id="userName"
          :type="'text'"
          :placeholder="'성함을 입력해주세요.'"
          :readonly="false"
          :required="true"
          :borderColor="'orange'"
          v-model="registrationData.userName"
        ></InputBasicComp>
      </div>

      <div class="input-container">
        <label for="phone">연락처</label>
        <InputBasicComp
          id="phone"
          :type="'tell'"
          :placeholder="'하이픈(-) 없이 숫자만 입력해주세요.'"
          :readonly="false"
          :required="true"
          :borderColor="'orange'"
          v-model="registrationData.phone"
        ></InputBasicComp>
      </div>

      <ButtonComp
        :type="'submit'"
        :content="'회 원 가 입'"
        :color="'orange'"
        style="padding: 10px 15px;"
      ></ButtonComp>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  padding: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  color: var(--brand-font-color);
}

h1 {
  letter-spacing: 10%;
}

p {
  align-self: flex-end;
  font-size: 10px;
  color: var(--brand-main-color);
}

span {
  color: var(--brand-main-color);
}

form {
  min-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label::before {
  content: '*';
  color: var(--brand-main-color);
}

.email-wrap {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
</style>