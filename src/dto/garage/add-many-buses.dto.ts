import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsPositive } from "class-validator";

export default class AddManyBusesDto {
  @IsArray()
  @IsPositive({ each: true })
  @ApiProperty({ type: [Number], description: "The ids of the buses you want to add to this garage.", example: [1, 2, 3, 4] })
  busIds: number[];
}