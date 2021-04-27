<style>
  .profile-card {
    @apply flex flex-col justify-center;
    @apply rounded bg-blue-200 border-white border-4 md:border-8 shadow-card;
    @apply w-2/3 mx-auto px-2 pb-1 mt-2 md:pb-4 md:mt-0;
    @apply text-center;
  }
  .profile-pic {
    @apply box-border;
    @apply h-24 w-24 md:h-48 md:w-48;
    @apply rounded-full bg-blue-200 border-white border-4 md:border-8;
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
    @apply w-5/6 md:w-3/5 mx-auto mt-2 md:p-2 md:mb-2;
    @apply font-medium text-gray-500 text-sm md:text-xl;
  }
  .profile-card-job {
    @apply w-5/6 md:w-full mx-auto mt-4 p-2 mb-4;
    @apply font-medium text-gray-600 text-sm md:text-xl;
  }
  .profile-card-paragraph {
    @apply w-5/6 md:w-full mx-auto my-4 p-2;
    @apply leading-loose font-medium text-gray-600 text-xs md:text-lg;
  }
  .button-group {
    @apply flex flex-col md:flex-row justify-center items-center mx-auto;
    @apply w-4/5 space-y-4 space-x-0 md:space-y-0 md:space-x-4;
  }
  .button {
    @apply inline-flex items-center px-4 py-2;
    @apply border-black border-2;
    @apply text-sm font-medium rounded-md text-black hover:text-white bg-yellow-300 hover:bg-indigo-600;
    @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
  }
  .link {
    @apply bg-blue-100 hover:bg-rose-300 text-gray-600 hover:text-black px-1 pb-1 rounded-md;
  }
</style>

<script>
  import Background from '$lib/background/index.svelte';

  let name = `Mrugesh Mohapatra`;
  let profileSrc = `/images/profile.png`;
</script>

<main>
  <div class="w-full h-screen flex justify-center items-center">
    <Background />
    <section class="absolute profile-card z-10">
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
          developer 👨‍💻 • open-source enthusiast 💕 • photography noob 📷
        </h2>
        <h3 class="profile-card-job">
          Butler of Infra & Keeper of Open Source,
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
            href="https://devlog.sh"
            rel="noopener noreferrer external"
            target="_blank"
            type="button"
          >
            📝Browse my blog
          </a>
        </div>
        <p class="profile-card-paragraph">
          If you liked an article I wrote or a tool that I helped build,
          consider
          <a
            aria-label="buy me a coffee"
            class="link"
            href="https://www.buymeacoffee.com/mrugesh"
            rel="noopener noreferrer external"
            target="_blank"
          >
            buying me a beer! 🍺
          </a>
        </p>
      </div>
    </section>
  </div>
</main>
