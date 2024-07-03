import { combine, createEvent, sample } from "effector";

import {
  minutesOnKilometer$,
  kilometersPerHour$,
  changeKilometersPerHour,
  changeMinutesOnKilometer,
} from "./model";

export const minutesOnKilometerView$ = combine(minutesOnKilometer$, Math.round);
export const kilometersPerHourView$ = combine(kilometersPerHour$, Math.round);

export const onChangeKilometersPerHour = createEventHandler(
  changeKilometersPerHour
);
export const onChangeMinutesOnKilometer = createEventHandler(
  changeMinutesOnKilometer
);

function createEventHandler(target) {
  const result = createEvent();

  sample({
    clock: result,
    fn: (e) => e.target.value,
    target,
  });

  return result;
}
