<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseButton from '../../common/components/BaseButton.vue'
import { readyPayment } from '../../api/paymentApi.js'

const route = useRoute()
const router = useRouter()

// URL 예시: /payment?id=16&type=deposit
const reservationId = computed(() => Number(route.query.id))

// 프론트 URL에서는 deposit / balance로 받고,
// 백엔드에는 DEPOSIT / BALANCE로 보냄
const paymentType = computed(() => {
  const type = String(route.query.type || 'deposit').toLowerCase()
  return type === 'balance' ? 'BALANCE' : 'DEPOSIT'
})

const paymentTypeQuery = computed(() => {
  return paymentType.value === 'BALANCE' ? 'balance' : 'deposit'
})

// 백엔드 /payments/ready 응답 데이터
const paymentReady = ref(null)

const isLoading = ref(false)
const errorMessage = ref('')
const isWidgetReady = ref(false)

// 토스페이먼츠 위젯 인스턴스
let widgetsInstance = null

// 테스트용 클라이언트 키
const clientKey =
  import.meta.env.VITE_TOSS_CLIENT_KEY ||
  'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'

// 로그인 머지 전 임시 customerKey
// 로그인 붙으면 userId 기반으로 변경하면 됨
const customerKey = 'cust_sangdari_temp_user'

const amount = computed(() => {
  return paymentReady.value?.amount ?? 0
})

const paymentTypeName = computed(() => {
  if (paymentReady.value?.paymentType === 'BALANCE') return '잔금'
  if (paymentReady.value?.paymentType === 'DEPOSIT') return '계약금'
  return paymentType.value === 'BALANCE' ? '잔금' : '계약금'
})

