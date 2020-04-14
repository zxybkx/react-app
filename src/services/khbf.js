import request from '@/utils/request';
import {stringify} from 'qs';

export async function getCustomersList() {
  return request(`/gateway/crmservice/api/crm-customers/dropDownList`, {
    method: 'GET'
  })
}

export async function addKhbf(payload) {
  return request(`/gateway/crmservice/api/crm-khgjs`, {
    method: 'POST',
    body: payload
  })
}

export async function getKhbfList(params) {
  const pagination = {
    page: params.page,
    size: params.size,
  };

  return request(`/gateway/crmservice/api/crm-khgjs/condition?${stringify({...pagination})}`, {
    method: 'POST',
    body: params
  })
}

export async function getDetail(params) {
  return request(`/gateway/crmservice/api/crm-khgjs/detail/${params.id}`, {
    method: 'GET'
  })
}


