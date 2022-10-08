import Head from 'next/head';

export const MetaHead = () => {
  return (
    <Head>
      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Mrugesh Mohapatra — Portfolio of a nocturnal developer.</title>
      <meta
        name="description"
        content="Namaste! I am a software engineer based out of Bengaluru, India. I am passionate about Aviation, Open Source, Education for All, and Site Reliability Engineering."
      />

      {/* Google / Search Engine Tags */}
      <meta
        itemProp="name"
        content="Mrugesh Mohapatra — Portfolio of a nocturnal developer."
      />
      <meta
        itemProp="description"
        content="Namaste! I am a software engineer based out of Bengaluru, India. I am passionate about Aviation, Open Source, Education for All, and Site Reliability Engineering."
      />
      <meta itemProp="image" content="http://mrugesh.dev/cover.png" />

      {/* Facebook Meta Tags */}
      <meta property="og:url" content="https://mrugesh.dev" />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="Mrugesh Mohapatra — Portfolio of a nocturnal developer."
      />
      <meta
        property="og:description"
        content="Namaste! I am a software engineer based out of Bengaluru, India. I am passionate about Aviation, Open Source, Education for All, and Site Reliability Engineering."
      />
      <meta property="og:image" content="http://mrugesh.dev/cover.png" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Mrugesh Mohapatra — Portfolio of a nocturnal developer."
      />
      <meta
        name="twitter:description"
        content="Namaste! I am a software engineer based out of Bengaluru, India. I am passionate about Aviation, Open Source, Education for All, and Site Reliability Engineering."
      />
      <meta name="twitter:image" content="http://mrugesh.dev/cover.png" />
    </Head>
  );
};
