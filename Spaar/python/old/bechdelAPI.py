import pandas as pd
import os, requests, json, time



df = pd.read_csv("chrisTestingGrounds/bestPictureMasterList.csv")

byTitle_baseURL = "http://bechdeltest.com/api/v1/getMoviesByTitle?title="

bechdel_verdicts = []



def callAPI(searchTitle):

    print(f"Calling API with movie title: '{searchTitle}'\n")

    conn = str(requests.get(byTitle_baseURL + searchTitle).json())

    #todo:::   use a case switch instead
    if len(conn) <= 2:
        return 0

    else:
        return 1



for row in df.iterrows():
    print("On call " + str(len(bechdel_verdicts) + 1) + "/" + "4795")
    # Rate limit our calls as to not be rude
    time.sleep(.90)
    # Stick the current row's movie_title value into a temp var for ease of use
    searchTitle = str(row[1].movie_title)
    # Call API with the movie_title as the parameter
    verdict = callAPI(searchTitle)
    #print(verdict, "\n")
    bechdel_verdicts.append(verdict)



df['Bechdel_Test'] = bechdel_verdicts

df.to_csv('BECHDEL___masterList.csv', index=False)


