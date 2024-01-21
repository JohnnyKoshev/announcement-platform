import { Controller } from '@nestjs/common';
import { IndividualService } from './individual.service';

@Controller('individual')
export class IndividualController {
  constructor(private individualService: IndividualService) {}
}
