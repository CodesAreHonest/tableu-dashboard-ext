import {
  DataTable,
  MarksCollection,
  TableauEvent,
} from "@tableau/extensions-api-types";
import React, { useEffect, useMemo, useState } from "react";

type Results = { [key: string]: any };
const SampleTableu = () => {
  const [selectedRecords, setSelectedRecords] = useState(0);
  useEffect(() => {
    const getSelectionContent = async () => {
      const dashboard = tableau.extensions.dashboardContent?.dashboard;
      if (!dashboard) return null;

      const markSelection = tableau.TableauEventType.MarkSelectionChanged;

      dashboard.worksheets.forEach((worksheet) => {
        worksheet.addEventListener(markSelection, (_: TableauEvent) => {
          worksheet
            .getSelectedMarksAsync()
            .then((collection: MarksCollection) => {
              let accRecord = 0;
              const results = collection.data.reduce((acc, table) => {
                const { data, columns } = table;

                data.forEach((row) => {
                  const [firstRow, secondRow] = row;
                  const first = firstRow.formattedValue as string;
                  const second = secondRow.formattedValue as string;
                  acc[first] = second;
                });

                accRecord += data.length;
                return acc;
              }, {} as Results);

              // display results
              console.log(results);
              setSelectedRecords(accRecord);
            });
        });
      });
    };

    tableau.extensions.initializeAsync().then(() => {
      getSelectionContent();
    });
  }, []);

  const display = useMemo(() => {
    return (
      <>
        <b>Selected Rows</b>: {selectedRecords}
      </>
    );
  }, [selectedRecords]);

  return <div>{display}</div>;
};

export default SampleTableu;
