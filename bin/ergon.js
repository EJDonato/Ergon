#!/usr/bin/env node
import { run } from '../dist/index.js';

run().catch((error) => {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
