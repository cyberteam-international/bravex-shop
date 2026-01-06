const minRange = document.getElementById('minRange');
const maxRange = document.getElementById('maxRange');
const minInput = document.getElementById('minInput');
const maxInput = document.getElementById('maxInput');
const track = document.querySelector('.range-track');

const minGap = 1;

function updateTrack() {
  const min = +minRange.value;
  const max = +maxRange.value;
  const range = +minRange.max - +minRange.min;

  const left = ((min - minRange.min) / range) * 100;
  const right = 100 - ((max - minRange.min) / range) * 100;

  track.style.setProperty('--left-range', `${left}%`);
  track.style.setProperty('--right-range', `${right}%`);
}

function syncFromRange() {
  let min = +minRange.value;
  let max = +maxRange.value;

  if (max - min < minGap) {
    minRange.value = max - minGap;
    min = +minRange.value;
  }

  minInput.value = min;
  maxInput.value = max;
  updateTrack();
}

function syncFromInput() {
  let min = +minInput.value;
  let max = +maxInput.value;

  if (min >= max) {
    min = max - minGap;
    minInput.value = min;
  }

  minRange.value = min;
  maxRange.value = max;
  updateTrack();
}

/* events */
minRange.addEventListener('input', syncFromRange);
maxRange.addEventListener('input', syncFromRange);

minInput.addEventListener('change', syncFromInput);
maxInput.addEventListener('change', syncFromInput);

/* init */
updateTrack();
