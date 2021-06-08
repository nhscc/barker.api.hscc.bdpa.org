[barker.api.hscc.bdpa.org][1] / test/setup

# Module: test/setup

## Table of contents

### Classes

- [FactoryExhaustionError][2]

### Interfaces

- [DummyDirectoriesFixtureOptions][3]
- [FixtureContext][4]
- [FixtureOptions][5]
- [GitProvider][6]
- [GitRepositoryFixtureOptions][7]
- [MockFixture][8]
- [RunOptions][9]
- [TestResultProvider][10]
- [TreeOutputProvider][11]
- [WebpackTestFixtureOptions][12]

### Type aliases

- [FixtureAction][13]
- [MockArgvOptions][14]
- [MockEnvOptions][15]
- [ReturnsString][16]

### Functions

- [asMockedFunction][17]
- [asMockedNextApiMiddleware][18]
- [describeRootFixture][19]
- [dummyDirectoriesFixture][20]
- [dummyFilesFixture][21]
- [dummyNpmPackageFixture][22]
- [gitRepositoryFixture][23]
- [isolatedImport][24]
- [isolatedImportFactory][25]
- [itemFactory][26]
- [mockArgvFactory][27]
- [mockEnvFactory][28]
- [mockFixtureFactory][29]
- [nodeImportTestFixture][30]
- [npmLinkSelfFixture][31]
- [protectedImportFactory][32]
- [rootFixture][33]
- [run][34]
- [runnerFactory][35]
- [webpackTestFixture][36]
- [withMockedArgv][37]
- [withMockedEnv][38]
- [withMockedExit][39]
- [withMockedFixture][40]
- [withMockedOutput][41]

## Type aliases

### FixtureAction

Ƭ **FixtureAction**\<Context>: (`ctx`: `Context`) => `Promise`\<unknown>

#### Type parameters

| Name      | Type                            |
| :-------- | :------------------------------ |
| `Context` | `Context` = [FixtureContext][4] |

#### Type declaration

▸ (`ctx`): `Promise`\<unknown>

##### Parameters

| Name  | Type      |
| :---- | :-------- |
| `ctx` | `Context` |

##### Returns

`Promise`\<unknown>

#### Defined in

[test/setup.ts:418][42]

---

### MockArgvOptions

Ƭ **MockArgvOptions**: `Object`

#### Type declaration

| Name       | Type      | Description                                                                                                                                                                 |
| :--------- | :-------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `replace?` | `boolean` | By default, the first two elements in `process.argv` are preserved. Setting `replace` to `true` will cause the entire process.argv array to be replaced **`default`** false |

#### Defined in

[test/setup.ts:139][43]

---

### MockEnvOptions

Ƭ **MockEnvOptions**: `Object`

#### Type declaration

| Name       | Type      | Description                                                                                                                                                               |
| :--------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `replace?` | `boolean` | By default, the `process.env` object is emptied and re-hydrated with `newEnv`. Setting `replace` to `false` will cause `newEnv` to be appended instead **`default`** true |

#### Defined in

[test/setup.ts:149][44]

---

### ReturnsString

Ƭ **ReturnsString**\<Context>: (`ctx`: `Context`) => `Promise`\<string> |
`string`

#### Type parameters

| Name      | Type                            |
| :-------- | :------------------------------ |
| `Context` | `Context` = [FixtureContext][4] |

#### Type declaration

▸ (`ctx`): `Promise`\<string> | `string`

##### Parameters

| Name  | Type      |
| :---- | :-------- |
| `ctx` | `Context` |

##### Returns

`Promise`\<string> | `string`

#### Defined in

[test/setup.ts:421][45]

## Functions

### asMockedFunction

▸ **asMockedFunction**\<T>(): `jest.MockedFunction`\<T>

#### Type parameters

| Name | Type                         |
| :--- | :--------------------------- |
| `T`  | `T`: `AnyFunction` = `never` |

#### Returns

`jest.MockedFunction`\<T>

#### Defined in

[test/setup.ts:130][46]

▸ **asMockedFunction**\<T>(`fn`): `jest.MockedFunction`\<T>

#### Type parameters

| Name | Type               |
| :--- | :----------------- |
| `T`  | `T`: `AnyFunction` |

#### Parameters

| Name | Type |
| :--- | :--- |
| `fn` | `T`  |

#### Returns

`jest.MockedFunction`\<T>

#### Defined in

[test/setup.ts:131][47]

---

### asMockedNextApiMiddleware

▸ **asMockedNextApiMiddleware**(`wrapHandler`): `void`

#### Parameters

| Name          | Type                                          |
| :------------ | :-------------------------------------------- |
| `wrapHandler` | [src/backend/middleware][48][`"wrapHandler"`] |

