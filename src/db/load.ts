import Dexie from "dexie";

import type { PromiseExtended, Transaction } from "dexie";
import type { FileMetaCollectionDb, FileMetaCollectionDbTables } from "./types";

//================================================

const DB_VERSIONS: [
  Partial<Record<keyof FileMetaCollectionDbTables, string | null>>,
  undefined | ((tx: Transaction) => PromiseExtended),
][] = [
  [
    {
      files: "&path,filename,index,*keywords,*rawCategories,rating",
    },
    undefined,
  ],
];

export const loadDataRegistryDb = (id: string, preventOpen?: true) => {
  const dataRegistryDb = new Dexie(id) as FileMetaCollectionDb;

  DB_VERSIONS.map(([stores, upgradeCallback], index) => {
    const version = dataRegistryDb.version(index + 1).stores(stores);
    if (upgradeCallback) {
      version.upgrade(upgradeCallback);
    }
  });

  if (!preventOpen) {
    dataRegistryDb.open().catch(e => console.error(e));
  }

  return dataRegistryDb;
};
