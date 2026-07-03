<script setup lang="ts">
  const pending = ref(false)
  const open = ref(true)

  function onDelete() {
    pending.value = true
    setTimeout(() => {
      pending.value = false
      open.value = false
    }, 300)
  }

  function onCancel() {
    open.value = false
  }
</script>

<template>
  <div class="p-12">
    <div class="flex w-full gap-2">
      <UButton color="neutral" variant="ghost" :disabled="pending" @click="onCancel">{{ $t('common.cancel') }}</UButton>
      <UButton color="error" :loading="pending" @click="onDelete">{{ $t('common.delete') }}</UButton>
    </div>
  </div>
</template>
