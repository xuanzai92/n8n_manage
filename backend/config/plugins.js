module.exports = {
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 100000,
      },
    },
  },
  'strapi-plugin-upload': {
    enabled: false,
  },
};
