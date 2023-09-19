import { useEffect, useState } from 'react';
import { matchRoutes, useLocation } from 'react-router-dom';

import { MODALS } from 'shared';

import { SwitchMode, allowedModals } from 'src/navigation';

export type ParsedModalScheme = {
  scheme: MODALS;
  params?: string;
  isOpen: boolean;
};

const modalsPaths = Object.values(MODALS);

const getSchemeFromSection = (
  section: string
): ParsedModalScheme | undefined => {
  if (modalsPaths.includes(section as MODALS)) {
    return {
      scheme: section as MODALS,
      isOpen: true,
    };
  }

  const match = matchRoutes(
    modalsPaths.map((item) => ({ path: item })),
    section
  );

  if (!match) {
    return undefined;
  }

  const { params, route } = match[0];

  return {
    params: JSON.stringify(params),
    scheme: route.path as MODALS,
    isOpen: true,
  };
};

export const useModalsSwitch = ({ mode }: SwitchMode) => {
  const [schemes, setSchemes] = useState<ParsedModalScheme[]>([]);
  const { pathname } = useLocation();

  useEffect(() => {
    const parts = pathname.split('/~');

    const newSchemes = parts
      .slice(1)
      .map((section) => getSchemeFromSection(section))
      .filter(
        (scheme) => !!scheme && allowedModals[mode].includes(scheme.scheme)
      ) as ParsedModalScheme[];

    const visible = schemes.filter(({ isOpen }) => isOpen);

    setSchemes(
      visible.length > newSchemes.length
        ? [...newSchemes, { ...visible[visible.length - 1], isOpen: false }]
        : newSchemes
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, mode]);

  return schemes;
};
