import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { InputsForm } from "./InputsForm";
import React from "react";

function LocalesList({ locales, allLocales, setLoading, setUpdate, setLocales }) {
  return (
    <div className="flex-1 mb-4">
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={locales.length}
            itemSize={50}
            width={width}
            rowHeight={200}
          >
            {({ index, style }) => (
              <InputsForm
                locales={locales}
                allLocales={allLocales}
                setLoading={setLoading}
                setUpdate={setUpdate}
                setLocales={setLocales}
                index={index}
                style={{ ...style, paddingBottom: "1rem" }}
              />
            )}
          </List>
        )}
      </AutoSizer>
    </div>
  );
}

export default LocalesList;
