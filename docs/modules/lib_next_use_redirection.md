[barker.api.hscc.bdpa.org][1] / lib/next-use-redirection

# Module: lib/next-use-redirection

## Table of contents

### Functions

- [useRedirection][2]

## Functions

### useRedirection

▸ **useRedirection**\<T>(`(destructured)`: { `fetchConfig?`: FetchConfig ;
`redirectConfig?`: [_FrontendRedirectConfig_][3] ; `redirectIf?`: (`data`: T) =>
_boolean_ ; `redirectTo?`: _string_ ; `uri`: _string_ }): _object_

Redirects to another location when configurable conditions are met.

redirecting = null - undecided redirecting = true - redirecting redirecting =
false - not redirecting error is defined - error occurred

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name                      | Type                          |
| :------------------------ | :---------------------------- |
| `(destructured)`          | _object_                      |
| ▶ `({ fetchConfig? })`    | FetchConfig                   |
| ▶ `({ redirectConfig? })` | [_FrontendRedirectConfig_][3] |
| ▶ `({ redirectIf? })`     | (`data`: T) => _boolean_      |
| ▶ `({ redirectTo? })`     | _string_                      |
| ▶ `({ uri })`             | _string_                      |

**Returns:** _object_

| Name          | Type                                                                                                                                                                                                                                  |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `error`       | _any_                                                                                                                                                                                                                                 |
| `mutate`      | (`data?`: _Record_<string, unknown> \| _Promise_<undefined \| Record<string, unknown>> \| _MutatorCallback_<undefined \| Record<string, unknown>>, `shouldRevalidate?`: _boolean_) => _Promise_<undefined \| Record<string, unknown>> |
| `redirecting` | `null` \| _boolean_                                                                                                                                                                                                                   |

Defined in: [lib/next-use-redirection/index.ts:18][4]

[1]: ../README.md
[2]: lib_next_use_redirection.md#useredirection
[3]: lib_next_isomorphic_redirect_types.md#frontendredirectconfig
[4]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/lib/next-use-redirection/index.ts#L18
