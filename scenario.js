// Evolver test scenario.
// Individuals are four-character strings of lower-case letters; eg, 'coat'.
// Fitness is the average of the character codes in the string (with 'a'===1); eg, 'zzzz' is 26.

const RUNS = 2
const GENERATIONS = 25
const MUTATION_RANGE_MAX = 2              // the maximum extent to which a character may be changed; 1 means an adjacent letter of the alphabet
const ENVIRONMENT_CHANGE_GENERATION = 20  // generation at which environment (fitness function) changes
const LOG_DETAILS = false                 // console.log every crossover and mutation
const LOG_GENERATION = true               // console.log every new generation

const CHARCODE_a = 'a'.charCodeAt(0)
const CHARCODE_z = 'z'.charCodeAt(0)

evolver.childrenToGenerate = 8
evolver.childrenToRetain = 4

evolver.initialPopulation = runNbr => {
  // Returns an array of individuals comprising generation zero.
  return ['coat', 'path', 'moon', 'jump']
  // To maximise the value of crossover, try 'zzmm' and 'mmzz'.
}

evolver.crossover = (parentA, parentB, runNbr, generationNbr) => {
  // Cross-over function: combine some of parent1 and some of parent2.
  // Returns a new (child) individual.

  // Pick sequence of parents randomly:
  let parent1 = parentA, parent2 = parentB
  if (Math.random() > 0.5) {parent1 = parentB; parent2 = parentA}

  const child = parent1.substring(0,2) + parent2.substring(2,4)

  if (LOG_DETAILS)
    console.log(`crossover(${parentA},${parentB})=${child}`)

  return child
}

evolver.mutate = (child, runNbr, generationNbr) => {
  // Returns a modified (child) individual.
  // Change a letter at a random position by up to MUTATION_RANGE_MAX.
  // A variation would be to change more than one letter per mutation.

  //console.log(`mutating ${child}`)
  const index = Math.floor(4 * Math.random())   // which char to change
  const mutationRange = Math.ceil(Math.random() * MUTATION_RANGE_MAX)   // how much to change it by
  let charCode = child.charCodeAt(index)
  charCode = Math.random() < 0.5? Math.max(charCode - mutationRange, CHARCODE_a) : Math.min(charCode + mutationRange, CHARCODE_z)
  const char = String.fromCharCode(charCode)
  const mutant = child.slice(0, index) + char + child.slice(index + 1)

  if (LOG_DETAILS)
    console.log(`mutate(${child})=${mutant}`)

  return mutant
}

evolver.fitness = (child, runNbr, generationNbr) => {
  // Calculate and return the fitness of a child (individual). Larger values are considered fitter.
  // Prior to ENVIRONMENT_CHANGE_GENERATION, fitness is average of letter values in child, with 'a'=1 (so 'zzzz' would have perfect fitness).
  // After ENVIRONMENT_CHANGE_GENERATION, fitness is negated (so 'aaaa' would have perfect fitness).
  let sum = 0   // total of char code values within child string
  for (let i=0; i<child.length; i++) sum += (child.charCodeAt(i) - CHARCODE_a + 1)
  //console.log(`fitness of ${child}: ${fitness}`)
  const fitness = sum / child.length
  return generationNbr < ENVIRONMENT_CHANGE_GENERATION? fitness : -fitness
}

evolver.onGeneration = (population, runNbr, generationNbr) => {
  // Returns true to produce another generation, false to end this run, or undefined (no return statement) to produce preset number of generations.
  if (LOG_GENERATION) {
    console.log(`Run ${runNbr} Generation ${generationNbr}:`)
    let fitnessSum = 0
    population.forEach(element => {
      console.log(`  ${element.individual} (${element.fitness})`)
      fitnessSum += element.fitness
    })
    console.log(`  Average fitness: ${fitnessSum / population.length}`)
  }
  //return population[0].fitness < 26  // stop if perfect ('zzzz'); shouldn't normally do this
}

const history = evolver.start(RUNS, GENERATIONS)
//console.log(`${JSON.stringify(history)}`)
evolver.dumpHistory(history, 'best')
evolver.dumpHistory(history, 'average')

// TODO 3.9 improve OO: history should be object with dump(attrib) prop; individual should have mutate() prop; .crossover() should be in Parents() object.