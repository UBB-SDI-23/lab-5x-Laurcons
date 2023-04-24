import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';
import * as fs from 'fs/promises';

const BATCHES = 1000;
const BATCH_SIZE = 1000;
const ENTITY_COUNT = BATCHES * BATCH_SIZE;

let f: fs.FileHandle;

async function writeBatch(
  entityName: string,
  keys: string[],
  generator: (
    entryIdx,
    batchIdx,
  ) =>
    | Promise<(string | number | bigint | boolean)[]>
    | (string | number | bigint | boolean)[],
  isManyToMany = false,
) {
  function formatForSql(thing: any): string {
    if (typeof thing === 'string') return `"${thing}"`;
    if (typeof thing === 'number') return `${thing}`;
    if (typeof thing === 'boolean') return `${thing ? '1' : '0'}`;
    throw new Error();
  }
  await f.write(`\n\n-- ${entityName}\n\n`);
  await f.write(`TRUNCATE TABLE ${entityName};\n`);
  const batches = BATCHES * (isManyToMany ? 10 : 1);
  for (let batchIdx = 0; batchIdx < batches; batchIdx++) {
    await f.write(`INSERT INTO ${entityName} (${keys.join(', ')}) VALUES\n`);
    for (let i = 0; i < BATCH_SIZE; i++) {
      const rawFields = await generator(i, batchIdx);
      const fields = rawFields.map(formatForSql);
      await f.write(
        `  (${fields.join(', ')})${i !== BATCH_SIZE - 1 ? ',' : ''}\n`,
      );
    }
    await f.write(';\n\n');
    console.log(
      `[${entityName}] Written batch ${
        batchIdx + 1
      }/${batches} of ${BATCH_SIZE} entries`,
    );
  }
}

async function garages() {
  await writeBatch('Garage', ['name', 'location', 'capacity'], () => {
    const street = faker.address.street();
    const garage: Prisma.GarageCreateInput = {
      name:
        faker.helpers.arrayElement(['Depou ', 'Capat ']) +
        faker.helpers.arrayElement(['Tr ', '']) +
        street +
        ' ' +
        faker.address.buildingNumber(),
      location: street,
      capacity: Math.floor(Math.random() * 10) * 10,
    };
    return [garage.name, garage.location, garage.capacity];
  });
}

async function buses() {
  await writeBatch(
    'Bus',
    [
      'manufacturer',
      'model',
      'fuel',
      'inventoryNum',
      'licensePlate',
      'garageId',
    ],
    () => {
      const bus: Prisma.BusUncheckedCreateInput = {
        manufacturer: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        fuel: faker.helpers.arrayElement([
          'DIESEL',
          'BATTERY_ELECTRIC',
          'CABLE_ELECTRIC',
        ]),
        inventoryNum: faker.random.numeric(10).toString(),
        licensePlate:
          'CJ' +
          faker.random.numeric(2) +
          faker.random.alpha({ count: 3, casing: 'upper' }),
        garageId: Math.floor(Math.random() * ENTITY_COUNT) + 1,
      };
      return [
        bus.manufacturer,
        bus.model,
        bus.fuel,
        bus.inventoryNum,
        bus.licensePlate,
        bus.garageId,
      ];
    },
  );
}

async function lines() {
  await writeBatch(
    'Line',
    [
      'name',
      'startName',
      'endName',
      'monthlyRidership',
      'startGarageId',
      'endGarageId',
    ],
    () => {
      const line: Prisma.LineUncheckedCreateInput = {
        name:
          faker.random.numeric(5) +
          faker.random.alpha({ count: 7, casing: 'mixed' }),
        startName: faker.address.street(),
        endName: faker.address.street(),
        monthlyRidership: Math.floor(Math.random() * 1000) * 100,
        startGarageId: Math.floor(Math.random() * ENTITY_COUNT) + 1,
        endGarageId: Math.floor(Math.random() * ENTITY_COUNT) + 1,
      };
      return [
        line.name,
        line.startName,
        line.endName,
        line.monthlyRidership,
        line.startGarageId,
        line.endGarageId,
      ];
    },
  );
}

async function stations() {
  await writeBatch('Station', ['name'], () => {
    return [faker.address.street() + ' ' + faker.address.buildingNumber()];
  });
}

async function lineStops() {
  await writeBatch(
    'LineStop',
    ['stationId', 'lineId', 'direction', 'isServicedInWeekends'],
    () => {
      const stop: Prisma.LineStopUncheckedCreateInput = {
        stationId: Math.floor(Math.random() * ENTITY_COUNT) + 1,
        lineId: Math.floor(Math.random() * ENTITY_COUNT) + 1,
        direction: faker.helpers.arrayElement(['TRIP', 'ROUND-TRIP']),
        isServicedInWeekends: faker.helpers.arrayElement([true, false]),
      };
      return [
        stop.stationId,
        stop.lineId,
        stop.direction,
        stop.isServicedInWeekends,
      ];
    },
    true,
  );
}

async function main() {
  faker.setLocale('ro');
  f = await fs.open(`fakedata.sql`, 'w');
  await f.write('SET FOREIGN_KEY_CHECKS = 0;\n');
  // await f.write('USE mpp-myapp;\n');
  await garages();
  await buses();
  await lines();
  await stations();
  await lineStops();
  await f.write('SET FOREIGN_KEY_CHECKS = 1;\n');
}

main();
