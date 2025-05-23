import * as migration_20250516_145237_initial from './20250516_145237_initial';
import * as migration_20250518_211033 from './20250518_211033';
import * as migration_20250518_212818_initial_setup from './20250518_212818_initial_setup';

export const migrations = [
  {
    up: migration_20250516_145237_initial.up,
    down: migration_20250516_145237_initial.down,
    name: '20250516_145237_initial',
  },
  {
    up: migration_20250518_211033.up,
    down: migration_20250518_211033.down,
    name: '20250518_211033',
  },
  {
    up: migration_20250518_212818_initial_setup.up,
    down: migration_20250518_212818_initial_setup.down,
    name: '20250518_212818_initial_setup'
  },
];
