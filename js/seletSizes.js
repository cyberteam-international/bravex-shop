// const select = document.querySelector('.select-sizes');
// const head = select.querySelector('.select-sizes__head');
// const value = select.querySelector('.select-sizes__value');
// const list = select.querySelector('.select-sizes__list');
// const items = [...select.querySelectorAll('.select-sizes__item')];

// const btnUpOption = select.querySelector('#btnUpOption');
// const btnDownOption = select.querySelector('#btnDownOption');
// const btnUp = select.querySelector('#btnUp');
// const btnDown = select.querySelector('#btnDown');

// let index = items.findIndex((i) => i.classList.contains('active'));

// const itemHeight = 52;
// const visibleItems = 5;
// const centerOffset = Math.floor(visibleItems / 2) * itemHeight;

// /* ---------- CORE ---------- */

// function update() {
//   items.forEach((i) => i.classList.remove('active'));
//   items[index].classList.add('active');
//   value.textContent = items[index].textContent;

//   const offset = index * itemHeight - centerOffset;
//   list.style.transform = `translateY(${-offset}px)`;

//   updateDropdownArrows();
// }

// /* ---------- ARROWS POSITION ---------- */

// function updateDropdownArrows() {
//   if (!select.classList.contains('open')) return;

//   const dropdown = select.querySelector('.select-sizes__dropdown');
//   const dropdownHeight = dropdown.clientHeight;

//   const centerY = dropdownHeight / 2;

//   btnUpOption.style.top = `${centerY - 40}px`;
//   btnDownOption.style.top = `${centerY + 10}px`;
// }

// /* ---------- OPEN / CLOSE ---------- */

// head.addEventListener('click', () => {
//   select.classList.toggle('open');
//   updateDropdownArrows();
// });

// /* ---------- HEAD ARROWS ---------- */

// btnUp.addEventListener('click', (e) => {
//   e.stopPropagation();
//   if (index > 0) {
//     index--;
//     update();
//   }
// });

// btnDown.addEventListener('click', (e) => {
//   e.stopPropagation();
//   if (index < items.length - 1) {
//     index++;
//     update();
//   }
// });

// /* ---------- DROPDOWN ARROWS ---------- */

// btnUpOption.addEventListener('click', () => {
//   if (index > 0) {
//     index--;
//     update();
//   }
// });

// btnDownOption.addEventListener('click', () => {
//   if (index < items.length - 1) {
//     index++;
//     update();
//   }
// });

// /* ---------- ITEM CLICK ---------- */

// items.forEach((item, i) => {
//   item.addEventListener('click', () => {
//     index = i;
//     update();
//     select.classList.remove('open');
//   });
// });

// /* ---------- INIT ---------- */

// update();

const select = document.querySelector('.select-sizes2');
const head = select.querySelector('.select-sizes2__head');
const value = select.querySelector('.select-sizes2__value');
const list = select.querySelector('.select-sizes2__list');
const items = [...select.querySelectorAll('.select-sizes2__item')];

const btnUpOption = select.querySelector('#btnUpOption');
const btnDownOption = select.querySelector('#btnDownOption');
const btnUp = select.querySelector('#btnUp');
const btnDown = select.querySelector('#btnDown');

let index = items.findIndex((i) => i.classList.contains('active'));

const itemHeight = 52;
const visibleItems = 5;
const centerOffset = Math.floor(visibleItems / 2) * itemHeight;

/* ---------- CORE ---------- */

function update() {
  items.forEach((i) => i.classList.remove('active'));
  items[index].classList.add('active');
  // value.textContent = items[index].textContent;

  const offset = index * itemHeight - centerOffset;
  console.log('offset: ', offset);
  list.style.transform = `translateY(${-offset}px)`;

  // updateDropdownArrows();
}

/* ---------- ARROWS POSITION ---------- */

// function updateDropdownArrows() {
//   if (!select.classList.contains('open')) return;

//   const dropdown = select.querySelector('.select-sizes__dropdown');
//   const dropdownHeight = dropdown.clientHeight;

//   const centerY = dropdownHeight / 2;

//   btnUpOption.style.top = `${centerY - 40}px`;
//   btnDownOption.style.top = `${centerY + 10}px`;
// }

/* ---------- OPEN / CLOSE ---------- */

head.addEventListener('click', () => {
  select.classList.toggle('open');
  // updateDropdownArrows();
});

/* ---------- HEAD ARROWS ---------- */

btnUp.addEventListener('click', (e) => {
  e.stopPropagation();
  if (index > 0) {
    index--;
    update();
  }
});

btnDown.addEventListener('click', (e) => {
  e.stopPropagation();
  if (index < items.length - 1) {
    index++;
    update();
  }
});

/* ---------- DROPDOWN ARROWS ---------- */

// btnUpOption.addEventListener('click', () => {
//   if (index > 0) {
//     index--;
//     update();
//   }
// });

// btnDownOption.addEventListener('click', () => {
//   if (index < items.length - 1) {
//     index++;
//     update();
//   }
// });

/* ---------- ITEM CLICK ---------- */

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

/* ---------- INIT ---------- */

update();
