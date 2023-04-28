import React, {
  ChangeEventHandler,
  KeyboardEventHandler,
  useState,
} from "react";
import { TiWarning } from "react-icons/ti";

export interface InputProps {
  className?: string;
  subClassName?: string;
  containerClassName?: string;
  autoFocus?: boolean;
  prepend?: any;
  prependClassName?: string;
  heading?: any;
  placeholder?: string;
  focusPlaceholder?: string;
  id?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  name?: string;
  type?: string;
  value?: string;
  style?: object;
  subStyle?: object;
  footerText?: string;
  footerClassName?: string;
  error?: boolean;
  disableHeading?: boolean;
  required?: boolean;
  disabled?: boolean;
  height?: string;
}

export const Input: React.FC<InputProps> = (props) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (props.onChange) {
      if (props.type === "money") {
        if (!e.target.value.startsWith("$"))
          e.target.value = "$" + e.target.value;
        e.target.value = numberWithCommas(e.target.value.replace(/,/g, ""));
      } else if (props.type === "phone") {
        e.target.value = formatPhoneNumber(e.target.value.replace(/-/g, ""));
      }
      props.onChange(e);
    }
  }
  function numberWithCommas(x: string | number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function formatPhoneNumber(phoneNumberString: string | number) {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = match[1] ? "+1 " : "";
      return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
    }
    return phoneNumberString.toString();
  }

  return (
    <div
      className={`${
        props.footerText && "relative flex flex-col gap-[0.35rem]"
      } ${props.containerClassName}`}
      style={props.style}
    >
      <div
        className={`relative flex h-full w-full items-center border border-slate-300 bg-slate-200/50 transition-all focus-within:border-blue-700 ${
          props.error && "errorField border-red"
        }
        h-[2.95rem] rounded-xl px-4 ${props.className}`}
      >
        {isFocused && !props.disableHeading && (
          <div
            className={`absolute -top-2 ${
              props.prepend && "left-5"
            } grid select-none place-items-center rounded-full px-3 py-[1px] text-light-900 transition-all`}
          >
            <span className="text-[0.7rem] font-medium">{props.heading}</span>
          </div>
        )}

        {props.prepend ? (
          <>
            <div className="absolute left-5 flex items-center gap-2">
              <props.prepend
                className={`h-[1.3rem] w-[1.3rem] text-slate-300 ${props.prependClassName}`}
              />
              <span
                className={`h-[1.5rem] w-[1.5px] rounded-full bg-dark-500`}
              ></span>
            </div>
          </>
        ) : (
          ""
        )}

        <input
          disabled={props.disabled}
          required={props.required}
          autoFocus={props.autoFocus}
          type={
            props.type === "money" || props.type === "phone"
              ? "text"
              : props.type || "text"
          }
          name={props.name}
          onChange={onChange}
          onKeyDown={props.onKeyDown}
          onFocus={(_) => {
            setIsFocused(true);
            props.onFocus?.();
          }}
          onBlur={(_) => {
            setIsFocused(false);
            props.onBlur?.();
          }}
          placeholder={
            (isFocused
              ? props.focusPlaceholder
                ? props.focusPlaceholder
                : props.placeholder
              : props.placeholder) || ""
          }
          aria-label={props.id || "input"}
          value={props.value}
          id={props.id || ""}
          style={props.subStyle}
          className={`w-full !outline-none p-0 ${
            props.prepend ? "pl-10" : ""
          } class="flex w-full py-1 pl-10 bg-transparent outline-none placeholder:text-zinc-500 placeholder:text-base" ${
            props.subClassName || ""
          }`}
        />
      </div>

      {/* footer */}
      {props.footerText && (
        <span
          className={`flex items-center gap-2 pl-2 text-sm-tiny font-medium ${
            props.error ? "text-red" : "text-dark-800"
          } ${props.footerClassName}`}
        >
          {props.error && <TiWarning className="h-5 w-5 text-red" />}{" "}
          {props.footerText}
        </span>
      )}
    </div>
  );
};
