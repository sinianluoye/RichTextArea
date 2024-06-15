# @sinianluoye/rich-text-area

[![NPM version](https://img.shields.io/npm/v/@sinianluoye/rich-text-area.svg?style=flat)](https://npmjs.org/package/@sinianluoye/rich-text-area)
[![NPM downloads](http://img.shields.io/npm/dm/@sinianluoye/rich-text-area.svg?style=flat)](https://npmjs.org/package/@sinianluoye/rich-text-area)

a text area with image
# DEMO

![demo](demo/demo.gif)

## Usage

```jsx
<RichTextArea 
    ref={ref}
    disabled={false}
    onEditorValueChange={(value) => {console.log("onEditorValueChange:", value)}}
    onFocus={(event) => {console.log("onFocus:", event)}}
    onPressEnter={(event) => {console.log("onPressEnter:", event)}}
    onCompositionEnd={() => {console.log("onCompositionEnd")}}
    onCompositionStart={() => {console.log("onCompositionStart")}}
></RichTextArea>
```

## Options

```tsx
type RichTextAreaProps = {
  disabled?: boolean;
  border?: string;
  padding?: string;
  lineHeight?: string;
  paddingBottom?: string;
  maxHeight?: string;
  placeholder?: string;
  onEditorValueChange?: (value: RichTextAreaElementType[]) => void;
  onCompositionStart?: () => void;
  onCompositionEnd?: () => void;
  onFocus?: (event: React.FocusEvent) => void;
  onPressEnter?: (event: React.KeyboardEvent) => void;
  className?: string;
};

type RichTextAreaRef = {
  clearContent: () => void;
  insertText: (text: string) => void;
  insertImage: (url: string) => void;
  focus: () => void;
  blur: () => void;
};
```

## Development

```bash
# install dependencies
$ pnpm install

# develop library by docs demo
$ pnpm start

# build library source code
$ pnpm run build

# build library source code in watch mode
$ pnpm run build:watch

# build docs
$ pnpm run docs:build

# Locally preview the production build.
$ pnpm run docs:preview

# check your project for potential problems
$ pnpm run doctor
```

## LICENSE

MIT
