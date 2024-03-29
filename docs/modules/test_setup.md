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
- [toPublicBark][36]
- [toPublicUser][37]
- [webpackTestFixture][38]
- [withMockedArgv][39]
- [withMockedEnv][40]
- [withMockedExit][41]
- [withMockedFixture][42]
- [withMockedOutput][43]

## Type aliases

### FixtureAction

Ƭ **FixtureAction**<`Context`>: (`ctx`: `Context`) => `Promise`<`unknown`>

#### Type parameters

| Name      | Type                  |
| :-------- | :-------------------- |
| `Context` | [`FixtureContext`][4] |

#### Type declaration

▸ (`ctx`): `Promise`<`unknown`>

##### Parameters

| Name  | Type      |
| :---- | :-------- |
| `ctx` | `Context` |

##### Returns

`Promise`<`unknown`>

#### Defined in

[test/setup.ts:457][44]

---

### MockArgvOptions

Ƭ **MockArgvOptions**: `Object`

#### Type declaration

| Name       | Type      | Description                                                                                                                                                                 |
| :--------- | :-------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `replace?` | `boolean` | By default, the first two elements in `process.argv` are preserved. Setting `replace` to `true` will cause the entire process.argv array to be replaced **`default`** false |

#### Defined in

[test/setup.ts:178][45]

---

### MockEnvOptions

Ƭ **MockEnvOptions**: `Object`

#### Type declaration

| Name       | Type      | Description                                                                                                                                                               |
| :--------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `replace?` | `boolean` | By default, the `process.env` object is emptied and re-hydrated with `newEnv`. Setting `replace` to `false` will cause `newEnv` to be appended instead **`default`** true |

#### Defined in

[test/setup.ts:188][46]

---

### ReturnsString

Ƭ **ReturnsString**<`Context`>: (`ctx`: `Context`) => `Promise`<`string`> |
`string`

#### Type parameters

| Name      | Type                  |
| :-------- | :-------------------- |
| `Context` | [`FixtureContext`][4] |

#### Type declaration

▸ (`ctx`): `Promise`<`string`> | `string`

##### Parameters

| Name  | Type      |
| :---- | :-------- |
| `ctx` | `Context` |

##### Returns

`Promise`<`string`> | `string`

#### Defined in

[test/setup.ts:460][47]

## Functions

### asMockedFunction

▸ **asMockedFunction**<`T`>(): `jest.MockedFunction`<`T`>

#### Type parameters

| Name | Type                           |
| :--- | :----------------------------- |
| `T`  | extends ` AnyFunction``never ` |

#### Returns

`jest.MockedFunction`<`T`>

#### Defined in

[test/setup.ts:169][48]

▸ **asMockedFunction**<`T`>(`fn`): `jest.MockedFunction`<`T`>

#### Type parameters

| Name | Type                  |
| :--- | :-------------------- |
| `T`  | extends `AnyFunction` |

#### Parameters

| Name | Type |
| :--- | :--- |
| `fn` | `T`  |

#### Returns

`jest.MockedFunction`<`T`>

#### Defined in

[test/setup.ts:170][49]

---

### asMockedNextApiMiddleware

▸ **asMockedNextApiMiddleware**(`wrapHandler`): `void`

#### Parameters

| Name          | Type                                            |
| :------------ | :---------------------------------------------- |
| `wrapHandler` | [`src/backend/middleware`][50][`"wrapHandler"`] |

#### Returns

`void`

#### Defined in

[test/setup.ts:95][51]

---

### describeRootFixture

▸ **describeRootFixture**(): [`MockFixture`][8]

#### Returns

[`MockFixture`][8]

#### Defined in

[test/setup.ts:695][52]

---

### dummyDirectoriesFixture

▸ **dummyDirectoriesFixture**(): [`MockFixture`][8]

#### Returns

[`MockFixture`][8]

#### Defined in

[test/setup.ts:649][53]

---

### dummyFilesFixture

▸ **dummyFilesFixture**(): [`MockFixture`][8]

#### Returns

[`MockFixture`][8]

#### Defined in

[test/setup.ts:670][54]

---

### dummyNpmPackageFixture

