<template>
  <div class="menu" @mouseup="mouseup">
    <div class="menu-wrapper">
      <ul class="menu-items">
        <li v-for="(item, i) in menuItems" :key="item.name" :ref="`menuItem${i}`" class="menu-item" :style="menuItemTransform(i)">
          <button class="menu-item-button" @click="onMenuItemClick(item)">
            <svg-icon :icon-class="item.icon" :style="menuItemTransform(i, true)" />
          </button>
          <div class="menu-item-bounce" />
        </li>
      </ul>
      <button class="menu-toggle-button" @mousedown="mousedown">
        <i ref="toggleIcon" class="el-icon-plus menu-toggle-icon" />
      </button>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script>
import { TweenMax, Power4, Power1, Elastic } from 'gsap/TweenMax'

export default {
  name: 'Menu',
  props: {},
  data() {
    return {
      on: false,
      menuItems: [
        {
          name: 'reply',
          icon: 'reply'
        },
        {
          name: 'play',
          icon: 'play'
        },
        {
          name: 'box',
          icon: 'box'
        }
      ]
    }
  },
  computed: {
    startingAngle() {
      const angle = 120
      return 180 + (-angle / 2)
    },
    slice() {
      const menuItemNum = this.menuItems.length
      const angle = 120
      return angle / (menuItemNum - 1)
    }
  },
  methods: {
    menuItemTransform(i, isReverse = false) {
      const angle = this.startingAngle + (this.slice * i)
      return `transform: rotate(${isReverse ? -angle : angle}deg)`
    },
    mousedown() {
      TweenMax.to(this.$refs.toggleIcon, 0.1, {
        scale: 0.65
      })
      this.pressHandler()
    },
    mouseup() {
      TweenMax.to(this.$refs.toggleIcon, 0.1, {
        scale: 1.0
      })
      this.on ? this.openMenu() : this.closeMenu()
    },
    pressHandler() {
      this.on = !this.on

      TweenMax.to(this.$refs.toggleIcon, 0.4, {
        rotation: this.on ? 45 : 0,
        ease: Power4.easeInOut,
        force3D: true
      })

      // this.on ? this.openMenu() : this.closeMenu()
    },
    openMenu() {
      Object.keys(this.$refs)
        .filter(key => key.includes('menuItem'))
        .forEach((key, i) => {
          const delay = i * 0.08
          const el = this.$refs[key][0]
          const bounce = el.getElementsByClassName('menu-item-bounce')

          TweenMax.fromTo(bounce, 0.2, {
            transformOrigin: '50% 50%'
          }, {
            delay: delay,
            scaleX: 0.8,
            scaleY: 1.2,
            force3D: true,
            ease: Power1.easeInOut,
            onComplete: () => {
              TweenMax.to(bounce, 0.15, {
                // scaleX:1.2,
                scaleY: 0.7,
                force3D: true,
                ease: Power1.easeInOut,
                onComplete: () => {
                  TweenMax.to(bounce, 3, {
                    // scaleX:1,
                    scaleY: 0.8,
                    force3D: true,
                    ease: Elastic.easeOut,
                    easeParams: [1.1, 0.12]
                  })
                }
              })
            }
          })

          const button = el.getElementsByClassName('menu-item-button')
          TweenMax.to(button, 0.5, {
            delay: delay,
            y: this.menuItems.length * 24,
            force3D: true,
            ease: Power4.easeInOut
          })
        })
    },
    closeMenu() {
      Object.keys(this.$refs)
        .filter(key => key.includes('menuItem'))
        .forEach((key, i) => {
          const delay = i * 0.08
          const el = this.$refs[key][0]
          const bounce = el.getElementsByClassName('menu-item-bounce')

          TweenMax.fromTo(bounce, 0.2, {
            transformOrigin: '50% 50%'
          }, {
            delay: delay,
            scaleX: 1,
            scaleY: 0.8,
            force3D: true,
            ease: Power1.easeInOut,
            onComplete: () => {
              TweenMax.to(bounce, 0.15, {
                // scaleX:1.2,
                scaleY: 1.2,
                force3D: true,
                ease: Power1.easeInOut,
                onComplete: () => {
                  TweenMax.to(bounce, 3, {
                    // scaleX:1,
                    scaleY: 1,
                    force3D: true,
                    ease: Elastic.easeOut,
                    easeParams: [1.1, 0.12]
                  })
                }
              })
            }
          })

          const button = el.getElementsByClassName('menu-item-button')
          TweenMax.to(button, 0.5, {
            delay: delay,
            y: 0,
            force3D: true,
            ease: Power4.easeInOut
          })
        })
    },
    onMenuItemClick(item) {
      this.$emit('menu-action', item.name)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@flow/styles/index.scss";

.menu {
  width: 200px;
  height: 200px;
  margin: 0 auto 50px;
  position: absolute;
  bottom: 25px;
  right: 10px;
  -webkit-filter: url("#goo");
  filter: url("/#goo");
  -webkit-transform: translateZ(0);
  transform: translateZ(0);

  .menu-wrapper {
    position: absolute;
    left: 50%;
    bottom: 10px;
  }

  .menu-toggle-button,
  .menu-item-bounce,
  .menu-item-button {
    background: #e9e9e0;
    border-radius: 50%;
    width: $menu-item-size;
    height: $menu-item-size;
    margin-left: -$menu-item-size/2;
    margin-top: -$menu-item-size/2;
    color: #fff;
    border: none;
    outline: none;
    position: relative;
  }

  .menu-toggle-button {
    background: transparent;
    position: absolute;
    top: 0;
    left: 0;
  }

  .menu-toggle-icon {
    font-size: $menu-item-size/2;
    position: absolute;
    top: 0;
    left: 0;
    width: $menu-item-size;
    height: $menu-item-size;
    line-height: $menu-item-size;
  }

  .menu-items {
    list-style-type: none;
    padding: 0;
    margin: 0;
    position: absolute;
    left: 0;
    top: 0;
  }

  .menu-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
  }

  .menu-item-bounce {
    position: absolute;
    top: 0;
    left: 0;
  }

  .menu-item-button {
    width: $menu-item-button-size;
    height: $menu-item-button-size;
    margin-left: -$menu-item-button-size/2;
    margin-top: -$menu-item-button-size/2;
    position: absolute;
    top: 0;
    left: 0;
    color: rgb(206, 219, 134);
    &:hover {
      color: #fff;
    }
  }

}
</style>
