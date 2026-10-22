学生クリエイティブフェスタ｜作品ギャラリー

【起動方法】
1. このフォルダを VS Code で開きます。
2. Live Server 拡張機能で index.html を開きます。
3. 「作品を見る」を押すと、作品詳細が表示されます。
※ works.json を読み込むため、HTMLをダブルクリックせず Live Server を使用してください。

【作品追加】
data/works.json の配列に、既存の項目をコピーして作品情報を追加します。

category は video / illustration / sculpture / music のいずれか。
映像・音楽：mediaType を video にし、media に動画ファイルのパスまたはURLを指定。
イラスト・立体：mediaType を image にし、media と thumbnail に画像ファイルのパスを指定。
ローカル動画の例：assets/my-work.mp4 を置き、media を assets/my-work.mp4 にします。
participation は competition（コンテスト）または exhibition（展示のみ）。
award が空文字でなければ「受賞作品」フィルターに表示されます。