▸ **dummyNpmPackageFixture**(): [`MockFixture`][8]

#### Returns

[`MockFixture`][8]

#### Defined in

[test/setup.ts:492][55]

---

### gitRepositoryFixture

▸ **gitRepositoryFixture**(): [`MockFixture`][8]

#### Returns

[`MockFixture`][8]

#### Defined in

[test/setup.ts:625][56]

---

### isolatedImport

▸ **isolatedImport**(`path`): `Promise`<`unknown`>

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `path` | `string` |

#### Returns

`Promise`<`unknown`>

#### Defined in

[test/setup.ts:273][57]

---

### isolatedImportFactory

▸ **isolatedImportFactory**(`path`): () => `Promise`<`unknown`>

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `path` | `string` |

#### Returns

`fn`

▸ (): `Promise`<`unknown`>

##### Returns

`Promise`<`unknown`>

#### Defined in

[test/setup.ts:297][58]

---

### itemFactory

▸ **itemFactory**<`T`>(`testItems`): () => `T` & { `$iter`:
`IterableIterator`<`T`> ; `count`: `number` ; `items`: `T`\[] ;
`[asyncIterator]`: () => `AsyncGenerator`<`T`, `void`, `unknown`> ;
`[iterator]`: () => `Generator`<`T`, `void`, `unknown`> }

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name        | Type  |
| :---------- | :---- |
| `testItems` | `T`[] |

#### Returns

() => `T` & { `$iter`: `IterableIterator`<`T`> ; `count`: `number` ; `items`:
`T`\[] ; `[asyncIterator]`: () => `AsyncGenerator`<`T`, `void`, `unknown`> ;
`[iterator]`: () => `Generator`<`T`, `void`, `unknown`> }

#### Defined in

[test/setup.ts:121][59]

---

### mockArgvFactory

▸ **mockArgvFactory**(`newArgv`, `options?`): (`fn`: () => `AnyVoid`,
`newArgv?`: `string`\[], `options?`: [`MockArgvOptions`][14]) =>
`Promise`<`void`>

#### Parameters

| Name      | Type                    |
| :-------- | :---------------------- |
| `newArgv` | typeof `process.argv`   |
| `options` | [`MockArgvOptions`][14] |

#### Returns

`fn`

▸ (`fn`, `newArgv?`, `options?`): `Promise`<`void`>

##### Parameters

| Name       | Type                    |
| :--------- | :---------------------- |
| `fn`       | () => `AnyVoid`         |
| `newArgv?` | `string`[]              |
| `options?` | [`MockArgvOptions`][14] |

##### Returns

`Promise`<`void`>

#### Defined in

[test/setup.ts:215][60]

---

### mockEnvFactory

▸ **mockEnvFactory**(`newEnv`, `options?`): (`fn`: () => `AnyVoid`, `newEnv?`:
`Record`<`string`, `string`>, `options?`: [`MockEnvOptions`][15]) =>
`Promise`<`void`>

#### Parameters

| Name      | Type                         |
| :-------- | :--------------------------- |
| `newEnv`  | `Record`<`string`, `string`> |
| `options` | [`MockEnvOptions`][15]       |

#### Returns

`fn`

▸ (`fn`, `newEnv?`, `options?`): `Promise`<`void`>

##### Parameters

| Name       | Type                         |
| :--------- | :--------------------------- |
| `fn`       | () => `AnyVoid`              |
| `newEnv?`  | `Record`<`string`, `string`> |
| `options?` | [`MockEnvOptions`][15]       |

##### Returns

`Promise`<`void`>

#### Defined in

[test/setup.ts:252][61]

---

### mockFixtureFactory

▸ **mockFixtureFactory**<`CustomOptions`, `CustomContext`>(`testIdentifier`,
`options?`): (`fn`:
[`FixtureAction`][13]<[`FixtureContext`][4]<[`FixtureOptions`][5] &
`Partial`<`Record`<`string`, `unknown`> & `CustomOptions`>> & `CustomContext`>)
=> `Promise`<`void`>

#### Type parameters

