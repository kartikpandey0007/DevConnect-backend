/**
 * API specification and frontend usage examples for DevTinder backend
 * Generated as JavaScript only. Import this file in frontend tools or use as reference.
 */

const BASE_URL = process.env.DEVTINDER_API_BASE_URL || 'http://localhost:3000';
const AUTH_COOKIE_NAME = 'token';

// Allowed enums and lists
const GENDER_ENUM = ['male', 'female', 'others', ''];
const CONNECTION_STATUSES = ['ignored', 'interested', 'accepted', 'rejected'];
const SEND_ALLOWED_STATUS = ['ignored', 'interested'];
const REVIEW_ALLOWED_STATUS = ['accepted', 'rejected'];

// Reusable fetch helper for authenticated requests (cookie-based JWT)
function fetchJson(path, { method = 'GET', body = null, query = '', headers = {} } = {}) {
  const url = `${BASE_URL}${path}${query ? '?' + query : ''}`;
  const opts = {
    method,
    headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
    credentials: 'include', // send cookies
  };
  if (body != null) opts.body = JSON.stringify(body);

  return fetch(url, opts).then(async (res) => {
    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();
    const payload = contentType.includes('application/json') ? JSON.parse(text || '{}') : text;
    if (!res.ok) {
      const err = new Error(typeof payload === 'string' ? payload : payload.message || res.statusText);
      err.status = res.status;
      err.payload = payload;
      throw err;
    }
    return payload;
  });
}

// Endpoints description
const endpoints = [
  {
    name: 'signup',
    method: 'POST',
    path: '/signup',
    auth: false,
    body: {
      firstName: 'string (required, min 4)',
      lastName: 'string (required)',
      emailID: 'string (required, valid email)',
      password: 'string (required, strong password)',
      gender: 'string (optional, one of ' + JSON.stringify(GENDER_ENUM) + ')',
      age: 'number (optional)',
      skills: 'array<string> (optional)',
      about: 'string (optional)'
    },
    response: '{ message, data: User }',
    example: function signupExample(payload) {
      return fetchJson('/signup', { method: 'POST', body: payload });
    }
  },
  {
    name: 'login',
    method: 'POST',
    path: '/login',
    auth: false,
    body: { emailID: 'string', password: 'string' },
    response: 'User (cookie "token" will be set)',
    example: function loginExample(payload) {
      return fetchJson('/login', { method: 'POST', body: payload });
    }
  },
  {
    name: 'logout',
    method: 'POST',
    path: '/logout',
    auth: false,
    body: null,
    response: 'string',
    example: function logoutExample() { return fetchJson('/logout', { method: 'POST' }); }
  },
  {
    name: 'viewProfile',
    method: 'GET',
    path: '/profile/view',
    auth: true,
    response: 'User',
    example: function getProfile() { return fetchJson('/profile/view'); }
  },
  {
    name: 'editProfile',
    method: 'PATCH',
    path: '/profile/edit',
    auth: true,
    bodyAllowedFields: ["firstName","lastName","emailID","photoUrl","gender","age","about","skills"],
    example: function editProfile(payload) { return fetchJson('/profile/edit', { method: 'PATCH', body: payload }); }
  },
  {
    name: 'sendRequest',
    method: 'POST',
    pathTemplate: '/request/send/:status/:toUserId',
    auth: true,
    allowedStatus: SEND_ALLOWED_STATUS,
    example: function sendRequest(status, toUserId) { 
      if (!SEND_ALLOWED_STATUS.includes(status)) throw new Error('invalid status');
      return fetchJson(`/request/send/${status}/${toUserId}`, { method: 'POST' });
    }
  },
  {
    name: 'reviewRequest',
    method: 'POST',
    pathTemplate: '/request/review/:status/:requestId',
    auth: true,
    allowedStatus: REVIEW_ALLOWED_STATUS,
    example: function reviewRequest(status, requestId) {
      if (!REVIEW_ALLOWED_STATUS.includes(status)) throw new Error('invalid status');
      return fetchJson(`/request/review/${status}/${requestId}`, { method: 'POST' });
    }
  },
  {
    name: 'requestsReceived',
    method: 'GET',
    path: '/user/requests/received',
    auth: true,
    response: '{ data: ConnectionRequest[] (populated fromUserId) }',
    example: function getRequestsReceived() { return fetchJson('/user/requests/received'); }
  },
  {
    name: 'connections',
    method: 'GET',
    path: '/user/connections',
    auth: true,
    response: '{ data: User[] }',
    example: function getConnections() { return fetchJson('/user/connections'); }
  },
  {
    name: 'feed',
    method: 'GET',
    path: '/feed',
    auth: true,
    queryParams: { page: 'number (default 1)', limit: 'number (default 10, max 50)' },
    response: '{ data: User[] }',
    example: function getFeed(page = 1, limit = 10) { return fetchJson('/feed', { query: `page=${page}&limit=${limit}` }); }
  },
  {
    name: 'getChat',
    method: 'GET',
    pathTemplate: '/chat/:targetUserId',
    auth: true,
    response: 'Chat (participants, messages populated senderId)',
    example: function getChat(targetUserId) { return fetchJson(`/chat/${targetUserId}`); }
  }
];

