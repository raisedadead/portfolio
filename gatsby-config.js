const path = require(`path`);

const sitesConfig = {
  sites: {
    default: {
      siteMetadata: {
        defaultTitle: `Mrugesh Mohapatra - Portfolio of a nocturnal developer.`,
        description: `Namaste. I am Mrugesh Mohapatra - A software engineer based out of Bengaluru, India. Passionate about all things open-source, aviation and turquoise in color.`,
        lang: `en`,
        locale: `en-IN`,
        icon: `assets/images/favicon-32x32.png`,
        siteUrl: `https://mrugesh.dev`, //No trailing slash allowed
        titleTemplate: `Mrugesh Mohapatra • %s`,
        twitterCreator: `@raisedadead`
      }
    }
  }
};

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: path.join(__dirname, `src`, `images`)
      }
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-background-image`,
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Poppins`],
        display: `swap`
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        anonymize: true,
        head: true,
        respectDNT: true,
        trackingId: `UA-119399348-1`
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        background_color: `#242943`,
        display: `minimal-ui`,
        icon: `src/images/logo.png`,
        name: `Mrugesh Mohapatra`,
        short_name: `Mrugesh`,
        start_url: `/`,
        theme_color: `#ffffff`
      }
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-robots-txt`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-offline`
  ],
  siteMetadata: sitesConfig.sites[`default`].siteMetadata
};
