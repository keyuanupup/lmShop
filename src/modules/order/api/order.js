import { fetch, common } from 'common';

export function subToOrder({ cartId }) {
  return fetch.get('/cartapi/subToOrder', {
    cartId
  });
}

export function addShipping({ cartIds, cityId }) {
  return fetch.get('/cartapi/addShipping', {
    cartIds,
    cityId
  });
}

export function getPrice({
  isPd,
  freight,
  cartIds,
  couponId,
  cityId,
}) {
  return fetch.get('/cartapi/getPrice', {
    isPd,
    freight,
    cartIds,
    couponId,
    cityId,
  });
}

export function saveorder({
  paytype,
  invoiceId,
  isPd,
  addressId,
  freight,
  cartIds,
  couponId,
}) {
  return fetch.get('/orderapi/saveorder', {
    paytype,
    invoiceId,
    isPd,
    addressId,
    freight,
    cartIds,
    couponId,
  });
}

// 银联支付
// http://testbbc.leimingtech.com/unionpay/api/tounionpay
// orderCode	P20170324105020308

// 微信支付
// http://testbbc.leimingtech.com/wxpay/api/towxpayInfo
// orderCode	P20170324105020308

// http://testbbc.leimingtech.com/alipay/api/alipaySignOrderInfo
// timestamp	1490323983463
// sign	TTrwd9WyZhZ2dVkHU6Bhi9lJfvmxuroRpaZlqsAO5Xfk9g62JuDhUC3ffY4e91EDoptlyq4OeexzfhCkChiEfWUkHHJOc2XVwsPjbTL3v1Nu4nryUwkOpmzwditB8L85EK8E/CJ1KEw44RMB9cWQCwAGLXGO1v3WfczDrvFR3Yk=
// orderCode	P20170324105020308

// http://testbbc.leimingtech.com/orderapi/saveorder
// paytype	1
// invoiceId	
// isPd	0
// sign	ObjzIIQNAQHfZY1+xAUSfIKBUm9KY/2FFshgrxf9eQ9PM2PV1n/c2Oh+qO4TUNNY+5gBlCJjHy48ZiVGNkhXk4wikmepAZsOz/EQNeAuLuXxo3sYiKYdL0NUK/Mcjf/ar9EyF+nPZkhcBThVyJk3DtAeaYPf3cRVtBmZ8ke+qwU=
// addressId	7f624584104449969cc1334647cf8e53
// freight	
// timestamp	1490323819033
// cartIds	8afd6ed4073e4976b96d38a737ec79f5
// couponId
