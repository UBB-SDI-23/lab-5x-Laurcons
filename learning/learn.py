import pandas as pd
from sklearn import linear_model as lm
import pickle

dataset = pd.read_csv('rocsi.csv')

datasets = [
  dataset[["ridership", "diesel"]],
  dataset[["ridership", "cable_adj"]],
  dataset[["ridership", "battery"]],
]
cols = ["diesel", "cable_adj", "battery"]

for col in cols:
  train = dataset[["ridership"]]
  target = dataset[[col]]

  regr = lm.LinearRegression()
  res = regr.fit(train, target)

  pred = regr.predict(pd.DataFrame({"ridership": [1000, 10000, 100000]}))

  print(pred[0][0])

  pickle.dump(regr, open(f'dmp/fuel-{col}.dmp', 'wb'))