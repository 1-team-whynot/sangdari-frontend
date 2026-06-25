export const email = (val) => {
  const regex = /^[0-9a-zA-Z](?!.*?[\-\_\.]{2})[a-zA-Z0-9\-\_\.]{3,63}@[0-9a-zA-Z](?!.*?[\-\_\.]{2})[a-zA-Z0-9\-\_\.]{3,63}\.[a-zA-Z]{2,3}$/;

  if(!val) {
    return '이메일과 비밀번호를 입력해주세요.';
  }

  if(!regex.test(val)) {
    return '올바른 이메일 형식으로 입력해주세요.';
  }

  return '';
}

export const password = (val) => {
  const regex = /^[0-9a-zA-Z!@#$%^&*()]{8,20}$/;

  if(!val) {
    return '이메일과 비밀번호를 입력해주세요.';
  }

  if(!regex.test(val)) {
    return '문자, 숫자, 특수문자 포함 6~20자로 입력해주세요.';
  }

  return '';
}