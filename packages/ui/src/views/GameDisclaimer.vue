<template>
  <MainLayout class="disclaimer">
    <SectionHeader title="Disclaimer" :from-auth="true" />
    <GameScreen>
      <p class="long-text">
        <span class="bold">Remember:</span>
        once you claim your egg, it will be forever linked to your web browser
        and the QR code will not work in a different browser. You are highly
        encouraged to export your egg from the main screen of the game as
        backup, or in case that you need to move your egg into a different
        browser.
      </p>
    </GameScreen>
    <router-link to="/scan" class="link">
      <CustomButton class="btn" type="primary"> CONTINUE </CustomButton>
    </router-link>
  </MainLayout>
</template>

<style lang="scss" scoped>
.disclaimer {
  font-family: JoystixMonospace;
  .title {
    font-family: JoystixMonospace;
  }
  .long-text {
    color: $dark-screen;
  }
  .btn {
    width: 100%;
  }
}
</style>
