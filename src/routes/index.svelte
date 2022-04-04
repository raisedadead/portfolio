<script lang="ts">
  import Background from '$lib/background/index.svelte';
  import NavSocial from '$lib/nav-social.svelte';
  import Footer from '$lib/footer.svelte';
  import { onMount } from 'svelte';

  let name = `Mrugesh Mohapatra`;
  let profileSrc = `/images/profile.jpg`;

  let cdlyReady = false;
  const onCalendlyLoaded = () => {
    cdlyReady = true;
  };

  onMount(() => {
    if (window?.Calendly) {
      onCalendlyLoaded();
    } else {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = onCalendlyLoaded;
      document.body.appendChild(script);
    }
  });

  const calendlyHandler = () => {
    const currentEvent = 'consulting-1-hr';
    const url =
      `https://calendly.com/mrugesh-m/${currentEvent}` +
      `?hide_landing_page_details=1&hide_gdpr_banner=1` +
      // `?hide_landing_page_details=1&hide_gdpr_banner=1&hide_event_type_details=1` +
      `&background_color=f9fafb`;

    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: url
      });
    }
  };
</script>

<main>
  <div class="flex items-center justify-center w-full h-screen">
    <Background />
    <section class="absolute z-10 profile-card">
      <div>
        <img
          id="profile-image"
          alt="{name}'s profile picture."
          src={profileSrc}
          class="profile-pic"
        />
        <div class="profile-name-container">
          <h1 class="profile-name-text">
            {name.toLocaleLowerCase()}
          </h1>
          <div class="profile-name-bg-line" />
        </div>
        <h2 class="profile-card-personality">
          nocturnal developer 🦉 • open-source enthusiast 💕 • photography noob
          📷
        </h2>
        <h3 class="profile-card-job">
          Principal Maintainer - Infrastructure & Open Source,
          <a
            aria-label="freecodecamp.org"
            class="link"
            href="https://www.freecodecamp.org"
            rel="noopener noreferrer external"
            target="_blank"
          >
            freeCodeCamp.org
          </a>
        </h3>
        <div class="button-group">
          <button
            on:click={calendlyHandler}
            aria-label="Schedule a call"
            class="button"
            disabled={!cdlyReady}
          >
            📅 Schedule a call (Paid)
          </button>
        </div>
        <p class="text-sm">
          or visit my <a
            class="link"
            href="https://calendly.com/mrugesh-m"
            target="_blank"
            rel="noopener noreferrer external">Calendly</a
          >
          for more options.
        </p>
        <div class="button-group">
          <a
            aria-label="Ask me anything"
            class="button"
            href="https://github.com/raisedadead/ama/discussions"
            rel="noopener noreferrer external"
            target="_blank"
            type="button"
          >
            🙋‍♂️ Ask me anything
          </a>
          <a
            aria-label="Browse my blog"
            class="button"
            href="https://hn.mrugesh.dev"
            rel="noopener noreferrer external"
            target="_blank"
            type="button"
          >
            📝 Browse my blog
          </a>
        </div>
        <p class="profile-card-paragraph">Stalk me</p>
        <NavSocial />
      </div>
      <Footer defaultType={true} />
    </section>
  </div>
</main>

<style style lang="postcss">
  .profile-card {
    @apply flex flex-col justify-center;
    @apply rounded bg-gray-50 border-yellow-200 border-4 md:border-8;
    @apply w-4/5 md:w-3/5 xl:w-2/5 mx-auto px-2 pb-1 mt-2 md:pb-4 md:mt-0;
    @apply text-center;
  }

  .profile-pic {
    @apply box-border;
    @apply h-24 w-24 md:h-48 md:w-48;
    @apply rounded-full bg-gray-50 border-yellow-200 border-4 md:border-8;
    @apply -mt-12 -ml-12 md:-mt-24 md:-ml-24;
  }
  .profile-name-container {
    @apply transform -rotate-12;
  }
  .profile-name-bg-line {
    @apply border-yellow-300 border-8;
    @apply w-1/6 max-h-0 mx-auto -mt-2 mb-4 md:-mt-6 md:mb-6;
  }
  .profile-name-text {
    @apply font-bold text-gray-600 text-xl md:text-4xl;
    @apply w-4/5 mx-auto -mt-6 md:-mt-12 md:mb-2;
    @apply transform rotate-12;
  }
  .profile-card-personality {
    @apply w-4/5 mx-auto mt-2 md:p-2 md:mb-2;
    @apply font-medium text-gray-500 text-sm md:text-xl;
  }
  .profile-card-job {
    @apply w-5/6 md:w-full mx-auto mt-4 p-2 mb-4;
    @apply font-medium text-gray-600 text-sm md:text-lg;
  }
  .profile-card-paragraph {
    @apply w-5/6 md:w-full mx-auto my-2 md:my-4 p-2;
    @apply leading-loose font-medium text-gray-600 text-sm md:text-base;
  }
  .button-group {
    @apply flex flex-col md:flex-row justify-center items-center mx-auto;
    @apply w-4/5 space-y-4 space-x-0 md:space-y-0 md:space-x-4;
    @apply mt-8 mb-4;
  }
  .button {
    @apply inline-flex items-center px-2 py-2 md:px-4 md:py-2;
    @apply border-black disabled:border-gray-600 border-2 md:border-2;
    @apply text-sm font-medium rounded-md text-black hover:text-white disabled:text-gray-600 disabled:hover:text-gray-600;
    @apply bg-yellow-300 hover:bg-indigo-600 disabled:bg-gray-200 disabled:hover:bg-yellow-200;
    @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
  }
  .link {
    @apply bg-orange-100 hover:bg-orange-600 text-gray-600 hover:text-white px-1 pb-1 rounded-md;
  }
</style>
