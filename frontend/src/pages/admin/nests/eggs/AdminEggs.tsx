import { faPlus, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import jsYaml from 'js-yaml';
import { ChangeEvent, MouseEvent as ReactMouseEvent, Ref, useCallback, useEffect, useRef, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router';
import getEggs from '@/api/admin/nests/eggs/getEggs.ts';
import importEgg from '@/api/admin/nests/eggs/importEgg.ts';
import { httpErrorToHuman } from '@/api/axios.ts';
import Button from '@/elements/Button.tsx';
import { AdminCan } from '@/elements/Can.tsx';
import AdminSubContentContainer from '@/elements/containers/AdminSubContentContainer.tsx';
import SelectionArea from '@/elements/SelectionArea.tsx';
import Table from '@/elements/Table.tsx';
import { eggTableColumns } from '@/lib/tableColumns.ts';
import EggView from '@/pages/admin/nests/eggs/EggView.tsx';
import { useKeyboardShortcuts } from '@/plugins/useKeyboardShortcuts.ts';
import { useSearchablePaginatedTable } from '@/plugins/useSearchablePageableTable.ts';
import { useToast } from '@/providers/ToastProvider.tsx';
import AdminPermissionGuard from '@/routers/guards/AdminPermissionGuard.tsx';
import { useAdminStore } from '@/stores/admin.tsx';
import EggActionBar from './EggActionBar.tsx';
import EggCreateOrUpdate from './EggCreateOrUpdate.tsx';
import EggRow from './EggRow.tsx';

function EggsContainer({ contextNest }: { contextNest: AdminNest }) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { eggs, setEggs, addEgg } = useAdminStore();

  const selectedEggsPreviousRef = useRef(new Set<string>());
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedEggs, setSelectedEggs] = useState(new Set<string>());

  const { loading, refetch, search, setSearch, setPage } = useSearchablePaginatedTable({
    fetcher: (page, search) => getEggs(contextNest.uuid, page, search),
    setStoreData: setEggs,
  });

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = '';

    const text = await file.text().then((t) => t.trim());
    let data: object;
    try {
      if (text.startsWith('{')) {
        data = JSON.parse(text);
      } else {
        data = jsYaml.load(text) as object;
      }
    } catch (err) {
      addToast(`Failed to parse egg: ${err}`, 'error');
      return;
    }

    importEgg(contextNest.uuid, data)
      .then((data) => {
        addEgg(data);
        addToast('Egg imported.', 'success');
      })
      .catch((msg) => {
        addToast(httpErrorToHuman(msg), 'error');
      });
  };

  const onSelectedStart = useCallback(
    (event: ReactMouseEvent | MouseEvent) => {
      selectedEggsPreviousRef.current = new Set(event.shiftKey ? selectedEggs : []);
    },
    [selectedEggs],
  );

  const onSelected = useCallback((selected: string[]) => {
    setSelectedEggs(new Set([...selectedEggsPreviousRef.current, ...selected]));
  }, []);

  useEffect(() => {
    setSelectedEggs(new Set([]));
  }, []);

  const addSelectedEgg = (eggUuid: string) =>
    setSelectedEggs((prev) => {
      const next = new Set(prev);
      next.add(eggUuid);
      return next;
    });

  const removeSelectedEgg = (eggUuid: string) =>
    setSelectedEggs((prev) => {
      const next = new Set(prev);
      next.delete(eggUuid);
      return next;
    });

  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'a',
        modifiers: ['ctrlOrMeta'],
        callback: () => setSelectedEggs(new Set(eggs?.data.map((a) => a.uuid) ?? [])),
      },
      {
        key: 'Escape',
        callback: () => setSelectedEggs(new Set([])),
      },
    ],
    deps: [eggs],
  });

  return (
    <AdminSubContentContainer
      title='Eggs'
      titleOrder={2}
      search={search}
      setSearch={setSearch}
      contentRight={
        <AdminCan action='eggs.create'>
          <Button onClick={() => fileInputRef.current?.click()} color='blue'>
            <FontAwesomeIcon icon={faUpload} className='mr-2' />
            Import
          </Button>
          <Button
            onClick={() => navigate(`/admin/nests/${contextNest.uuid}/eggs/new`)}
            color='blue'
            leftSection={<FontAwesomeIcon icon={faPlus} />}
          >
            Create
          </Button>

          <input
            type='file'
            accept='.json,.yml,.yaml'
            ref={fileInputRef}
            className='hidden'
            onChange={handleFileUpload}
          />
        </AdminCan>
      }
    >
      <EggActionBar
        nest={contextNest}
        selectedEggs={selectedEggs}
        invalidateEggs={() => {
          setSelectedEggs(new Set());
          refetch();
        }}
      />

      <SelectionArea onSelectedStart={onSelectedStart} onSelected={onSelected}>
        <Table columns={eggTableColumns} loading={loading} pagination={eggs} onPageSelect={setPage} allowSelect={false}>
          {eggs.data.map((egg) => (
            <SelectionArea.Selectable key={egg.uuid} item={egg.uuid}>
              {(innerRef: Ref<HTMLElement>) => (
                <EggRow
                  key={egg.uuid}
                  nest={contextNest}
                  egg={egg}
                  showSelection
                  isSelected={selectedEggs.has(egg.uuid)}
                  onSelectionChange={(selected) => (selected ? addSelectedEgg(egg.uuid) : removeSelectedEgg(egg.uuid))}
                  ref={innerRef as Ref<HTMLTableRowElement>}
                />
              )}
            </SelectionArea.Selectable>
          ))}
        </Table>
      </SelectionArea>
    </AdminSubContentContainer>
  );
}

export default function AdminEggs({ contextNest }: { contextNest: AdminNest }) {
  return (
    <Routes>
      <Route path='/' element={<EggsContainer contextNest={contextNest} />} />
      <Route path='/:eggId/*' element={<EggView contextNest={contextNest} />} />
      <Route element={<AdminPermissionGuard permission='eggs.create' />}>
        <Route path='/new' element={<EggCreateOrUpdate contextNest={contextNest} />} />
      </Route>
    </Routes>
  );
}
