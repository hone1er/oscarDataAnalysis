# receive the input from extract then TRANSFORM it to an input ready object
import json, ast
import numpy as np
import pandas as pd



pd.set_option("display.max_colwidth", -1)

#! Test object "d" below to confirm structure needed for predict
d = {
  "winner": "1",
  "cast": [
    [
      {
        "character": "Woody",
        "gender": "2",
        "name": "Tom Hanks",
        "order": "0"
      },
      {
        "character": "Buzz Lightyear",
        "gender": "2",
        "name": "Tim Allen",
        "order": "1"
      },
      {
        "character": "Bo Peep",
        "gender": "0",
        "name": "Annie Potts",
        "order": "2"
      },
      {
        "character": "Forky",
        "gender": "2",
        "name": "Tony Hole",
        "order": "3"
      }
    ]
  ],
  "crew": [
    [
      {
        "department": "Art",
        "gender": "2",
        "job": "Director",
        "name": "Josh Cooley"
      },
      {
        "department": "Writing",
        "gender": "2",
        "job": "Screenplay",
        "name": "John Lasseter"
      },
      {
        "department": "Writing",
        "gender": "2",
        "job": "Screenplay",
        "name": "Andrew Stanton"
      },
      {
        "department": "Writing",
        "gender": "0",
        "job": "Screenplay",
        "name": "Valerie LaPointe"
      }
    ]
  ],
  "genres": [
    [
      {
        "name": "Adventure"
      },
      {
        "name": "Animation"
      },
      {
        "name": "Comedy"
      }
    ]
  ],
  "keywords": [
    [
      {
        "name": "bo peep character"
      },
      {
        "name": "buzz lightyear character"
      },
      {
        "name": "woody character"
      },
      {
        "name": "fourth part"
      }
    ]
  ],
  "overview": "When a new toy called \"Forky\" joins Woody and the gang, a road trip alongside old and new friends reveals how big the world can be for a toy.",
  "production_companies": [
    [
      {
        "name": "Pixar Animation Studios"
      },
      {
        "name": "Walt Disney Pictures"
      }
    ]
  ],
  "production_countries": [
    {
      "iso_3166_1": "US",
      "name": "United States of America"
    }
  ],
  "release_date": "2019-06-21",
  "runtime": "100",
  "status": "Released",
  "title": "Toy Story 4",
  "Bechdel_Test": "1"
}

#ast.literal_eval(d)

dff = pd.DataFrame(data=d)
#print(dff)

def feature_engineering(column_name, df, json_name):

    name = {}
    for item in df[column_name]:
        print("\n\nItem: ", item, "\n\n")
        group = json.loads(item)
        for it in group:
            if it[json_name] not in name:
                name[it[json_name]] = 1
            else:
                name[it[json_name]] += 1

    final = {}
    index = 0
    for k,v in name.items():
        if v > 1:
            final[k] = index
            index += 1
    np_item = np.zeros((len(df),len(final)))
    item_dict = {}
    row = 0
    for item in df[column_name]:
        group = json.loads(item)
        for it in group:
            if it[json_name] in final:
                index = final[it[json_name]]
                np_item[row][index] = 1
        row += 1

    df_item = pd.DataFrame(np_item, columns = list(final.keys()))
    df_output = pd.concat([df,df_item],axis = 1)

    return df_output

df2 = feature_engineering("cast", dff, "name")
df2 = df2.drop("cast", axis=1)



crew_name = {}
for item in df2["crew"]:
    crew = json.loads(item)
    for it in crew:
        if it["job"] == "Director":
            if it["name"] not in crew_name:
                crew_name[it["name"]] = 1
            else:
                crew_name[it["name"]] += 1

final_crew = {}
index = 0
for k,v in crew_name.items():
    if v > 0:
        final_crew[k] = index
        index += 1

np_crew = np.zeros((len(df2), len(final_crew)))
row = 0
for item in df2["crew"]:
    crew = json.loads(item)
    for it in crew:
        if it["job"] == "Director":
            if it["name"] in final_crew:
                index = final_crew[it["name"]]
                np_crew[row][index] = 1
    row += 1

df_crew = pd.DataFrame(np_crew, columns = list(final_crew.keys()))
df3 = pd.concat([df2, df_crew], axis=1)




df3=df3.drop(["crew"],axis=1)
df4 = feature_engineering("genres", df3, "name")
df4 = df4.drop(["genres"], axis = 1)
df5 = feature_engineering("keywords", df4, "name")
df5 = df5.drop(["keywords"], axis = 1)
df6 = feature_engineering("production_companies",df5,"name")
df6 = df6.drop(["production_companies"],axis=1)
df7 = feature_engineering("production_countries",df6,"name")
df7 = df7.drop(["production_countries"], axis=1)



df_clean = df7.drop(["overview", "title", "status", "release_date"], axis=1)
df_clean = df_clean.dropna(axis="index", how="any")

print(f"Number of null values in entire DF: {df_clean.isnull().sum().sum()}\n")
for dtype in df_clean.dtypes:
    if dtype != float:
        print(dtype)



X = df_clean[df_clean.columns.difference(["Bechdel_Test"])]
y = df_clean["winner"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, train_size=0.75, random_state=90001, shuffle=True, stratify=y)
scaler = StandardScaler()
scaler.fit(X_train)
X_train = scaler.transform(X_train)
X_test = scaler.transform(X_test)

pca = PCA(0.95)
fit = pca.fit(X_train)
X_train = pca.transform(X_train)
X_test = pca.transform(X_test)