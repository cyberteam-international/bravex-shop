const selectTriggers = document.querySelectorAll('.select .select-trigger');

selectTriggers.forEach((trigger) => {
  const options = trigger.nextElementSibling;

  trigger.addEventListener('click', () => {
    options.classList.toggle('open');
    trigger.classList.toggle('active');
  });

  options.querySelectorAll('li').forEach((option) => {
    option.addEventListener('click', () => {
      trigger.querySelector('span').textContent = option.textContent;
      trigger.classList.remove('active');
      options.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!trigger.parentElement.contains(e.target)) {
      options.classList.remove('open');
      trigger.classList.remove('active');
    }
  });
});
