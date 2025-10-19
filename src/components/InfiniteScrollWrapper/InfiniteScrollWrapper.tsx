import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import css from "./InfiniteScrollWrapper.module.css";

interface InfiniteScrollWrapperProps {
  dataLength: number;
  hasMore: boolean;
  next: () => void;
  loading?: boolean;
  endMessage?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
  customLoader?: React.ReactNode;
}

export default function InfiniteScrollWrapper({
  dataLength,
  hasMore,
  next,
  loading = false,
  endMessage,
  children,
  style,
  customLoader,
}: InfiniteScrollWrapperProps) {
  return (
    <InfiniteScroll
      dataLength={dataLength}
      next={next}
      hasMore={hasMore}
      loader={
        customLoader ? (
          customLoader
        ) : loading ? (
          <div className={css.loaderWrapper}>
            <div className={css.loader}></div>
            <p className={css.loaderText}>Loading...</p>
          </div>
        ) : null
      }
      endMessage={endMessage}
      style={style}
    >
      {children}
    </InfiniteScroll>
  );
}
