// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { EnvConfig } from "@corpdesk/core";

export const environment: EnvConfig = {
  appId: '',
  production: false,
  apiEndpoint: 'https://cd-api.co.ke/api',
  sioEndpoint: 'https://cd-api.co.ke:3002/sio',
  wsEndpoint: 'ws://cd-api.co.ke:3000',
  wsMode: 'sio',
  CD_PORT: 443,
  consumerToken: 'B0B3DA99-1859-A499-90F6-1E3F69575DCD',// current company consumer
  USER_RESOURCES: 'http://routed-93/user-resources',
  apiHost: 'https://cd-api.co.ke',
  sioHost: 'https://cd-api.co.ke',
  shellHost: 'https://cd-shell.asdap.africa',
  consumer: '',
  clientAppGuid: 'ca0fe39f-92b2-484d-91ef-487d4fc462a2',
  clientAppId: 2, // this client application identifies itself to the server with this id
  SOCKET_IO_PORT: 443, // push server port
  defaultauth: 'cd-auth',
  mfManifestPath: '/assets/mf.manifest.json',
  apiOptions: {
    headers: {'Content-Type': 'application/json'}
  },
  sioOptions: {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    secure: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    timeout: 20000,
    // transports: ['websocket'],
    rejectUnauthorized: false,  // Adjust based on your security requirements
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
