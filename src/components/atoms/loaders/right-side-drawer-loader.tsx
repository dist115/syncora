import ContentLoader from 'react-content-loader';

export default function RightSideDrawerLoader(props: { className?: string }) {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={684}
      viewBox="0 0 448 684"
      backgroundColor="#f2f2f2"
      foregroundColor="#d6d6d6"
      {...props}
    >
      <rect x="26" y="32" width="278" height="30" />
      <rect x="26" y="181" width="395" height="50" />
      <rect x="26" y="247" width="395" height="50" />
      <rect x="26" y="445" width="395" height="50" />
      <rect x="26" y="313" width="395" height="50" />
      <rect x="26" y="511" width="395" height="50" />
      <rect x="26" y="379" width="395" height="50" />
      <rect x="26" y="577" width="395" height="50" />
      <rect x="26" y="88" width="335" height="24" />
      <rect y="128" width="448" height="5" />
      <rect x="379" y="32" width="42" height="30" />
    </ContentLoader>
  );
}
