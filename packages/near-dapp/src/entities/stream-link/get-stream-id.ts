import {ActionCall} from '~/shared/api/astro';

import {base64ToJson} from '@roketo/core/lib/base64';

export const getStreamId = ({
  actions,
  methodName,
}: {
  actions: ActionCall[];
  methodName?: 'pause_stream' | 'start_stream' | 'stop_stream' | 'withdraw';
}): string | null => {
  const argsStr = actions.find(
    (action) => (action.methodName as unknown as string) === methodName,
  )?.args;
  const args = argsStr ? base64ToJson(argsStr) : null;
  return args?.stream_id || args?.stream_ids[0];
};