onMounted(async () => {
  if (!reservationId.value || Number.isNaN(reservationId.value)) {
    errorMessage.value = '잘못된 예약 번호입니다.'
    return
  }

  if (!window.TossPayments) {
    errorMessage.value = '토스페이먼츠 SDK가 로드되지 않았습니다. index.html을 확인하세요.'
    return
  }

  try {
    isLoading.value = true

    // 1. 백엔드 결제 준비 요청
    const res = await readyPayment({
      reservationId: reservationId.value,
      paymentType: paymentType.value,
    })

    paymentReady.value = res.data.data

    if (!paymentReady.value?.orderId || !paymentReady.value?.amount) {
      errorMessage.value = '결제 준비 응답 정보가 올바르지 않습니다.'
      return
    }

    // 2. 토스페이먼츠 위젯 초기화
    const tossPayments = window.TossPayments(clientKey)

    widgetsInstance = tossPayments.widgets({
      customerKey,
    })

    // 3. 백엔드에서 받은 금액으로 결제 금액 설정
    await widgetsInstance.setAmount({
      currency: 'KRW',
      value: paymentReady.value.amount,
    })

    // 4. 결제수단 / 약관 위젯 렌더링
    await Promise.all([
      widgetsInstance.renderPaymentMethods({
        selector: '#payment-method',
        variantKey: 'DEFAULT',
      }),
      widgetsInstance.renderAgreement({
        selector: '#agreement',
        variantKey: 'DEFAULT',
      }),
    ])

    isWidgetReady.value = true
  } catch (error) {
    console.error('결제 준비 중 오류:', error)

    errorMessage.value =
      error.response?.data?.data ||
      error.response?.data?.message ||
      '결제 준비 중 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
})

const handlePayment = async () => {
  if (!widgetsInstance || !paymentReady.value || !amount.value) {
    return
  }

  try {
    const successUrl =
      `${window.location.origin}/payment/success` +
      `?reservationId=${reservationId.value}` +
      `&type=${paymentTypeQuery.value}`

    const failUrl =
      `${window.location.origin}/payment/fail` +
      `?reservationId=${reservationId.value}` +
      `&type=${paymentTypeQuery.value}`

    await widgetsInstance.requestPayment({
      // 백엔드에서 만든 orderId 사용
      orderId: paymentReady.value.orderId,

      // 백엔드에서 만든 주문명 사용
      orderName: paymentReady.value.orderName,

      // 로그인 머지 전 임시값
      customerName: paymentReady.value.customerName || '테스트 고객',
      customerEmail: paymentReady.value.customerEmail || 'test@example.com',

      successUrl,
      failUrl,
    })
  } catch (error) {
    console.error('결제 요청 중 오류:', error)

    router.push({
      path: '/payment/fail',
      query: {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || '결제 요청 중 오류가 발생했습니다.',
        orderId: paymentReady.value?.orderId,
        reservationId: reservationId.value,
        type: paymentTypeQuery.value,
      },
    })
  }
}
</script>

<template>
  <div class="page">
    <main class="page-body">
      <div class="container container--md">
        <div class="page-header text-center mb-6">
          <h1 class="page-header-title">안전 결제</h1>
          <p class="page-header-desc">
            토스페이먼츠의 안전 결제 시스템을 이용합니다.
          </p>
        </div>

        <div v-if="isLoading" class="empty-state card">
          <p>결제 정보를 불러오는 중입니다...</p>
        </div>

        <div v-else-if="errorMessage" class="empty-state card">
          <p>{{ errorMessage }}</p>

          <BaseButton
            variant="ghost"
            class="mt-4"
            @click="router.back()"
          >
            이전 화면으로
          </BaseButton>
        </div>

        <div v-else class="payment-layout">
          <!-- 왼쪽: 결제 요약 카드 -->
          <div class="card payment-summary-card">
            <h3 class="card-title">주문 정보 요약</h3>

            <div class="product-badge">
              {{ paymentTypeName }} 결제
            </div>

            <div class="store-info mt-5">
              <span class="store-info-label">신청 업체</span>
              <span class="store-info-value">
                {{ paymentReady?.storeName || paymentReady?.orderName || '예약 결제' }}
              </span>
            </div>

            <div class="event-info-box mt-4">
              <div class="event-info-row">
                <span class="event-info-label">행사 날짜</span>
                <span class="event-info-value">
                  {{ paymentReady?.eventDate || '-' }}
                </span>
              </div>

              <div class="event-info-row">
                <span class="event-info-label">행사 장소</span>
                <span class="event-info-value">
                  {{ paymentReady?.eventLocation || '-' }}
                </span>
              </div>

              <div class="event-info-row">
                <span class="event-info-label">총 견적액</span>
                <span class="event-info-value">
                  {{
                    paymentReady?.estimateAmount
                      ? paymentReady.estimateAmount.toLocaleString() + '원'
                      : '-'
                  }}
                </span>
              </div>
            </div>

            <div class="total-price-box mt-6">
              <span class="total-price-label">결제 금액</span>
              <span class="total-price-value">
                {{ amount.toLocaleString() }} 원
              </span>
            </div>

            <BaseButton
              variant="ghost"
              full-width
              class="mt-4"
              @click="router.back()"
            >
              이전 화면으로
            </BaseButton>
          </div>

          <!-- 오른쪽: 토스페이먼츠 위젯 및 결제 버튼 -->
          <div class="card payment-widget-card">
            <div id="payment-method"></div>
            <div id="agreement"></div>

            <div class="action-btn-container mt-6">
              <BaseButton
                variant="primary"
                full-width
                :disabled="!isWidgetReady || !amount"
                @click="handlePayment"
              >
                {{ amount.toLocaleString() }}원 안전 결제하기
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.payment-layout {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 24px;
  align-items: start;
  margin-top: var(--space-4);
}

@media (max-width: 868px) {
  .payment-layout {
    grid-template-columns: 1fr;
  }
}

.payment-summary-card {
  padding: 30px;
}

.card-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text-main);
  margin-bottom: 20px;
}

.product-badge {
  display: inline-block;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  font-size: var(--text-sm);
  font-weight: 700;
  padding: 6px 16px;
  border-radius: var(--radius-md);
}

.store-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 12px;
  gap: 16px;
}

.store-info-label {
  color: var(--color-text-sub);
  font-weight: 500;
  flex-shrink: 0;
}

.store-info-value {
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--color-text-main);
  text-align: right;
}

.event-info-box {
  background: var(--color-bg-alt);
  padding: 16px;
  border-radius: var(--radius-md);
}

.event-info-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;
  font-size: var(--text-sm);
}

.event-info-row:last-child {
  margin-bottom: 0;
}

.event-info-label {
  color: var(--color-text-sub);
  flex-shrink: 0;
}

.event-info-value {
  font-weight: 600;
  color: var(--color-text-main);
  text-align: right;
}

.total-price-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 18px;
  background: linear-gradient(
    135deg,
    var(--color-primary-light) 0%,
    rgba(255, 107, 0, 0.05) 100%
  );
  border: 1px dashed var(--color-primary);
  border-radius: var(--radius-lg);
}

.total-price-label {
  font-weight: 700;
  color: var(--color-text-main);
}

.total-price-value {
  font-size: var(--text-xl);
  font-weight: 800;
  color: var(--color-primary);
  text-align: right;
}

.payment-widget-card {
  padding: 20px;
}

.action-btn-container {
  padding: 0 10px;
}
</style>