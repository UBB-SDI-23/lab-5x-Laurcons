import { faker } from '@faker-js/faker';
import { Prisma, UserStatus } from '@prisma/client';
import * as fs from 'fs/promises';
import * as bcrypt from 'bcrypt';

const BATCHES = 100;
const BATCH_SIZE = 100;
const ENTITY_COUNT = BATCHES * BATCH_SIZE;

let f: fs.FileHandle;

// function reused from gen-data.ts
async function writeBatch(
  entityName: string,
  keys: string[],
  generator: (
    entryIdx,
    batchIdx,
  ) =>
    | Promise<(string | number | bigint | boolean | Date)[]>
    | (string | number | bigint | boolean | Date)[],
  isManyToMany = false,
) {
  function formatForSql(thing: any): string {
    if (typeof thing === 'string') return `"${thing}"`;
    if (typeof thing === 'number') return `${thing}`;
    if (typeof thing === 'boolean') return `${thing ? '1' : '0'}`;
    if (thing instanceof Date)
      return `'${thing.toISOString().substring(0, 10)}'`;
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

async function users() {
  await writeBatch('User', ['username', 'password', 'status'], async () => {
    const user: Prisma.UserCreateInput = {
      username: faker.internet.userName(),
      password: await bcrypt.hash('1234', 5),
      status: UserStatus.activated,
    };
    return [user.username, user.password, user.status!];
  });
}

async function profiles() {
  let idx = 10;
  await writeBatch(
    'UserProfile',
    ['userId', 'birthDate', 'bio', 'gender', 'location', 'website'],
    async () => {
      const prof: Prisma.UserProfileUncheckedCreateInput = {
        userId: idx++,
        bio: faker.lorem.sentences(10),
        birthDate: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }),
        gender: faker.helpers.arrayElement(['male', 'female', 'other']),
        location: faker.address.countryCode(),
        website: 'http://' + faker.internet.domainName(),
      };
      return [
        prof.userId,
        prof.birthDate,
        prof.bio,
        prof.gender,
        prof.location,
        prof.website,
      ];
    },
  );
}

async function main() {
  faker.setLocale('ro');
  f = await fs.open(`src/scripts/fakeprofiles.sql`, 'w');
  await f.write('SET unique_checks = 0;\n');
  await f.write('SET FOREIGN_KEY_CHECKS = 0;\n');
  // await f.write('USE mpp-myapp;\n');
  // await users();
  await profiles();
  await f.write('SET unique_checks = 1;\n');
  await f.write('SET FOREIGN_KEY_CHECKS = 1;\n');
}

main();
