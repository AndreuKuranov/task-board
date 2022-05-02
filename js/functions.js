// проверка на число
export const validationNumber = (n) => (Number.isInteger(+n) && !isNaN(+n));

// преобразует значение в шестнадцатеричную систему счисления
export const convertNumeralSystem = (item, n) => (`0${(Number(item).toString(n))}`).slice(-2).toUpperCase();

// преобразует значения цвет RGB или RGBA в шестнадцатеричный вид 
export const convertColor10In16 = (color) => color.split('').filter(item => (validationNumber(item) && item !== ' ') || item === ',' || item === '.').join('').split(',').slice(0,3).map(item => convertNumeralSystem(item, 16)).join('');

// проверяет если нужный класс у элемента
export const checkClass = (element, cl) => element.classList.contains(cl);

// поиск элемента по id
export const labelClass = (element, n) => element.querySelector(`label[for=${n}]`);

// уникальный id
export const uniqueId = () => {
  const random = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

  return `${random()}${random()}-${random()}-${random()}-${random()}-${random()}${random()}${random()}`
}

// учитывает положение курсора относительно центра элемента
export const getNextElement = (cursorPosition, currentElement) => {
  let currentElementCoord = currentElement.getBoundingClientRect();
  let currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

  let nextElement = (cursorPosition < currentElementCenter) ? currentElement : currentElement.nextElementSibling;
  
  return nextElement;
};