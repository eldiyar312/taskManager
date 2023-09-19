/**
 * https://ant.design/components/spin/
 */
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import Spin from 'antd/lib/spin';
import React from 'react';

export const Preloader: React.FC = () => (
  <Spin indicator={<LoadingOutlined spin />} />
);
