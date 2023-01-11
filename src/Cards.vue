<template>
  <div class="wrapper unreg-wrapper">
    <sprite></sprite>
    <div class="unreg-cards" data-unreg-slider>
      <div class="unreg-cards__header">
        <h2 class="unreg-cards__title">{{ title }}</h2>
        <div class="unreg-cards__text" v-if="type === 'cv'">
          <p>Check out some of our candidates, selected for you by our smart algorithm.<span></span></p>
          <p>You can view their full CV and open their contacts after <br>a&nbsp;<a class="unreg-cards__link" target="_blank" :href="regLink">quick registration</a><span></span></p>
        </div>
        <div class="unreg-cards__text" v-else>
          <p>See some of our offers, selected for you by our smart algorithm.<span></span></p>
          <p>You can view them in detail or see more vacanies after <br>a&nbsp;<a class="unreg-cards__link" :href="regLink">quick registration</a><span></span></p>
        </div>
      </div>
      <div class="unreg-cards__controls">
        <button class="btn unreg-cards__arrow-btn" type="button" data-slider-prev><span class="btn__text"></span><span class="btn__icon">
                <svg width="43" height="8" aria-hidden="true">
                  <use xlink:href="#long-arrow-left"></use>
                </svg></span>
        </button>
        <button class="btn unreg-cards__arrow-btn" type="button" data-slider-next><span class="btn__text"></span><span class="btn__icon">
                <svg width="43" height="8" aria-hidden="true">
                  <use xlink:href="#long-arrow-left"></use>
                </svg></span>
        </button>
      </div>
      <div class="unreg-cards__cards keen-slider" id="keen-slider">
        <article v-for="card in cards" :key="card.id" class="unreg-card keen-slider__slide unreg-card--personal unreg-card--hidden" @click="register">
          <div class="unreg-card__userpic" v-if="card.image">
            <picture>
              <source type="image/webp" :srcset="card.image"><img :src="card.image" width="34" height="34" alt="Drew Cano">
            </picture>
          </div>
          <div class="unreg-card__body">
            <h3 class="unreg-card__title">{{ card.title }}</h3>
            <time class="unreg-card__time-found" datetime="2022-06-18">Matched today</time>
            <p class="unreg-card__name">{{ card.name }}</p>
            <p class="unreg-card__match unreg-card__match--green">{{getRndInteger(87,99)}}% match</p>
            <p class="unreg-card__relocation">Open to relocation</p>
            <p class="unreg-card__label unreg-card__label--experience">Total experience</p>
            <p class="unreg-card__experience">{{ card.experience }}</p>
            <p class="unreg-card__location">
              <svg width="9" height="11" aria-hidden="true">
                <use xlink:href="#map-marker"></use>
              </svg><span>{{ card.location }}</span>
            </p>
            <p class="unreg-card__label unreg-card__label--salary">Expected salary</p>
            <p class="unreg-card__salary">{{ card.salary }}</p>
            <p class="unreg-card__workplace">{{ card.office }}</p>
            <p class="unreg-card__label unreg-card__label--stack">Languages</p>
            <p class="unreg-card__languages">{{ card.languages }}<span>&nbsp;{{getRndInteger(1,4)}}+</span>
            </p>
            <p class="unreg-card__label unreg-card__label--frameworks">Frameworks</p>
            <p class="unreg-card__frameworks">{{ card.frameworks }}<span>&nbsp;{{getRndInteger(1,20)}}+</span>
            </p>
            <div class="unreg-card__buttons">
              <button class="btn unreg-card__button unreg-card__button--accented" type="button" @click="register">
                <span class="btn__text">I am interested</span>
              </button>
              <button class="btn unreg-card__button unreg-card__button--dark" type="button" @click="register">
                <span class="btn__text">Decline</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import Sprite from '/src/components/Sprite';
import axios from "axios";
import KeenSlider from 'keen-slider'

const getSlidesSpacing = () => {
  const mediaSM = window.matchMedia('(max-width: 767px)');
  const mediaMD = window.matchMedia('(max-width: 1024px)');

  if (mediaSM.matches) {
    return '10';
  }
  if (mediaMD.matches) {
    return '24';
  }
  return '48';
};

const initSlider = () => {
  const root = document.querySelectorAll('cards-component');
  const sliders = root[0].shadowRoot.querySelectorAll('[data-unreg-slider]');

  if (!sliders.length) {
    return;
  }

  sliders.forEach((slider) => {
    const sliderContainer = slider.querySelector('.keen-slider');

    const keenSlider = new KeenSlider(sliderContainer, {
      loop: true,
      mode: "snap",
      rtl: false,
      slides: {
        perView: "auto",
        spacing: getSlidesSpacing(),
      },
    });

    slider.style.paddingRight = 0;

    const controls = {
      'prev': slider.querySelector('[data-slider-prev]'),
      'next': slider.querySelector('[data-slider-next]'),
    };

    if (controls['prev'] && controls['next']) {
      controls['prev'].addEventListener("click", () => keenSlider.prev())
      controls['next'].addEventListener("click", () => keenSlider.next())
    }
  });
};

export default {
  name: "Cards",
  components: {
    Sprite
  },
  props: {
    type: {
      type: String,
      default: 'cv'
    }
  },
  data() {
    return {
      cards: [],
    }
  },
  computed: {
    regLink() {
      return process.env.VUE_APP_MAIN_APP_URL + '/signup';
    },
    title() {
      if (this.type === 'cv') {
        return 'Meet our best';
      }
      return 'Have a go at it';
    }
  },
  mounted() {
    this.initData();
    window.addEventListener('rutajob_skills-localstorage-changed', () => {
      this.initData();
    });
  },
  methods: {
    initData() {
      let data = localStorage.getItem('rutajob_skills_' + this.type);
      if (data) {
        data = JSON.parse(data);
      } else {
        data = { type: this.type }
      }
      const baseUrl = process.env.VUE_APP_API_BASEURL;
      axios.post(baseUrl + '/find-cards', data).then((res) => {
        if (res.data.success) {
          this.cards = res.data.data;
          this.$nextTick().then(() => {
            initSlider();
          });
        }
      })
    },
    getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min) ) + min;
    },
    register() {
      window.open(this.regLink);
    }
  }
}
</script>

<style lang="scss">
@import '/src/assets/style-unreg.scss';
</style>
