// Constructs an evolver object that encapsulates properties to simulate evolution.

const constructEvolver = () => {   // This is a closure, so we can protect private properties.
  // PRIVATE PROPERTIES:

  let childrenToGenerate = 10
  let childrenToRetain = 5
  let population = []     // current population of individuals (adults); elements are {individual,fitness}

  function setChildrenToGenerate(val) {childrenToGenerate = val}

  function setChildrenToRetain(val) {childrenToRetain = val}

  function startEvolution(runs = 1, generations = 10) {
    // Return history.
    const history = Array(runs)      // array of {maximum, average} fitness values in each [run][generation]
    for (let runNbr = 1; runNbr <= runs; runNbr++)
      history[runNbr - 1] = doRun(runNbr, generations)
    return history
  }

  function doRun(runNbr, generations) {
    // Returns history for this run: array of {maximum, average} fitness values in each [generation].

    let generationNbr = 0       // Number; 0 for initial population
    let doNextGeneration
    let child
    const children = []      // next generation of individuals; elements are {individual,fitness}
    let parentA, parentB
    let doNextGenerationOverride

    const runHistory = []

    // Initialise population:
    population.length = 0
    const initialPopulation = interface.initialPopulation(runNbr)
    initialPopulation.forEach(individual => population.push({individual: individual}))

    do {
      // Apply crossover (if defined) between pairs of parents to create initial children:
      for (let childCount = 0; childCount < childrenToGenerate; childCount++) {
        // Pick which individuals to breed:
        parentA = population[Math.floor(Math.random() * population.length)]
        if (interface.crossover) {
          parentB = population[Math.floor(Math.random() * population.length)]
          // It would be possible to ensure that parentA and parentB aren't the same individual. However, a crossover() might still create a variation; eg, by changing sequence of parts.
          // It would be possible to ensure that no two parents get to breed (crossover) more than once. However, crossover of the same parents can result in different children.
          // It would be possible to ensure that no parent gets to crossover with more than one other parent. However, allowing this can increase generality.
          // It would be possible to perform crossover from more than two parents (although nature doesn't).
          child = interface.crossover(parentA.individual, parentB.individual, runNbr, generationNbr) // create a child by combining some of parentA and some of parentB
        } else
          child = parentA.individual        // if crossover isn't defined, copy a parent (nature doesn't do this; it's more like cloning)
        children.push({individual: child})
      }

      // Apply mutation to all children:
      if (interface.mutate)
        children.forEach((element, index) => children[index] = {individual: interface.mutate(element.individual, runNbr, generationNbr)})
      // It's not mandatory for mutate() to make a change.

      // Evaluate fitness of children:
      children.forEach(element => {element.fitness = interface.fitness(element.individual, runNbr, generationNbr)})

      // Prune (survival of the fittest):
      children.sort((element1, element2) => element2.fitness-element1.fitness)  // sort with highest fitness first
      children.length = childrenToRetain

      // Update history:
      let sum = 0
      children.forEach(child => sum += child.fitness)
      runHistory[generationNbr] = {best: children[0].fitness, average: sum / childrenToRetain}

      population = children    // replace previous adult population with children
      //console.log(`population=${JSON.stringify(population)}`)
      generationNbr++
      doNextGeneration = undefined
      if (interface.onGeneration) {
        doNextGenerationOverride = interface.onGeneration(population, runNbr, generationNbr)  // report next generation (children) to scenario
        if (doNextGenerationOverride !== undefined) doNextGeneration = doNextGenerationOverride
      }
      if (doNextGeneration === undefined) doNextGeneration = generationNbr < generations
    } while (doNextGeneration)

    return runHistory
  }

  function dumpHist(history, attribute) {
    // Optional convenience function for sending history to console.log.
    const runs = history.length
    console.log(`History of ${attribute} values:`)
    let historyEntry, value, sum, generationNbr = 0
    let count   // number of runs that ran for as long as generationNbr
    let line = 'Gen.'
    for (let runNbr = 0; runNbr < runs; runNbr++) line += `\tRun ${runNbr+1}`
    console.log(line + '\tAv.')

    do {
      line = (generationNbr+1).toString()
      sum = count = 0
      for (let runNbr = 0; runNbr < runs; runNbr++) {
        historyEntry = history[runNbr][generationNbr]
        if (historyEntry) {
          value = historyEntry[attribute]
          line += '\t' + value.toFixed(2)
          sum += value
          count++
        } else {
          line += '\t—'
        }
      }
      // Append average of values (if any) for this generation across all runs:
      if (count) console.log(`${line}\t${(sum / count).toFixed(2)}`)

      generationNbr++
    } while (count)
    console.log(' ')
  }

  // PUBLIC PROPERTIES (INTERFACE):

  const interface = {
    start: (runs, generations) => startEvolution(runs, generations),
    dumpHistory: (history, attribute) => dumpHist(history, attribute)
  }

  Object.defineProperty(interface, 'childrenToGenerate', {
    set(val) {setChildrenToGenerate(val)}
  })

  Object.defineProperty(interface, 'childrenToRetain', {
    set(val) {setChildrenToRetain(val)}
  })

  return interface
}

const evolver = constructEvolver()