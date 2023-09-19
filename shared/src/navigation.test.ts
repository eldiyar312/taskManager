import { MODALS, PAGES, makeHierarchicalPath } from './navigation';

jest.spyOn(global.console, 'error').mockImplementation();

describe('Navigation', () => {
  test('Calling make/detect without parameters will return null', () => {
    expect(
      makeHierarchicalPath(undefined, undefined as never, 'detect')
    ).toBeNull();

    expect(
      makeHierarchicalPath({ pathname: '/foo' }, undefined as never, 'detect')
    ).toBeNull();

    expect(
      makeHierarchicalPath(
        { pathname: '/foo', search: '?bar=baz' },
        undefined as never,
        'detect'
      )
    ).toBeNull();
  });

  test('Calling make/replace without parameters will return null', () => {
    expect(
      makeHierarchicalPath(undefined, undefined as never, 'replace')
    ).toBeNull();

    expect(
      makeHierarchicalPath({ pathname: '/foo' }, undefined as never, 'replace')
    ).toBeNull();

    expect(
      makeHierarchicalPath(
        { pathname: '/foo', search: '?bar=baz' },
        undefined as never,
        'replace'
      )
    ).toBeNull();
  });

  test('Calling make/detect with empty array will return null', () => {
    expect(makeHierarchicalPath(undefined, [], 'detect')).toBeNull();

    expect(makeHierarchicalPath({ pathname: '/foo' }, [], 'detect')).toBeNull();

    expect(
      makeHierarchicalPath(
        { pathname: '/foo', search: '?bar=baz' },
        [],
        'detect'
      )
    ).toBeNull();
  });

  test('Calling make/replace with empty array will return null', () => {
    expect(makeHierarchicalPath(undefined, [], 'replace')).toBeNull();

    expect(
      makeHierarchicalPath({ pathname: '/foo' }, [], 'replace')
    ).toBeNull();

    expect(
      makeHierarchicalPath(
        { pathname: '/foo', search: '?bar=baz' },
        [],
        'replace'
      )
    ).toBeNull();
  });

  test('Calling make/detect with root route will return root route', () => {
    expect(
      makeHierarchicalPath(undefined, [{ scheme: PAGES.ROOT }], 'detect')
    ).toEqual({
      pathname: '/',
    });
  });

  test('Calling make/replace with root route will return root route', () => {
    expect(
      makeHierarchicalPath(undefined, [{ scheme: PAGES.ROOT }], 'replace')
    ).toEqual({
      pathname: '/',
    });

    expect(
      makeHierarchicalPath(
        { pathname: '/foo' },
        [{ scheme: PAGES.ROOT }],
        'replace'
      )
    ).toEqual({ pathname: '/' });

    expect(
      makeHierarchicalPath(
        { pathname: '/foo', search: '?bar=baz' },
        [{ scheme: PAGES.ROOT }],
        'replace'
      )
    ).toEqual({ pathname: '/' });
  });

  test('Calling make/detect with simple route will return simple route', () => {
    expect(
      makeHierarchicalPath(undefined, [{ scheme: PAGES.APP }], 'detect')
    ).toEqual({
      pathname: '/app',
    });
  });

  test('Calling make/replace with simple route will return simple route', () => {
    expect(
      makeHierarchicalPath(undefined, [{ scheme: PAGES.APP }], 'replace')
    ).toEqual({
      pathname: '/app',
    });

    expect(
      makeHierarchicalPath(
        { pathname: '/foo' },
        [{ scheme: PAGES.APP }],
        'replace'
      )
    ).toEqual({ pathname: '/app' });

    expect(
      makeHierarchicalPath(
        { pathname: '/foo', search: '?bar=baz' },
        [{ scheme: PAGES.APP }],
        'replace'
      )
    ).toEqual({ pathname: '/app' });
  });

  test('Calling make/detect with difficult route will return difficult route', () => {
    expect(
      makeHierarchicalPath(
        { pathname: '/' },
        [{ scheme: MODALS.CONFIRM_EMAIL, params: { code: 'example' } }],
        'detect'
      )
    ).toEqual({ pathname: '/~/confirm/email/example' });
  });

  test('Calling make/replace with difficult route will return difficult route', () => {
    expect(
      makeHierarchicalPath(
        undefined,
        [
          { scheme: PAGES.ROOT },
          { scheme: MODALS.CONFIRM_EMAIL, params: { code: 'example' } },
        ],
        'replace'
      )
    ).toEqual({
      pathname: '/~/confirm/email/example',
    });

    expect(
      makeHierarchicalPath(
        { pathname: '/foo' },
        [
          { scheme: PAGES.ROOT },
          { scheme: MODALS.CONFIRM_EMAIL, params: { code: 'example' } },
        ],
        'replace'
      )
    ).toEqual({ pathname: '/~/confirm/email/example' });

    expect(
      makeHierarchicalPath(
        { pathname: '/foo', search: '?bar=baz' },
        [
          { scheme: PAGES.ROOT },
          { scheme: MODALS.CONFIRM_EMAIL, params: { code: 'example' } },
        ],
        'replace'
      )
    ).toEqual({ pathname: '/~/confirm/email/example' });
  });

  test('Calling make/detect with difficult route without scheme params will return null', () => {
    expect(
      makeHierarchicalPath(
        undefined,
        [{ scheme: MODALS.CONFIRM_EMAIL }],
        'detect'
      )
    ).toBeNull();

    expect(
      makeHierarchicalPath(
        { pathname: '/foo' },
        [{ scheme: MODALS.CONFIRM_EMAIL }],
        'detect'
      )
    ).toBeNull();

    expect(
      makeHierarchicalPath(
        { pathname: '/foo', search: '?bar=baz' },
        [{ scheme: MODALS.CONFIRM_EMAIL }],
        'detect'
      )
    ).toBeNull();
  });

  test('Calling make/replace with difficult route without scheme params will return null', () => {
    expect(
      makeHierarchicalPath(
        undefined,
        [{ scheme: MODALS.CONFIRM_EMAIL }],
        'replace'
      )
    ).toBeNull();

    expect(
      makeHierarchicalPath(
        { pathname: '/foo' },
        [{ scheme: MODALS.CONFIRM_EMAIL }],
        'replace'
      )
    ).toBeNull();

    expect(
      makeHierarchicalPath(
        { pathname: '/foo', search: '?bar=baz' },
        [{ scheme: MODALS.CONFIRM_EMAIL }],
        'replace'
      )
    ).toBeNull();
  });

  test('Calling make/detect with root and modal route will return updated route', () => {
    expect(
      makeHierarchicalPath(
        { pathname: '/' },
        [{ scheme: MODALS.SIGN_IN_EMAIL }],
        'detect'
      )
    ).toEqual({ pathname: '/~/sign-in/email' });

    expect(
      makeHierarchicalPath(
        { pathname: '/', search: '?bar=baz' },
        [{ scheme: MODALS.SIGN_IN_EMAIL }],
        'detect'
      )
    ).toEqual({ pathname: '/~/sign-in/email', search: '?bar=baz' });
  });

  test('Calling make/replace with root and modal route will return null', () => {
    expect(
      makeHierarchicalPath(
        { pathname: '/' },
        [{ scheme: MODALS.SIGN_IN_EMAIL }],
        'replace'
      )
    ).toBeNull();

    expect(
      makeHierarchicalPath(
        { pathname: '/', search: '?bar=baz' },
        [{ scheme: MODALS.SIGN_IN_EMAIL }],
        'replace'
      )
    ).toBeNull();

    expect(
      makeHierarchicalPath(
        { pathname: '/foo' },
        [{ scheme: MODALS.SIGN_IN_EMAIL }],
        'replace'
      )
    ).toBeNull();

    expect(
      makeHierarchicalPath(
        { pathname: '/foo', search: '?bar=baz' },
        [{ scheme: MODALS.SIGN_IN_EMAIL }],
        'replace'
      )
    ).toBeNull();

    expect(
      makeHierarchicalPath(
        { pathname: '/foo' },
        [
          {
            scheme: MODALS.FORGOT_PASSWORD_CHANGE,
            params: { code: 'example' },
          },
        ],
        'replace'
      )
    ).toBeNull();

    expect(
      makeHierarchicalPath(
        { pathname: '/foo', search: '?bar=baz' },
        [
          {
            scheme: MODALS.FORGOT_PASSWORD_CHANGE,
            params: { code: 'example' },
          },
        ],
        'replace'
      )
    ).toBeNull();
  });

  test('Calling make/detect with difficult modal route will return difficult route', () => {
    expect(
      makeHierarchicalPath(
        { pathname: '/' },
        [
          {
            scheme: MODALS.FORGOT_PASSWORD_CHANGE,
            params: { code: 'example' },
          },
        ],
        'detect'
      )
    ).toEqual({ pathname: '/~/forgot/password/change/example' });

    expect(
      makeHierarchicalPath(
        { pathname: '/foo' },
        [
          {
            scheme: MODALS.FORGOT_PASSWORD_CHANGE,
            params: { code: 'example' },
          },
        ],
        'detect'
      )
    ).toEqual({ pathname: '/foo/~/forgot/password/change/example' });

    expect(
      makeHierarchicalPath(
        { pathname: '/foo', search: '?bar=baz' },
        [
          {
            scheme: MODALS.FORGOT_PASSWORD_CHANGE,
            params: { code: 'example' },
          },
        ],
        'detect'
      )
    ).toEqual({
      pathname: '/foo/~/forgot/password/change/example',
      search: '?bar=baz',
    });
  });

  test('Calling make/detect with hierarchical modals works correctly', () => {
    expect(
      makeHierarchicalPath(
        { pathname: '/' },
        [
          { scheme: PAGES.APP },
          { scheme: MODALS.SIGN_UP_EMAIL },
          { scheme: MODALS.SIGN_IN_EMAIL },
        ],
        'detect'
      )
    ).toEqual({ pathname: '/app/~/sign-up/email/~/sign-in/email' });

    expect(
      makeHierarchicalPath(
        { pathname: '/' },
        [
          { scheme: MODALS.SIGN_UP_EMAIL },
          { scheme: PAGES.APP },
          { scheme: MODALS.SIGN_IN_EMAIL },
        ],
        'detect'
      )
    ).toBeNull();

    expect(
      makeHierarchicalPath(
        { pathname: '/' },
        [{ scheme: MODALS.SIGN_UP_EMAIL }, { scheme: MODALS.SIGN_IN_EMAIL }],
        'detect'
      )
    ).toEqual({ pathname: '/~/sign-up/email/~/sign-in/email' });
  });

  test('Calling make/replace with hierarchical modals works correctly', () => {
    expect(
      makeHierarchicalPath(
        { pathname: '/' },
        [
          { scheme: PAGES.APP },
          { scheme: MODALS.SIGN_UP_EMAIL },
          { scheme: MODALS.SIGN_IN_EMAIL },
        ],
        'replace'
      )
    ).toEqual({ pathname: '/app/~/sign-up/email/~/sign-in/email' });

    expect(
      makeHierarchicalPath(
        { pathname: '/' },
        [
          { scheme: MODALS.SIGN_UP_EMAIL },
          { scheme: PAGES.APP },
          { scheme: MODALS.SIGN_IN_EMAIL },
        ],
        'replace'
      )
    ).toBeNull();

    expect(
      makeHierarchicalPath(
        { pathname: '/' },
        [{ scheme: MODALS.SIGN_UP_EMAIL }, { scheme: MODALS.SIGN_IN_EMAIL }],
        'replace'
      )
    ).toBeNull();
  });

  test('Merging get parameters works correctly', () => {
    expect(
      makeHierarchicalPath(
        { pathname: '/', search: '?a=b&c=d' },
        [{ scheme: MODALS.SIGN_IN_EMAIL, getParams: { c: 'e', f: 'g' } }],
        'detect'
      )
    ).toEqual({ pathname: '/~/sign-in/email', search: '?a=b&c=e&f=g' });

    expect(
      makeHierarchicalPath(
        { pathname: '/', search: '?a=b&c=d' },
        [
          { scheme: PAGES.APP, getParams: { c: 'e', f: 'g' } },
          { scheme: MODALS.SIGN_IN_EMAIL, getParams: { c: 'f', g: 'h' } },
        ],
        'replace'
      )
    ).toEqual({ pathname: '/app/~/sign-in/email', search: '?c=f&f=g&g=h' });
  });

  test('Replace duplicates works correctly', () => {
    expect(
      makeHierarchicalPath(
        { pathname: '/~/sign-in/email' },
        [
          { scheme: MODALS.SIGN_IN_EMAIL },
          { scheme: MODALS.SIGN_UP_EMAIL },
          { scheme: MODALS.SIGN_IN_EMAIL },
        ],
        'detect'
      )
    ).toEqual({ pathname: '/~/sign-up/email/~/sign-in/email' });

    expect(
      makeHierarchicalPath(
        { pathname: '/~/sign-in/email' },
        [
          { scheme: PAGES.APP },
          { scheme: MODALS.SIGN_IN_EMAIL },
          { scheme: MODALS.SIGN_UP_EMAIL },
          { scheme: MODALS.SIGN_IN_EMAIL },
        ],
        'replace'
      )
    ).toEqual({ pathname: '/app/~/sign-up/email/~/sign-in/email' });
  });
});
