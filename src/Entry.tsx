// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { EntryWrapper } from './Wrappers';
import { APIContext } from './contexts/Api';
import Router from './Router';
import { NetworkMetricsContextWrapper } from './contexts/Network';
import { BalancesContextWrapper } from './contexts/Balances';
export class Entry extends React.Component {

  static contextType?: React.Context<any> = APIContext;

  componentDidMount () {
    // set initial active network
    const network = localStorage.getItem('network');

    // initiate connection to Polakdot API
    this.context.connect(network);
  }

  // wrap entire router with network metrics: provides activeEra
  render () {
    return (
      <NetworkMetricsContextWrapper>
        <BalancesContextWrapper>
          <EntryWrapper>
            <Router />
          </EntryWrapper>
        </BalancesContextWrapper>
      </NetworkMetricsContextWrapper>
    );
  }
}

export default Entry;