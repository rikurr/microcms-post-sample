import "dotenv/config";
import fs from "fs";
import fetch from "node-fetch";

type ApiData = {
  contents: {
    id: string;
  }[];
};

// 新規作成や更新用のJSONファイルの読み込み
const getMicrocmsJson = (file: string) => {
  const jsonObject = JSON.parse(fs.readFileSync(`${file}`, "utf8"));
  const contents = jsonObject.contents;
  return contents as any[];
};

// microCMS API情報
const microcms = {
  url: process.env.MICROCMS_ENDPOINT ?? "",
  apiKey: process.env.MICROCMS_KEY ?? "",
};

// microCMS GET API
const getMicrocmsData = async (limit: number) => {
  const getOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-MICROCMS-API-KEY": microcms.apiKey,
    },
  };

  const response = await fetch(`${microcms.url}?limit=${limit}`, getOptions);
  const data = (await response.json()) as ApiData;
  return data.contents;
};

const main = async () => {
  const jsonData = getMicrocmsJson("sources.json");
  const getApiData = await getMicrocmsData(50);

  // コンテンツを新規作成する際に0番目の要素が一番上に表示されるよう配列の順番を入れ替える
  const revJsonData = jsonData.reverse();

  for (const item of revJsonData) {
    // 作成できないデータ項目の削除
    delete item.createdAt;
    delete item.updatedAt;
    delete item.publishedAt;
    delete item.revisedAt;

    // データがすでに存在しているか
    const isExist = getApiData.some((apiItem) => apiItem.id === item.id);

    // すでにデータが存在しているならPATCH、なければPOSTする
    if (isExist) {
      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-MICROCMS-API-KEY": microcms.apiKey,
        },
        body: JSON.stringify(item),
      };

      const response = await fetch(`${microcms.url}/${item.id}`, options);
      console.log(`コンテンツID: ${item.id} PATCH`, response.status);
    } else {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-MICROCMS-API-KEY": microcms.apiKey,
        },
        body: JSON.stringify(item),
      };

      const response = await fetch(`${microcms.url}`, options);
      console.log(`コンテンツID: ${item.id} POST`, response.status);
    }
  }

  console.log("完了しました");
};

main();
