import request from '@/utils/request';
import { stringify } from 'qs';

export async function getProductList(params) {
  return request(`/gateway/crmservice/api/crm-products?${stringify(params)}&sort=zt,asc&sort=dwmc,asc`, {
    method: 'GET',
  });
}

export async function getDetail(params) {
  return request(`/gateway/crmservice/api/crm-products/${params.id}`, {
    method: 'GET',
  });
}

export async function categories(params) {
  return request(`/gateway/crmservice/api/crm-categories/info?${stringify(params)}`, {
    method: 'GET',
  });
}

export async function getPinYin(params) {
  return request(`/gateway/utilservice/api/pinyin/words/${params.text}`, {
    method: 'GET'
  })
}

export async function addProduct(payload) {
  return request(`/gateway/crmservice/api/crm-products`, {
    method: 'POST',
    body: payload,
  })
}
