import { createStore } from 'effector';

import { ModelsProfile } from 'src/_generated';
import { actions } from 'src/actions';

type State = {
  isAuthenticated: boolean;
  profile: ModelsProfile | null;
};

const initialState: State = {
  isAuthenticated: false,
  profile: null,
};

export const $access = createStore<State>(initialState)
  .on(
    actions.api['/'].GET.doneData,
    (state, payload): State => ({
      ...state,
      isAuthenticated: payload.isAuthenticated,
      profile: payload.isAuthenticated ? state.profile : null,
    })
  )
  .on(
    [
      actions.api['/confirm/email'].POST.doneData,
      actions.api['/password/forgot/change'].POST.doneData,
      actions.api['/profile'].GET.doneData,
      actions.api['/sign-in/email'].POST.doneData,
      actions.api['/sign-up/email'].POST.doneData,
    ],
    (state, payload): State => ({
      ...state,
      isAuthenticated: true,
      profile: payload,
    })
  )
  .on(
    actions.api['/sign-out'].POST.doneData,
    (state): State => ({
      ...state,
      isAuthenticated: false,
      profile: null,
    })
  );

// TODO: move to selectors?
export const $isLoggedIn = $access.map((state) => state.isAuthenticated);
export const $profile = $access.map((state) => state.profile);
