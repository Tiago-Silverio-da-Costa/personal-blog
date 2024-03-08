import prisma from "@/adapter/prisma";
import {
  TCustomFilterParams,
  TPaginationParams,
} from "@/components/admin/utils";
import { Prisma } from "@prisma/client";

export type TArticleData = Prisma.PromiseReturnType<typeof getArticleData>[0];
type TQuery = ReturnType<typeof getQuery>;

export function getQuery({
  paginationParams,
  customFilterParams,
}: {
  paginationParams: TPaginationParams;
  customFilterParams: TCustomFilterParams;
}) {
  const authorId =
    customFilterParams.user && customFilterParams.user
      ? customFilterParams.user
      : undefined;

  var where: Prisma.PostWhereInput = {
    authorId,
  };

  //search
  if (paginationParams.search) {
    const search: Prisma.PostWhereInput = {
      OR: [
        {
          title: {
            contains: paginationParams.search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: paginationParams.search,
            mode: "insensitive",
          },
        },
      ],
    };
    where = {
      ...search,
    };
  }

  // sortQuery
  var orderBy: Prisma.PostOrderByWithRelationInput = {
    createdAt: "desc",
  };
  if (paginationParams.sort === "title") {
    orderBy = {
      createdAt: Prisma.SortOrder.asc,
    };
  } else if (paginationParams.sort == "name") {
    orderBy = {
      title: Prisma.SortOrder.asc,
    };
  }

  // perPageQuery
  var take = paginationParams.perPage ? paginationParams.perPage : 10;

  // pageQuery
  var skip = paginationParams.page ? (paginationParams.page - 1) * take : 0;

  return {
    where,
    orderBy,
    take,
    skip,
  };
}

async function getArticleData(query: TQuery) {
  const articleData = await prisma.post.findMany({
    ...query,
    select: {
      id: true,
      title: true,
      theme: true,
      content: true,
      createdAt: true,
      authorId: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  const data = articleData.map((article) => {
    const authorNameW = article.author.name.split(" ");
    const authorName =
      authorNameW.length > 1
        ? `${authorNameW[0]} ${authorNameW.at(-1)}`
        : authorNameW[0];

    return {
      id: article.id,
      title: article.title,
      theme: article.theme,
      content: article.content,
      createdAt: article.createdAt,
      authorId: article.authorId,
      authorName: authorName,
    };
  });

  return articleData;
}

async function getArticleCount(where: Prisma.PostWhereInput) {
  const count = await prisma.post.count({ where });

  return count;
}

export async function getArticles({
  paginationParams,
  customFilterParams,
}: {
  paginationParams: TPaginationParams;
  customFilterParams: TCustomFilterParams;
}) {
  const query = getQuery({ paginationParams, customFilterParams });

  const dataPromise = getArticleData(query);
  const countPromise = getArticleCount(query.where);

  const [count, data] = await Promise.all([countPromise, dataPromise]);

  return {
    data,
    count,
  };
}
