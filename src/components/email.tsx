export const Email = () => {
  const email = (() => {
    const raw = (() => {
      const encodedBytes = Uint8Array.from([
        38, 223, 143, 95, 159, 117, 138, 223, 47, 162, 33, 138, 191, 47, 157, 39, 223, 152, 47, 149, 38, 194, 209, 107,
        149, 35
      ]);
      const mask = Uint8Array.from([0x55, 0xaa, 0xff, 0x0f, 0xf0]);
      const decoded = encodedBytes.reduce((accumulator, value, index) => {
        accumulator[index] = value ^ mask[index % mask.length];
        return accumulator;
      }, new Uint8Array(encodedBytes.length));
      const characters = Array.from(decoded.values(), (codePoint) => String.fromCodePoint(codePoint));
      return characters.join('');
    })();
    const sanitized = raw.toLowerCase().replaceAll(' ', '');
    return sanitized.split('').reverse().join('');
  })();
  return (
    <span
      className='font-medium underline'
      style={{
        unicodeBidi: 'bidi-override',
        direction: 'rtl',
        textAlign: 'left'
      }}
    >
      {email}
    </span>
  );
};
