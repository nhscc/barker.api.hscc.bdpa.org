[barker.api.hscc.bdpa.org][1] / [test/setup][2] / FixtureContext

# Interface: FixtureContext\<CustomOptions>

[test/setup][2].FixtureContext

## Type parameters

| Name            | Type                                    |
| :-------------- | :-------------------------------------- |
| `CustomOptions` | extends `Record`<`string`, `unknown`>{} |

## Hierarchy

- `Partial`<[`TestResultProvider`][3]>

- `Partial`<[`TreeOutputProvider`][4]>

- `Partial`<[`GitProvider`][5]>

  ↳ **`FixtureContext`**

## Table of contents

### Properties

- [debug][6]
- [fileContents][7]
- [git][8]
- [options][9]
- [root][10]
- [testIdentifier][11]
- [testResult][12]
- [treeOutput][13]
- [using][14]

## Properties

### debug

• **debug**: `Debugger`

#### Defined in

[test/setup.ts:437][15]

---

### fileContents

• **fileContents**: `Object`

#### Index signature

▪ \[filePath: `string`]: `string`

#### Defined in

[test/setup.ts:436][16]

---

### git

• `Optional` **git**: `SimpleGit`

#### Inherited from

Partial.git

#### Defined in

[test/setup.ts:452][17]

---

### options

• **options**: [`FixtureOptions`][18] & `CustomOptions`

#### Defined in

[test/setup.ts:434][19]

---

### root

• **root**: `string`

#### Defined in

[test/setup.ts:432][20]

---

### testIdentifier

• **testIdentifier**: `string`

#### Defined in

[test/setup.ts:433][21]

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

[test/setup.ts:442][22]

---

### treeOutput

• `Optional` **treeOutput**: `string`

#### Inherited from

Partial.treeOutput

#### Defined in

[test/setup.ts:447][23]

---

### using

• **using**: [`MockFixture`][24]<[`FixtureContext`][25]<`Object`>>\[]

#### Defined in

[test/setup.ts:435][26]

[1]: ../README.md
[2]: ../modules/test_setup.md
[3]: test_setup.testresultprovider.md
[4]: test_setup.treeoutputprovider.md
[5]: test_setup.gitprovider.md
[6]: test_setup.fixturecontext.md#debug
[7]: test_setup.fixturecontext.md#filecontents
[8]: test_setup.fixturecontext.md#git
[9]: test_setup.fixturecontext.md#options
[10]: test_setup.fixturecontext.md#root
[11]: test_setup.fixturecontext.md#testidentifier
[12]: test_setup.fixturecontext.md#testresult
[13]: test_setup.fixturecontext.md#treeoutput
[14]: test_setup.fixturecontext.md#using
[15]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L437
[16]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L436
[17]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L452
[18]: test_setup.fixtureoptions.md
[19]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L434
[20]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L432
[21]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L433
[22]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L442
[23]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L447
[24]: test_setup.mockfixture.md
[25]: test_setup.fixturecontext.md
[26]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/setup.ts#L435