#### Returns

`void`

#### Defined in

[test/setup.ts:61][49]

---

### describeRootFixture

▸ **describeRootFixture**(): [MockFixture][8]

#### Returns

[MockFixture][8]

#### Defined in

[test/setup.ts:644][50]

---

### dummyDirectoriesFixture

▸ **dummyDirectoriesFixture**(): [MockFixture][8]

#### Returns

[MockFixture][8]

#### Defined in

[test/setup.ts:600][51]

---

### dummyFilesFixture

▸ **dummyFilesFixture**(): [MockFixture][8]

#### Returns

[MockFixture][8]

#### Defined in

[test/setup.ts:619][52]

---

### dummyNpmPackageFixture

▸ **dummyNpmPackageFixture**(): [MockFixture][8]

#### Returns

[MockFixture][8]

#### Defined in

[test/setup.ts:453][53]

---

### gitRepositoryFixture

▸ **gitRepositoryFixture**(): [MockFixture][8]

#### Returns

[MockFixture][8]

#### Defined in

[test/setup.ts:578][54]

---

### isolatedImport

▸ **isolatedImport**(`path`): `Promise`\<unknown>

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `path` | `string` |

#### Returns

`Promise`\<unknown>

#### Defined in

[test/setup.ts:234][55]

---

### isolatedImportFactory

▸ **isolatedImportFactory**(`path`): () => `Promise`\<unknown>

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `path` | `string` |

#### Returns

`fn`

▸ (): `Promise`\<unknown>

##### Returns

`Promise`\<unknown>

#### Defined in

[test/setup.ts:258][56]

---

### itemFactory

▸ **itemFactory**\<T>(`testItems`): () => `T` & { `$iter`:
`IterableIterator`\<T> ; `count`: `number` ; `items`: `T`\[] ;
`[Symbol.asyncIterator]`: () => `AsyncGenerator`\<T, void, unknown> ;
`[Symbol.iterator]`: () => `Generator`\<T, void, unknown> }

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name        | Type  |
| :---------- | :---- |
| `testItems` | `T`[] |

#### Returns

() => `T` & { `$iter`: `IterableIterator`\<T> ; `count`: `number` ; `items`:
`T`\[] ; `[Symbol.asyncIterator]`: () => `AsyncGenerator`\<T, void, unknown> ;
`[Symbol.iterator]`: () => `Generator`\<T, void, unknown> }

#### Defined in

[test/setup.ts:82][57]

---

### mockArgvFactory

▸ **mockArgvFactory**(`newArgv`, `options?`): (`fn`: () => `AnyVoid`,
`newArgv?`: `string`\[], `options?`: [MockArgvOptions][14]) => `Promise`\<void>

#### Parameters

| Name      | Type                  |
| :-------- | :-------------------- |
| `newArgv` | typeof `process.argv` |
| `options` | [MockArgvOptions][14] |

#### Returns

`fn`

▸ (`fn`, `newArgv?`, `options?`): `Promise`\<void>

##### Parameters

| Name       | Type                  |
| :--------- | :-------------------- |
| `fn`       | () => `AnyVoid`       |
| `newArgv?` | `string`[]            |
| `options?` | [MockArgvOptions][14] |

##### Returns

`Promise`\<void>

#### Defined in

[test/setup.ts:176][58]

---

### mockEnvFactory

▸ **mockEnvFactory**(`newEnv`, `options?`): (`fn`: () => `AnyVoid`, `newEnv?`:
`Record`\<string, string>, `options?`: [MockEnvOptions][15]) => `Promise`\<void>

#### Parameters

| Name      | Type                     |
| :-------- | :----------------------- |
| `newEnv`  | `Record`<string, string> |
| `options` | [MockEnvOptions][15]     |

#### Returns

`fn`

▸ (`fn`, `newEnv?`, `options?`): `Promise`\<void>

##### Parameters

| Name       | Type                     |
| :--------- | :----------------------- |
| `fn`       | () => `AnyVoid`          |
| `newEnv?`  | `Record`<string, string> |
| `options?` | [MockEnvOptions][15]     |

##### Returns

`Promise`\<void>

#### Defined in

[test/setup.ts:213][59]

---

### mockFixtureFactory

▸ **mockFixtureFactory**\<CustomOptions, CustomContext>(`testIdentifier`,
`options?`): (`fn`: [FixtureAction][13]<[FixtureContext][4]<[FixtureOptions][5]
& `Partial`<`Record`\<string, unknown> & `CustomOptions`>> & `CustomContext`>)
=> `Promise`\<void>

#### Type parameters

