import { FC } from 'react';
import { Background } from '../components/background';
import { Footer } from '../components/footer';
import { Social } from '../components/social';

const Home = async (): Promise<ReturnType<FC>> => {
  return (
    <>
      <main>
        <div className="flex h-screen w-screen items-center justify-center">
          <Background />
          <section className="absolute z-10 mx-8 mt-4 flex flex-col items-center justify-center rounded bg-gray-50/30 p-2 text-center text-slate-800 shadow-lg backdrop-blur-lg md:mx-16 md:mt-16 md:p-8">
            <div className="flex flex-col items-center justify-center">
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  id="profile-image"
                  alt="Mrugesh Mohapatra's profile picture."
                  src="/images/profile.jpg"
                  className="mx-auto -mt-14 h-24 w-24 rounded-full border-2 border-white shadow-lg md:-mt-24 md:h-32 md:w-32"
                />
              </div>
              <div className="mt-7 -rotate-12 transform md:mt-14">
                <h1 className="drop-shadow-l mx-auto rotate-12 transform text-xl font-bold text-slate-600 md:-mt-14 md:p-1 md:text-4xl">
                  {'Mrugesh Mohapatra'.toLowerCase()}
                </h1>
                <div className="m-1 mx-auto -mt-7 w-2/5 rounded-full border-8 border-orange-300 bg-orange-300" />
              </div>
              <h2 className="mx-auto my-2 max-w-sm p-1 text-sm font-medium text-slate-600 md:max-w-md md:text-base">
                nocturnal developer 🦉 • open-source enthusiast 🌏 • photography
                noob 📷
              </h2>
              <h3 className="mx-auto my-2 max-w-sm p-1 text-sm font-medium text-slate-600 md:max-w-2xl md:text-base">
                Principal Maintainer — Cloud Infrastructure & Open-source,{' '}
                <a
                  aria-label="freecodecamp.org"
                  className="text-slate-600 underline decoration-gray-50 hover:text-slate-800 hover:no-underline"
                  href="https://www.freecodecamp.org"
                  rel="noopener noreferrer external"
                  target="_blank"
                >
                  freeCodeCamp.org
                </a>
              </h3>
              <div className="space-1 mx-auto mt-2 mb-4 flex flex-row items-center justify-center">
                <a
                  aria-label="Schedule a call"
                  className="items-center rounded-md bg-orange-500 px-1 py-1 text-sm font-medium text-slate-100 backdrop-blur-sm hover:bg-orange-300 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-gray-200 disabled:text-slate-500 md:px-4 md:py-2"
                  href="https://calendly.com/d/gqs-whd-zpz"
                  rel="noopener noreferrer external"
                  target="_blank"
                  type="button"
                >
                  📅 Schedule a meeting
                </a>
                <a
                  aria-label="Ask me anything"
                  className="ml-2 items-center rounded-md bg-gray-50/50 px-2 py-1 text-sm font-medium text-slate-600 backdrop-blur-sm hover:bg-orange-300 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-gray-200 disabled:text-slate-500 md:px-4 md:py-2"
                  href="https://github.com/raisedadead/ama/discussions"
                  rel="noopener noreferrer external"
                  target="_blank"
                  type="button"
                >
                  🙋‍♂️ Ask me anything
                </a>
                <a
                  aria-label="Browse my blog"
                  className="ml-2 items-center rounded-md bg-gray-50/50 px-2 py-1 text-sm font-medium text-slate-600 backdrop-blur-sm hover:bg-orange-300 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-gray-200 disabled:text-slate-500 md:px-4 md:py-2"
                  href="https://hn.mrugesh.dev"
                  rel="noopener noreferrer external"
                  target="_blank"
                  type="button"
                >
                  📝 Browse my blog
                </a>
              </div>
              <p className="text-slate-600-0 mx-auto p-0 text-sm font-medium text-slate-600 lg:mt-4">
                Elsewhere on the internet
              </p>
              <Social />
            </div>
            <Footer defaultType={true} />
          </section>
        </div>
      </main>
    </>
  );
};

export default Home;
