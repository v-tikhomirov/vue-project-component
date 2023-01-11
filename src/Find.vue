<template>
  <div class="wrapper unreg-wrapper">
    <div class="unreg-find">
      <sprite></sprite>
      <div class="unreg-find__wrapper">
        <h2 class="unreg-find__title">Find your match</h2>
        <div class="unreg-find__text" :class="[type === 'vacancy' ? 'unreg-find__text--vacancy' : '']">
          <template v-if="type === 'cv'">
            <p>What type of&nbsp;programmer do&nbsp;you need for your project?<br>Fill in&nbsp;the skills you want to&nbsp;see in&nbsp;your potential employee and let our smart algorithm work its magic</p>
            <p></p>
          </template>
          <template v-else>
            <div class="unreg-find__text ">
              <p>Fill in&nbsp;your skills, choose desired positions and hop in&nbsp;for a&nbsp;ride.</p>
              <p>We’ll do&nbsp;the rest for you!</p>
            </div>
          </template>
        </div>
        <div class="unreg-find__form unreg-select-container">
          <button class="btn unreg-find__btn" type="button" @click="findEntity">
            <span class="btn__text">{{ buttonText }}</span>
            <span class="btn__icon">
            <svg width="19" height="20" aria-hidden="true">
              <use xlink:href="#icon-search-unreg"></use>
            </svg>
          </span>
          </button>
          <div class="not-empty custom-select custom-select-up" :class="[isOpenClass ? 'is-open' : '', ]" data-select data-multiple="true" data-editable="true">
            <span class="custom-select__error">Select skills</span>
            <div class="custom-select__selected-list-container not-empty">
              <ul class="custom-select__selected-list" role="listbox">
                <li
                    v-for="sTech in selected"
                    :key="'s_'+sTech.id"
                    class="custom-select__selected-list-item is-editable"
                    data-select-value="id-1"
                    aria-selected="true"
                    role="option">
                  <div class="not-empty custom-select custom-select-edit" :class="[sTech.experience ? 'has-value ' : '', sTech.isOpen ? 'is-open' : '']" data-select v-click-outside="closeExp">
                    <span class="custom-select__label">Experience</span>
                    <button class="custom-select__button" type="button" aria-label="Choose an option" @click="openExp(sTech.id)">
                      <span class="custom-select__text">{{ getExpLabel(sTech.experience) }}</span>
                      <span class="custom-select__icon"></span>
                      <span class="custom-select__placeholder">Experience</span>
                    </button>
                    <ul class="custom-select__list" role="listbox">
                      <li class="custom-select__selected-text-item">
                        <p class="custom-select__selected-text">{{ getExpLabel(sTech.experience) }}</p>
                        <button class="btn btn--only-icon btn--border-none custom-select__list-close" type="button" aria-label="Close list">
                          <span class="btn__text"></span>
                        </button>
                      </li>
                      <li class="custom-select__item" tabindex="0" role="option" @click="setExp(sTech.id, 12)">0-1 year
                      </li>
                      <li class="custom-select__item" tabindex="0" role="option" @click="setExp(sTech.id, 24)">1-2 years
                      </li>
                      <li class="custom-select__item" tabindex="0" role="option" @click="setExp(sTech.id, 36)">2-3 years
                      </li>
                      <li class="custom-select__item" tabindex="0" role="option" @click="setExp(sTech.id, 48)">3-4 years
                      </li>
                      <li class="custom-select__item" tabindex="0" role="option" @click="setExp(sTech.id, 72)">5-6 years
                      </li>
                      <li class="custom-select__item" tabindex="0" role="option" @click="setExp(sTech.id, 84)">7+ years
                      </li>
                    </ul>
                  </div>
                  <div class="custom-select__popup">
                    <p>You can fill out your skillset, and specify the experience you have with that particular technology from the dropdown menu.</p>
                    <p>This data will help us match you&nbsp;with the best possible job opportunity.</p>
                  </div>
                  <p class="custom-select__item-text">{{ sTech.name }}</p>
                  <button class="btn btn--only-icon btn--border-none custom-select__item-close" type="button" aria-label="Close list">
                    <span class="btn__text"></span>
                    <span class="btn__icon" @click="removeSelected(sTech.id)">
                    <svg width="15" height="15" aria-hidden="true">
                      <use xlink:href="#icon-close2"></use>
                    </svg>
                  </span>
                  </button>
                </li>
              </ul>
            </div>
            <button class="custom-select__button" type="button" aria-label="Choose an option">
              <input type="text" class="custom-select__text" v-model="search" @input="loadValues">
              <span class="custom-select__icon"></span>
              <span v-if="!search" class="custom-select__placeholder">Search skills</span>
            </button>
            <ul class="custom-select__list" role="listbox" v-click-outside="toggleOpen">
              <li
                  v-for="tech in filteredTechnologies"
                  :key="tech.value"
                  class="custom-select__item"
                  @click.stop="selectTech(tech)"
                  role="option">{{ tech.label }}
              </li>
            </ul>
          </div>
        </div>
        <div class="unreg-find__divider-icon">
          <svg width="1180" height="8" aria-hidden="true">
            <use xlink:href="#divider"></use>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clickOutside from "./directives/click-outside";
