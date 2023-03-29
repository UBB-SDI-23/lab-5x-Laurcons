import { IsArray, IsPositive } from "class-validator";

export default class AddManyBusesDto {
  @IsArray()
  @IsPositive({ each: true })
  busIds: number[];
}