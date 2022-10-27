'use strict'

const images = document.querySelectorAll('.dashboard-img');
const scorePossible = document.querySelector('.score-possible');
const scoreReal = document.querySelector('.score-real');
const btnReset = document.querySelector('.reset-btn');
const btnConfirm = document.querySelector('.confirm-btn');
const eventContainer = document.querySelector('.event-container');
const eventTab = document.getElementById('events');
const rewards = document.querySelectorAll('.reward');
const rewardsGrid = document.querySelector('.dashboard-rewards-grid');
const choreDescription = document.querySelector('.chore-description');

const showDescription = function (event, add) {
    const score = event.target.dataset.score;
    const description = document.querySelector(`.description-${score}`)
    const defaultDescription = document.querySelector('.description-default')
    if (add) {
        defaultDescription.classList.remove('description-active');
        description.classList.add('description-active');
    } else {
        defaultDescription.classList.add('description-active');
        description.classList.remove('description-active');
    }
}

images.forEach(function (img) {
    img.addEventListener('mouseover', function (e) {
        img.classList.add('dashboard-img-hover');
        showDescription(e,true);
    });

    img.addEventListener('mouseout', function (e) {
        if (!img.classList.contains('dashboard-img-clicked'))
            img.classList.remove('dashboard-img-hover');
        showDescription(e, false);
    });

    img.addEventListener('click', function (e) {
        if (img.classList.contains('dashboard-img-clicked')) {
            img.classList.remove('dashboard-img-clicked');
            scorePossible.textContent = String(Number(scorePossible.textContent) - Number(e.target.dataset.score));
        } else {
            img.classList.add('dashboard-img-clicked')
            img.classList.add('dashboard-img-hover')
            scorePossible.textContent = String(Number(scorePossible.textContent) + Number(e.target.dataset.score));
        }
    });
});

const resetLayout = function () {
    images.forEach(img => {
        img.classList.remove('dashboard-img-clicked');
        img.classList.remove('dashboard-img-hover');
        return img;
    })
};

const addEvent = function () {
    const selectedImages = document.querySelectorAll('.dashboard-img-clicked');
    let str = 'you '; // TODO: nahradit retezec 'you' uzivatelskym jmenem
    selectedImages.forEach(function (image) {
        str += image.dataset.event;
        str += ', ';
    })
    str = str.slice(0, -2);
    const now = new Date();
    console.log(now.getDate());
    const optionsDate = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    };
    const optionsTime = {
        hour: 'numeric',
        minute: 'numeric'
    }
    const date = new Intl.DateTimeFormat('cs-CZ', optionsDate).format(now);
    const time = new Intl.DateTimeFormat('cs-CZ', optionsTime).format(now);
    const html = `<div class="event_row">
                    <p>${date} at ${time} - ${str}</p>
                  </div>`;
    eventContainer.insertAdjacentHTML('beforeend', html);
}

const revealRewards = function () {
    rewards.forEach(function (reward) {
        if (Number(scoreReal.textContent) >= Number(reward.dataset.value)) {
            reward.classList.remove('hidden');
            reward.style.filter = 'blur(0px)';
        }
})};


btnReset.addEventListener('click', function () {
    resetLayout();
    scorePossible.textContent = '0';
});

btnConfirm.addEventListener('click', function () {
    let score = Number(scoreReal.textContent);
    score += Number(scorePossible.textContent);
    scoreReal.textContent = String(score);
    scorePossible.textContent = '0';
    addEvent();
    resetLayout();
    revealRewards();
});