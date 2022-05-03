import { convertColor10In16, checkClass, labelClass, uniqueId, getNextElement } from './functions.js';
import PostService from './postService.js';

let modal = document.querySelector('.modal');
let modalClose = document.querySelector('.modal__close');
let modalContent = document.querySelector('.modal__content');
let form = document.querySelector('.form');
let formTitle = document.querySelector('.form__title');
let formBtn = document.querySelector('.form__btn');
let formBtnDelete = document.querySelector('.form__btn--delete');
let kanbanBoardContent = document.querySelector('.kanban-board__content');
let kanbanBoardBody = document.querySelector('.kanban-board__body');
let kanbanBoardButton = document.querySelector('.kanban-board__button');
let saveBtn = document.querySelector('.header__button');

let inputAll = document.querySelectorAll('.form__input');

// проверяет поля в форме, в зависимости от результата изменяется положение "placeholder"
const checkValueInput = (element) => {
  let inputAll = element.querySelectorAll('.input');

  for (let item of inputAll) {
    if (item.value.length === 0) {
      labelClass(element, item.id).classList.add('label--transition');
      labelClass(element, item.id).classList.remove('label--top');
    } else {
      labelClass(element, item.id).classList.remove('label--transition');
      labelClass(element, item.id).classList.add('label--top');
    }
  }
}

// при фокусе или его потери изменяется положение "placeholder"
const labelTopInput = (form) => {
  form.addEventListener('focusin', function(e) {
    if (checkClass(e.target, 'input')) {
      labelClass(this, e.target.id).classList.add('label--top', 'label--transition')
    }
  });

  form.addEventListener('focusout', function(e) {
    checkValueInput(form);
  });
}

// сброс значений полей формы 
const resetForm = (arr) => Array.from(arr).forEach(item => item.id === 'color' ? item.value = '#FFFF00' : item.value = '');
// действия при закрытие модалки
const closeModal = () => {
  document.removeEventListener('keydown', escapeHandler);

  modalContent.classList.remove('modal__animation-zoomIn');
  modalClose.classList.remove('modal__animation-opacityOpen');
  document.body.classList.remove('no-scroll');

  modalContent.classList.add('modal__animation-zoomOut');
  modalClose.classList.add('modal__animation-opacityClose', 'modal__close-closeClose');

  setTimeout(() => {
    modalContent.classList.remove('modal__animation-zoomOut');
    modalClose.classList.remove('modal__animation-opacityClose', 'modal__close-closeClose');
    modal.classList.remove('modal--open');
    formBtnDelete.classList.remove('form__btn--open');

    resetForm(inputAll);
  }, 500);
};

// закрытие модалки с помощи Escape
const escapeHandler = (e) => {
  if (e.code == 'Escape') {
    closeModal();
  
    checkValueInput(form);
  }
};

// действия при открытие модалки 
const formBtnFunc = (text, element, titleCol) => {
  labelTopInput(form);

  let titleColumn = titleCol.querySelector('.column__title');
  formTitle.textContent = titleColumn.textContent;

  document.addEventListener('keydown', escapeHandler);

  modalContent.classList.add('modal__animation-zoomIn');
  modalClose.classList.add('modal__animation-opacityOpen', 'modal__close-closeOpen');
  document.body.classList.add('no-scroll');

  formBtn.textContent = text;

  let [title, description, color] = [document.getElementById('title'), document.getElementById('description'), document.getElementById('color')];
  let [colorValue, titleText, descriptionText] = [element.querySelector('.item__content'), element.querySelector('.item__title'), element.querySelector('.item__text')];

  // проверяем изменяем ли карточку,  если да, то подгружаем данные из карточки в поля формы 
  if (text === 'Изменить') {
    formBtnDelete.classList.add('form__btn--open');

    title.value = titleText.textContent;
    description.value = descriptionText.textContent;

    let color10 = window.getComputedStyle(colorValue).backgroundColor;
    let color16 = convertColor10In16(color10);

    color.value = `#${color16}`;

    checkValueInput(form);
  }

  // создаем или изменяем карточку
  formBtn.onclick = () => {
    if (text === 'Создать') {
      let x = createItem(title.value, description.value, color.value)
      x.classList.add('modal__animation-zoomIn');

      element.append(x);

      setTimeout(() => x.classList.remove('modal__animation-zoomIn'), 700);
    } else {
      titleText.textContent = title.value;
      descriptionText.textContent = description.value;
      colorValue.style.backgroundColor = color.value;
    }

    closeModal();
  }

  // удаляем карточку
  formBtnDelete.onclick = () => {
    closeModal();
    element.classList.add('modal__animation-zoomOut');

    setTimeout(() => {
      element.classList.remove('modal__animation-zoomOut');
      element.remove();
      
    }, 500);
  }
}

