#!/usr/bin/env node
import { Command } from 'commander';

import { deriveHolisticImages, findLooseDerivatives, findDeriveTargets } from './api';

const program = new Command();

program
  .command('derive <folder> <mask>')
  .description('creates derivative image from .holistic source')
  .action((folder, mask) => {
    return deriveHolisticImages(folder, mask);
  });

program
  .command('verify <folder> <mask>')
  .description('check operation integrity - all files derived, nothing left over')
  .action(async (folder, mask) => {
    const targets = await findDeriveTargets(folder, mask);

    if (targets.length > 0) {
      console.log('missing derives for:\n- ', targets.map((t) => t.source).join('\n- '));
      throw new Error('please generate missing files');
    }

    const loose = await findLooseDerivatives(folder, mask);

    if (loose.length > 0) {
      console.log('loose derives:\n- ', loose.join('\n- '));
      throw new Error('please delete left over files');
    }
  });

program.addHelpText(
  'after',
  `

Example call:
  $ holistic-image derive src *
  $ holistic-image verify packages */assets
`
);

program.parse();
