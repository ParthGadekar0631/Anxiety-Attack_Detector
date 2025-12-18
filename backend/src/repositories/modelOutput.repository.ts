import { ModelOutputModel } from '../models/modelOutput.model';

export class ModelOutputRepository {
  create(data: Parameters<typeof ModelOutputModel.create>[0]) {
    return ModelOutputModel.create(data);
  }

  findByCheckin(checkinId: string) {
    return ModelOutputModel.findOne({ checkin: checkinId }).exec();
  }
}

export const modelOutputRepository = new ModelOutputRepository();
