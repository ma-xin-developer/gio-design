import React, { useLayoutEffect, useRef, createContext } from 'react';
import classNames from 'classnames';
import { useWindowSize, useSetState } from 'react-use';
import { LayoutProps, LayoutState, ContentState, LayoutContextType } from './interfaces';
import usePrefixCls from '../../utils/hooks/use-prefix-cls';
import Header from './header';
import Content from './content';
import Sider from './sider';
import useSiders from './useSiders';

const initLayoutState = { wide: false };
const initContentState = { maxWidth: 0, margin: 0 };

export const LayoutContext = createContext<LayoutContextType>({
  layoutState: initLayoutState,
  contentState: initContentState,
} as LayoutContextType);

const Layout = ({ prefixCls: customizePrefixCls, className, style, children }: LayoutProps) => {
  const { width } = useWindowSize();
  const containerRef = useRef<HTMLDivElement>(null);
  const prefixCls = usePrefixCls('layout', customizePrefixCls);
  const [localLayoutState, setLayoutState] = useSetState<LayoutState>(initLayoutState);
  const [localContentState, setContentState] = useSetState<ContentState>(initContentState);
  const [siders, sidersWidth, removeSider, updateSiders, margin] = useSiders();

  useLayoutEffect(() => {
    const layoutWidth = containerRef.current?.getBoundingClientRect().width ?? 0;
    setLayoutState(() => {
      return { wide: layoutWidth > localContentState.maxWidth + 2 * localContentState.margin + sidersWidth };
    });
  }, [width, setLayoutState, localContentState, siders, sidersWidth]);

  const mergedStyle = {
    ...{ marginLeft: margin[0], marginRight: margin[1] },
    ...style,
  };

  return (
    <LayoutContext.Provider
      value={{
        contentState: localContentState,
        layoutState: localLayoutState,
        setLayoutState,
        setContentState,
        removeSider,
        updateSiders,
      }}
    >
      <section ref={containerRef} className={classNames(prefixCls, className)} style={mergedStyle}>
        {children}
      </section>
    </LayoutContext.Provider>
  );
};

Layout.Header = Header;
Layout.Content = Content;
Layout.Sider = Sider;

export default Layout;
