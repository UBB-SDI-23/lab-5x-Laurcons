
from flask import Flask
from sklearn import linear_model as lm
import pickle
import os

app = Flask(__name__)

def load_regression(name):
  return pickle.load(open(f'dmp/fuel-{name}.dmp', 'rb'))

regressions = {
  'diesel': load_regression('diesel'),
  'cable_electric': load_regression('cable_adj'),
  'battery_electric': load_regression('battery'),
}

@app.route("/predict/<fuel>/<ridership>")
def predict(fuel, ridership):
  return ','.join([str(regressions[fuel].predict([[int(ridersh)]])[0][0]) for ridersh in ridership.split(',')])

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)