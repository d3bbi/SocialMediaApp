import React from 'react';
import { useQuery } from "@apollo/client";
import { Grid, GridColumn } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from '../util/graphql'
import Postcard from '../components/PostCard';

function Home() {
    const {
        loading,
        data
      } = useQuery(FETCH_POSTS_QUERY);

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>Loading post..</h1>
        ) : (
          data.getPosts &&
          data.getPosts.map((post) => (
            <GridColumn key={post.id} style={{marginBottom: 20}}>
              <Postcard post={post} />
            </GridColumn>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
}



export default Home;
