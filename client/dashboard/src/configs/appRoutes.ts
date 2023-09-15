export const API_BASE_URL = 'http://localhost:9091/api';

export const SITECONFIG_ROUTE = `${API_BASE_URL}/siteconfig`;
export const PROFILE_ROUTE = `${API_BASE_URL}/profile`;
export const MOODCATEGORY_ROUTE = `${API_BASE_URL}/mood/cat`;
export const MOOD_ROUTE = `${API_BASE_URL}/mood`;
export const DOCTOR_ROUTE = `${API_BASE_URL}/doctor`;
export const EXERCISE_LEVEL_ROUTE = `${API_BASE_URL}/exercise/difficulty`;
export const DISCOVER_ROUTE = `${API_BASE_URL}/discover`;
export const ROLE_PERMISSION_ROUTE = `${API_BASE_URL}/v1/role_permission`;
export const ROLE_ROUTE = `${API_BASE_URL}/v1/role_permission/roles`;
export const API_ROUTE = `${API_BASE_URL}/apiList`;
export const WORKOUT_ROUTE = `${API_BASE_URL}/exercise`;
export const USER_ROUTE = `${API_BASE_URL}/profile/user`;





export const DOCTORCATEGORY_ROUTE = `${API_BASE_URL}/doctor/category`;

export const protectedRoutes = ["/profile","/"];
export const authRoutes = ["/login"];
