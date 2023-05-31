import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { config } from 'src/lib/config';

@Injectable()
export default class LearningService {
  constructor() {}

  async estimateValues(fuel: string, values: number[]) {
    const res = await axios
      .get(
        `${config.learning.url}/predict/${fuel.toLowerCase()}/${values.join(
          ',',
        )}`,
      )
      .then((r) => r.data.toString());
    return res.split(',').map((str) => parseInt(str));
  }
}
