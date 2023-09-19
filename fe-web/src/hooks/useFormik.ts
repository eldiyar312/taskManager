import {
  FormikConfig,
  FormikHelpers,
  FormikValues,
  useFormik as useOriginalHook,
} from 'formik';
import React, { useEffect, useRef, useState } from 'react';

type Props<Values> = {
  initialValues: FormikConfig<Values>['initialValues'];
  onSubmit: (
    values: Values,
    formikHelpers: FormikHelpers<Values>,
    options: { signal?: AbortSignal }
  ) => void | Promise<unknown>;
  validationSchema?: FormikConfig<Values>['validationSchema'];
  enableReinitialize?: FormikConfig<Values>['enableReinitialize'];
};

export const useFormik = <Values extends FormikValues = FormikValues>(
  props: Props<Values>
) => {
  const [validateOnChange, setValidateOnChange] = useState(false);
  const ref = useRef<AbortController>();

  useEffect(() => {
    ref.current = new AbortController();

    return () => ref.current?.abort();
  }, []);

  const formik = useOriginalHook<Values>({
    validateOnChange,
    ...props,
    onSubmit: (...args) =>
      props.onSubmit(...args, { signal: ref.current?.signal }),
  });

  return {
    ...formik,
    handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => {
      formik.handleSubmit(e);
      setValidateOnChange(true);
    },
  };
};
