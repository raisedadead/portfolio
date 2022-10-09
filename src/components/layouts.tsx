export type LayoutProps = {
  children: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  return <>{children}</>;
};

export default Layout;
