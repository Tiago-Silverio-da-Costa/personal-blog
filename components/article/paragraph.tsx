"use client";

import { Fragment } from "react";

export default function Paragraph({ content }: { content: string }) {

  return (
    <>
      <div className="text-lg tracking-tighter leading-6">
        {
          content.split("\n").map((line, index) => {
            const isCode = line.includes("`");
            const isQuote = line.startsWith(">") && line.endsWith("<");
            const isList = line.startsWith("-");


            if (isCode) {
              return (
                <Fragment key={index}>
                  <div className="border-l-2 border-l-secondary/50 border-r-2 border-r-secondary/50 p-4 first:rounded-tr-md first:rounded-tl-md first:border-t-2 first:border-l-2 first:border-r-2 first:border-t-secondary/50 first:border-r-secondary/50 first:border-l-secondary/50 last:rounded-br-md last:rounded-bl-md last:border-b-2 last:border-l-2 last:border-r-2 last:border-b-secondary/50 last:border-r-secondary/50 last:border-l-secondary/50">
                    {line.replace(/`/g, "")}
                  </div>
                </Fragment>

              )
            }

            if (isQuote) {
              return (
                <Fragment key={index}>
                  <blockquote className="rounded-md border-2 border-secondary/50 p-4">
                    &quot;{line.replace(/></g, "")}&quot;
                  </blockquote>
                </Fragment>
              )
            }

            if (isList) {
              return (
                <Fragment key={index}>
                  <ul className="list-disc list-inside">
                    <li>{line.slice(1)}</li>
                  </ul>
                </Fragment>
              )
            }

            return (
              <Fragment key={index}>
                <p className="my-4">{line}</p>
                <br />
              </Fragment>
            )
          })}
      </div>

    </>
  )
}