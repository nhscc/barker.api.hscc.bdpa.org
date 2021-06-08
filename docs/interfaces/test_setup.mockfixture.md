[barker.api.hscc.bdpa.org][1] / [test/setup][2] / MockFixture

# Interface: MockFixture\<Context>

[test/setup][2].MockFixture

## Type parameters

| Name      | Type                            |
| :-------- | :------------------------------ |
| `Context` | `Context` = [FixtureContext][3] |

## Table of contents

### Properties

- [description][4]
- [name][5]
- [setup][6]
- [teardown][7]

## Properties

### description

• **description**: `string` | [ReturnsString][8]\<Context>

#### Defined in

[test/setup.ts:428][9]

---

### name

• **name**: `string` | `symbol` | [ReturnsString][8]\<Context>

#### Defined in

[test/setup.ts:427][10]

---

### setup

• `Optional` **setup**: [FixtureAction][11]\<Context>

#### Defined in

[test/setup.ts:429][12]

---

### teardown

• `Optional` **teardown**: [FixtureAction][11]\<Context>

#### Defined in

[test/setup.ts:430][13]

[1]: ../README.md
[2]: ../modules/test_setup.md
[3]: test_setup.fixturecontext.md
[4]: test_setup.mockfixture.md#description
[5]: test_setup.mockfixture.md#name
[6]: test_setup.mockfixture.md#setup
[7]: test_setup.mockfixture.md#teardown
[8]: ../modules/test_setup.md#returnsstring
[9]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L428
[10]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L427
[11]: ../modules/test_setup.md#fixtureaction
[12]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L429
[13]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/setup.ts#L430
