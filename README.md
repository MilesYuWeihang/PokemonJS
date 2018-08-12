# PokemonCompare
author: Weihang Yu

The project is written in nodejs

The code is run in environment below:
GNU bash, version 4.3.48(1)-release (x86_64-pc-linux-gnu)
node v4.2.6


follow the steps to run the project

1. fork or download from github

2.unzip pack if it is downloade

3. authoritize script files
``chmod u+x program

5. run the program with two parameter(id/name of pokemon)
``./program [pokemon1] [pokemon2]

6. check the result
Because the project need to query the data from website "https://pokeapi.co/", it may need
some time to finish and print, the result is the name of pokemon with advantages.


Compare Algorithm:
From the source website, I can get types of pokemons and damage relation between 2 types.
However, some pokemons are duel-type, which makes the type advantage more complex.
By Pokemon battle rules, damage depends on type of Attacker's move and type of move is unique.
Although sometimes pokemon can learn moves do not belong to their type, we assume they always use
the move with one of the types of their own type. To compare the maximum times of damage amount
pokemon can do to each other, we can finally compute the pokemon with the type advantage.
If the times of damage amounts are equal, I compare the total base stats, if it still equal, the
pokemon input first should be output.
