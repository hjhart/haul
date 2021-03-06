/**
 * Copyright 2017-present, Callstack.
 * All rights reserved.
 *
 * @flow
 */

import type { EnvOptions } from '../../types';

const path = require('path');
const getBabelConfig = require('../getBabelConfig');
const { replacePathsInObject } = require('jest/helpers'); // eslint-disable-line import/no-unresolved

const orignalEnv = process.env.NODE_ENV;

const emptyEnvOptions: EnvOptions = {
  root: '',
  assetsDest: '',
  dev: true,
  platform: '',
};

const envOptionsWithoutHMR: EnvOptions = {
  root: '',
  assetsDest: '',
  dev: true,
  platform: '',
  disableHotReloading: true,
};

afterEach(() => {
  process.env.NODE_ENV = orignalEnv;
});

test('extracts config from .babelrc', () => {
  const cwd = path.resolve(__dirname, './fixtures');
  const config = getBabelConfig(cwd, emptyEnvOptions);
  expect(config).toMatchObject({
    extends: path.resolve(cwd, '.babelrc'),
  });
});

test('creates new config when no .babelrc found', () => {
  const cwd = path.resolve('mocked/path');
  const config = getBabelConfig(cwd, emptyEnvOptions);
  expect(replacePathsInObject(config)).toMatchSnapshot();
});

test('does not include "hot" plugins in production', () => {
  process.env.NODE_ENV = 'production';
  const cwd = path.resolve('mocked/path');
  const config = getBabelConfig(cwd, emptyEnvOptions);
  expect(replacePathsInObject(config)).toMatchSnapshot();
});

test('does not include "hot" plugins when HMR is disabled', () => {
  const cwd = path.resolve('mocked/path');
  const config = getBabelConfig(cwd, envOptionsWithoutHMR);
  expect(replacePathsInObject(config)).toMatchSnapshot();
});
