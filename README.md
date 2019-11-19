Sisal to IR1 translator
========

### Deployment

to setup:

```bash
npm install
```

or

```bash
make setup
```

to run tests:

```bash
make test
```

to compile:

```bash
make compile
```

to run sisal program:

```bash
node ./build/sisal.js <program.sis>
```

to output computation graph in graphML format:

```bash
node ./build/sisal.js <program.sis> --graph
```

for example:
```bash
node ./build/sisal.js ./test/programs/if.sis --graph
```

### Feedback

Please, feel free to create issue or make contribution to this software!
