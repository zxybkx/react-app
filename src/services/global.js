import { stringify } from 'qs';
import request from '@/utils/request';
import config from '@/config';

export async function getMobileToken(data) {
  return request(`/gateway/api/authorize-gateway`, {
    method: 'POST',
    body: data,
  });
}

export async function fetchMobileUser(param) {
  return request(`${config.get('mobileUri')}/users?type=id&matching=true&${stringify(param)}`)
}


