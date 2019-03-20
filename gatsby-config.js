const sitesConfig = {
  sites: {
    default: {
      siteMetadata: {
        defaultTitle: `Mrugesh Mohapatra`,
        description: `
        Hi, I am Mrugesh Mohapatra and I love developing
        applications for Desk, Web and Mobile.
        `,
        lang: `en`,
        locale: `en-IN`,
        icon: `assets/images/favicon-32x32.png`,
        siteUrl: `https://mrugesh.dev`, //No trailing slash allowed
        titleTemplate: `%s | Mrugesh Mohapatra`,
        twitterCreator: `@raisedadead`
      }
    }
  }
};

module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: {
        prefixes: [`/dashboard/*`]
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/images`,
        name: `images`
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        anonymize: true,
        exclude: [`/preview/**`],
        head: true,
        respectDNT: true,
        trackingId: `UA-125425021-1`
      }
    },
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: `GTM-W9DNBKC`,
        includeInDevelopment: true
        // gtmAuth: `9qdcleHZMeragP2aZTYTpw`,
        // gtmPreview: `env-5`,
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        background_color: `#242943`,
        display: `minimal-ui`,
        icon: `src/images/logo.png`,
        name: `Mrugesh Mohapatra`,
        orientation: `any`,
        short_name: `Mrugesh`,
        start_url: `/`,
        theme_color: `#ffffff`
      }
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-robots-txt`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`
      }
    },
    `gatsby-plugin-offline`
  ],
  siteMetadata: sitesConfig.sites[`default`].siteMetadata
};
