import React from 'react';

import { Icon } from 'src/components/atoms/Icon';
import { Button } from 'src/components/molecules/Button';
import { Msg } from 'src/i18n/Msg';

export const SocialButtons: React.FC = () => (
  <>
    <Button shape="default">
      <Icon icon="google" color="var(--lightRed-2)" size={24} />
      <Msg id="components.organisms.SocialButtons.google" />
    </Button>

    <Button shape="default">
      <Icon icon="faceBook" color="var(--blue-1)" size={24} />
      <Msg id="components.organisms.SocialButtons.facebook" />
    </Button>
  </>
);
