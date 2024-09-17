interface Entry {
  title: string;
  url: string;
  notes: string;
  entryId: number;
}

const data = {
  view: 'entry-form',
  entries: [] as Entry[],
  editing: null,
  nextEntryId: 1,
};
