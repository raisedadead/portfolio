<script lang="ts">
  export let defaultType = false;
</script>

<footer class:defaultType class:otherType={!defaultType}>
  <div>
    <p>
      © {new Date().getFullYear()} Mrugesh Mohapatra. All rights reserved.
    </p>
    <p class="mt-2">
      <a aria-label="Terms & Conditions" href="/terms"> Terms </a>
      •
      <a aria-label="Privacy Policy" href="/privacy"> Privacy </a>
      •
      <a aria-label="Refunds & Cancellation Policy" href="/refunds">
        Refunds
      </a>
    </p>
  </div>
</footer>

<style lang="postcss">
  .defaultType {
    @apply font-mono text-gray-400 text-sm text-center;
    @apply mx-auto pt-8 pb-2 max-w-max;
  }

  .defaultType a {
    @apply text-gray-500 hover:text-orange-600;
  }

  .otherType {
    @apply mt-12 text-center;
  }
  .otherType a {
    @apply text-gray-500 hover:text-gray-900 no-underline;
  }
</style>
