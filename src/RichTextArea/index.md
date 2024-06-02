# RichTextArea

a text area with image

```jsx
import {  RichTextArea,
    RichTextAreaRef,
    RichTextAreaEditor,
    RichTextAreaElementType,
    RichTextAreaProps,
    RichTextAreaStyle } from '@sinianluoye/rich-text-area';
import { useState, useRef } from "react";

export default () => {
    const ref = useRef(null);
    return (
      <div>
        <RichTextArea 
          className={'text-class-name'}
          ref={ref}
          disabled={false}
          onEditorValueChange={(value) => {console.log("onEditorValueChange:", value)}}
          onFocus={(event) => {console.log("onFocus:", event)}}
          onPressEnter={(event) => {console.log("onPressEnter:", event)}}
          onCompositionEnd={(e) => {console.log("onCompositionEnd:", e)}}
          onCompositionStart={() => {console.log("onCompositionStart")}}
          style={{backgroundColor: '#abcdef'}}
          imageStyle={{
            maxHeight: '200px'
          }}
        ></RichTextArea>
        <button onClick={()=>{ref.current?.clearContent()}}>clear</button>
        <button onClick={()=>{ref.current?.insertText("this is inserted text")}}>insert text</button>
        <button onClick={()=>{ref.current?.insertImage("https://img.zcool.cn/community/0176b05e254499a801216518ff2bf4.jpg")}}>insert image</button>
        <button onClick={()=>{ref.current?.focus()}}> focus </button>
        <button onClick={()=>{ref.current?.blur()}}> blur </button>
      </div>
    );
}
```
