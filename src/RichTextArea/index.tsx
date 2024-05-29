// Import React dependencies.
import { Image } from 'antd';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { BaseEditor, Editor, Element, Transforms, createEditor } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  Slate,
  withReact,
} from 'slate-react';

export type RichTextAreaEditor = BaseEditor & ReactEditor & HistoryEditor;

export type Text = { text: string };

export type TextElementType = {
  type: 'paragraph';
  children: Text[];
} & Element;

export type ImageElementType = {
  type: 'image_url';
  image_url: {
    url: string;
  };
  children: Text[];
} & Element;

export type RichTextAreaElementType = ImageElementType | TextElementType;

export type RichTextAreaStyle = {
  border?: string;
  padding?: string;
  lineHeight?: string;
  paddingBottom?: string;
};

declare module 'slate' {
  interface RichTextAreaTypes {
    Editor: RichTextAreaEditor;
    Element: RichTextAreaElementType;
    Text: Text;
  }
}

const renderTextElement = (
  { attributes, children, element }: RenderElementProps,
  style: any,
) => {
  return (
    <div {...attributes} style={style}>
      {children}
    </div>
  );
};

const renderImageElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  return (
    <div
      {...attributes}
      style={{ display: 'inline-flex', alignItems: 'flex-end' }}
    >
      <div
        contentEditable={false}
        style={{ display: 'inline-flex', alignItems: 'flex-end' }}
      >
        <Image
          src={(element as ImageElementType).image_url.url}
          alt=""
          style={{ display: 'inline-flex', verticalAlign: 'bottom' }}
        />
      </div>
      {children}
    </div>
  );
};

const withImages = (editor: ReactEditor) => {
  const { insertData, isVoid, isInline } = editor;

  editor.isInline = (element) => {
    return (element as RichTextAreaElementType).type === 'image_url'
      ? true
      : isInline(element);
  };

  editor.isVoid = (element) => {
    return (element as RichTextAreaElementType).type === 'image_url'
      ? true
      : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');
    const { files } = data;

    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      for (const file of filesArray) {
        const reader = new FileReader();
        const [mime] = file.type.split('/');

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result;
            Transforms.insertNodes(editor, {
              type: 'image_url',
              image_url: {
                url: url,
              },
              children: [{ text: '' }],
            } as ImageElementType);

            Transforms.move(editor, { distance: 1, unit: 'offset' });
          });

          reader.readAsDataURL(file);
        }
      }
    } else {
      const lines = text.split('\n');
      lines.forEach((line, index) => {
        if (index > 0) {
          Transforms.insertNodes(editor, {
            type: 'paragraph',
            children: [{ text: line }],
          } as TextElementType);
        } else {
          Transforms.insertText(editor, line);
        }
      });
    }
  };

  return editor;
};

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  } as TextElementType,
];

const handleKeyDownEnter = (
  event: React.KeyboardEvent,
  editor: ReactEditor,
) => {
  if (
    event.key === 'Enter' &&
    event.shiftKey === false &&
    event.ctrlKey === false &&
    event.metaKey === false &&
    event.altKey === false
  ) {
    event.preventDefault();
    Transforms.insertNodes(editor, {
      type: 'paragraph',
      children: [{ text: '' }],
    } as TextElementType);
    ReactEditor.focus(editor);
    setTimeout(() => {
      const domSelection = window.getSelection();
      if (domSelection) {
        const domRange = domSelection.getRangeAt(0);
        const domNode = domRange.startContainer.parentNode as HTMLElement;
        domNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 0);
  }
};

const handleKeyDownTab = (event: React.KeyboardEvent, editor: ReactEditor) => {
  if (event.key === 'Tab') {
    event.preventDefault();
    editor.insertText('\t');
  }
};

export type RichTextAreaProps = {
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

export type RichTextAreaRef = {
  clearContent: () => void;
  insertText: (text: string) => void;
  insertImage: (url: string) => void;
};

const RichTextArea = forwardRef<RichTextAreaRef, RichTextAreaProps>(
  (props: RichTextAreaProps, ref) => {
    const [editor] = useState(() =>
      withImages(withReact(withHistory(createEditor()))),
    );
    const {
      disabled = false,
      border = '1px solid black',
      padding = '10px',
      lineHeight = '1.5',
      paddingBottom = '0',
      maxHeight = '400px',
      placeholder = 'input something...',
      onEditorValueChange = () => {},
      onCompositionStart = () => {},
      onCompositionEnd = () => {},
      onFocus = () => {},
      onPressEnter = null,
      className = 'rich-text-area',
    } = props;

    const renderElement = useCallback(
      ({ attributes, children, element }: RenderElementProps) => {
        if ((element as RichTextAreaElementType).type === 'paragraph') {
          return renderTextElement(
            { attributes, children, element },
            {
              lineHeight: lineHeight,
              paddingBottom: paddingBottom,
              margin: 0,
            },
          );
        } else if ((element as RichTextAreaElementType).type === 'image_url') {
          return renderImageElement({ attributes, children, element });
        } else {
          console.error(`Unknown element ${element}`);
          return renderTextElement(
            { attributes, children, element },
            {
              lineHeight: lineHeight,
              paddingBottom: paddingBottom,
              margin: 0,
            },
          );
        }
      },
      [],
    );

    const handleKeyDown = (event: React.KeyboardEvent, editor: ReactEditor) => {
      if (onPressEnter !== null) {
        onPressEnter(event);
      } else {
        handleKeyDownEnter(event, editor);
      }
      handleKeyDownTab(event, editor);
    };
    if (disabled) {
      return null;
    }

    const insertText = (text: string) => {
      Transforms.insertText(editor, text);
      Transforms.move(editor, { distance: 1, unit: 'offset' });
    };

    const insertImage = (url: string) => {
      Transforms.insertNodes(editor, {
        type: 'image_url',
        image_url: {
          url: url,
        },
        children: [{ text: '' }],
      } as ImageElementType);
      Transforms.move(editor, { distance: 1, unit: 'offset' });
    };

    const clearContent = () => {
      Transforms.delete(editor, {
        at: {
          anchor: Editor.start(editor, []),
          focus: Editor.end(editor, []),
        },
      });
    };

    useImperativeHandle(ref, () => ({
      clearContent,
      insertText,
      insertImage,
    }));

    return (
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={(x) => {
          const isAstChange = editor.operations.some(
            (op) => 'set_selection' !== op.type,
          );
          if (isAstChange) {
            onEditorValueChange?.(x as RichTextAreaElementType[]);
          }
        }}
      >
        <Editable
          className={className}
          placeholder={placeholder}
          renderElement={renderElement}
          style={{
            border: border,
            padding: padding,
            lineHeight: lineHeight,
            maxHeight: maxHeight,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
          onKeyDown={(event) => handleKeyDown(event, editor)}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          onFocus={onFocus}
        ></Editable>
      </Slate>
    );
  },
);

export default RichTextArea;
