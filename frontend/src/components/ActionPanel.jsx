import React from "react";

export default function ActionPanel({ actions, analysis }) {

  return (
    <div>

      {analysis && (
        <>
          <h3>AI Vision Analysis</h3>
          <p>{analysis}</p>
        </>
      )}

      {actions && (
        <>
          <h3>Suggested Action</h3>

          <pre>
            {JSON.stringify(actions, null, 2)}
          </pre>
        </>
      )}

    </div>
  );
}