| Name            | Type                                            |
| :-------------- | :---------------------------------------------- |
| `CustomOptions` | `CustomOptions`: `Record`<string, unknown> = {} |
| `CustomContext` | `CustomContext`: `Record`<string, unknown> = {} |

#### Parameters

| Name             | Type                                             |
| :--------------- | :----------------------------------------------- |
| `testIdentifier` | `string`                                         |
| `options?`       | `Partial`<[FixtureOptions][5] & `CustomOptions`> |

#### Returns

`fn`

▸ (`fn`): `Promise`\<void>

##### Parameters

| Name | Type                                                                                                                                     |
| :--- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `fn` | [FixtureAction][13]<[FixtureContext][4]<[FixtureOptions][5] & `Partial`<`Record`<string, unknown> & `CustomOptions`>> & `CustomContext`> |

##### Returns

`Promise`\<void>

#### Defined in

[test/setup.ts:770][60]

---

### nodeImportTestFixture

▸ **nodeImportTestFixture**(): [MockFixture][8]

#### Returns

[MockFixture][8]

#### Defined in

[test/setup.ts:546][61]

---

### npmLinkSelfFixture

▸ **npmLinkSelfFixture**(): [MockFixture][8]

#### Returns

[MockFixture][8]

#### Defined in

[test/setup.ts:478][62]

---

### protectedImportFactory

▸ **protectedImportFactory**(`path`): (`params?`: { `expectedExitCode?`:
`number` }) => `Promise`\<unknown>

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `path` | `string` |

#### Returns

`fn`

▸ (`params?`): `Promise`\<unknown>

##### Parameters

| Name                       | Type     |
| :------------------------- | :------- |
| `params?`                  | `Object` |
| `params.expectedExitCode?` | `number` |

##### Returns

`Promise`\<unknown>

#### Defined in

[test/setup.ts:278][63]

---

### rootFixture

▸ **rootFixture**(): [MockFixture][8]

#### Returns

[MockFixture][8]

#### Defined in

[test/setup.ts:434][64]

---

### run

▸ **run**(`file`, `args?`, `options?`): `Promise`<`ExecaReturnValue`\<string> &
{ `code`: `number` }>

#### Parameters

| Name       | Type            |
| :--------- | :-------------- |
| `file`     | `string`        |
| `args?`    | `string`[]      |
| `options?` | [RunOptions][9] |

#### Returns

`Promise`<`ExecaReturnValue`\<string> & { `code`: `number` }>

#### Defined in

[test/setup.ts:342][65]

---

### runnerFactory

▸ **runnerFactory**(`file`, `args?`, `options?`): (`args?`: `string`\[],
`options?`: [RunOptions][9]) => `Promise`<`ExecaReturnValue`\<string> & {
`code`: `number` }>

#### Parameters

| Name       | Type            |
| :--------- | :-------------- |
| `file`     | `string`        |
| `args?`    | `string`[]      |
| `options?` | [RunOptions][9] |

#### Returns

`fn`

▸ (`args?`, `options?`): `Promise`<`ExecaReturnValue`\<string> & { `code`:
`number` }>

##### Parameters

| Name       | Type            |
| :--------- | :-------------- |
| `args?`    | `string`[]      |
| `options?` | [RunOptions][9] |

##### Returns

`Promise`<`ExecaReturnValue`\<string> & { `code`: `number` }>

#### Defined in

[test/setup.ts:354][66]

---

### webpackTestFixture

▸ **webpackTestFixture**(): [MockFixture][8]

#### Returns

[MockFixture][8]

#### Defined in

[test/setup.ts:493][67]

---

### withMockedArgv

▸ **withMockedArgv**(`fn`, `newArgv`, `options?`): `Promise`\<void>

#### Parameters

| Name      | Type                  |
| :-------- | :-------------------- |
| `fn`      | () => `AnyVoid`       |
| `newArgv` | `string`[]            |
| `options` | [MockArgvOptions][14] |

#### Returns

`Promise`\<void>

#### Defined in

[test/setup.ts:160][68]

---

### withMockedEnv

▸ **withMockedEnv**(`fn`, `newEnv`, `options?`): `Promise`\<void>

#### Parameters

| Name      | Type                     |
| :-------- | :----------------------- |
| `fn`      | () => `AnyVoid`          |
| `newEnv`  | `Record`<string, string> |
| `options` | [MockEnvOptions][15]     |

#### Returns

`Promise`\<void>

#### Defined in

[test/setup.ts:193][69]

---

### withMockedExit

▸ **withMockedExit**(`fn`): `Promise`\<void>

#### Parameters

