import {Link, routeNode, withRoute} from 'moonglow/lib/src/libs/react-router';
import React from 'react';

function About(props) {
  const {route}= props;

  return (
    <div>
      {route.name === 'about' ? (
        <div>
          <p>About Us</p>
          <p>
            <Link routeName='home'>Home</Link>
          </p>
        </div>
      ): null}
    </div>
  );
}

export default withRoute(About);
