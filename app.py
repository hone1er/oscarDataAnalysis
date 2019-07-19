from flask import Flask, render_template, request, Response, redirect, jsonify
import pandas as pd
import os

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/about')
def about():
    return render_template('about.html')

# API call for bar chart
###############################################################
class Grapher:
    def __init__(self):
        file = os.path.join(os.path.dirname('__file__'),
        "resources/movieGraph.csv")
        self.df = pd.read_csv(file,index_col=['original_title','title'])


    def graph(self, movie):
        # Format the name
        self.movie = movie.title()
        movieInfo = self.df.loc[self.movie]
        return movieInfo.to_json()
################################################################

grapher = Grapher()
app.add_url_rule("/graph/<movie>", "",
                 lambda movie: grapher.graph(movie), methods=["GET"])

if __name__ == "__main__":
    app.run(port=5000)
