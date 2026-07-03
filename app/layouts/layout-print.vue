<template>
  <div class="min-h-screen bg-white">
    <slot />
  </div>
</template>

<style scoped>
  @media print {
    @page {
      margin: 0;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      background: #fff;
    }
  }
</style>
