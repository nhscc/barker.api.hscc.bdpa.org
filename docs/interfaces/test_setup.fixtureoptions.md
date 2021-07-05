[barker.api.hscc.bdpa.org][1] / [test/setup][2] / FixtureOptions

# Interface: FixtureOptions

[test/setup][2].FixtureOptions

## Hierarchy

- `Partial`<[`WebpackTestFixtureOptions`][3]>

- `Partial`<[`GitRepositoryFixtureOptions`][4]>

- `Partial`<[`DummyDirectoriesFixtureOptions`][5]>

  ↳ **`FixtureOptions`**

## Table of contents

### Properties

- [directoryPaths][6]
- [initialFileContents][7]
- [performCleanup][8]
- [setupGit][9]
- [use][10]
- [webpackVersion][11]

## Properties

### directoryPaths

• `Optional` **directoryPaths**: `string`\[]

#### Inherited from

Partial.directoryPaths

#### Defined in

[test/setup.ts:423][12]

---

### initialFileContents

• **initialFileContents**: `Object`

#### Index signature

▪ \[filePath: `string`]: `string`

#### Defined in

[test/setup.ts:408][13]

---

### performCleanup

• **performCleanup**: `boolean`

#### Defined in

[test/setup.ts:406][14]

---

### setupGit

• `Optional` **setupGit**: (`git`: `SimpleGit`) => `AnyVoid`

#### Type declaration

▸ (`git`): `AnyVoid`

##### Parameters

| Name  | Type        |
| :---- | :---------- |
| `git` | `SimpleGit` |

##### Returns

`AnyVoid`

#### Inherited from

Partial.setupGit

#### Defined in

[test/setup.ts:418][15]

---

### use

• **use**: [`MockFixture`][16]<[`FixtureContext`][17]<`Object`>>\[]

#### Defined in

[test/setup.ts:407][18]

---

### webpackVersion

• `Optional` **webpackVersion**: `string`

#### Inherited from

Partial.webpackVersion

#### Defined in

[test/setup.ts:413][19]

[1]: ../README.md
[2]: ../modules/test_setup.md
[3]: test_setup.webpacktestfixtureoptions.md
[4]: test_setup.gitrepositoryfixtureoptions.md
[5]: test_setup.dummydirectoriesfixtureoptions.md
[6]: test_setup.fixtureoptions.md#directorypaths
[7]: test_setup.fixtureoptions.md#initialfilecontents
[8]: test_setup.fixtureoptions.md#performcleanup
[9]: test_setup.fixtureoptions.md#setupgit
[10]: test_setup.fixtureoptions.md#use
[11]: test_setup.fixtureoptions.md#webpackversion
[12]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L423
[13]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L408
[14]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L406
[15]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L418
[16]: test_setup.mockfixture.md
[17]: test_setup.fixturecontext.md
[18]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L407
[19]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L413
