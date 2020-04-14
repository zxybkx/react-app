import request from '@/utils/request';
import {stringify} from 'qs';

export async function addCustomer(params) {
  return request(`/gateway/crmservice/api/crm-customers`, {
    method: 'POST',
    body: params,
  })
}

export async function validateKhmc(payload) {
  return request(`/gateway/crmservice/api/crm-customers/validate?${stringify(payload)}`, {
    method: 'GET',
  })
}

export async function getDataList(params) {
  return request(`/gateway/crmservice/api/crm-customers?${stringify(params)}`, {
    method: 'GET',
  });
}

export async function traceToRoot4Region (params) {
  return request(
    `/gateway/utilservice/api/administrative-division/trace-to-root?${stringify(params, { arrayFormat: 'repeat' })}`,
    {
      method: 'GET',
    }
  );
}

export async function getRegion(params) {
  return request(`/gateway/utilservice/api/administrative-division/next-level?${stringify(params, { arrayFormat: 'repeat' })}`);
}

export async function getOptions() {
  return request(`/gateway/crmservice/api/crm-customers/getComboBox`, {
    method: 'GET'
  })
}

export async function saveEditCustomer(params) {
  return request(`/gateway/crmservice/api/crm-customers`, {
    method: 'PUT',
    body: params,
  })
}

export async function saveAddCustomer(params) {
  return request(`/gateway/crmservice/api/crm-customers`, {
    method: 'POST',
    body: params,
  })
}

export async function editCustomer(payload) {
  return request(`/gateway/crmservice/api/crm-customers/detail/${payload.id}`, {
    method: 'GET',
  })
}

export async function getDetail(params) {
  return request(`/gateway/crmservice/api/crm-customers/detail/${params}`, {
    method: 'GET',
  })
}

export async function changeKhzt(payload) {
  return request(`/gateway/crmservice/api/crm-customers/changeKhzt?${stringify((payload))}`, {
    method: 'PUT',
    body: payload
  })
}

export async function getKhzzOptions(params) {
  return request(`/gateway/crmservice/api/crm-categories/info?${stringify(params)}`, {
    method: 'GET'
  })
}

export async function getKhbm(params) {
  return request(`/gateway/masterdataservice/api/master/getConsumerCode?${stringify(params)}`,{
    method: 'GET'
  })
}

