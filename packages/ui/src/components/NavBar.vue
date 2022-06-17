<template>
  <div>
    <div class="nav-container" ref="target">
      <nav class="navbar" :class="{ open: isMenuVisible }">
        <label class="responsive-menu" @click="toggleMenu">
          <a class="target-burger" :class="{ visible: isMenuVisible }">
            <ul class="buns">
              <li class="bun"></li>
              <li class="bun center"></li>
              <li class="bun"></li>
            </ul>
          </a>
        </label>
        <div class="dropdown">
          <ul class="tab-container" :class="{ visible: isMenuVisible }">
            <router-link class="tab" to="/leaderboard">
              Leaderboard
            </router-link>
            <router-link class="tab" to="/settings"> Settings </router-link>
            <router-link class="tab" to="/contacts"> Contacts </router-link>
            <router-link class="tab" to="/interactions"> History </router-link>
            <router-link class="tab" to="/instructions">
              Instructions
            </router-link>
            <div class="tab" @click="openExportModal()" type="dark">
              Get backup
            </div>
          </ul>
        </div>
      </nav>
      <SvgImage class="main-logo" :svg="mainLogo" />
    </div>
  </div>
</template>

<script>
import mainLogo from '@/assets/witty-creatures-logo.svg?raw'
import editionLogo from '@/assets/edition-logo.svg?raw'
import { onClickOutside } from '@vueuse/core'

import { ref } from 'vue'
export default {
  setup(props, { emit }) {
    const target = ref(null)
    const displayBox = ref(false)
    const isMenuVisible = ref(false)
    function openExportModal() {
      emit('openExportModal')
      closeMenu()
    }
    function closeMenu() {
      isMenuVisible.value = false
    }
    function toggleMenu() {
      isMenuVisible.value = !isMenuVisible.value
    }
    function displayDropDown() {
      displayBox.value = !displayBox.value
    }
    onClickOutside(target, () => {
      if (isMenuVisible.value) {
        closeMenu()
      }
    })
    return {
      target,
      ref,
      displayDropDown,
      toggleMenu,
      closeMenu,
      openExportModal,
      isMenuVisible,
      displayBox,
      mainLogo,
      editionLogo,
    }
  },
}
</script>

<style scoped lang="scss">
.nav-container {
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-template-rows: max-content;
  grid-gap: 16px;
  justify-content: center;
}
.navbar {
  display: block;
  top: 8px;
  left: 8px;
  padding: 0;
  .responsive-menu {
    display: block;
    position: relative;
    z-index: 50px;
    top: 10px;
    left: 0px;
    width: 32px;
  }
  .dropdown {
    position: absolute;
    z-index: 50;
    margin-top: 16px;
  }
}
.tab-container {
  background-color: var(--primary-color);
  border: 2px solid var(--primary-color);
  list-style: none;
  visibility: hidden;
  text-align: left;
  border-radius: 4px;
  margin: 0;
  display: grid;
  opacity: 0;
  width: 0px;
  height: 0px;
  &.visible {
    box-sizing: border-box;
    transition: all 0.1s;
    visibility: visible;
    padding: 8px 0px;
    top: 8px;
    opacity: 1;
    width: 160px;
    height: 240px;
    .tab {
      cursor: pointer;
      opacity: 1;
      transition: all 0.3s;
    }
  }
  .list-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .tab {
    width: 160px;
    cursor: pointer;
    display: block;
    align-items: left;
    text-decoration: none;
    padding: 0px 16px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    color: $white;
    font-size: 18px;
    font-weight: bold;
    opacity: 0;
    .btn {
      max-width: max-content;
      margin: 0;
      top: 0px;
      left: 16px;
    }
    &:hover {
      color: $witnet-color;
    }
  }
}
.target-burger {
  cursor: pointer;
  display: block;
  transition: 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
    opacity: opacity(0.45);
  }
  &.visible {
    ul.buns {
      width: 24px;
      height: 24px;
      li.bun {
        -webkit-transform: rotate(45deg) translateZ(0);
        transform: rotate(45deg) translateZ(0);
        &.center {
          display: none;
        }
        &:last-child {
          -webkit-transform: rotate(-45deg) translateZ(0);
          transform: rotate(-45deg) translateZ(0);
        }
      }
    }
  }
  .buns {
    width: 24px;
    height: 24px;
    list-style: none;
    padding: 0;
    -webkit-transition: -webkit-transform 1s cubic-bezier(0.23, 1, 0.32, 1),
      color 1s cubic-bezier(0.23, 1, 0.32, 1);
    transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1),
      color 1s cubic-bezier(0.23, 1, 0.32, 1);
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    color: var(--primary-color);
    .bun {
      width: 100%;
      height: 2.5px;
      background-color: var(--primary-color);
      position: absolute;
      top: 50%;
      margin-top: -2px;
      -webkit-transform: translateY(-4px) translateZ(0);
      transform: translateY(-4px) translateZ(0);
      -webkit-transition: -webkit-transform 1s cubic-bezier(0.23, 1, 0.32, 1),
        background-color 1s cubic-bezier(0.23, 1, 0.32, 1);
      transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1),
        background-color 1s cubic-bezier(0.23, 1, 0.32, 1);
      &.center {
        -webkit-transform: translateY(4px) translateZ(0);
        transform: translateY(4px) translateZ(0);
      }
      &:last-child {
        -webkit-transform: translateY(12px) translateZ(0);
        transform: translateY(12px) translateZ(0);
      }
    }
  }
}
@media (max-width: 600px) {
  .navbar {
    .responsive-menu {
      top: 0px;
    }
    .dropdown {
      margin-top: 8px;
    }
  }
}
</style>
