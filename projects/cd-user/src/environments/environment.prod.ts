// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { HttpHeaders } from "@angular/common/http";
import { EnvConfig } from "@corpdesk/core";

// const h = new HttpHeaders({'Content-Type': 'application/json'});

const API_HOST = "https://cd-api.co.ke"
const API_ROUTE = '/api'
const API_PORT = '443'
const SIO_PORT = '3002'
const PUSH_HOST = API_HOST
const SIO_ROUTE = '/sio'

export const environment: EnvConfig = {
  appId: '',
  production: false,
  apiEndpoint: `${API_HOST}${API_ROUTE}`,
  sioEndpoint: `${API_HOST}:${SIO_PORT}`,
  wsEndpoint: 'ws://cd-api.co.ke:3000',
  wsMode: 'wss',
  pushConfig: {
    sio: {
      enabled: true,
    },
    wss: {
      enabled: false,
    },
    pusher: {
      enabled: true,
      apiKey: 'DtVRY9V5j41KwSxKrd8L_dRijUJh9gVcqwBH5wb96no',
      options: {
        cluster: 'ap2',
        forceTLS: true,
        userAuthentication: {
          // endpoint: "/pusher/user-auth",
          endpoint: "https://cd-api.co.ke:3002/pusher/auth",
          transport: "ajax",
          params: {},
          headers: {},
          includeCredentials: true,
          customHandler: null,
        },
        channelAuthorization: {
          endpoint: "https://cd-api.co.ke:3002/pusher/auth",
        },
        authEndpoint: 'https://cd-api.co.ke:3002/pusher/auth',
      }
    }
  },
  CD_PORT: 3001,
  consumerToken: 'B0B3DA99-1859-A499-90F6-1E3F69575DCD',// current company consumer
  USER_RESOURCES: 'http://routed-93/user-resources',
  apiHost: 'https://cd-api.co.ke',
  sioHost: 'https://cd-api.co.ke',
  shellHost: 'https://cd-shell.asdap.africa',
  consumer: '',
  clientAppGuid: 'ca0fe39f-92b2-484d-91ef-487d4fc462a2',
  clientAppId: 2, // this client application identifies itself to the server with this id
  SOCKET_IO_PORT: 3002, // push server port
  defaultauth: 'cd-auth', // fckService | cd-auth | firebase
  mfManifestPath: '/assets/mf.manifest.json',
  apiOptions: {
    headers: { 'Content-Type': 'application/json' }
  },
  // this.socket = io(`${this.env.sioEndpoint}`,this.env.sioOptions);
  sioOptions: {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    secure: true
  },
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
