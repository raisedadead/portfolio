import React from 'react';
import * as Sentry from '@sentry/nextjs';
import Error, { ErrorProps } from 'next/error';
import { NextPageContext } from 'next';

interface CustomErrorComponentProps extends Omit<ErrorProps, 'statusCode'> {
  statusCode?: number;
}

const CustomErrorComponent = ({ statusCode }: CustomErrorComponentProps) => {
  return <Error statusCode={statusCode || 500} />;
};

CustomErrorComponent.getInitialProps = async (contextData: NextPageContext) => {
  // In case this is running in a serverless function, await this in order to give Sentry
  // time to send the error before the lambda exits
  await Sentry.captureUnderscoreErrorException(contextData);

  // This will contain the status code of the response
  const errorInitialProps = await Error.getInitialProps(contextData);

  return {
    ...errorInitialProps,
    statusCode: errorInitialProps.statusCode
  };
};

export default CustomErrorComponent as typeof CustomErrorComponent & {
  getInitialProps: (
    contextData: NextPageContext
  ) => Promise<CustomErrorComponentProps>;
};
