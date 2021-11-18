// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createContainer, Logger } from './Container';
import React from 'react';
import { create, IPFSHTTPClient } from 'ipfs-http-client';

type InitialState = {
  gateway?: string;
};

function useIPFSImpl(
  logger: Logger,
  initialState?: InitialState,
): { ipfs: IPFSHTTPClient; catSingle: (cid: string) => Promise<Uint8Array> } {
  const { gateway } = initialState ?? {};

  if (!gateway) {
    throw new Error('No IPFS gateway provided');
  }
  const ipfs = React.useRef<IPFSHTTPClient>(create({ url: gateway }));

  React.useEffect(() => {
    logger.l(`Creating ipfs client at: ${gateway}`);
    ipfs.current = create({ url: gateway });
  }, [gateway, logger]);

  const catSingle = async (cid: string): Promise<Uint8Array> => {
    logger.l(`Getting: ${cid}`);
    const results = ipfs.current.cat(cid);

    for await (const result of results) {
      return result;
    }

    throw new Error(`No content`);
  };

  return {
    ipfs: ipfs.current,
    catSingle,
  };
}

export const { useContainer: useIPFS, Provider: IPFSProvider } = createContainer(useIPFSImpl, { displayName: 'IPFS' });
