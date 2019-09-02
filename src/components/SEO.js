import React from "react";
import Helmet from "react-helmet";
import { StaticQuery, graphql } from "gatsby";

function SEO({ title }) {
  return (
    <StaticQuery
      query={graphql`
        {
          site {
            siteMetadata {
              author
              description
              siteUrl
            }
          }
        }
      `}
      render={data => (
        <Helmet
          title={title}
          htmlAttributes={{
            lang: "en"
          }}
          meta={
            [
              {
                name: "description",
                content: data.site.siteMetadata.description
              }
            ]
          }
        />
      )}
    />
  );
}

export default SEO;