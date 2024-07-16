const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'cd-user',

  exposes: {
    './Component': './projects/cd-user/src/app/app.component.ts',
    './PagesModule': './projects/cd-user/src/app/pages/pages.module.ts',
    './LoginComponent': './projects/cd-user/src/app/account/auth/login/login.component.ts',
    './UserFrontModule': './projects/cd-user/src/app/modules/user/user-front.module.ts',
    './GroupModule': './projects/cd-user/src/app/modules/group/group.module.ts',
    './GroupMemberModule': './projects/cd-user/src/app/modules/group-member/group-member.module.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});
