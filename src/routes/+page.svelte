<script lang="ts">
  import Background from '$lib/background.svelte';
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
          nocturnal developer 🦉 • open-source enthusiast 🌏 • photography noob
          📷
        </h2>
        <h3 class="profile-card-job">
          Principal Maintainer — Cloud Infrastructure & Open-source,
          <a
            aria-label="freecodecamp.org"
            class="text-gray-600 hover:text-gray-800 underline hover:no-underline decoration-gray-50"
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
            class="text-gray-600 hover:text-gray-800 underline hover:no-underline decoration-gray-50"
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
    @apply flex flex-col justify-center items-center;
    @apply rounded backdrop-blur-lg bg-gray-50/30 shadow-lg;
    @apply p-2 mt-4 mx-8 md:p-8 md:mt-16 md:mx-16;
    @apply text-center text-gray-800;
  }

  .profile-pic {
    @apply rounded-full border-white border-2 shadow-lg;
    @apply h-24 w-24 md:h-32 md:w-32;
    @apply mx-auto -mt-14 md:-mt-24;
  }
  .profile-name-container {
    @apply mt-7 md:mt-14;
    @apply transform -rotate-12;
  }
  .profile-name-bg-line {
    @apply border-fuchsia-300 border-8;
    @apply w-1/5 mx-auto -mt-7 m-1;
    @apply rounded-full;
  }
  .profile-name-text {
    @apply font-bold text-xl md:text-4xl text-gray-700 drop-shadow-lg;
    @apply mx-auto md:-mt-14 md:p-1;
    @apply transform rotate-12;
  }
  .profile-card-personality {
    @apply md:max-w-md max-w-sm;
    @apply mx-auto mt-6 mb-2 p-1;
    @apply font-medium text-sm md:text-base text-gray-600;
  }
  .profile-card-job {
    @apply md:max-w-2xl max-w-sm;
    @apply mx-auto my-2 p-1;
    @apply font-medium text-sm md:text-base text-gray-600;
  }
  p {
    @apply mx-auto p-0;
    @apply font-medium text-sm text-gray-600;
  }
  .button-group {
    @apply flex flex-col md:flex-row justify-center items-center mx-auto;
    @apply space-y-2 space-x-0 md:space-y-0 md:space-x-2;
    @apply mt-2 mb-1 md:mt-4 md:mb-2;
  }
  .button {
    @apply inline-flex items-center px-1 py-1 md:px-4 md:py-2;
    @apply text-sm font-medium rounded-md text-gray-600 hover:text-gray-800 disabled:text-gray-200;
    @apply backdrop-blur-sm bg-gray-200/50 hover:bg-fuchsia-300 disabled:bg-gray-500;
    @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500;
  }
</style>
