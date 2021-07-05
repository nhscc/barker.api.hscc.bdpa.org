# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Conventional Commits][1], and this project adheres to
[Semantic Versioning][2].

# 1.0.0 (2021-07-05)

### Bug Fixes

- Fixed bug that prevented PUT requests from updating entities using own data
  ([31132c7][3])
- More consistent search interface ([20b3c5a][4])
- **backend:** do not complain if deleting deleted barks ([bdcb0a6][5])
- **backend:** ensure boolean values (like "deleted") pass search validation
  ([19236c4][6])
- **backend:** use more permissive email regex ([320912e][7])
- **backend/middleware:** actually use the more human-friendly error messages
  ([c1bf1b2][8])
- **backend/middleware:** lazily evaluate env upon import ([fbab7bc][9])
- **data:** flatten corpus ([e1a9997][10])
- **data:** remove double spaces ([0d1445e][11])
- **data:** remove useless data ([23134f8][12])
- **data/generate-corpus.js:** spacing and newline in output ([faa27a1][13])
- **docs:** discriminating doc generation ([8ab67b8][14])
- **index.ts:** retryAfter can no longer go negative ([65cff44][15])
- Several bug fixes ([f4ef42e][16])
- **spellcheck-commit.js:** better package.json handling ([9ed5c98][17])

### Build System

- **package.json:** better test-integration filtering; now includes tsx files
  ([c101e05][18])
- **test/db.ts:** add defer parameter to setupTestDb() ([5752064][19])
- Add eslint-config-next ([4c76d18][20])
- Debug mode env renamed to DEBUG_INSPECTING ([d8895aa][21])
- Next v11 compliance ([55ed28e][22])
- Unlocked all endpoints (go live!) ([91f011a][23])
- Update dependencies ([3dd6f39][24])
- **deps:** bump @types/node from 14.17.1 to 15.6.1 ([6bcfeae][25])
- **deps:** bump @types/node from 15.12.1 to 15.12.2 ([33b51c0][26])
- **deps:** bump @types/node from 15.6.1 to 15.12.1 ([36e507d][27])
- **deps:** bump @types/react from 17.0.8 to 17.0.9 ([2778ccf][28])
- **deps:** bump @typescript-eslint/eslint-plugin from 4.25.0 to 4.26.0
  ([031c550][29])
- **deps:** bump prettier from 2.3.0 to 2.3.1 ([4d03937][30])
- **deps:** bump type-fest from 1.1.3 to 1.2.0 ([4225c00][31])
- **deps:** bump typedoc-plugin-markdown from 3.8.2 to 3.9.0 ([978d37b][32])
- Revert to github-linked vercel app ([c23a05c][33])
- Update dependencies ([95fb8d0][34])
- Update dependencies ([260de1b][35])
- **deps:** bump babel-jest from 26.6.3 to 27.0.2 ([e8fec6b][36])
- **deps:** bump jest-circus from 26.6.3 to 27.0.3 ([63632a2][37])
- **deps:** bump lint-staged from 10.5.4 to 11.0.0 ([f83f2ad][38])
- **next.config.js:** enable webpack 5 support ([600d899][39])
- Update dependencies ([79e0120][40])

### Features

- **next.config.js:** add another layer of anti-bot protection ([14a254a][41])
- Add vercel deploy/build support ([2bde2ad][42])
- **data:** add convo corpus ([72c8fe1][43])
- **index.tsx:** add ?hydrate dev functionality ([e053f39][44])
- **robots.txt:** add robots.txt ([000f45a][45])
- Initial commit (carryover from airports api) ([5a838c7][46])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/31132c74f5931967a0549267f5b4e6d7c51b7dbd
[4]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/20b3c5af7493777bb8a7903967bd9117af03a235
[5]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/bdcb0a65278dfa54d82e8f8d37d1c2c4eb642087
[6]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/19236c4a557e68e55439bd59e59073ba2a82ac8f
[7]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/320912ee3e7adc086ceaf31870558e71fb108df9
[8]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/c1bf1b2a362adb4f2a2a62135bf881d158a5c9be
[9]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/fbab7bc8d6d24a6192c0a8e57ec26d667216834e
[10]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/e1a99973d08192647dd24dfd6474f777ba821cbf
[11]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/0d1445e1280beb0a2c68498fd3fd215dc62ed8c7
[12]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/23134f873397b29acd5c716af2a64d136901338c
[13]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/faa27a138df003c9e618fb4872591d65c4cc75b1
[14]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/8ab67b8a8b17832b1fd93f8c93ab519b920c7d7f
[15]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/65cff4431d8401fd3f89f9ad052f0d880cf0d523
[16]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/f4ef42e967b8323b28a1fbeab159a9425fb6295c
[17]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/9ed5c98f7619243946e96b93fd52b1ff446cf23a
[18]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/c101e0512236a8d7db2a36d6116d6579884d64ba
[19]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/575206417bf51aa958c8b68b99d0a2ebc3b22aec
[20]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/4c76d18e218ab47dc526222b6016fcdf7fc1c161
[21]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/d8895aa8bac155874141cec75c90c4be20649602
[22]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/55ed28e894fe7017a72e7e43970c1313ca24d885
[23]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/91f011a714d10e4c3bc2a5cf6609a80d655bb37a
[24]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/3dd6f394a3f47e12c47a14dae3f37ffd47a764ef
[25]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/6bcfeae5482893b2277a78fc0554abffceea86d3
[26]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/33b51c0c3cf84aff326516ba6a0de6c8a6b70b71
[27]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/36e507dc98d8a0d8a53b2afea2cb47d8a0c2fff0
[28]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/2778ccffec8b4ad6af8e0652a4b16d0db1c9d127
[29]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/031c550037b5e2ec85994af8c9fd739260037c74
[30]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/4d0393728ae5fdcd728309fc60435799e133b33a
[31]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/4225c00ebe256ad8c83cd67629407c177983c372
[32]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/978d37b6f70964aca7c2292dcac2e43be01454cc
[33]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/c23a05c8f9b57e62c2e6aaf11aa381e27e2200a8
[34]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/95fb8d0d1250274f6d799bed90cc281576628487
[35]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/260de1b03b4f51f91a6676ee334b95dcec71e23e
[36]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/e8fec6b6206afe048548d2eced427788aff7cb95
[37]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/63632a2b01293505d5c260bb40f35ddda23161b8
[38]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/f83f2adc1e08de013d06fecb24311bbc4b45b7ad
[39]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/600d8998592db3ed3f0760b94d72a2fdbccd0b7f
[40]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/79e01202f79bfb3ede4d73cfcd91818da59bc608
[41]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/14a254afe0ad4aa9f423d7709932b2b22afd277e
[42]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/2bde2ad212eb18918282d93cae75aafc71c6f394
[43]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/72c8fe1ba70fa05eb97aacb109f873627fa95216
[44]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/e053f390584350ebc3aeebf73f260e71ff3223ef
[45]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/000f45a5c88dc6037c169172d8d7d1f734d09e62
[46]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/commit/5a838c7b6e14c64b60217dd3cbf1768065cc7454
