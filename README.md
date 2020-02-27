# syntax-speed-tests
A test rig system that generates metrics and graphs of the speed of certain syntaxes against each other.

## Installation
```shell
$ git clone https://github.com/sr-jayrearon/syntax-speed-tests
$ cd syntax-speed-tests
$ npm install
```

### On MacOS
Before you run `npm install`, Xcode must be updated to most recent version in Apple store, and you must have opened Xcode to install all updates.

The Xcode Command-line tools must also be installed. Use the following command to do this:
```shell
$ xcode-select --install
```

Additionally, you must also have [Homebrew](https://brew.sh/) installed and have first installed the following packages:
```shell
$ brew install cairo pkg-config sqlite
```

#### Troubleshooting
If you get the error (`gyp: No Xcode or CLT version detected!`) when running, then you must reinstall the Xcode command-line tools using the following commands:

```shell
$ sudo rm -rf $(xcode-select -print-path)
$ xcode-select --install
```

## Running
Before running the test suite on *nix based systems, ensure that the files are set executable:
```shell
$ chmod 755 syntax-speed-tests index.js
```

 To run the test suite, use any of the following commands:
```shell
$ ./index.js
$ ./syntax-speed-tests
```

### On Windows
You must run the command though node on windows
```shell
> node index.js
```

## Commands
The test suite provides several commands as follows:

### Usage
```shell
Usage: syntax-speed-tests [options] [command]

Options:
  -V, --version       output the version number
  -a, --all           Run all tests.
  -d, --debug         Enable debug output.
  -n, --nosave        Do not save test results to database
  -s, --skip <tests>  A comma seperated list of tests to skip by index number.
  -h, --help          output usage information

Commands:
  gen-chart [tests]    Generate charts for tests from the current database.
  gen-results [tests]  Generate results for tests from current database.
  list                 Lists all tests available.
  purge                Purge all data from tests database
  run [tests]          Run the specified [tests] by index number the comma separated list of tests.
  run-all              Run all syntax speed tests and then generate graphs
  stats                Displays the current database statistics.

  Version: 1.0.0
```

### `gen-chart`
The `gen-results` command takes a comma separated list of test rig index numbers (e.g. 1, 2, 3, etc...) and creates charts in the `./images` folder containing a comparation of the relative speeds of each test within the test rig based on all data from all runs for that test rig in the database.

```shell
$ syntax-speed-test gen-chart
```

**Output**
```
[info] Creating arraynormalizationvi Chart...
[info] Creating creatinganimmutablec Chart...
[info] Creating filteringarrayconten Chart...
```

### `gen-results`
The `gen-results` command takes a comma separated list of test rig index numbers (e.g. 1, 2, 3, etc...) and outputs the test results from the associated test rig(s) within the database.

```shell
$ syntax-speed-test gen-results
```

**Output**

### `list`
The `list` command displays a list of current available test rigs.

```shell
$ syntax-speed-test list
```

**Output**
```shell
[info] 
[info] ======================================================================================================================
[info] | # | Test Rig Name                                                                                                  |
[info] ======================================================================================================================
[info] |  0| Array Merging vs. Array Concat vs. Spread Operator vs. For-loop                                                |
[info] |  1| Array Normalization via Array Concat vs. if-else ternary vs. fast defaulting ternary                           |
[info] |  2| Creating an Immutable Copy of Object via Object.assign vs. Spread Operator                                     |
[info] |  3| Filtering Array Contents via Array.filter vs. Array.forEach vs. For loop /w if-else vs. For-of loop /w if-else |
[info] |  4| Function Return Object From via Short-Form vs. Long-Form vs. Mixed-Form vs. Object.assign vs. Spread Operator  |
[info] |  5| Object Propetry Retrieval via Object Destructuring vs. Object Scope Operator                                   |
[info] ======================================================================================================================
[info] 
```

### `purge`
The `purge` command wipes all test data from the database and deletes all chart images in the images folder.

```shell
$ ./syntax-speed-test purge
```

**Output**
```
[info] Purging all data from db
[info] OK
[info] 
```

### `run`
The `run` command takes a comma separated list of test rig index numbers (e.g. 1, 2, 3, etc...) and runs the associated test rig(s).

```shell
$ syntax-speed-test run 1,2,3
```

**Output**
```
[info] Building 5000000 test cases...
[info] Filtering Array Contents via Array.filter vs. Array.forEach vs. For loop /w if-else vs. For-of loop /w if-else
[info] Running 4 tests with 100000000 operations on 5000000 cases.
[info] Running test "for loop /w inner if-else"...
[info] Running test "for-of loop /w inner if-else"...
[info] Running test "Array.forEach"...
[info] Running test "Array.filter"...
[info] 
[info] ******************
[info] * Results Report *
[info] ******************
[info] 
[info] Speeds
[info] ======
[info] [1] for loop /w inner if-else:    0.00006159 ms per op
[info] [2] for-of loop /w inner if-else: 0.00006291 ms per op
[info] [3] Array.forEach:                0.00006828 ms per op
[info] [4] Array.filter:                 0.00007266 ms per op
[info] 
[info] Ops per Second
[info] ==============
[info] [1] for loop /w inner if-else:    16236402.01331385 ops per sec
[info] [2] for-of loop /w inner if-else: 15895724.050230484 ops per sec
[info] [3] Array.forEach:                14645577.035735209 ops per sec
[info] [4] Array.filter:                 13762730.525736306 ops per sec
[info] 
[info] Speed Comparison
[info] ================
[info] [1] "for loop /w inner if-else" is the fastest syntax.
[info] [1] "for loop /w inner if-else" is 1.02x faster than [2] "for-of loop /w inner if-else"
[info] [1] "for loop /w inner if-else" is 1.11x faster than [3] "Array.forEach"
[info] [1] "for loop /w inner if-else" is 1.18x faster than [4] "Array.filter"
[info] 
[info] Projections
[info] ===========
[info] Estimated time to complete 100000000000 operations
[info] Completes [1] for loop /w inner if-else    in 1.71h
[info] Completes [2] for-of loop /w inner if-else in 1.75h
[info] Completes [3] Array.forEach                in 1.9h
[info] Completes [4] Array.filter                 in 2.02h
```

### `run-all`
The `run-all` command is equivalent to running both the `run` and `gen-chart` commands back-to-back with the `--all` flag enabled.

```shell
$ syntax-speed-test run-all
```

### `stats`
The `stats` command outputs the statistics of all test runs in the database to the console.

```shell
$ syntax-speed-test stats
```
