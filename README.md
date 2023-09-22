# evolver
Evolver is a simplistic JavaScript [genetic algorithm](https://en.wikipedia.org/wiki/Genetic_algorithm) (evolution) framework.

## Structure

The project is a web page (`index.html`) that runs two JavaScript files:

* `evolver.js`: provides an `evolver` Object that contains an interface for specifying and running a scenario. `evolver` is generic and should work with any individuals (population members) that are expressed as JavaScript Objects.
* `scenario.js`: uses the `evolver` Object to specify and run a particular scenario. In this repository, individuals are four-letter strings.

Results are not displayed on the web page, but as `console.log` output.

## evolver Members

### childrenToGenerate
Number (optional; default is set in `evolver.js`).

How many children to generate when creating a new population generation.

### childrenToRetain
Number (optional; default is set in `evolver.js`).

How many children to retain ('survival of the fittest'). Fitness is determined using `fitness()`.

### initialPopulation
Syntax: `initialPopulation(runNbr:Number): Array`

Returns an array of individuals (Objects) that constitutes the initial population.

### crossover
Syntax: `crossover(parentA:Object, parentB:Object, runNbr:Number, generationNbr:Number): Object`

Combines some of parentA and some of parentB to produce a new (child) individual, which is returned.

If the `crossover` function is not defined, `evolver` will copy (clone) random parents to provide the next generation.

### mutate
Syntax: `mutate(child:Object, runNbr:Number, generationNbr:Number): Object`

Makes a change to `child` and returns it.

If the `mutate` function is not defined, mutation will not occur.

### fitness()
Syntax: `fitness(child:Object, runNbr:Number, generationNbr:Number): Number`

Calculates and returns a value that indicates how well the `child` (individual) is suited to the environment. Larger values are considered fitter.

It is possible to simulate the effect of changing environment by making the returned value depend on `generationNbr`.

### onGeneration
Syntax: `onGeneration(population:Array, runNbr:Number, generationNbr:Number): Boolean|undefined`

An optional function that will be called after the selection of every generation. It can be used to produce output, halt the run prematurely and/or extend the run beyond the preset number of generations.

`population` is an array of Objects of the form `{individual:Object, fitness:Number}`.

Return `true` to produce another generation, `false` to end this run, or `undefined` (no `return` statement) to produce the number of generations specified in `start()`.

### start
Syntax: `start(runs:Number, generations:Number): Array`

Commences simulation of evolution. Multiple `runs` can be used to assess consistency. Each run will comprise `generations` generations (unless overridden by a value returned by `onGeneration()`).

The return value is a history Array comprising `{best:Number, average:Number}` fitness values in each [run][generation]. It can be used directly and/or passed to `dumpHistory()`.

### dumpHistory

Syntax: `dumpHistory(history:Array, attribute:String)`

Produces `console.log` output of a `history` Array returned by `start()`. `attribute` specifies which value to print; current options are 'best' and 'average'.

## Execution

Load `index.html` in a web browser. Use your browser's developer console to see the output.

## Customisation

To simulate different types of individuals, provide appropriate values and functions in `scenario.js`. You should not need to change `evolver.js`.

## Notes

Population won't reach perfection and stay there because of random crossover and mutation between generations; *ie*, the overall fitness may reduce.