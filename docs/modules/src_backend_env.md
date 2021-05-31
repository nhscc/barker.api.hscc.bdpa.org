[barker.api.hscc.bdpa.org][1] / src/backend/env

# Module: src/backend/env

## Table of contents

### Functions

- [getEnv][2]

## Functions

### getEnv

▸ **getEnv**(`loud?`: _boolean_): _object_

#### Parameters

| Name   | Type      | Default value |
| :----- | :-------- | :------------ |
| `loud` | _boolean_ | false         |

**Returns:** _object_

| Name                                      | Type               |
| :---------------------------------------- | :----------------- |
| `API_ROOT_URI`                            | _string_           |
| `BAN_HAMMER_DEFAULT_BAN_TIME_MINUTES`     | `null` \| _number_ |
| `BAN_HAMMER_MAX_REQUESTS_PER_WINDOW`      | `null` \| _number_ |
| `BAN_HAMMER_RECIDIVISM_PUNISH_MULTIPLIER` | `null` \| _number_ |
| `BAN_HAMMER_RESOLUTION_WINDOW_SECONDS`    | `null` \| _number_ |
| `BAN_HAMMER_WILL_BE_CALLED_EVERY_SECONDS` | `null` \| _number_ |
| `DEBUG_MODE`                              | _boolean_          |
| `DISABLED_API_VERSIONS`                   | _string_[]         |
| `DISALLOWED_METHODS`                      | _string_[]         |
| `EXTERNAL_SCRIPTS_BE_VERBOSE`             | _boolean_          |
| `EXTERNAL_SCRIPTS_MONGODB_URI`            | _string_           |
| `HYDRATE_DB_ON_STARTUP`                   | _boolean_          |
| `IGNORE_RATE_LIMITS`                      | _boolean_          |
| `LOCKOUT_ALL_KEYS`                        | _boolean_          |
| `MAX_CONTENT_LENGTH_BYTES`                | _number_           |
| `MONGODB_MS_PORT`                         | `null` \| _number_ |
| `MONGODB_URI`                             | _string_           |
| `NODE_ENV`                                | _string_           |
| `PRUNE_LOGS_MAX_LOGS`                     | `null` \| _number_ |
| `REQUESTS_PER_CONTRIVED_ERROR`            | _number_           |
| `RESULTS_PER_PAGE`                        | _number_           |

Defined in: [src/backend/env.ts:5][3]

[1]: ../README.md
[2]: src_backend_env.md#getenv
[3]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/src/backend/env.ts#L5
