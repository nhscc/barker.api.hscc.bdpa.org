[barker.api.hscc.bdpa.org][1] / [test/setup][2] / FixtureOptions

# Interface: FixtureOptions

[test/setup][2].FixtureOptions

## Hierarchy

- `Partial`<[WebpackTestFixtureOptions][3]>

  ↳ **FixtureOptions**

## Table of contents

### Properties

- [directoryPaths][4]
- [initialFileContents][5]
- [performCleanup][6]
- [setupGit][7]
- [use][8]
- [webpackVersion][9]

## Properties

### directoryPaths

• `Optional` **directoryPaths**: `string`\[]

#### Inherited from

Partial.directoryPaths

#### Defined in

[test/setup.ts:384][10]

---

### initialFileContents

• **initialFileContents**: `Object`

#### Index signature

▪ \[filePath: `string`]: `string`

#### Defined in

[test/setup.ts:369][11]

---

### performCleanup

• **performCleanup**: `boolean`

#### Defined in

[test/setup.ts:367][12]

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

[test/setup.ts:379][13]

---

### use

• **use**: [MockFixture][14]<[FixtureContext][15]<`Object`>>\[]

#### Defined in

[test/setup.ts:368][16]

---

### webpackVersion

• `Optional` **webpackVersion**: `string`

#### Inherited from

Partial.webpackVersion

#### Defined in

[test/setup.ts:374][17]

[1]: ../README.md
[2]: ../modules/test_setup.md
[3]: test_setup.webpacktestfixtureoptions.md
[4]: test_setup.fixtureoptions.md#directorypaths
[5]: test_setup.fixtureoptions.md#initialfilecontents
[6]: test_setup.fixtureoptions.md#performcleanup
[7]: test_setup.fixtureoptions.md#setupgit
[8]: test_setup.fixtureoptions.md#use
[9]: test_setup.fixtureoptions.md#webpackversion
[10]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L384
[11]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L369
[12]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L367
[13]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L379
[14]: test_setup.mockfixture.md
[15]: test_setup.fixturecontext.md
[16]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L368
[17]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L374
