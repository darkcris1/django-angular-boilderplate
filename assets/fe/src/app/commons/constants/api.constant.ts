import { urlsafe } from 'src/app/commons/utils/http.util';
import { API_URL, API_STREAM } from './conf.constant';

// USERS

export const API_USERS = urlsafe(API_URL, 'users');
export const API_USERS_AUTH = urlsafe(API_USERS, 'auth');

export const API_USERS_LOGIN = urlsafe(API_USERS, 'login');
export const API_USERS_SIGNUP = urlsafe(API_USERS, 'signup');

// Ride
export const API_RIDE = urlsafe(API_URL, 'ride');
export const API_RIDE_BOOKING = urlsafe(API_RIDE,'booking');

// MESSAGING

export const STREAM_GLOBAL = urlsafe(API_STREAM, 'global');