import classNames from "classnames";
import { createRef, ReactNode, useCallback, useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import ContentEditable from "react-contenteditable";
import { useInView } from "react-intersection-observer";

export type ChatBoxClasses = {
  gridWrapper?: string;
  chatboxWrapper?: string;
  header?: string;
  body?: string;
  scrollbars?: string;
  scrollBox?: string;
  scrollThumb?: string;
  messagesWrapper?: string;
  author?: string;
} & MessageBoxClasses &
  InputBoxClasses;

export type ChatBoxProps = {
  header: ReactNode | string;
  messages: ChatBoxMessage[];
  handleSubmit: (content: string) => void;
  classes?: ChatBoxClasses;
  inputPlaceholder?: string;
  userAuthorName?: string;
  mathisIcon?: JSX.Element;
  userIcon?: JSX.Element;
  isMultiLine?: boolean;
  setIsChatInputFocussed?: (isFocussed: boolean) => void;
};

export type ChatBoxMessage = MessageBoxProps & {
  id: string;
  date: number;
  userAuthorName?: string;
};

export const ChatBox = ({
  header,
  messages,
  handleSubmit,
  inputPlaceholder,
  classes,
  userAuthorName,
  mathisIcon,
  userIcon,
  isMultiLine,
  setIsChatInputFocussed,
}: ChatBoxProps) => {
  const scrollRef = createRef<HTMLDivElement>();
  useEffect(
    () =>
      scrollRef?.current?.scrollIntoView({ block: "end", behavior: "smooth" }),
    [scrollRef.current, JSON.stringify(messages)],
  );

  const renderView = useCallback(
    ({ style, ...props }: any) => (
      <div className={classes?.scrollBox} style={{ ...style }} {...props} />
    ),
    [],
  );

  const renderThumb = useCallback(({ style, ...props }: any) => {
    const thumbStyle = {
      zIndex: 2,
    };
    return (
      <div
        className={classes?.scrollThumb}
        style={{ ...style, ...thumbStyle }}
        {...props}
      />
    );
  }, []);

  return (
    <div className={classes?.gridWrapper}>
      <div className={classes?.chatboxWrapper}>
        {header && <div className={classes?.header}>{header}</div>}

        <div className={classes?.body}>
          <Scrollbars
            universal
            className={classes?.scrollbars}
            renderView={renderView}
            renderThumbHorizontal={renderThumb}
            renderThumbVertical={renderThumb}
          >
            <div className={classes?.messagesWrapper} ref={scrollRef}>
              {messages.map(message => (
                <MessageBox
                  key={message.id}
                  classes={classes}
                  mathisIcon={mathisIcon}
                  userIcon={userIcon}
                  userAuthorName={userAuthorName}
                  {...message}
                />
              ))}
            </div>
          </Scrollbars>
        </div>

        <InputBox
          classes={classes}
          onSend={handleSubmit}
          placeholder={inputPlaceholder}
          isMultiLine={isMultiLine}
          setIsChatInputFocussed={setIsChatInputFocussed}
        />
      </div>
    </div>
  );
};

export type MessageBoxClasses = {
  messageBox?: string;
  rightAligned?: string;
  messageBlock?: string;
  author?: string;
  message?: string;
};

export type MessageBoxProps = {
  content: string;
  author: string;
  isRightAligned: boolean;
  userAuthorName?: string;
  mathisIcon?: JSX.Element;
  userIcon?: JSX.Element;
  classes?: MessageBoxClasses;
};

const MessageBox = ({
  content,
  isRightAligned,
  author,
  userAuthorName,
  mathisIcon,
  userIcon,
  classes,
}: MessageBoxProps) => {
  const iconToUse = !!userAuthorName
    ? author === userAuthorName
      ? userIcon
      : mathisIcon
    : null;
  return (
    <>
      <div
        className={classNames({
          [classes?.messageBox!]: true,
          [classes?.rightAligned!]: isRightAligned,
        })}
      >
        <div
          className={classNames("uk-flex", classes?.author, {
            "uk-flex-right": isRightAligned,
          })}
        >
          {!isRightAligned && iconToUse && iconToUse}
          <div
            className={classNames(classes?.author, {
              "uk-margin-small-left": !isRightAligned && iconToUse,
              "uk-margin-small-right": isRightAligned && iconToUse,
            })}
          >
            {author}
          </div>
          {isRightAligned && iconToUse && iconToUse}
        </div>

        <div className={classes?.messageBlock}>
          <div className={classes?.message}>
            {content.split("\n").map((c, i) => (
              <span key={i}>
                {c}
                <br />
              </span>
            ))}
          </div>
        </div>
      </div>
      <br />
    </>
  );
};

export type InputBoxClasses = {
  inputBox?: string;
  inputWrapper?: string;
  inputField?: string;
  multilineInputField?: string;
  sendButton?: string;
};

export type InputBoxProps = {
  onSend: (content: string) => void;
  classes?: InputBoxClasses;
  placeholder?: string;
  isMultiLine?: boolean;
  setIsChatInputFocussed?: (isFocussed: boolean) => void;
};

const InputBox = ({
  onSend,
  classes,
  placeholder,
  isMultiLine,
  setIsChatInputFocussed,
}: InputBoxProps) => {
  const { ref, inView } = useInView({ threshold: 0 });
  const [content, setContent] = useState("");
  const inputRef = createRef<HTMLInputElement>();
  const multilineInputRef = createRef<HTMLElement>();
  const handleSubmit = useCallback(() => {
    const parsedContent = content.trim();
    if (parsedContent !== "") {
      onSend(parsedContent);
    }
    setContent("");
  }, [content]);

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const onButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Enter" || e.code === "NumpadEnter" || e.code === "Space") {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (setIsChatInputFocussed) {
      if (isMultiLine) {
        setIsChatInputFocussed(
          inView &&
            !!multilineInputRef?.current &&
            document.activeElement === multilineInputRef.current,
        );
      } else {
        setIsChatInputFocussed(
          inView &&
            !!inputRef?.current &&
            document.activeElement === inputRef.current,
        );
      }
    }
  }, [
    setIsChatInputFocussed,
    document.activeElement,
    multilineInputRef?.current,
    inputRef?.current,
    inView,
  ]);

  return (
    <div ref={ref} className={classes?.inputBox}>
      <div className={classes?.inputWrapper}>
        {isMultiLine && (
          <ContentEditable
            innerRef={multilineInputRef}
            html={content}
            onChange={({ currentTarget: { innerText } }) =>
              setContent(innerText)
            }
            onKeyDown={onInputKeyDown}
            className={classNames("uk-textarea", classes?.multilineInputField)}
            placeholder={placeholder}
          />
        )}

        {!isMultiLine && (
          <input
            ref={inputRef}
            onChange={({ target: { value } }) => setContent(value)}
            onKeyDown={onInputKeyDown}
            value={content}
            className={classNames("uk-input", classes?.inputField)}
            placeholder={placeholder}
          />
        )}

        <div
          tabIndex={0}
          role="button"
          className={classNames("uk-button", classes?.sendButton)}
          onKeyDown={onButtonKeyDown}
          onClick={handleSubmit}
        >
          <i className="far fa-paper-plane-top" />
        </div>
      </div>
    </div>
  );
};
