import { useCallback, useEffect, useState } from "react";
import * as ExifReader from "exifreader";

import { loadAllFilesInSubdirectories, getImageThumbnailDataUri } from "~/utils";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

//================================================

export function HomePage() {
  const [hovered, setHovered] = useState(false);
  const [dataTransfer, setDataTransfer] = useState<DataTransfer>();

  const onDrop = useCallback((e: React.DragEvent) => {
    setHovered(false);
    e.preventDefault();
    setDataTransfer(e.dataTransfer);
  }, []);

  const [entries, setEntries] = useState<FileSystemFileEntry[]>();
  const [sample, setSample] = useState<ExifReader.Tags>();

  useEffect(() => {
    const dir = dataTransfer?.items[0].webkitGetAsEntry();
    if (dir instanceof FileSystemDirectoryEntry) {
      loadAllFilesInSubdirectories(dir).then(files => setEntries(files));
    }
  }, [dataTransfer]);

  useEffect(() => {
    if (entries?.length) {
      entries[0].file(file => {
        console.log(`file: `, file);
        ExifReader.load(file).then(tags => {
          setSample(tags);
        });
      });
    }
  }, [entries]);

  console.log(`sample: `, sample);

  return (
    <Grid
      container
      direction="column"
      width="100vw"
      height="100%"
      alignItems="center"
      justifyContent="center"
      gap={8}
    >
      <Grid
        container
        direction="column"
        width="20rem"
        height="16rem"
        alignItems="center"
        justifyContent="center"
        border="4px dashed"
        borderRadius="1rem"
        onDragEnter={() => setHovered(true)}
        onDragLeave={() => setHovered(false)}
        onDragOver={e => {
          setHovered(true);
          e.preventDefault();
        }}
        onDropCapture={onDrop}
        {...(hovered
          ? {
              borderColor: "primary.light",
              bgcolor: "primary.dark",
            }
          : {
              borderColor: "divider",
            })}
      >
        <Typography onDragEnterCapture={e => e.preventDefault()}>
          Drag and drop a folder of photos here
        </Typography>
      </Grid>

      {entries && (
        <Card>
          <CardContent>
            <List>
              {entries?.slice(0, 10).map(entry => (
                <ListItem key={entry.fullPath}>{entry.fullPath}</ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
      {sample && (
        <Card>
          <CardHeader title={entries?.[0].name}></CardHeader>
          <CardContent>
            <pre>{JSON.stringify(sample, null, "  ")}</pre>
            {sample.Thumbnail && <img src={getImageThumbnailDataUri(sample)} />}
          </CardContent>
        </Card>
      )}
    </Grid>
  );
}
