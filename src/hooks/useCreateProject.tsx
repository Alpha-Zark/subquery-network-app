// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { useIPFS, useProjectMetadata, useQueryRegistry } from '../containers';
import { NewDeployment, ProjectMetadata } from '../models';

export function useCreateProject() {
  const { uploadMetadata, uploadVersionMetadata } = useProjectMetadata();
  const { ipfs } = useIPFS();
  const { registerQuery } = useQueryRegistry();

  const createProject = React.useCallback(
    async function (project: ProjectMetadata & { image: File | undefined | string } & NewDeployment): Promise<string> {
      // Form can give us a File type that doesn't match the schema
      if ((project.image as unknown) instanceof File) {
        console.log('Uploading icon...');
        const res = await ipfs.add(project.image as unknown as File);
        project.image = res.cid.toString();
        console.log('Uploading icon...DONE');
      }

      const versionCid = await uploadVersionMetadata({
        version: project.version,
        description: (project as any).versionDescription,
      });

      const metadata = await uploadMetadata(project);
      const tx = await registerQuery(metadata, project.deploymentId, versionCid);
      const receipt = await tx.wait(1);
      const event = receipt.events?.[0];

      if (!receipt.status) {
        throw new Error('Create project unsuccessful');
      }

      if (!event) {
        throw new Error('No successful events');
      }

      const { queryId /*, creator*/ } = event.args as any;

      return queryId;
    },
    [ipfs, uploadMetadata, registerQuery],
  );

  return createProject;
}
