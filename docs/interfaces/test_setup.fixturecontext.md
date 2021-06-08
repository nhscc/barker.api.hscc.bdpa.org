[barker.api.hscc.bdpa.org][1] / [test/setup][2] / FixtureContext

# Interface: FixtureContext\<CustomOptions>

[test/setup][2].FixtureContext

## Type parameters

| Name            | Type                                            |
| :-------------- | :---------------------------------------------- |
| `CustomOptions` | `CustomOptions`: `Record`<string, unknown> = {} |

## Hierarchy

- `Partial`<[TestResultProvider][3]>

  ↳ **FixtureContext**

## Table of contents

### Properties

- [debug][4]
- [fileContents][5]
- [git][6]
- [options][7]
- [root][8]
- [testIdentifier][9]
- [testResult][10]
- [treeOutput][11]
- [using][12]

## Properties

### debug

• **debug**: `Debugger`

#### Defined in

[test/setup.ts:398][13]

---

### fileContents

• **fileContents**: `Object`

#### Index signature

▪ \[filePath: `string`]: `string`

#### Defined in

[test/setup.ts:397][14]

---

### git

• `Optional` **git**: `SimpleGit`

#### Inherited from

Partial.git

#### Defined in

[test/setup.ts:413][15]

---

### options

• **options**: [FixtureOptions][16] & `CustomOptions`

#### Defined in

[test/setup.ts:395][17]

---

### root

• **root**: `string`

#### Defined in

[test/setup.ts:393][18]

---

### testIdentifier

• **testIdentifier**: `string`

#### Defined in

[test/setup.ts:394][19]

---

### testResult

• `Optional` **testResult**: `Object`

#### Type declaration

| Name     | Type     |
| :------- | :------- |
| `code`   | `number` |
| `stderr` | `string` |
| `stdout` | `string` |

#### Inherited from

Partial.testResult

#### Defined in

[test/setup.ts:403][20]

---

### treeOutput

• `Optional` **treeOutput**: `string`

#### Inherited from

Partial.treeOutput

#### Defined in

[test/setup.ts:408][21]

---

### using

• **using**: [MockFixture][22]<[FixtureContext][23]<`Object`>>\[]

#### Defined in

[test/setup.ts:396][24]

[1]: ../README.md
[2]: ../modules/test_setup.md
[3]: test_setup.testresultprovider.md
[4]: test_setup.fixturecontext.md#debug
[5]: test_setup.fixturecontext.md#filecontents
[6]: test_setup.fixturecontext.md#git
[7]: test_setup.fixturecontext.md#options
[8]: test_setup.fixturecontext.md#root
[9]: test_setup.fixturecontext.md#testidentifier
[10]: test_setup.fixturecontext.md#testresult
[11]: test_setup.fixturecontext.md#treeoutput
[12]: test_setup.fixturecontext.md#using
[13]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L398
[14]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L397
[15]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L413
[16]: test_setup.fixtureoptions.md
[17]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L395
[18]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L393
[19]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L394
[20]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L403
[21]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L408
[22]: test_setup.mockfixture.md
[23]: test_setup.fixturecontext.md
[24]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L396
