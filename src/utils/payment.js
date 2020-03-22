import { postRequest } from './api'
import Vue from 'vue'

/**
 * 支付
 * @param params
 * @returns {AxiosPromise}
 */
export const payment = (params) => {
  return postRequest('/housing.payment/payment', params)
}

/**
 * 退款
 * @param params
 * @returns {AxiosPromise}
 */
export const refund = (params) => {
  return postRequest('/housing.payment/refund', params)
}

/**
 * 支付or退款
 * @param flow 1:支付 2:退款
 * @param params
 * @returns {AxiosPromise}
 */
export const paymentOrRefund = (flow, params) => {
  if (flow === 1) {
    return payment(params)
  } else {
    return refund(params)
  }
}

export const paymentMsg = (flow, money) => {
  const priceFenToYuan = Vue.filter('priceFenToYuan')
  money = priceFenToYuan(money)
  if (flow === 1) {
    return `会员还需要支付 ${money} 元（已抵消押金）`
  }
  return `需要退还会员 ${money} 元`
}

export const paymentButtonText = (flow) => {
  if (flow === 1) {
    return '已支付'
  }
  return '已退款'
}

export default {
  payment,
  refund,
  paymentOrRefund,
  paymentMsg,
  paymentButtonText
}
