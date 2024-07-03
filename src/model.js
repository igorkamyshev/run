import { createEvent, restore, sample } from "effector";

export const appStarted = createEvent();

/* -- Настройки -- */

/* За сколько минут пробегается километр */
export const changeMinutesOnKilometer = createEvent();
export const minutesOnKilometer$ = restore(changeMinutesOnKilometer, 6);

/* Сколько километров пробегается за час */
export const changeKilometersPerHour = createEvent();
export const kilometersPerHour$ = restore(changeKilometersPerHour, 10);

/* -- Расчеты -- */

sample({
  clock: [
    changeMinutesOnKilometer,
    sample({ clock: appStarted, source: minutesOnKilometer$ }),
  ],
  fn: (minutesOnKilometer) => (1 / minutesOnKilometer) * 60,
  target: kilometersPerHour$,
});

sample({
  clock: [
    changeKilometersPerHour,
    sample({ clock: appStarted, source: kilometersPerHour$ }),
  ],
  fn: (kilometersPerHour) => 1 / (kilometersPerHour / 60),
  target: minutesOnKilometer$,
});
