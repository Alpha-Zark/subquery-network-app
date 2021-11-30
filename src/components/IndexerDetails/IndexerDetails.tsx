// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { GetDeploymentIndexers_indexers_nodes as DeploymentIndexer } from '../../__generated__/GetDeploymentIndexers';
import Row from './Row';
import { useTranslation } from 'react-i18next';

type Props = {
  indexers: readonly DeploymentIndexer[];
  targetBlock: number;
  startBlock?: number;
};

const IndexerDetails: React.FC<Props> = ({ indexers, startBlock, targetBlock }) => {
  const { t } = useTranslation();

  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{t('indexers.head.indexers')}</TableCell>
            <TableCell>{t('indexers.head.progress')}</TableCell>
            <TableCell>{t('indexers.head.status')}</TableCell>
            <TableCell>{t('indexers.head.url')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {indexers.map((indexer, index) => (
            <Row
              indexer={indexer}
              key={index}
              startBlock={startBlock}
              targetBlock={targetBlock}
              // metadata={{ data: undefined, loading: true}}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default IndexerDetails;