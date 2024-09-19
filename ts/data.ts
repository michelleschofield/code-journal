interface Entry {
  title: string;
  url: string;
  notes: string;
  entryId: number;
}

interface Data {
  view: string;
  entries: Entry[];
  editing: null | Entry;
  nextEntryId: number;
}

const data = readData();

function writeData(): void {
  const dataJSON = JSON.stringify(data);

  localStorage.setItem('entriesData', dataJSON);
}

function readData(): Data {
  const dataJSON = localStorage.getItem('entriesData');
  const defaultData = {
    view: 'entries',
    entries: [] as Entry[],
    editing: null,
    nextEntryId: 1,
  };
  return dataJSON ? JSON.parse(dataJSON) : defaultData;
}
