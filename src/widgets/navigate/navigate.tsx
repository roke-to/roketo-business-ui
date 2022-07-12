import React from 'react';
import {Link} from 'react-router-dom';

import {RouteKey, ROUTES} from '~/shared/config/routes';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';

const LINKS: RouteKey[] = ['dashboard', 'treasury', 'governance', 'employees'];

export const Navigate = () => (
  <Col className='px-4' gap={3}>
    {LINKS.map((linkName) => {
      const {title, path} = ROUTES[linkName];

      return (
        <Button
          key={title}
          as={Link}
          /* @ts-expect-error */
          to={path}
          variant='plain'
          className='justify-start h-6 font-normal text-black'
        >
          {title}
        </Button>
      );
    })}
  </Col>
);
