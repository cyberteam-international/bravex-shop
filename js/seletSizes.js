const select = document.querySelector('.select-sizes');
const head = select.querySelector('.select-sizes__head');
const value = select.querySelector('.select-sizes__value');
const list = select.querySelector('.select-sizes__list');
const items = [...select.querySelectorAll('.select-sizes__item')];

const btnUp = select.querySelector('#btnUp');
const btnDown = select.querySelector('#btnDown');

let index = items.findIndex((i) => i.classList.contains('active'));

const itemHeight = 36;
const visibleItems = 5;
const hardcodedOffsetForCenteringList = 14;
const centerOffset = Math.floor(visibleItems / 2) * itemHeight - hardcodedOffsetForCenteringList;

let startY = 0;
let startTranslate = 0;
let isDragging = false;

function update() {
  items.forEach((i) => i.classList.remove('active'));
  items[index].classList.add('active');

  const offset = index * itemHeight - centerOffset;
  console.log('offset: ', offset);
  list.style.transform = `translateY(${-offset}px)`;
}

head.addEventListener('click', () => {
  select.classList.toggle('open');
});

btnUp.addEventListener('click', (e) => {
  if (select.classList.contains('open') && index > 0) {
    e.stopPropagation();
    index--;
    update();
  }
});

btnDown.addEventListener('click', (e) => {
  if (select.classList.contains('open') && index < items.length - 1) {
    e.stopPropagation();
    index++;
    update();
  }
});

items.forEach((item, i) => {
  item.addEventListener('click', (e) => {
    if (select.classList.contains('open')) {
      e.stopPropagation();
    }
    index = i;
    update();
    select.classList.remove('open');
    console.log('here');
  });
});

document.addEventListener('click', (e) => {
  console.log('e: ', e.target);
  if (!select.contains(e.target)) {
    console.log('sdfsd');
    select.classList.remove('open');
  }
});

//TOUCH EVENTS

list.addEventListener(
  'touchstart',
  (e) => {
    if (!select.classList.contains('open')) return;

    isDragging = true;
    startY = e.touches[0].clientY;

    const matrix = new WebKitCSSMatrix(getComputedStyle(list).transform);
    startTranslate = matrix.m42;
  },
  { passive: true },
);

list.addEventListener(
  'touchmove',
  (e) => {
    if (!isDragging) return;

    e.preventDefault();

    const delta = e.touches[0].clientY - startY;
    list.style.transform = `translateY(${startTranslate + delta}px)`;
  },
  { passive: false },
);

list.addEventListener(
  'touchend',
  () => {
    if (!isDragging) return;
    isDragging = false;
    snapToItem();
  },
  { passive: true },
);

function snapToItem() {
  const matrix = new WebKitCSSMatrix(getComputedStyle(list).transform);
  const translateY = matrix.m42;

  const rawIndex = (centerOffset - translateY) / itemHeight;
  index = Math.round(rawIndex);

  index = Math.max(0, Math.min(index, items.length - 1));

  list.style.transition = 'transform 0.3s ease';
  update();

  setTimeout(() => {
    list.style.transition = '';
  }, 300);
}

update();
