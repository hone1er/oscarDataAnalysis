# EXTRACT all of the needed data to predict off of for transform

import pandas as pd
from tqdm import tqdm
import time
#todo   return all fields needed for the prediction


#!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- !#
print("\nInitialized..")
#!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- !#

with tqdm(total=100) as pbar:

    #*   Prohibits truncatation of data in prints.
    pd.set_option('display.max_colwidth', -1)

    #*   User input of which movie to munge attributes for then predict against the model.
    movieToSearch = str(input("Enter a movie title: "))  #"Toy Story 4"
    pbar.update(5)

    #*   The `title.basics` db object:
    #*   Declares $tconst (IMDB's media PK) as a string & $genres as a string array.
    print("\n\n\nMunging title.basics.tsv..")
    herp = pd.read_csv("/Users/nicolespaar/Documents/title.basics.tsv", sep='\t', header=0, low_memory=False)
    pbar.update(10)
    herpArray = herp[herp['primaryTitle'] == movieToSearch]
    herpRow = herpArray[herpArray['titleType'] == 'movie']
    tconst = herpRow.tconst.to_string(index=False)
    genres = herpRow.genres.to_string(index=False).split(",")

    #*   The `title.crew` db object:
    #*   Declares $crew_directors & $crew_writers as a string array.
    print("\nMunging title.crew.tsv..")
    derp = pd.read_csv("/Users/nicolespaar/Documents/title.crew.tsv", sep='\t', header=0)
    pbar.update(10)
    derpRow = derp[derp['tconst'] == tconst[1:]]
    crew_directors = derpRow.directors.to_string(index=False).split(",")
    crew_writers = derpRow.writers.to_string(index=False).split(",")

    #*   The `name.basics` db object:
    print("\nMunging name.basics.tsv..")
    merp = pd.read_csv("/Users/nicolespaar/Documents/name.basics.tsv", sep='\t', header=0, index_col='nconst')
    pbar.update(10)

    #*   The `title.principals` db object:
    print("\nMunging title.principals.tsv..")
    plerp = pd.read_csv("/Users/nicolespaar/Documents/title.principals.tsv", sep='\t', header=0, index_col='nconst')
    pbar.update(10)
    plerpRow = plerp[plerp['tconst'] == tconst[1:]]





    #!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- !#
    print("\nSorting Cast..")
    time.sleep(0.25)
    #!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- !#
    #*   Iterrows() on $plerpRow to sort/bin the cast actors' names & jobs from the cast non-actors'
    #*   names and jobs.

    cast_actors = []
    cast_actors_jobs = []
    cast_other = []
    cast_other_jobs = []

    for row in plerpRow.iterrows():
        x = row[1].category
        if (x in ('actor', 'actress')):
            cast_actors.append(row[0])
            cast_actors_jobs.append(row[1].job)
        else:
            cast_other.append(row[0])
            cast_other_jobs.append(row[1].job)

    pbar.update(10)

    def lengths(x):
        if isinstance(x, list):
            yield len(x)
            for y in x:
                yield from lengths(y)

    def iAmount(anArray):
        return max(lengths(anArray))
    #todo   a check to panic if c_a vs c_a_j (and c_o vs c_o_j) are not the same length





    #!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- !#
    print("\nPrinting Cast..\n")
    time.sleep(0.25)
    #!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- !#
    #*   A for-loop executing as many times as the length of the $cast_actors list prints out all of
    #*   the relevant information. Also plugs in the current iterration's actor's `nconst` into the
    #*   $merp db object (where `nconst` is the Index) to return a whole row/object relating to them.

    print("\n*****   Primary Cast[ACTORS]")
    i = 0
    iAmt = iAmount(cast_actors)

    for i in range(iAmt):
        cast = cast_actors[i]
        job = cast_actors_jobs[i]
        print("IMDB 'nconst': ", cast, "\n", "Job: ", job, "\n\n", "Cast Object: ", "\n", merp.loc[cast], "\n")
        i += 1

    pbar.update(5)

    #*   A for-loop executing as many times as the length of the $cast_other list prints out all of
    #*   the relevant information. Also plugs in the current iterration's actor's `nconst` into the
    #*   $merp db object (where `nconst` is the Index) to return a whole row/object relating to them.

    print("\n*****   Primary Cast[NON-ACTORS]")
    i = 0
    iAmt = iAmount(cast_other)

    for i in range(iAmt):
        cast = cast_other[i]
        job = cast_other_jobs[i]
        print("IMDB 'nconst': ", cast, "\n", "Job: ", job, "\n\n", "Cast Object: ", "\n", merp.loc[cast], "\n")
        i += 1

    pbar.update(5)





    #!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- !#
    print("\nPrinting Crew..")
    time.sleep(0.25)
    #!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- !#
    #*   A for-loop on $crew_directors (the 2 columns of the $merp db object) to
    #*   print out all of the relevant information. Also plugs in the current iterration's crew's
    #*   `nconst` to return a whole row/object relating to them.

    print("\n*****   All Crew[DIRECTORS]")

    for crew in crew_directors:
        if crew[0] == " ":
            print("\n", "        [!]      [!]      [!]      [!]      [!]")
            print(f"[!] Prepending whitespace bug detected on: '{crew}'", "[!]", "\n")
            crew = crew[1:]
            print(f"[!]             Fixed to: '{crew}'", "                  [!]")
            print("        [!]      [!]      [!]      [!]      [!]", "\n")
        print("IMDB 'nconst': ", crew, "\n", "Job: ", job, "\n\n", "Cast Object: ", "\n", merp.loc[crew], "\n")

    pbar.update(5)



    #*   A for-loop on $crew_directors (the 2 columns of the $merp db object) to
    #*   print out all of the relevant information. Also plugs in the current iterration's crew's
    #*   `nconst` to return a whole row/object relating to them.

    print("\n*****   All Crew[WRITERS]")

    for crew in crew_writers:
        if crew[0] == " ":
            print("\n", "        [!]      [!]      [!]      [!]      [!]")
            print(f"[!] Prepending whitespace bug detected on: '{crew}'", "[!]", "\n")
            crew = crew[1:]
            print(f"[!]             Fixed to: '{crew}'", "                  [!]")
            print("        [!]      [!]      [!]      [!]      [!]", "\n")
        print("IMDB 'nconst': ", crew, "\n", "Job: ", job, "\n\n", "Cast Object: ", "\n", merp.loc[crew], "\n")

    pbar.update(5)





    #!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- !#
    print("\nPrinting Genres..\n")
    time.sleep(0.25)
    #!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- !#
    #*   A for-loop on $genres to print out all of the genres listed for the movieToSearch.
    print("\n*****   All Genres")
    for genre in genres:
        if genre[0] == " ":
            print("\n", "        [!]      [!]      [!]      [!]      [!]")
            print(f"[!] Prepending whitespace bug detected on: '{genre}'", "[!]", "\n")
            genre = genre[1:]
            print(f"[!]             Fixed to: '{genre}'", "                  [!]")
            print("        [!]      [!]      [!]      [!]      [!]", "\n")
        print(genre)
    print("\n", genres, "\n")

    pbar.update(10)





    #!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- !#
    print("\nPrinting Production Companies..\n")
    time.sleep(0.25)
    #!-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- !#