// @ts-nocheck
import { vi } from 'vitest';

// Exposes a `jest` global backed by vitest for setup code written against Jest.
const jestShim: any = Object.create(vi);
jestShim.setTimeout = (ms: number) => vi.setConfig({ testTimeout: ms });
Object.assign(globalThis, { jest: jestShim });