import Sprite from '/src/components/Sprite';
import axios from "axios";
import _ from 'lodash';
import Vue from "vue";
Vue.directive('click-outside', clickOutside);
export default {
  name: 'FindComponent',
  props: {
    type: {
      type: String,
      default: 'cv'
    }
  },
  components: {
    Sprite
  },
  data() {
    return {
      search: '',
      technology: [],
      selected: [],
      isOpen: false
    }
  },
  computed: {
    isOpenClass() {
      return this.isOpen && this.technology.length > 0
    },
    filteredTechnologies() {
      return this.technology.filter((item) => {
        return !this.selectedIds.includes(item.value);
      })
    },
    selectedIds() {
      return this.selected.map((item) => {
        return item.id;
      })
    },
    buttonText() {
      if (this.type === 'cv') {
        return 'Find a programmer';
      }
      return 'Find a job';
    }
  },
  methods: {
    loadValues: _.debounce(function () { this.getValues() }, 800),
    getValues() {
      const baseUrl = process.env.VUE_APP_API_BASEURL;
      if (this.search) {
        axios.get(baseUrl + '/technology?search=' + this.search).then((res) => {
          if (res.data.success) {
            this.technology = res.data.data;
            this.technology.sort((a,b) => {
              const sub = a.label.toLowerCase().replace(this.search, '');
              const sub2 = b.label.toLowerCase().replace(this.search, '');
              if (sub.length > sub2.length) {
                return 1
              } else if (sub.length < sub2.length) {
                return -1
              } else {
                return 0;
              }
            })
            this.isOpen = true;
          }
        })
      }
    },
    selectTech(element) {
      const idx = this.selected.findIndex((item) => {
        return item.id === element.value;
      });
      if (idx < 0) {
        this.selected.push({
          id: element.value,
          name: element.label,
          experience: null,
          isOpen: false
        });
      }
    },
    setExp(id, exp) {
      const idx = this.selected.findIndex((item) => {
        return item.id === id;
      });
      if (idx >= 0) {
        this.selected[idx].experience = exp;
      }
    },
    toggleExp(flag, id) {
      const idx = this.selected.findIndex((item) => {
        return item.id === id;
      });
      if (idx >= 0) {
        this.selected[idx].isOpen = flag;
      }
    },
    openExp(id) {
      this.toggleExp(true, id)
    },
    closeExp() {
      this.selected.forEach((item) => {
        item.isOpen = false;
        return item;
      })
    },
    removeSelected(id) {
      const idx = this.selected.findIndex((item) => {
        return item.id === id;
      });
      if (idx >= 0) {
        this.selected.splice(idx,1);
      }
    },
    toggleOpen() {
      this.isOpen = false;
    },
    findEntity() {
      localStorage.setItem('rutajob_skills_'+ this.type, JSON.stringify({ skills: this.selected, type: this.type } ));
      window.dispatchEvent(new CustomEvent('rutajob_skills-localstorage-changed', {}));
    },
    getExpLabel(value) {
      switch (value) {
        case 12:
          return '0-1 year';
        case 24:
          return '1-2 years';
        case 36:
          return '2-3 years';
        case 48:
          return '3-4 years';
        case 72:
          return '5-6 years';
        case 84:
          return '7+ years';
        default:
          break;
      }
    }
  }
}
</script>
<style lang="scss">
@import '/src/assets/style-unreg.scss';
</style>
