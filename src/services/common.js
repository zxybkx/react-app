import { stringify } from 'qs';
import request from '../utils/request';

export async function getOrgs() {
  return request(`/gateway/hrservice/api/hr-organization/list-from-node/?maxDepth=2`);
}

export async function getOrgEmps(param) {
  return request(`/gateway/hrservice/api/hr-organization/${param.id}/emp`);
}

export async function searchEmps(param) {
  return request(`/gateway/hrservice/api/hr-employees/fuzzy-query?${stringify(param)}`);
}



