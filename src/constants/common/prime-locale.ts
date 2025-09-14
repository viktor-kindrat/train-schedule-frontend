import type { LocaleOptions } from 'primereact/api';

export const UK_LOCALE_CODE = 'uk';

export const UKRAINIAN_PRIME_LOCALE: LocaleOptions = {
  firstDayOfWeek: 1,
  dayNames: ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'пʼятниця', 'субота'],
  dayNamesShort: ['нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
  dayNamesMin: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  monthNames: [
    'січень',
    'лютий',
    'березень',
    'квітень',
    'травень',
    'червень',
    'липень',
    'серпень',
    'вересень',
    'жовтень',
    'листопад',
    'грудень',
  ],
  monthNamesShort: [
    'січ',
    'лют',
    'бер',
    'кві',
    'трав',
    'чер',
    'лип',
    'сер',
    'вер',
    'жовт',
    'лис',
    'груд',
  ],
  today: 'Сьогодні',
  clear: 'Очистити',
  weekHeader: 'Тиж',
};