// закрываем модалку
modalClose.onclick = () => {
  closeModal();

  checkValueInput(form);
}

//-------------------------------------------------------------------------------------------------

// создание раздела
const createColumn = (title, id = uniqueId(), ...arg) => {
  let column = document.createElement('div');
  column.classList.add('kanban-board__column', 'column');
  column.id = id;

  let columnHeader = document.createElement('div');
  columnHeader.classList.add('column__header');

  let columnTitle = document.createElement('h3');
  columnTitle.classList.add('column__title');
  columnTitle.textContent = title;
  columnTitle.title = 'Редактировать заголовок';

  let columnBtnBlock = document.createElement('div');
  columnBtnBlock.classList.add('column__btn-block');

  let columnBtnDelete = document.createElement('button');
  columnBtnDelete.classList.add('column__btn-delete', 'material-symbols-outlined');
  columnBtnDelete.type = 'button';
  columnBtnDelete.textContent = 'delete';
  columnBtnDelete.title = 'Удалить раздел';

  columnBtnBlock.append(columnBtnDelete);

  let inputTitle = document.createElement('textarea');
  inputTitle.classList.add('column__input', 'open');
  inputTitle.id = 'columnTitle';
  inputTitle.name = 'columnTitle';
  inputTitle.title = 'Заголовок';
  //------------------------------
  columnTitle.addEventListener('click', function() {
    this.classList.add('open');
    columnBtnBlock.classList.add('open');
    inputTitle.classList.remove('open');
    inputTitle.focus();
  });

  inputTitle.addEventListener('focus', function() {
    this.value = columnTitle.textContent;
  });

  inputTitle.addEventListener('blur', function() {
    columnTitle.textContent = this.value;
    columnTitle.classList.remove('open');
    columnBtnBlock.classList.remove('open');
    this.classList.add('open');
  });
  //------------------------------
  columnHeader.append(columnTitle, columnBtnBlock, inputTitle);

  let columnBody = document.createElement('ul');
  columnBody.classList.add('column__body');
  columnBody.title = 'Создать карточку'

  if (arg.length > 0) {
    let fragment = new DocumentFragment();
    let arrValue = arg[0];

    for(let i of arrValue) {
      fragment.append(createItem(i.title, i.text, i.color, i.id));
    }

    columnBody.append(fragment)
  }

  column.append(columnHeader, columnBody);

  return column
}

const titleSection = (e) => {
  let titleColumn;
  for (let item of e.path) {
    if (checkClass(item, 'column')) {
      titleColumn = item;
      break
    }
  }
  return titleColumn
}

// создание карточки
const createItem = (
  title = 'заголовок', 
  text = 'описание',
  color = '#ffff00',
  id = uniqueId()
) => {
  let item = document.createElement('li');
  item.classList.add('column__item', 'item');
  item.draggable = 'true';
  item.id = id;
  //------------------------------
  // изменяем содержимое карточки
  item.addEventListener('click', function(e) {
    modal.classList.add('modal--open');

    formBtnFunc('Изменить', this, titleSection(e));
  });

  item.addEventListener('dragstart', function() {
    this.classList.add('opacity');
  });
  item.addEventListener('dragend', function() {
    this.classList.remove('opacity');
  });
  //------------------------------
  let itenContent = document.createElement('div');
  itenContent.classList.add('item__content');
  itenContent.style.backgroundColor = color;
  itenContent.title = 'Редактировать карточку';

  let itemTitle = document.createElement('h4');
  itemTitle.classList.add('item__title');
  itemTitle.textContent = title;

  let itemText = document.createElement('div');
  itemText.classList.add('item__text');
  itemText.textContent = text;

  itenContent.append(itemTitle, itemText);

  item.append(itenContent);

  return item
}

//-------------------------------------------------------------------------------------------------

