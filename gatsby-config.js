module.exports = {
  siteMetadata: {
    title: 'Clean up your cloud',
    description: 'Purify. Cleaner of clouds',
    siteUrl: "https://purify.cloud",
    author: 'Reed Hanson'
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-favicon',
      options: {
        logo: './static/Clouds-icon.png'
      }
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Purify',
        short_name: 'purify',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/Clouds-icon.png', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-offline',
    {
      resolve: `gatsby-plugin-stripe`,
      options: {
        async: true,
      },
    }
  ],
}
