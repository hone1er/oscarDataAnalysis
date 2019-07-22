# Recreates the model from scratch --- takes ~10 hours

import json, math, time
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedShuffleSplit
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix



def feature_engineering(column_name, df, json_name):

    name = {}
    for item in df[column_name]:
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



df = pd.read_csv("chrisTestingGrounds/BECHDEL___masterList.csv", dtype={'budget': float, 'revenue': float, 'vote_count': float, 'Bechdel_Test': float})
df = df.drop(['revenue', 'popularity', 'budget', 'vote_average', 'vote_count', 'movie_title', 'original_title', 'original_language', 'spoken_languages', 'tagline'], axis=1)



#pd.set_option('display.max_colwidth', -1)
#pCC = df.iloc[0]
#print(pCC)



df2 = feature_engineering("cast", df, "name")
df2 = df2.drop('cast', axis=1)



crew_name = {}
for item in df2['crew']:
    crew = json.loads(item)
    for it in crew:
        if it['job'] == 'Director':
            if it['name'] not in crew_name:
                crew_name[it['name']] = 1
            else:
                crew_name[it['name']] += 1

final_crew = {}
index = 0
for k,v in crew_name.items():
    if v > 0:
        final_crew[k] = index
        index += 1

np_crew = np.zeros((len(df2), len(final_crew)))
row = 0
for item in df2['crew']:
    crew = json.loads(item)
    for it in crew:
        if it['job'] == 'Director':
            if it['name'] in final_crew:
                index = final_crew[it['name']]
                np_crew[row][index] = 1
    row += 1

df_crew = pd.DataFrame(np_crew, columns = list(final_crew.keys()))
df3 = pd.concat([df2, df_crew], axis=1)




df3=df3.drop(['crew'],axis=1)
df4 = feature_engineering("genres", df3, "name")
df4 = df4.drop(['genres'], axis = 1)
df5 = feature_engineering('keywords', df4, 'name')
df5 = df5.drop(['keywords'], axis = 1)
df6 = feature_engineering('production_companies',df5,'name')
df6 = df6.drop(['production_companies'],axis=1)
df7 = feature_engineering('production_countries',df6,'name')
df7 = df7.drop(['production_countries'], axis=1)



df_clean = df7.drop(["overview", "title", "status", "release_date"], axis=1)
df_clean = df_clean.dropna(axis='index', how='any')

print(f"Number of null values in entire DF: {df_clean.isnull().sum().sum()}\n")
for dtype in df_clean.dtypes:
    if dtype != float:
        print(dtype)



X = df_clean[df_clean.columns.difference(['Bechdel_Test'])]
y = df_clean['winner']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, train_size=0.75, random_state=90001, shuffle=True, stratify=y)
scaler = StandardScaler()
scaler.fit(X_train)
X_train = scaler.transform(X_train)
X_test = scaler.transform(X_test)

pca = PCA(0.95)
fit = pca.fit(X_train)
X_train = pca.transform(X_train)
X_test = pca.transform(X_test)
#! L
logisticRegr = LogisticRegression(penalty='elasticnet', multi_class='ovr', n_jobs=-1, l1_ratio=0, random_state=288, solver='saga', max_iter=5000, verbose=1)
logisticRegr.fit(X_train, y_train)
predicted = logisticRegr.predict(X_test)  #Prediction
print(logisticRegr.score(X_train, y_train))
print(logisticRegr.score(X_test, y_test))



tn, fp, fn, tp = confusion_matrix(y_test, predicted).ravel()
print(f"\n\n\nTotal - Y_Test: {len(y_test)}")
print(f"Total - Predicted: {len(predicted)}\n")
print(f"True Negatives: {tn}")
print(f"False Positives: {fp}")
print(f"False Negatives: {fn}")
print(f"True Positives: {tp}\n")
sensitivity = tp/(tp+fn)
print(f"Sensetivity / True Positive Rate: {sensitivity}\n")
specificity = tn/(tn+fp)
print(f"Specificity / True Negative Rate: {specificity}\n")
precision = tp/(tp+fp)
print(f"Precision / Positive Predictive Value: {precision}\n")
npv = tn/(tn+fn)
print(f"Negative Predictive Value: {npv}\n")
miss_rate = fn/(fn+tp)
print(f"Miss Rate / False Negative Rate: {miss_rate}\n")
fall_out = fp/(fp+tn)
print(f"Fall-Out / False Positive Rate: {fall_out}\n")
fdr = fp/(fp+tp)
print(f"False Discovery Rate: {fdr}\n")
fOMr = fn/(fn+tn)
print(f"False Omission Rate: {fOMr}\n")
threat_score = tp/(tp+fn+fp)
print(f"Threat Score / Critical Success Index: {threat_score}\n")
accuracy = (tp+tn)/(tp+tn+fp+fn)
print(f"Accuracy: {accuracy}\n")
f1_score = (2*tp)/((2*tp)+fp+fn)
print(f"F1 Score / Harmonic Mean of Precision(PPV) and Sensetivity(TPR): {f1_score}\n")
mcc = ((tp*tn)-(fp*fn))/math.sqrt((tp+fp)*(tp+fn)*(tn+fp)*(tn+fn))
print(f"Matthews Correlation Coefficient: {mcc}\n")
informedness = (sensitivity+specificity-1)
print(f"Informedness / Bookmaker Informedness: {informedness}\n")
markedness = (precision+npv-1)
print(f"Markedness: {markedness}\n")


youSure = None
while youSure not in ("y", "n"):
    youSure = str(input("This will take ~10 hours, continue? [y/n]"))
    if youSure == "n":
        continue
    elif youSure == "y":
        sss = StratifiedShuffleSplit(random_state=55)
        sumAccuracy = []
        for train, test in sss.split(X, y):
            print("\n\nValidating a new set..\n\n")
            df_train = df_clean.iloc[train]
            df_test = df_clean.iloc[test]
            train_X = df_train[df_clean.columns.difference(['Bechdel_Test'])]
            train_y = df_train['winner']
            test_X = df_test[df_clean.columns.difference(['Bechdel_Test'])]
            test_y = df_test['winner']
            logisticRegr.fit(train_X, train_y)
            sumAccuracy.append(logisticRegr.score(test_X, test_y))
        avg = np.mean(sumAccuracy)
        print(f"\n\n3-Fold Cross Validation Mean Score: {avg}\n\n")
    else:
        print("[!]   You must enter 'y' or 'n'")
        time.sleep(3)