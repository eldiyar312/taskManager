/**
 * https://ant.design/components/menu
 */
import Menu from 'antd/lib/menu';
import { useStore } from 'effector-react';
import React, { useState } from 'react';

import { MODALS, PAGES, isPage } from 'shared';

import { actions } from 'src/actions';
import { Button } from 'src/components/molecules/Button';
import { Roles } from 'src/components/routes';
import { DictionaryKey } from 'src/i18n';
import { Msg } from 'src/i18n/Msg';
import { Link } from 'src/navigation/Link';
import { $isLoggedIn, $profile } from 'src/store/access';

const menuItems: Record<
  Roles,
  {
    scheme: PAGES | MODALS;
    title: DictionaryKey;
  }[]
> = {
  guest: [
    {
      scheme: MODALS.SIGN_IN_EMAIL,
      title: 'components.organisms.Header.app',
    },
    {
      scheme: MODALS.SIGN_IN_EMAIL,
      title: 'components.organisms.Header.signIn',
    },
  ],
  //TODO
  customer: [
    {
      scheme: PAGES.APP,
      title: 'components.organisms.Header.app',
    },
  ],
  //TODO
  contractor: [
    {
      scheme: PAGES.APP,
      title: 'components.organisms.Header.app',
    },
  ],
};

export const Header: React.FC = () => {
  const [current, setCurrent] = useState('');

  const isLoggedIn = useStore($isLoggedIn);
  const profile = useStore($profile);

  const items = menuItems[isLoggedIn && profile ? profile.role : 'guest'];

  const handleLogOut = () => {
    actions.api['/sign-out'].POST({});
  };

  return (
    <header>
      <Menu
        onClick={(e) => {
          if (isPage(e.key)) {
            setCurrent(e.key);
          }
        }}
        selectedKeys={[current]}
        mode="horizontal"
        items={items.map((item) => ({
          key: item.title,
          label: (
            <Link url={{ scheme: item.scheme }}>
              <Msg id={item.title} />
            </Link>
          ),
        }))}
      />

      {isLoggedIn && (
        <Button onClick={handleLogOut}>
          <Msg id="components.organisms.Header.signOut" />
        </Button>
      )}
    </header>
  );
};
