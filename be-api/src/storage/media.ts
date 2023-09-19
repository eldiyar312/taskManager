import { FlattenMaps } from 'mongoose';

import { ModelsMedia } from 'src/_generated';
import { Media, MediaModel } from 'src/models/media';

export const createMedia = async ({
  mediaData,
}: {
  mediaData: Omit<ModelsMedia, '_id'>;
}): Promise<FlattenMaps<Media>> => {
  const media = await MediaModel.create(mediaData);
  return media.toJSON();
};
