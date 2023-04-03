import { ApiProperty } from "@nestjs/swagger";

export class QueryDto {
  @ApiProperty()
  lineId?: number;
  @ApiProperty()
  stationId?: number;
}