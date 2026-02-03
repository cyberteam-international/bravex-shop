function initNumberInput() {
  const numberInputWrapper = document.querySelector('.number-input');
  if (!numberInputWrapper) return; // Выход если элемент не найден

  const numberInput = numberInputWrapper.querySelector('input[type="number"]');
  const numberInputUp = numberInputWrapper.querySelector('.up');
  const numberInputDown = numberInputWrapper.querySelector('.down');

  if (!numberInput || !numberInputUp || !numberInputDown) return; // Выход если нет необходимых элементов

  numberInputUp.addEventListener('click', () => {
    let max = numberInput.max ? parseInt(numberInput.max) : Infinity;
    let step = numberInput.step ? parseInt(numberInput.step) : 1;
    let value = parseInt(numberInput.value) || 0;
    if (value + step <= max) {
      numberInput.value = value + step;
      numberInput.dispatchEvent(new Event('input'));
    }
  });

  numberInputDown.addEventListener('click', () => {
    let min = numberInput.min ? parseInt(numberInput.min) : -Infinity;
    let step = numberInput.step ? parseInt(numberInput.step) : 1;
    let value = parseInt(numberInput.value) || 0;
    if (value - step >= min) {
      numberInput.value = value - step;
      numberInput.dispatchEvent(new Event('input'));
    }
  });
}

// Инициализация при загрузке DOM
document.addEventListener("DOMContentLoaded", initNumberInput);

// Экспорт для возможной переинициализации
export { initNumberInput };
