<template>
  <ModalBase
    title="Incubation time is over"
    description="Preview and mint the NFT, you need to connect to a web3 provider (e.g. MetaMask). Create a backup if needed."
    :subtitle="importLink"
    :cancel="false"
    allowText="Close"
    @allow="$parent.$emit('close')"
  />
</template>

<style scoped>
.import-link {
  word-break: break-all;
  word-wrap: anywhere;
}
</style>
