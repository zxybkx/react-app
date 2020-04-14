import request from '@/utils/request';
import {stringify} from 'qs';

export async function getDataList (params) {
  return request(`/gateway/crmservice/api/crm-businesses?${stringify(params)}&sort=jsrq,desc`, {
    method: 'GET'
  })
}

export async function getPinYin(params) {
  return request(`/gateway/utilservice/api/pinyin/words/${params.text}`, {
    method: 'GET'
  })
}

export async function addBusiness(payload) {
  return request(`/gateway/crmservice/api/crm-businesses`, {
    method: 'POST',
    body: payload
  })
}

export async function getCustomersList() {
  return request(`/gateway/crmservice/api/crm-customers/dropDownList`, {
    method: 'GET'
  })
}

export async function getData(params) {
  return request(`/gateway/crmservice/api/crm-businesses/${params}`, {
    method: 'GET'
  })
}
