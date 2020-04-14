import request from '@/utils/request';
import { stringify } from 'qs';

export async function getPoint() {
  return request(`/gateway/crmservice/api/crm-mobile-client/total`, {
    method: 'GET'
  })
}
