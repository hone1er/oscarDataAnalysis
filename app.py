from flask import Flask, render_template, request, Response
import pandas as pd

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/data')
def data():
    return render_template('data.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/intro')
def intro():
    return render_template('intro.html')

# API call for bar chart and tables
###############################################################

class Grapher:
    def __init__(self):
        file = "resources/movieGraph2.csv"
        self.df = pd.read_csv(file, index_col=['original_title', 'title'])

    def graph(self, movie):
        # Format the name
        self.movie = movie
        movieInfo = self.df.loc[self.movie]
        return movieInfo.to_json()
################################################################


grapher = Grapher()
app.add_url_rule("/graph/<movie>", "", lambda movie: grapher.graph(movie), methods=["GET"])




if __name__ == "__main__":
    app.run(debug=False)
