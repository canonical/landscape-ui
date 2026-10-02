import Logo from '@/assets/images/logo-white-character.svg';
import { APP_TITLE } from '@/constants';
import { Col, Navigation, Row, Theme } from '@canonical/react-components';
import { Card } from '@canonical/react-ds-global';
import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import classes from './AuthTemplate.module.scss';
import AppNotification from '@/components/layout/AppNotification';
import useNotify from '@/hooks/useNotify';

interface AuthTemplateProps {
  readonly children: ReactNode;
  readonly title: string;
}

const AuthTemplate: FC<AuthTemplateProps> = ({ title, children }) => {
  const { notify, inlineErrors } = useNotify();

  return (
    <div className={classNames('surface', classes.root)}>
      <Row className='p-strip'>
        <Col emptyLarge={4} size={6}>
          <div className={classNames('grid', classes.cardGrid)}>
            <Card className={classes.card}>
              <Navigation
                logo={{
                  src: Logo,
                  title: APP_TITLE,
                  url: '/',
                }}
                theme={Theme.DARK}
              />
              <div className={classNames('surface', classes.inner)}>
                <h1 className='p-heading--4'>{title}</h1>
                {inlineErrors && notify.notification?.type === 'negative' && (
                  <AppNotification notify={notify} isSidePanelOpen={true} />
                )}
                <div>{children}</div>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AuthTemplate;
