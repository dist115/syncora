export type GetIconProps = {
  iconList: any;
  iconName: string;
  [key: string]: unknown;
};
export const DynamicIcon = ({ iconList, iconName, ...rest }: GetIconProps) => {
  const TagName = iconList[iconName];
  return !!TagName ? <TagName {...rest} /> : null;
};