// Models: JS descriptions for frontend
const models = {
  User: {
    description: 'User document returned by server (may include emailID). Password should not be exposed to frontend.',
    fields: {
      _id: 'string',
      firstName: 'string',
      lastName: 'string',
      emailID: 'string',
      password: 'string (hashed on server, should not be present in responses)',
      age: 'number',
      gender: `string enum ${JSON.stringify(GENDER_ENUM)}`,
      photoUrl: 'string (url)',
      about: 'string',
      skills: 'string[]',
      createdAt: 'string (iso date)',
      updatedAt: 'string (iso date)'
    }
  },
  ConnectionRequest: {
    fields: {
      _id: 'string',
      fromUserId: 'string | User (populated)',
      toUserId: 'string | User (populated)',
      status: `string enum ${JSON.stringify(CONNECTION_STATUSES)}`,
      createdAt: 'string',
      updatedAt: 'string'
    }
  },
  Chat: {
    fields: {
      _id: 'string',
      participants: 'string[] (user ids)',
      messages: '[{ _id, senderId: User | string, text: string, createdAt } ]'
    }
  }
};

// Socket usage helpers (client-side pseudocode functions with socket.io-client)
const socket = {
  description: 'Socket.IO client usage patterns.',
  serverUrl: process.env.DEVTINDER_SOCKET_URL || BASE_URL,
  events: {
    clientToServer: ['joinChat', 'sendMessage'],
    serverToClient: ['messageReceived']
  },
  getRoomIdFromPair: `Server computes room id by sha256 hash of sorted [userId,targetUserId]. Client may instead call joinChat and let server assign the socket to the room. If client must compute roomId locally, reproduce the same sha256(sort([userId,targetUserId]).join('_')).`,
  exampleClient: function exampleSocketClientUsage() {
    return `// Example socket.io-client usage (install socket.io-client first)
import { io } from 'socket.io-client';

const socket = io('${BASE_URL}', { withCredentials: true });

socket.on('connect', () => {
  console.log('connected', socket.id);
  // join chat room
  socket.emit('joinChat', { firstName: currentUser.firstName, userId: currentUser._id, targetUserId });
});

function sendMessage(text, userId, targetUserId, firstName) {
  socket.emit('sendMessage', { firstName, userId, targetUserId, text });
}

socket.on('messageReceived', (payload) => {
  // payload: { firstName, text }
  // append to UI
});
`;
  }
};

// Type-like JS objects for common shapes (examples)
const examples = {
  exampleUser: {
    firstName: 'Alice',
    lastName: 'Smith',
    emailID: 'alice@example.com',
    age: 25,
    gender: 'female',
    photoUrl: 'https://www.w3schools.com/howto/img_avatar.png',
    about: 'Hello, I am Alice',
    skills: ['node', 'react']
  },
  exampleConnectionRequest: {
    fromUserId: '64a1111111111111111111111',
    toUserId: '64a2222222222222222222222',
    status: 'interested'
  },
  exampleMessage: { senderId: '64a1111111111111111111111', text: 'Hello!' }
};

// Small utility to create fetch functions per endpoint name
function makeEndpointFunction(name) {
  const ep = endpoints.find(e => e.name === name);
  if (!ep) throw new Error('Unknown endpoint ' + name);
  return ep.example || (() => { throw new Error('No example for ' + name); });
}

module.exports = {
  BASE_URL,
  AUTH_COOKIE_NAME,
  GENDER_ENUM,
  CONNECTION_STATUSES,
  SEND_ALLOWED_STATUS,
  REVIEW_ALLOWED_STATUS,
  fetchJson,
  endpoints,
  models,
  socket,
  examples,
  makeEndpointFunction,
};
