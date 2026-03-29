import { NavLink } from 'react-router';
import { z } from 'zod';
import Code from '@/elements/Code.tsx';
import { TableData, TableRow } from '@/elements/Table.tsx';
import FormattedTimestamp from '@/elements/time/FormattedTimestamp.tsx';
import { adminEggConfigurationSchema } from '@/lib/schemas/admin/eggConfigurations.ts';

export default function EggConfigurationRow({
  eggConfiguration,
}: {
  eggConfiguration: z.infer<typeof adminEggConfigurationSchema>;
}) {
  return (
    <TableRow>
      <TableData>
        <NavLink
          to={`/admin/egg-configurations/${eggConfiguration.uuid}`}
          className='text-blue-400 hover:text-blue-200 hover:underline'
        >
          <Code>{eggConfiguration.uuid}</Code>
        </NavLink>
      </TableData>

      <TableData>{eggConfiguration.order}</TableData>

      <TableData>{eggConfiguration.name}</TableData>

      <TableData>{eggConfiguration.eggs.length}</TableData>

      <TableData>
        <FormattedTimestamp timestamp={eggConfiguration.created} />
      </TableData>
    </TableRow>
  );
}
