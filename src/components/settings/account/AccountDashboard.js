import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';

import Loader from '../../ui/Loader';
import Button from '../../ui/Button';
import Infobox from '../../ui/Infobox';
import Link from '../../ui/Link';
import SubscriptionForm from '../../../containers/subscription/SubscriptionFormScreen';

const messages = defineMessages({
  headline: {
    id: 'settings.account.headline',
    defaultMessage: '!!!Account',
  },
  headlineSubscription: {
    id: 'settings.account.headlineSubscription',
    defaultMessage: '!!!Your Subscription',
  },
  headlineUpgrade: {
    id: 'settings.account.headlineUpgrade',
    defaultMessage: '!!!Upgrade your Account',
  },
  headlineInvoices: {
    id: 'settings.account.headlineInvoices',
    defaultMessage: '!!Invoices',
  },
  headlineDangerZone: {
    id: 'settings.account.headlineDangerZone',
    defaultMessage: '!!Danger Zone',
  },
  manageSubscriptionButtonLabel: {
    id: 'settings.account.manageSubscription.label',
    defaultMessage: '!!!Manage your subscription',
  },
  accountTypeBasic: {
    id: 'settings.account.accountType.basic',
    defaultMessage: '!!!Basic Account',
  },
  accountTypePremium: {
    id: 'settings.account.accountType.premium',
    defaultMessage: '!!!Premium Supporter Account',
  },
  accountEditButton: {
    id: 'settings.account.account.editButton',
    defaultMessage: '!!!Edit Account',
  },
  invoiceDownload: {
    id: 'settings.account.invoiceDownload',
    defaultMessage: '!!!Download',
  },
  userInfoRequestFailed: {
    id: 'settings.account.userInfoRequestFailed',
    defaultMessage: '!!!Could not load user information',
  },
  tryReloadUserInfoRequest: {
    id: 'settings.account.tryReloadUserInfoRequest',
    defaultMessage: '!!!Try again',
  },
  deleteAccount: {
    id: 'settings.account.deleteAccount',
    defaultMessage: '!!!Delete account',
  },
  deleteInfo: {
    id: 'settings.account.deleteInfo',
    defaultMessage: '!!!If you don\'t need your Franz account any longer, you can delete your account and all related data here.',
  },
  deleteEmailSent: {
    id: 'settings.account.deleteEmailSent',
    defaultMessage: '!!!You have received an email with a link to confirm your account deletion. Your account and data cannot be restored!',
  },
});

@observer
export default class AccountDashboard extends Component {
  static propTypes = {
    user: MobxPropTypes.observableObject.isRequired,
    orders: MobxPropTypes.arrayOrObservableArray.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLoadingOrdersInfo: PropTypes.bool.isRequired,
    isLoadingPlans: PropTypes.bool.isRequired,
    isCreatingPaymentDashboardUrl: PropTypes.bool.isRequired,
    userInfoRequestFailed: PropTypes.bool.isRequired,
    retryUserInfoRequest: PropTypes.func.isRequired,
    openDashboard: PropTypes.func.isRequired,
    openExternalUrl: PropTypes.func.isRequired,
    onCloseSubscriptionWindow: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    isLoadingDeleteAccount: PropTypes.bool.isRequired,
    isDeleteAccountSuccessful: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      user,
      orders,
      isLoading,
      isCreatingPaymentDashboardUrl,
      openDashboard,
      openExternalUrl,
      isLoadingOrdersInfo,
      isLoadingPlans,
      userInfoRequestFailed,
      retryUserInfoRequest,
      onCloseSubscriptionWindow,
      deleteAccount,
      isLoadingDeleteAccount,
      isDeleteAccountSuccessful,
    } = this.props;
    const { intl } = this.context;

    return (
      <div className="settings__main">
        <div className="settings__header">
          <span className="settings__header-item">
            {intl.formatMessage(messages.headline)}
          </span>
        </div>
        <div className="settings__body">
          {isLoading && (
            <Loader />
          )}

          {!isLoading && userInfoRequestFailed && (
            <div>
              <Infobox
                icon="alert"
                type="danger"
                ctaLabel={intl.formatMessage(messages.tryReloadUserInfoRequest)}
                ctaLoading={isLoading}
                ctaOnClick={retryUserInfoRequest}
              >
                {intl.formatMessage(messages.userInfoRequestFailed)}
              </Infobox>
            </div>
          )}

          {!userInfoRequestFailed && (
            <div>
              {!isLoading && (
                <div className="account">
                  <div className="account__box account__box--flex">
                    <div className="account__avatar">
                      <img
                        src="./assets/images/logo.svg"
                        alt=""
                      />
                      <span
                        className="account__avatar-premium emoji"
                        data-tip="Free Supporter Account"
                      >
                        <img src="./assets/images/emoji/black_hand.png" alt="" />
                      </span>
                    </div>
                    <div className="account__info">
                      <h2>
                        {`${user.firstname} ${user.lastname}`}
                      </h2>
                      {user.organization && `${user.organization}, `}
                      {user.email}<br />
                      <span className="badge badge--premium">Free Software Account</span>
                    </div>
                    <Link to="/settings/user/edit" className="button">
                      {intl.formatMessage(messages.accountEditButton)}
                    </Link>

                    {user.emailValidated}
                  </div>
                </div>
              )}
              <div className="account franz-form">
                <div className="account__box">
                  <h2>{intl.formatMessage(messages.headlineDangerZone)}</h2>
                  {!isDeleteAccountSuccessful && (
                    <div className="account__subscription">
                      <p>{intl.formatMessage(messages.deleteInfo)}</p>
                      <Button
                        label={intl.formatMessage(messages.deleteAccount)}
                        buttonType="danger"
                        onClick={() => deleteAccount()}
                        loaded={!isLoadingDeleteAccount}
                      />
                    </div>
                  )}
                  {isDeleteAccountSuccessful && (
                    <p>{intl.formatMessage(messages.deleteEmailSent)}</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
        <ReactTooltip place="right" type="dark" effect="solid" />
      </div>
    );
  }
}
