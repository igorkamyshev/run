import { combine, createEffect, createEvent, sample } from "effector";

import {
  minutesOnKilometer$,
  kilometersPerHour$,
  changeKilometersPerHour,
  changeMinutesOnKilometer,
} from "./model";

// Форматирование минут на километр как минуты'секунды (например, 5'30)
function formatMinutesOnKilometer(value) {
  const minutes = Math.floor(value);
  const seconds = Math.round((value - minutes) * 60);
  if (seconds === 60) {
    return `${minutes + 1}'00`;
  }
  return `${minutes}'${seconds.toString().padStart(2, "0")}`;
}

// Парсинг ввода минут на километр (принимает 5'30, 5.30, 5,30)
function parseMinutesOnKilometer(input) {
  // Заменяем запятые и точки на апостроф для унификации
  const normalized = input.replace(/[.,]/g, "'");
  const match = normalized.match(/^(\d+)'(\d{1,2})$/);
  if (match) {
    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    return minutes + seconds / 60;
  }
  // Если просто число — считаем как минуты
  const num = parseFloat(input.replace(",", "."));
  return isNaN(num) ? null : num;
}

// Форматирование км/ч с одним десятичным знаком
function formatKilometersPerHour(value) {
  return value.toFixed(1).replace(".", ",");
}

// Парсинг ввода км/ч (принимает и точку и запятую)
function parseKilometersPerHour(input) {
  const normalized = input.replace(",", ".");
  const num = parseFloat(normalized);
  return isNaN(num) ? null : num;
}

export const minutesOnKilometerView$ = combine(
  minutesOnKilometer$,
  formatMinutesOnKilometer
);
export const kilometersPerHourView$ = combine(
  kilometersPerHour$,
  formatKilometersPerHour
);

export const onChangeKilometersPerHour = createEvent();
export const onChangeMinutesOnKilometer = createEvent();

sample({
  clock: onChangeKilometersPerHour,
  fn: (e) => {
    const value = parseKilometersPerHour(e.target.value);
    return value;
  },
  filter: (e) => parseKilometersPerHour(e.target.value) !== null,
  target: changeKilometersPerHour,
});

// Эффект для автозамены точки/запятой на апостроф и ограничения ввода
const replaceInputSeparatorFx = createEffect((input) => {
  const cursorPos = input.selectionStart;
  let newValue = input.value.replace(/[.,]/g, "'");
  
  // Ограничиваем: после ' только 2 цифры максимум
  const match = newValue.match(/^(\d*'?\d{0,2})/);
  if (match) {
    newValue = match[1];
  }
  
  if (newValue !== input.value) {
    input.value = newValue;
    input.setSelectionRange(Math.min(cursorPos, newValue.length), Math.min(cursorPos, newValue.length));
  }
});

sample({
  clock: onChangeMinutesOnKilometer,
  fn: (e) => e.target,
  target: replaceInputSeparatorFx,
});

sample({
  clock: replaceInputSeparatorFx.done,
  fn: ({ params: input }) => parseMinutesOnKilometer(input.value),
  filter: ({ params: input }) => parseMinutesOnKilometer(input.value) !== null,
  target: changeMinutesOnKilometer,
});
