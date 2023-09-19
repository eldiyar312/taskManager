import dayjs from 'dayjs';

export const rollNowDateForward = (days: 5 = 5) =>
  dayjs().add(days, 'day').format();

export const isValid = (date?: string | number): boolean =>
  dayjs(date).isValid();

export const isValidRange = ({
  startAt,
  endAt,
}: {
  startAt: string | number;
  endAt?: string | number;
}) => {
  if (dayjs(startAt).isBefore(getDayISO())) {
    return false;
  }

  if (!endAt) {
    return dayjs(startAt).isAfter(getDateISO());
  }

  return dayjs(endAt).isAfter(dayjs(startAt));
};

export const getDateISO = () => dayjs().toISOString();
export const getDayISO = () => dayjs().startOf('day').toISOString();

export const getCurrentDate = () => dayjs().toDate();

export const taskDatesToIsoString = <
  T extends { createdAt: Date; updatedAt?: Date; startAt?: Date; endAt?: Date }
>(
  data: T
) => ({
  ...data,
  createdAt: data.createdAt.toISOString(),
  ...('updatedAt' in data && { updatedAt: data.updatedAt?.toISOString() }),
  ...('startAt' in data && { startAt: data.startAt?.toISOString() }),
  ...('endAt' in data && { endAt: data.endAt?.toISOString() }),
});

export const subTaskDatesToIsoString = <
  T extends { startAt?: Date; endAt?: Date }
>(
  data: T
) => ({
  ...data,
  ...('startAt' in data && { startAt: data.startAt?.toISOString() }),
  ...('endAt' in data && { endAt: data.endAt?.toISOString() }),
});
