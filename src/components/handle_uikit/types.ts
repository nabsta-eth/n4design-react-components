export interface BaseProps {
  id?: string;
  className?: string;
  style?: object;
}

export interface BaseContainerProps extends BaseProps {
  children: any;
  align?: string;
  height?: number;
  width?: number;
  background?: string;
  position?: string;
}

export interface AccordionProps extends BaseContainerProps {
  options?: string;
  onBeforeShow?: (e: Event, accordionState: any) => boolean | void;
  onBeforeHide?: (e: Event, accordionState: any) => boolean | void;
  onShow?: (e: Event, accordionState: any) => void;
  onShown?: (e: Event, accordionState: any) => void;
  onHide?: (e: Event, accordionState: any) => void;
  onHidden?: (e: Event, accordionState: any) => void;
}

export interface AccordionItemProps extends BaseProps {
  title: string;
  children: string | JSX.Element;
}

export interface AlertProps extends BaseProps {
  content: string;
  color?: string;
  duration?: number;
  isClosable?: boolean;
  onBeforeHide?: Function;
  onHide?: Function;
}

export interface ArticleProps extends BaseContainerProps {
  title: string;
  meta?: string;
  lead?: string;
}

export interface BadgeProps extends BaseProps {
  count: number;
}

export interface BreadcrumbProps extends BaseProps {
  children: any;
}

export interface ButtonProps extends BaseProps {
  children: any;
  submit?: boolean;
  toggleOptions?: string;
  type?: "primary" | "secondary" | "default";
  color?:
    | "error"
    | "warning"
    | "alert"
    | "red"
    | "yellow"
    | "orange"
    | "up"
    | "down";
  size?: string;
  icon?: boolean;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  to?: string;
  onClick?: any;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  active?: boolean;
  alert?: boolean;
  expand?: boolean;
  tooltip?: {
    text: string;
    position:
      | "bottom"
      | "bottom-left"
      | "bottom-right"
      | "left"
      | "top-left"
      | "top-right"
      | "top"
      | "right";
    classes?: string;
  };
  presetTooltip?: string;
  noBorder?: boolean;
}

export interface CardProps extends BaseContainerProps {
  hover?: boolean;
  color?: string;
  size?: string;
  name?: string;
}

export interface ContainerProps extends BaseContainerProps {
  size?: string;
}

export interface CoverProps extends BaseProps {
  src: string;
  alt?: string;
  type: "video" | "image";
  videoFormat?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  width?: string;
  height?: string;
  responsive?: boolean;
}

