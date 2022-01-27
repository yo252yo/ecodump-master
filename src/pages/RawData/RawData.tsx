import { For } from "solid-js";
import createDBsStore from "./createDBsStore";
import Table, {
  TableHeader,
  TableHeaderCol,
  TableHeaderColAction,
  TableBody,
} from "../../components/Table";
export default () => {
  const { dbs, downloadFile } = createDBsStore();
  return (
    <Table>
      <TableHeader>
        <TableHeaderCol>File name</TableHeaderCol>
        <TableHeaderCol>Last update</TableHeaderCol>
        <TableHeaderColAction>Download</TableHeaderColAction>
      </TableHeader>
      <TableBody>
        <For each={dbs() ?? []}>
          {(db) => (
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {db?.Name}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {db?.ExportedAt?.StringRepresentation}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  class="text-indigo-800 hover:text-indigo-900"
                  onclick={() => downloadFile(db?.Name)}
                >
                  Download
                </button>
              </td>
            </tr>
          )}
        </For>
      </TableBody>
    </Table>
  );
};
