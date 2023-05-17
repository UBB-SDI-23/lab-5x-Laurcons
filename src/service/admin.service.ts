import { Injectable } from '@nestjs/common';
import PrismaService from './prisma.service';
import { exec } from 'child_process';
import { config } from 'src/lib/config';
import { Observable, Subject, concatMap, from, lastValueFrom, map } from 'rxjs';
import { Readable } from 'stream';

@Injectable()
export default class AdminService {
  constructor(private prisma: PrismaService) {}

  async deleteAllData() {
    await Promise.all([
      this.prisma.$executeRaw`TRUNCATE TABLE StationSign;`,
      this.prisma.$executeRaw`TRUNCATE TABLE LineStop;`,
      this.prisma.$executeRaw`TRUNCATE TABLE Station;`,
      this.prisma.$executeRaw`TRUNCATE TABLE Line;`,
      this.prisma.$executeRaw`TRUNCATE TABLE Bus;`,
      this.prisma.$executeRaw`TRUNCATE TABLE Garage;`,
      this.prisma.$executeRaw`TRUNCATE TABLE User;`,
      this.prisma.$executeRaw`TRUNCATE TABLE UserProfile;`,
    ]);
  }

  async writeAllData() {
    const dbName = config.databaseUrl.split('/').pop()!.split('?')[0];
    const pass = config.databaseUrl.split(':')[2]?.split('@')?.[0];
    console.log({ dbName, pass });
    const commands = [
      'SET GLOBAL autocommit=0;SET GLOBAL unique_checks=0;SET GLOBAL foreign_key_checks=0;',
      'source src/scripts/fakeusers.sql',
      `INSERT IGNORE INTO User (username, password, status) VALUES ('_default', '-', 'not_activated'); UPDATE User SET id=0 WHERE username='_default';`,
      'source src/scripts/fakeprofiles.sql',
      'source src/scripts/fakedata.sql',
      'source src/scripts/associate.sql',
      'SET GLOBAL autocommit=1;SET unique_checks=1;SET foreign_key_checks=1;',
    ];
    return from(commands).pipe(
      concatMap((command) => {
        const sub$ = new Subject();
        console.log('executing', command);
        const proc = exec(`mysql -u root ${dbName}`, (err, stdout, stderr) => {
          console.log({ err, stdout, stderr });
          if (err) sub$.next('no');
          else sub$.next('yes');
          sub$.complete();
        });
        const stream = new Readable();
        stream.push((pass ?? '') + '\n');
        stream.push(command + ';\n');
        stream.push('COMMIT;\n');
        stream.push(null);
        stream.pipe(proc.stdin);
        return sub$;
      }),
    );
    // exec("mysql ",);
  }
}
