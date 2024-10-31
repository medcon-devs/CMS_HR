export default {
  meEndpoint: '/profile',
  loginEndpoint: '/login',
  registerEndpoint: '/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken', // logout | refreshToken
  users: 'users',
  resetPassword: 'reset-password',
  managers: 'managers',
  types: 'leave-type',
  request: 'leave-request',
  archiveRequest:'leave-request-archive',
  requestPerUser: 'leave-request/per-user',
  transferDays: 'days-transfer',
  approvedRequests: 'leave-request/approved',
  approvedRequestsPerWeek: 'leave-request/approved/perWeek',
  remainingDays: 'remaining-days',
  requestStatus: 'leave-request/status',
  changeStatus: 'days-transfer/status',
  uploadDataSources: '',
  emergencyType: 'leave-type/new/emergency'
}
