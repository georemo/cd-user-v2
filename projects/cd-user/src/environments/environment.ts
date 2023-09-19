// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { EnvConfig } from "@corpdesk/core";

export const environment: EnvConfig = {
  appId: '',
  production: false,
  apiEndpoint: 'http://localhost:3001',
  // apiEndpoint: 'http://cd-api-22:3001',
  sioEndpoint: 'http://localhost:3001',
  // sioEndpoint: 'http://cd-sio-23:3000',
  wsEndpoint: 'ws://cd-sio-23:3000',
  CD_PORT: 3001,
  consumerToken: 'B0B3DA99-1859-A499-90F6-1E3F69575DCD',// current company consumer
  USER_RESOURCES: 'http://routed-93/user-resources',
  apiHost: 'http://cd-api-22',
  sioHost: 'http://localhost',
  // sioHost: 'http://cd-sio-23',
  shellHost: 'http://cd-shell-24',
  consumer: '',
  clientAppGuid: 'ca0fe39f-92b2-484d-91ef-487d4fc462a2',
  clientAppId: 2, // this client application identifies itself to the server with this id
  SOCKET_IO_PORT: 3000, // push server port
  defaultauth: 'fackbackend',
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
