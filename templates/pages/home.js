import {Link, routeNode, withRoute} from 'moonglow/lib/src/libs/router';
import React from 'react';

function Home(props) {
  const {route} = props;

  return (
    <div>
      {route.name === 'home' ? (
        <div>
          <p>Home Page</p>
          <p>
            <Link routeName='about'>About</Link>
          </p>
        </div>
      ): null}
    </div>
  );
}

export default withRoute(Home);