export interface DropdownProps extends BaseContainerProps {
  options?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export interface FlexProps extends BaseContainerProps {
  alignment?: string;
  direction?: string;
  wrap?: string;
}

export interface FormProps extends React.HTMLProps<HTMLFormElement> {
  layout?: string;
  custom?: boolean;
}

export interface FormInputProps extends React.HTMLProps<HTMLInputElement> {
  color?: "danger" | "success" | "blank";
  layout?: "small" | "large";
  width?: "large" | "medium" | "small" | "xsmall";
  checked?: boolean;
  tooltip?: string;
  currentValue?: string;
}

export interface FormSelectProps extends React.HTMLProps<HTMLSelectElement> {
  color?: "danger" | "success" | "blank";
  layout?: "small" | "large";
  width?: "large" | "medium" | "small" | "xsmall";
}

export interface FormTextareaProps
  extends React.HTMLProps<HTMLTextAreaElement> {
  children?: string;
  color?: "danger" | "success" | "blank";
  layout?: "small" | "large";
  width?: "large" | "medium" | "small" | "xsmall";
}

export interface GridProps extends BaseContainerProps {
  gutter?: "small" | "medium" | "large" | "collapse";
  divider?: boolean;
  match?: boolean;
  options?: string;
  sortable?: string;
}

export interface IconProps extends BaseProps {
  options: string;
  href?: string;
  button?: boolean;
  image?: string;
}

export interface ImageProps extends React.HTMLProps<HTMLImageElement> {
  options?: string;
}

export interface LabelProps extends BaseProps {
  color?: string;
  content: string;
}

export interface LightboxProps extends BaseProps {
  options: string;
  children: any;
}

export interface LightboxItemProps extends BaseProps {
  href: string;
  caption?: string;
  children: any;
}

export interface LinkProps extends BaseProps {
  type?: "muted" | "text" | "heading" | "reset";
  href?: string;
  target?: string;
  rel?: string;
  toggleOptions?: string;
  children: any;
  tooltip?: {
    text: string;
    position: "bottom" | "left" | "top" | "right";
  };
  onClick?: () => void;
}

export interface ListProps extends BaseContainerProps {
  type?: "bullet" | "divider" | "striped";
}

export interface MarginProps extends BaseContainerProps {
  type: string;
  dynamicWrapping?: boolean;
}

export interface ModalProps extends BaseContainerProps {
  id: string;
  title: string | React.ReactNode;
  show: boolean;
  onClose: () => void;
  titleClass?: "h2" | "h3" | "h4";
  closeButton: boolean; //true = display a modal close icon
  full?: boolean; //full page modal
  scroll?: boolean; //true = scrollbar in the modal when > viewport, otherwise whole page scrolls
  escClose?: boolean; //true = esc key closes the modal
  backgroundClose?: boolean; //true = clicking on the background closes
  stack?: boolean; //true = a new modal closes all others; false = previous modals remain open
  closeSelectors?: string; //selectors (classes/ids) that may close the modal (default is ".uk-modal-cloes-*")
}

export interface NavProps extends BaseProps {
  preset?: "default" | "primary" | "center";
  options?: string;
  accordion?: boolean;
  child?: boolean;
  children: any;
}

export interface NavItemProps extends BaseProps {
  type?: "header" | "divider";
  parent?: boolean;
  children: any;
}

export interface NavbarProps extends BaseProps {
  left?: boolean;
  center?: boolean;
  right?: boolean;
  children: any;
}

export interface NavbarContainerProps extends BaseProps {
  options?: string;
  dropbar?: boolean;
  transparent?: boolean;
  children: any;
}

export interface NavbarStickyProps extends BaseProps {
  id: string;
  options?: string;
  onActive?: any;
  onInactive?: any;
  children: any;
}

export interface OffcanvasProps extends BaseProps {
  id: string;
  options?: string;
  onBeforeShow?: Function;
  onShow?: Function;
  onShown?: Function;
  onBeforeHide?: Function;
  onHide?: Function;
  onHidden?: Function;
  children: any;
}

export interface OverlayProps extends BaseProps {
  position?: string;
  type?: "default" | "primary";
  showIcon?: boolean;
}

export interface PanelProps extends BaseProps {
  isScrollable?: boolean;
  children: any;
}

export interface ParallaxProps extends BaseProps {
  options: string;
  children: any;
}

export interface ProgressProps extends BaseProps {
  value: number;
  max: number;
}

export interface ProgressState {
  value: number;
}

export interface ScrollspyProps extends BaseProps {
  options: string;
  children: any;
}

export interface SectionProps extends BaseContainerProps {
  padding?: boolean;
  color?: string;
  size?: string;
  preserveColor?: boolean;
}

export interface SidebarProps extends BaseContainerProps {
  visibility?: string;
}

export interface SlideshowProps extends BaseProps {
  options?: string;
  navigation?: boolean;
  navigationStyle?: "dark" | "light";
  children: any;
}

export interface SlideshowItemProps extends BaseProps {
  src: string;
  alt?: string;
  type: "image" | "video";
  videoFormat?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
}

export interface TabContainerProps extends BaseProps {
  id?: string;
  options?: string;
  onBeforeShow?: Function;
  onShow?: Function;
  onShown?: Function;
  onBeforeHide?: Function;
  onHide?: Function;
  onHidden?: Function;
  children: any;
}

export interface TabProps extends BaseProps {
  id: string;
  onTabChange: (id: string) => void;
  children: any;
  active?: boolean;
}

export interface TableProps extends BaseProps {
  divider?: boolean;
  striped?: boolean;
  hover?: boolean;
  justify?: boolean;
  center?: boolean;
  responsive?: boolean;
  size?: string;
  children: any;
}

export interface TableDataProps extends BaseProps {
  shrink?: boolean;
  expand?: boolean;
  width?: string;
  colSpan?: number;
  textAlign?: "left" | "center" | "right";
  children: any;
  label?: string;
}

export interface TableTitleProps extends BaseProps {
  children: any;
}

export interface TableHeadDataProps extends BaseProps {
  shrink?: boolean;
  expand?: boolean;
  width?: string;
  colSpan?: number;
  textAlign?: "left" | "center" | "right";
  children: any;
}

export interface TableHeadProps extends BaseProps {
  shrink?: boolean;
  expand?: boolean;
  width?: string;
  children: any;
}

export interface TableHeaderProps extends BaseProps {
  shrink?: boolean;
  expand?: boolean;
  width?: string;
  children: any;
}

export interface TableRowProps extends BaseProps {
  children: any;
  onClick?: () => void;
}
