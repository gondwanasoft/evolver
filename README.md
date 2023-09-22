# evolver
Evolver is a simplistic JavaScript genetic algorithm (evolution) framework.

## evolver Members

### childrenToGenerate
optional

### childrenToRetain
optional

### initialPopulation
essential

### crossover
optional

### mutate
optional

### fitness()
essential

### onGeneration
optional. Can optionally return true or false to abort run prematurely, or continue it beyond value specified in start

### start()

### dumpHistory

## Notes

Population won't reach perfection and stay there because of random crossover and mutation between generations; ie, the overall fitness may reduce