## ピュアアロエ ディストリビューターアプリ

## インストール手順

1. ピュアアロエアプリケーションをインストールします。こちらに手順があります: https://github.com/mokamoto/purealoe

1. 設定 > ユーザから、 Node.js からSalesforceに接続するインテグレーションユーザを作成します。 **Salesforce** ライセンスタイプを選択し、 **システム管理者** をプロファイルとして選択します。該当のユーザでブラウザよりログイン (https://test.salesforce.com)　し、電話番号を登録しないを選択します。

1. 設定 > ユーザ > 権限セットより、インテグレーション、purealoe 権限セットをアサインします。

1. 接続アプリケーションをDeveloper edition 組織か、Hub組織に作成します。 (Scratch組織ではありません)

1. こちらのリポジトリをクローンします:
    ```
    git clone https://github.com/mokamoto/purealoe-distributor
    cd purealoe-distributor
    ```

1. Heroku アプリケーションを作成します:
    ```
    heroku create some_app_name
    ```

1. Heroku config varsを生成します:
    ```
    heroku config:set SF_CLIENT_ID=your_connected_client_id
    heroku config:set SF_CLIENT_SECRET=your_connected_client_secret
    heroku config:set SF_USER_NAME=your_integration_user_name
    heroku config:set SF_USER_PASSWORD=your_integration_user_password
    heroku config:set SF_ENVIRONMENT=sandbox
    ```

    **SF_ENVIRONMENT** にはScratch組織の場合には **sandbox** を指定し、もし通常のDeveloper Editionを使用する場合には **production** を指定します。

1. コードを Heroku アプリケーションへプッシュします:
    ```
    git push heroku master
    ```

    もしくはアプリケーションをローカルで実行します:

    ```
    heroku run:local npm start
    ```
