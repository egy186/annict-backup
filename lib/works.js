import { GraphQLClient, gql } from 'graphql-request';

const works = async token => {
  if (typeof token !== 'string' || token.length === 0) {
    throw new TypeError('Token must be a string');
  }

  const endpoint = 'https://api.annict.com/graphql';

  const graphQLClient = new GraphQLClient(endpoint, { headers: { authorization: `Bearer ${token}` } });

  const query = gql`
    query {
      viewer {
        username
        name
        works {
          nodes {
            annictId
            episodesCount
            image {
              recommendedImageUrl
            }
            media
            noEpisodes
            officialSiteUrl
            seasonName
            seasonYear
            title
            titleEn
            titleKana
            twitterHashtag
            twitterUsername
            viewerStatusState
            wikipediaUrl
          }
        }
      }
    }
  `;

  const data = await graphQLClient.request(query);
  return data;
};

export { works };

export default works;