| Name            | Type                                    |
| :-------------- | :-------------------------------------- |
| `CustomOptions` | extends `Record`<`string`, `unknown`>{} |
| `CustomContext` | extends `Record`<`string`, `unknown`>{} |

#### Parameters

| Name             | Type                                               |
| :--------------- | :------------------------------------------------- |
| `testIdentifier` | `string`                                           |
| `options?`       | `Partial`<[`FixtureOptions`][5] & `CustomOptions`> |

#### Returns

`fn`

▸ (`fn`): `Promise`<`void`>

##### Parameters

| Name | Type                                                                                                                                               |
| :--- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fn` | [`FixtureAction`][13]<[`FixtureContext`][4]<[`FixtureOptions`][5] & `Partial`<`Record`<`string`, `unknown`> & `CustomOptions`>> & `CustomContext`> |

##### Returns

`Promise`<`void`>

#### Defined in

[test/setup.ts:821][62]

---

### nodeImportTestFixture

▸ **nodeImportTestFixture**(): [`MockFixture`][8]

#### Returns

[`MockFixture`][8]

#### Defined in

[test/setup.ts:591][63]

---

### npmLinkSelfFixture

▸ **npmLinkSelfFixture**(): [`MockFixture`][8]

#### Returns

[`MockFixture`][8]

#### Defined in

[test/setup.ts:517][64]

---

### protectedImportFactory

▸ **protectedImportFactory**(`path`): (`params?`: { `expectedExitCode?`:
`number` }) => `Promise`<`unknown`>

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `path` | `string` |

#### Returns

`fn`

▸ (`params?`): `Promise`<`unknown`>

##### Parameters

| Name                       | Type     |
| :------------------------- | :------- |
| `params?`                  | `Object` |
| `params.expectedExitCode?` | `number` |

##### Returns

`Promise`<`unknown`>

#### Defined in

[test/setup.ts:317][65]

---

### rootFixture

▸ **rootFixture**(): [`MockFixture`][8]

#### Returns

[`MockFixture`][8]

#### Defined in

[test/setup.ts:473][66]

---

### run

▸ **run**(`file`, `args?`, `options?`): `Promise`<`ExecaReturnValue`<`string`> &
{ `code`: `number` }>

#### Parameters

| Name       | Type              |
| :--------- | :---------------- |
| `file`     | `string`          |
| `args?`    | `string`[]        |
| `options?` | [`RunOptions`][9] |

#### Returns

`Promise`<`ExecaReturnValue`<`string`> & { `code`: `number` }>

#### Defined in

[test/setup.ts:381][67]

---

### runnerFactory

▸ **runnerFactory**(`file`, `args?`, `options?`): (`args?`: `string`\[],
`options?`: [`RunOptions`][9]) => `Promise`<`ExecaReturnValue`<`string`> & {
`code`: `number` }>

#### Parameters

| Name       | Type              |
| :--------- | :---------------- |
| `file`     | `string`          |
| `args?`    | `string`[]        |
| `options?` | [`RunOptions`][9] |

#### Returns

`fn`

▸ (`args?`, `options?`): `Promise`<`ExecaReturnValue`<`string`> & { `code`:
`number` }>

##### Parameters

| Name       | Type              |
| :--------- | :---------------- |
| `args?`    | `string`[]        |
| `options?` | [`RunOptions`][9] |

##### Returns

`Promise`<`ExecaReturnValue`<`string`> & { `code`: `number` }>

#### Defined in

[test/setup.ts:393][68]

---

### toPublicBark

▸ **toPublicBark**(`internal`): [`PublicBark`][69]

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `internal` | `WithId`<[`InternalBark`][70]> |

#### Returns

[`PublicBark`][69]

#### Defined in

[test/setup.ts:56][71]

---

### toPublicUser

▸ **toPublicUser**(`internal`): [`PublicUser`][72]

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `internal` | `WithId`<[`InternalUser`][73]> |

#### Returns

[`PublicUser`][72]

#### Defined in

[test/setup.ts:41][74]

---

### webpackTestFixture

▸ **webpackTestFixture**(): [`MockFixture`][8]

#### Returns

[`MockFixture`][8]

#### Defined in

[test/setup.ts:532][75]

---

### withMockedArgv

▸ **withMockedArgv**(`fn`, `newArgv`, `options?`): `Promise`<`void`>

#### Parameters

| Name      | Type                    |
| :-------- | :---------------------- |
| `fn`      | () => `AnyVoid`         |
| `newArgv` | `string`[]              |
| `options` | [`MockArgvOptions`][14] |

#### Returns

`Promise`<`void`>

#### Defined in

[test/setup.ts:199][76]

---

### withMockedEnv

▸ **withMockedEnv**(`fn`, `newEnv`, `options?`): `Promise`<`void`>

#### Parameters

| Name      | Type                         |
| :-------- | :--------------------------- |
| `fn`      | () => `AnyVoid`              |
| `newEnv`  | `Record`<`string`, `string`> |
| `options` | [`MockEnvOptions`][15]       |

#### Returns

`Promise`<`void`>

#### Defined in

[test/setup.ts:232][77]

---

### withMockedExit

▸ **withMockedExit**(`fn`): `Promise`<`void`>

#### Parameters

| Name | Type                                                      |
| :--- | :-------------------------------------------------------- |
| `fn` | (`spies`: { `exitSpy`: `jest.SpyInstance` }) => `AnyVoid` |

#### Returns

`Promise`<`void`>

#### Defined in

[test/setup.ts:302][78]

---

### withMockedFixture

▸ **withMockedFixture**<`CustomOptions`, `CustomContext`>(`(destructured)`):
`Promise`<`void`>

#### Type parameters

| Name            | Type                                    |
| :-------------- | :-------------------------------------- |
| `CustomOptions` | extends `Record`<`string`, `unknown`>{} |
| `CustomContext` | extends `Record`<`string`, `unknown`>{} |

#### Parameters

| Name                     | Type                                                                                                                                               |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| `(destructured)`         | `Object`                                                                                                                                           |
| ▶ `({ fn })`             | [`FixtureAction`][13]<[`FixtureContext`][4]<[`FixtureOptions`][5] & `Partial`<`Record`<`string`, `unknown`> & `CustomOptions`>> & `CustomContext`> |
| ▶ `({ options? })`       | `Partial`<[`FixtureOptions`][5] & `CustomOptions`>                                                                                                 |
| ▶ `({ testIdentifier })` | `string`                                                                                                                                           |

#### Returns

`Promise`<`void`>

#### Defined in

[test/setup.ts:709][79]

---

### withMockedOutput

▸ **withMockedOutput**(`fn`): `Promise`<`void`>

#### Parameters

| Name | Type                                                                                                                                                                                                                          |
| :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fn` | (`spies`: { `errorSpy`: `jest.SpyInstance` ; `infoSpy`: `jest.SpyInstance` ; `logSpy`: `jest.SpyInstance` ; `stdErrSpy`: `jest.SpyInstance` ; `stdoutSpy`: `jest.SpyInstance` ; `warnSpy`: `jest.SpyInstance` }) => `AnyVoid` |

#### Returns

`Promise`<`void`>

#### Defined in

[test/setup.ts:334][80]

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
[36]: test_setup.md#topublicbark
[37]: test_setup.md#topublicuser
[38]: test_setup.md#webpacktestfixture
[39]: test_setup.md#withmockedargv
[40]: test_setup.md#withmockedenv
[41]: test_setup.md#withmockedexit
[42]: test_setup.md#withmockedfixture
[43]: test_setup.md#withmockedoutput
[44]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L457
[45]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L178
[46]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L188
[47]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L460
[48]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L169
[49]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L170
[50]: src_backend_middleware.md
[51]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L95
[52]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L695
[53]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L649
[54]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L670
[55]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L492
[56]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L625
[57]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L273
[58]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L297
[59]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L121
[60]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L215
[61]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L252
[62]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L821
[63]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L591
[64]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L517
[65]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L317
[66]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L473
[67]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L381
[68]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L393
[69]: types_global.md#publicbark
[70]: types_global.md#internalbark
[71]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L56
[72]: types_global.md#publicuser
[73]: types_global.md#internaluser
[74]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L41
[75]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L532
[76]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L199
[77]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L232
[78]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L302
[79]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L709
[80]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L334
