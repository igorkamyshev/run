import { combine, createEvent, sample } from "effector";

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

sample({
  clock: onChangeMinutesOnKilometer,
  fn: (e) => {
    // Автозамена точки/запятой на апостроф при вводе
    const input = e.target;
    const cursorPos = input.selectionStart;
    const newValue = input.value.replace(/[.,]/g, "'");
    if (newValue !== input.value) {
      input.value = newValue;
      input.setSelectionRange(cursorPos, cursorPos);
    }
    return parseMinutesOnKilometer(newValue);
  },
  filter: (e) => {
    const newValue = e.target.value.replace(/[.,]/g, "'");
    return parseMinutesOnKilometer(newValue) !== null;
  },
  target: changeMinutesOnKilometer,
});
