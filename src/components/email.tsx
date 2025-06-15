export const Email = () => {
  const email = new String('supPo    Rt @ mrug esh.dev')
    .toLowerCase()
    .replaceAll(' ', '')
    .split('')
    .reverse()
    .join('');
  return (
    <span
      className="font-medium underline"
      style={{
        unicodeBidi: 'bidi-override',
        direction: 'rtl',
        textAlign: 'left',
      }}
    >
      {email}
    </span>
  );
};
