[barker.api.hscc.bdpa.org][1] / src/backend/env

# Module: src/backend/env

## Table of contents

### Functions

- [getEnv][2]

## Functions

### getEnv

▸ **getEnv**(`loud?`): `Object`

#### Parameters

| Name   | Type      | Default value |
| :----- | :-------- | :------------ |
| `loud` | `boolean` | `false`       |

#### Returns

`Object`

| Name                                      | Type               |
| :---------------------------------------- | :----------------- |
| `API_ROOT_URI`                            | `string`           |
| `BAN_HAMMER_DEFAULT_BAN_TIME_MINUTES`     | `null` \| `number` |
| `BAN_HAMMER_MAX_REQUESTS_PER_WINDOW`      | `null` \| `number` |
| `BAN_HAMMER_RECIDIVISM_PUNISH_MULTIPLIER` | `null` \| `number` |
| `BAN_HAMMER_RESOLUTION_WINDOW_SECONDS`    | `null` \| `number` |
| `BAN_HAMMER_WILL_BE_CALLED_EVERY_SECONDS` | `null` \| `number` |
| `DEBUG_INSPECTING`                        | `boolean`          |
| `DISABLED_API_VERSIONS`                   | `string`[]         |
| `DISALLOWED_METHODS`                      | `string`[]         |
| `EXTERNAL_SCRIPTS_BE_VERBOSE`             | `boolean`          |
| `EXTERNAL_SCRIPTS_MONGODB_URI`            | `string`           |
| `HYDRATE_DB_ON_STARTUP`                   | `boolean`          |
| `IGNORE_RATE_LIMITS`                      | `boolean`          |
| `LOCKOUT_ALL_KEYS`                        | `boolean`          |
| `MAX_CONTENT_LENGTH_BYTES`                | `number`           |
| `MONGODB_MS_PORT`                         | `null` \| `number` |
| `MONGODB_URI`                             | `string`           |
| `NODE_ENV`                                | `string`           |
| `PRUNE_DATA_MAX_LOGS`                     | `null` \| `number` |
| `REQUESTS_PER_CONTRIVED_ERROR`            | `number`           |
| `RESULTS_PER_PAGE`                        | `number`           |

#### Defined in

[src/backend/env.ts:27][3]

[1]: ../README.md
[2]: src_backend_env.md#getenv
[3]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/src/backend/env.ts#L27