| Name | Type                                                      |
| :--- | :-------------------------------------------------------- |
| `fn` | (`spies`: { `exitSpy`: `jest.SpyInstance` }) => `AnyVoid` |

#### Returns

`Promise`\<void>

#### Defined in

[test/setup.ts:263][70]

---

### withMockedFixture

▸ **withMockedFixture**\<CustomOptions, CustomContext>(`(destructured)`):
`Promise`\<void>

#### Type parameters

| Name            | Type                                            |
| :-------------- | :---------------------------------------------- |
| `CustomOptions` | `CustomOptions`: `Record`<string, unknown> = {} |
| `CustomContext` | `CustomContext`: `Record`<string, unknown> = {} |

#### Parameters

| Name                     | Type                                                                                                                                     |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `(destructured)`         | `Object`                                                                                                                                 |
| ▶ `({ fn })`             | [FixtureAction][13]<[FixtureContext][4]<[FixtureOptions][5] & `Partial`<`Record`<string, unknown> & `CustomOptions`>> & `CustomContext`> |
| ▶ `({ options? })`       | `Partial`<[FixtureOptions][5] & `CustomOptions`>                                                                                         |
| ▶ `({ testIdentifier })` | `string`                                                                                                                                 |

#### Returns

`Promise`\<void>

#### Defined in

[test/setup.ts:658][71]

---

### withMockedOutput

▸ **withMockedOutput**(`fn`): `Promise`\<void>

#### Parameters

| Name | Type                                                                                                                                                                                                                          |
| :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fn` | (`spies`: { `errorSpy`: `jest.SpyInstance` ; `infoSpy`: `jest.SpyInstance` ; `logSpy`: `jest.SpyInstance` ; `stdErrSpy`: `jest.SpyInstance` ; `stdoutSpy`: `jest.SpyInstance` ; `warnSpy`: `jest.SpyInstance` }) => `AnyVoid` |

#### Returns

`Promise`\<void>

#### Defined in

[test/setup.ts:295][72]

[1]: ../README.md
[2]: ../classes/test_setup.factoryexhaustionerror.md
[3]: ../interfaces/test_setup.dummydirectoriesfixtureoptions.md
[4]: ../interfaces/test_setup.fixturecontext.md
[5]: ../interfaces/test_setup.fixtureoptions.md
[6]: ../interfaces/test_setup.gitprovider.md
[7]: ../interfaces/test_setup.gitrepositoryfixtureoptions.md
[8]: ../interfaces/test_setup.mockfixture.md
[9]: ../interfaces/test_setup.runoptions.md
[10]: ../interfaces/test_setup.testresultprovider.md
[11]: ../interfaces/test_setup.treeoutputprovider.md
[12]: ../interfaces/test_setup.webpacktestfixtureoptions.md
[13]: test_setup.md#fixtureaction
[14]: test_setup.md#mockargvoptions
[15]: test_setup.md#mockenvoptions
[16]: test_setup.md#returnsstring
[17]: test_setup.md#asmockedfunction
[18]: test_setup.md#asmockednextapimiddleware
[19]: test_setup.md#describerootfixture
[20]: test_setup.md#dummydirectoriesfixture
[21]: test_setup.md#dummyfilesfixture
[22]: test_setup.md#dummynpmpackagefixture
[23]: test_setup.md#gitrepositoryfixture
[24]: test_setup.md#isolatedimport
[25]: test_setup.md#isolatedimportfactory
[26]: test_setup.md#itemfactory
[27]: test_setup.md#mockargvfactory
[28]: test_setup.md#mockenvfactory
[29]: test_setup.md#mockfixturefactory
[30]: test_setup.md#nodeimporttestfixture
[31]: test_setup.md#npmlinkselffixture
[32]: test_setup.md#protectedimportfactory
[33]: test_setup.md#rootfixture
[34]: test_setup.md#run
[35]: test_setup.md#runnerfactory
[36]: test_setup.md#webpacktestfixture
[37]: test_setup.md#withmockedargv
[38]: test_setup.md#withmockedenv
[39]: test_setup.md#withmockedexit
[40]: test_setup.md#withmockedfixture
[41]: test_setup.md#withmockedoutput
[42]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L418
[43]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L139
[44]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L149
[45]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L421
[46]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L130
[47]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L131
[48]: src_backend_middleware.md
[49]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L61
[50]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L644
[51]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L600
[52]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L619
[53]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L453
[54]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L578
[55]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L234
[56]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L258
[57]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L82
[58]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L176
[59]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L213
[60]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L770
[61]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L546
[62]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L478
[63]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L278
[64]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L434
[65]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L342
[66]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L354
[67]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L493
[68]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L160
[69]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L193
[70]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L263
[71]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L658
[72]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L295
