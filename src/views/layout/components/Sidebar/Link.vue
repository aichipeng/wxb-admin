
<template>
  <!-- eslint-disable vue/require-component-is-->
  <!-- <component v-bind="linkProps(to)">
    <slot />
  </component>-->
  <div @click="go">
    <slot />
  </div>
</template>

<script>
import { isExternal } from '@/utils';

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    isExternalLink(routePath) {
      return isExternal(routePath);
    },
    linkProps(url) {
      if (this.isExternalLink(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        };
      }
      return {
        is: 'router-link',
        to: url
      };
    },
    go() {
      console.log(this.$route.path);
      if (this.$route.path == this.to) {
        this.$router.go(0);
      } else {
        this.$router.push({ path: this.to });
      }
    }
  }
};
</script>
