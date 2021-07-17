import { statSync } from 'fs';

import { defaultConverters } from '../constants';

const { cosmiconfigSync } = require('cosmiconfig');

const explorer = cosmiconfigSync('holistic-image');

const filemstatSync = (file: string) => statSync(file).mtime;

export const getConfiguration = () => {
  const userConfig = explorer.search();
  const configFile = userConfig?.filepath;

  return {
    configFile,
    era: configFile ? new Date(filemstatSync(configFile)) : undefined,
    converters: {
      ...defaultConverters,
      ...userConfig?.config,
    },
  };
};

export const getConverters = () => getConfiguration().converters;
