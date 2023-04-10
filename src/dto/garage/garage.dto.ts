import { Garage } from 'prisma/prisma-client';
export default class GarageDto implements Garage {
  id: number;
  name: string;
  location: string;
}
