# textfit 開発セットアップガイド

### 1. 依存関係のインストール

```bash
cd textfit
npm install
```

### 2. ビルド

```bash
npm run build
```

これで `dist/` フォルダにビルド済みファイルが生成されます。

### 3. テストの実行

```bash
# 通常のテスト実行
npm test

# UIでテスト結果を確認
npm run test:ui

# カバレッジ付き
npm run test:coverage
```

### 4. 開発モード（ファイル監視）

```bash
npm run dev
```

ファイルを変更すると自動的にリビルドされます。

### 5. 使用例の実行

```bash
node examples/basic-usage.js
```

## 📁 プロジェクト構成

```
textfit/
├── src/
│   ├── core/             # コア機能
│   │   ├── kana.ts      # カナ変換
│   │   ├── space.ts     # 空白処理
│   │   └── normalize.ts # 正規化
│   ├── presets/          # プリセット
│   │   └── common.ts
│   ├── types.ts         # 型定義
│   └── index.ts         # エントリーポイント
├── tests/                # テスト
├── examples/             # 使用例
├── dist/                 # ビルド出力（git無視）
└── package.json
```

## 🔄 開発ワークフロー

### 新機能の追加

1. `src/` 配下に機能を実装
2. `tests/` にテストを追加
3. `npm test` でテストが通ることを確認
4. `npm run build` でビルドエラーがないか確認
5. `README.md` に使用例を追加

### よくある問題

**Q: ビルドエラーが出る**

- TypeScript の型エラーを確認
- `tsconfig.json` の設定を確認

**Q: テストが失敗する**

- `npm install` を再実行
- Node.js のバージョンを確認（推奨: v18 以上）

**Q: 例が動かない**

- 先に `npm run build` を実行
- `dist/` フォルダが生成されているか確認

## 📦 npm パッケージとして公開（オプション）

```bash
# npmアカウントでログイン
npm login

# パッケージ公開
npm publish
```

初回公開前に:

- `package.json` の `name` がユニークか確認
- `version` を `0.1.0` から開始
- ライセンスを確認

## 🎯 次のステップ

- [ ] より多くのテストケースを追加
- [ ] パフォーマンスベンチマークの作成
- [ ] 追加のプリセット機能（住所正規化など）
- [ ] ドキュメントサイトの構築
- [ ] CI/CD の設定

Happy coding! 🎉
