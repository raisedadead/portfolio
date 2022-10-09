export const Email = () => {
  const email = new String('supPo    Rt @ mrug esh.dev')
    .toLowerCase()
    .replaceAll(' ', '')
    .split('')
    .reverse()
    .join('');
  return (
    <a href="mailto:${email}">
      {' '}
      <span
        style={{
          unicodeBidi: 'bidi-override',
          direction: 'rtl',
          textAlign: 'left'
        }}
      >
        {email}
      </span>
    </a>
  );
};

export default Email;
