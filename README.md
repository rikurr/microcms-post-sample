# microcms-post-sample

POSTやPATCHを用いてmicroCMSのコンテンツ作成や更新を行う処理のサンプルです。

## 実行方法

`yarn dev`

## 手順

1. microCMSへPOSTするJSONファイルを用意する
2. microCMSのAPIキーとエンドポイントを`.env`ファイルに設定する。
3. microCMS管理画面のサービス設定のAPIキーの項目からAPIキーにPOSTとPATCH権限を付与する
4. `yarn dev`を実行するとデータを作成できます

