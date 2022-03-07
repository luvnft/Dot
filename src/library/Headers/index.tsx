// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { Wrapper, HeadingWrapper, Account, Item } from './Wrapper';
import { useAssistant } from '../../contexts/Assistant';
import { useConnect } from '../../contexts/Connect';
import Identicon from '@polkadot/react-identicon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faCogs } from '@fortawesome/free-solid-svg-icons';
import Dropdown from './Dropdown';
import { clipAddress } from '../../Utils';

export const Headers = () => {

  const [showMenu, toggleMenu]: any = useState(false);

  const assistant = useAssistant();
  const connect = useConnect();

  // subscribe to web3 accounts
  const connectWeb3 = async () => {
    connect.setAccounts();
  }

  return (
    <Wrapper>

      {/* connected, display stash and controller */}
      {connect.status === 1 &&
        <>
          <HeadingWrapper>
            <Account
              whileHover={{ scale: 1.02 }}
              style={{ paddingLeft: 0 }}
            >
              <Identicon
                value={connect.activeAccount.address}
                size={26}
                theme="polkadot"
              />
              <span className='title'>{clipAddress(connect.activeAccount.address)}</span>
              {/* {connect.activeAccount.name} */}
              <div className='label'>Stash</div>
            </Account>
          </HeadingWrapper>
          <HeadingWrapper>
            <Account
              whileHover={{ scale: 1.02 }}
              style={{ paddingLeft: 0 }}
            >
              <Identicon
                value={connect.activeAccount.address}
                size={26}
                theme="polkadot"
              />
              <span className='title'>{clipAddress(connect.activeAccount.address)}</span>
              <div className='label'>Controller</div>
            </Account>
          </HeadingWrapper>
        </>
      }

      {/* not connected, display connect accounts */}
      {connect.status === 0 &&
        <HeadingWrapper>
          <Item
            className='connect'
            onClick={() => connectWeb3()}
            whileHover={{ scale: 1.02 }}
          >
            Connect Accounts
          </Item>
        </HeadingWrapper>
      }

      {/* always display assistant */}
      <HeadingWrapper>
        <Item
          onClick={() => { assistant.toggle() }}
          whileHover={{ scale: 1.02 }}
        >
          {connect.status === 0 && <div className='label'>1</div>}
          Assistant
        </Item>
      </HeadingWrapper>


      {/* connected, display connected accounts */}
      {connect.status === 1 &&
        <HeadingWrapper>
          <Item
            whileHover={{ scale: 1.02 }}
            style={{ paddingLeft: 0, paddingRight: 0, width: '2.5rem' }}
            onClick={() => toggleMenu(showMenu ? false : true)}
          >
            <FontAwesomeIcon
              icon={!showMenu ? faCog : faCogs}
              transform={!showMenu ? undefined : `shrink-2`}
              style={{ cursor: 'pointer', color: '#444' }}
            />
          </Item>
          {showMenu && <Dropdown toggleMenu={toggleMenu} />}
        </HeadingWrapper>
      }

    </Wrapper>
  );
}

export default Headers;