// генерирует список задач
function getListContent(arr) {
  let fragment = new DocumentFragment();

  for(let i of arr) {
    fragment.append(createColumn(i.columnTitle, i.id, i.item));
  }

  return fragment;
}

// обработка ошибки
const errorMessage = (e) => {
  let message = document.createElement('div');
  message.textContent = `Что-то пошло не так: "${e.stack}"`;
  message.style = 'margin: 20px'

  kanbanBoardContent.after(message);

  setTimeout(() => {
    message.remove();
  }, 5000)
}

let loadingElement = document.createElement('h2');
loadingElement.textContent = 'Загрузка...';
loadingElement.style.textAlign = 'center';

let saveElement = document.createElement('h2');
saveElement.textContent = 'Сохранение...';
saveElement.style.textAlign = 'center';

// при запросе блокирует поле с задачами и кнопку сохранения  
const loading = (bol, element) => {
  if (bol) {
    kanbanBoardContent.style.display = 'none';
    kanbanBoardContent.after(element);
    saveBtn.disabled = true;
  } else {
    kanbanBoardContent.style.display = '';
    element.remove();
    saveBtn.disabled = false;
  }
}

// обработка GET запрос
async function loadAndSortTowns() {
  try {
    loading(true, loadingElement)
    let obj = await PostService.getAll();

    kanbanBoardBody.append(getListContent(obj.arr));

  } catch(e) {
    loading(false, loadingElement)
    errorMessage(e);
  } finally {
    setTimeout(loading, 500, false, loadingElement);
  }
}

// не знаю когда лучше делать GET запрос, делаю после полной загрузке html
document.addEventListener('load', loadAndSortTowns());

// подготавливаем данные для сохранения
const valueTaskBoard = () => {
  let arr = [];
  let columnAll = document.querySelectorAll('.column');

  for (let i of columnAll) {
    let columnTitle = i.querySelector('.column__title').textContent;

    let itemAll = i.querySelectorAll('.item');
    let item = [];

    for (let j of itemAll) {
      let [colorValue, titleText, descriptionText] = [j.querySelector('.item__content'), j.querySelector('.item__title'), j.querySelector('.item__text')];
      let color10 = window.getComputedStyle(colorValue).backgroundColor;
      let color16 = convertColor10In16(color10);

      item.push({
        title: titleText.textContent, 
        text: descriptionText.textContent,
        color: `#${color16}`,
        id: j.id
      })
    }
    arr.push({
      columnTitle,
      item,
      id: i.id
    })
  }

  return {arr}
}

// обработка PATCH запрос
async function saveList() {
  try {
    loading(true, saveElement)
    await PostService.putAll(valueTaskBoard(), 'taskBoard')

  } catch(e) {
    loading(false, saveElement);
    errorMessage(e);
  } finally {
    setTimeout(loading, 1000, false, saveElement);
  }
}

// сохраняем изменения
saveBtn.onclick = () => {
  saveList();
}

//-------------------------------------------------------------------------------------------------

// создаем новый раздел
kanbanBoardButton.onclick = () => {
  kanbanBoardBody.append(createColumn('Title'));
}

kanbanBoardBody.addEventListener('click', function(e) {
  
  let titleColumn = titleSection(e);

  // определяем что клик пришелся по пустой области, а не по карточке 
  if (e.target.className === 'column__body') {
    modal.classList.add('modal--open');
    formBtnFunc('Создать', e.target, titleColumn);

    checkValueInput(form);
  }

  // удаляем раздел 
  if (checkClass(e.target, 'column__btn-delete')) {
    for (let item of e.path) {
      if (checkClass(item, 'column')) {
        item.remove();
        break
      }
    }
  }
});

// события dragstart и dragend вешаю при создание элемента в функции createItem
kanbanBoardBody.addEventListener('dragover', function(e) {
  e.preventDefault();

  let activeElement = this.querySelector('.opacity');
  let nextElement;

  for (let item of e.path) {
    if (checkClass(item, 'item')) {
      let currentElement = item;

      let isMoveable = activeElement !== currentElement;
      if (!isMoveable) return;

      nextElement = getNextElement(e.clientY, currentElement);

      if ( nextElement && activeElement === nextElement.previousElementSibling || activeElement === nextElement ) return;
    }

    if (checkClass(item, 'column__body')) {
      item.insertBefore(activeElement, nextElement);
    }

    if (checkClass(item, 'kanban-board__body')) break;
  }
});
