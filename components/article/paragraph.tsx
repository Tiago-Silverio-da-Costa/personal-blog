"use client";

import Image from "next/image";
import { Fragment, useState, useEffect } from "react";

export default function Paragraph({ content }: { content: string }) {
  const [processedContent, setProcessedContent] = useState<(JSX.Element | null)[]>([]);

  useEffect(() => {
    const lines = content.split("\n");
    const newContent: (JSX.Element | null)[] = [];
    let codeBlockContent: string[] = [];
    let isInCodeBlock = false;

    lines.forEach((line, index) => {
      const isQuote = line.startsWith("<blockquote>");
      const isList = line.startsWith("-");
      const isTitle = line.startsWith("<title>");
      const isLink = line.includes("<link>") && line.includes("</link>");
      const isImage = line.includes("<image>") && line.includes("</image>");
      const isCodeStart = line.startsWith("<code>");
      const isCodeEnd = line.endsWith("</code>");

      if (isCodeStart) {
        isInCodeBlock = true;
        codeBlockContent.push(line.replace(/<code>/, ""));
        return;
      }

      if (isInCodeBlock) {
        if (isCodeEnd) {
          isInCodeBlock = false;
          codeBlockContent.push(line.replace(/<\/code>/, ""));
          const finalContent = codeBlockContent.join("\n");
          newContent.push(
            <Fragment key={index}>
              <div className="border border-secondaryText p-4 rounded-lg">
                <code className="break-all whitespace-pre-wrap">{finalContent}</code>
              </div>
            </Fragment>
          );
          codeBlockContent = [];
        } else {
          codeBlockContent.push(line);
        }
        return;
      }

      if (isImage) {
        newContent.push(
          <Fragment key={index}>
            <Image src={line.replace(/<image>/, "").replace(/<\/image>/, "")} alt="Imagem" width={500} height={300} />
          </Fragment>
        );
        return;
      }

      if (isLink) {
        newContent.push(
          <Fragment key={index}>
            <a target="_blank" href={line.replace(/<link>/, "").replace(/<\/link>/, "").includes("https://") ? line.replace(/<link>/, "").replace(/<\/link>/, "") : `https://${line.replace(/<link>/, "").replace(/<\/link>/, "")}`} className="text-secondary underline">{line.replace(/<link>/, "").replace(/<\/link>/, "")}</a>
          </Fragment>
        );
        return;
      }

      if (isTitle) {
        newContent.push(
          <Fragment key={index}>
            <h2 className="text-3xl font-medium text-secondary tracking-tighter leading-10 md:leading-6">{line.replace(/<title>/, "")}</h2>
          </Fragment>
        );
        return;
      }

      if (isQuote) {
        newContent.push(
          <Fragment key={index}>
            <blockquote className="border-l-4 border-secondary/50 p-4 italic">
              {line.replace(/<blockquote>/, "")}
            </blockquote>
          </Fragment>
        );
        return;
      }

      if (isList) {
        newContent.push(
          <Fragment key={index}>
            <ul className="list-disc list-inside">
              <li>{line.slice(1)}</li>
            </ul>
          </Fragment>
        );
        return;
      }

      newContent.push(
        <Fragment key={index}>
          <p className="my-4">{line}</p>
          <br />
        </Fragment>
      );
    });

    setProcessedContent(newContent);
  }, [content]);

  return (
    <div className="text-lg tracking-tighter leading-6">
      {processedContent}
    </div>
  );
}
