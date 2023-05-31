import math
import random

coeffs = {
    'DIESEL': 0.002,
    'BATTERY_ELECTRIC': 0.003,
    'CABLE_ELECTRIC': 0.001
}

file = open("learn.csv", "w")
file.write('fuel,monthlyRidership,busCount\r\n')

for (fuel, coef) in coeffs.items():
  print(f'{fuel}')
  for riders in [x * 100 for x in range(10, 1000)]:
    rand = (random.random() * 0.2 + 0.9)
    file.write(f'{fuel},{riders},{max(math.floor(riders * coef * rand), 1)}\r\n')
