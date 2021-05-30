# Precomputed Barker Conversations

The complete corpus of conversations that (generated) users have with one
another is stored [here](./corpus.json). This corpus was created with data from
the
[Cornell Movie-Dialogs Corpus](https://www.cs.cornell.edu/~cristian/Cornell_Movie-Dialogs_Corpus.html),
a large metadata-rich collection of fictional conversations extracted from raw
movie scripts.

If for some reason you want to regenerate the corpus, run
[`node ./generate-corpus.js`](./generate-corpus.js).

> Latest corpus stats: 7510 total lines, 5331 generated usernames.
