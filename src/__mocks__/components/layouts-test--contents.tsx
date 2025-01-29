import Layout from '@/components/layouts';

const Contents: React.FC = () => {
  return (
    <Layout>
      <section>
        <div className='prose prose-stone max-w-none px-20 pt-5 pb-20'>
          <h1 className='py-2 text-center'>Blog</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel
            maximus lorem, in semper lacus. Praesent scelerisque vestibulum dui,
            eu facilisis dui dapibus vel.
          </p>
          <h2>Consectetur Adipiscing Elit</h2>
          <p>
            Integer fringilla ipsum vitae elit interdum, at fermentum odio
            consequat. Fusce eu felis vel metus commodo dapibus ut nec purus.
          </p>
          <h3>Curabitur Venenatis</h3>
          <ul>
            <li>Fusce eget ante vel lacus consequat laoreet.</li>
            <li>Mauris vitae magna sed odio cursus sodales.</li>
            <li>Phasellus semper enim sit amet ultricies consectetur.</li>
          </ul>
          <h2>Donec Velit Neque</h2>
          <p>
            Donec velit neque, auctor et enim in, condimentum fermentum nisi.
            Morbi lacinia velit justo, nec tempus nulla porta quis. Vivamus
            dictum, risus at feugiat pharetra, erat sem cursus felis, id
            consectetur ante ipsum ac mi.
          </p>
          <h3>Quisque Elementum</h3>
          <ol>
            <li>Etiam commodo bibendum justo.</li>
            <li>Pellentesque non semper diam, nec convallis lacus.</li>
            <li>Integer in volutpat nunc, at ullamcorper erat.</li>
          </ol>
          <h2>Nunc Suscipit</h2>
          <table className='border'>
            <thead>
              <tr>
                <th>Header 1</th>
                <th>Header 2</th>
                <th>Header 3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Row 1, Cell 1</td>
                <td>Row 1, Cell 2</td>
                <td>Row 1, Cell 3</td>
              </tr>
              <tr>
                <td>Row 2, Cell 1</td>
                <td>Row 2, Cell 2</td>
                <td>Row 2, Cell 3</td>
              </tr>
              <tr>
                <td>Row 3, Cell 1</td>
                <td>Row 3, Cell 2</td>
                <td>Row 3, Cell 3</td>
              </tr>
            </tbody>
          </table>
          <h3>Etiam Malesuada</h3>
          <p>
            Etiam malesuada sapien ut cursus convallis. Sed ullamcorper
            facilisis justo, et posuere elit convallis a. Pellentesque habitant
            morbi tristique senectus et netus et malesuada fames ac turpis
            egestas.
          </p>
          <h2>Integer Vitae</h2>
          <p>
            Integer vitae ipsum vitae lacus lacinia, id congue justo convallis.
            Cras auctor sapien vitae turpis consequat ultrices. Fusce eu odio
            lorem. Duis scelerisque purus ac justo pharetra, eget tincidunt
            neque fringilla. Aenean nec ante turpis. Nulla facilisi.
          </p>
          <h3>Maecenas Tincidunt</h3>
          <ul>
            <li>Nulla non ligula non diam consequat consequat.</li>
            <li>Praesent quis massa in sem consequat aliquam.</li>
            <li>Ut ullamcorper libero at blandit fermentum.</li>
          </ul>
          <h2>Aliquam Eros</h2>
          <p>
            Aliquam eros magna, ullamcorper et imperdiet id, euismod in mi.
            Fusce rhoncus metus ut ipsum posuere, sit amet porttitor est
            dapibus.
          </p>
          <h3>Vestibulum Dapibus</h3>
          <ol>
            <li>Vivamus euismod nunc vel lorem ullamcorper.</li>
            <li>Curabitur vehicula libero vel mi dapibus.</li>
            <li>In hac habitasse platea dictumst.</li>
          </ol>
          <h2>Sed Egestas</h2>
          <table className='border'>
            <thead>
              <tr>
                <th>Column A</th>
                <th>Column B</th>
                <th>Column C</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cell A1</td>
                <td>Cell B1</td>
                <td>Cell C1</td>
              </tr>
              <tr>
                <td>Cell A2</td>
                <td>Cell B2</td>
                <td>Cell C2</td>
              </tr>
              <tr>
                <td>Cell A3</td>
                <td>Cell B3</td>
                <td>Cell C3</td>
              </tr>
            </tbody>
          </table>
          <h3>Fusce Varius</h3>
          <p>
            Fusce varius velit ac sapien malesuada, a tincidunt purus consequat.
            Nunc luctus dapibus justo, id consequat quam tincidunt vitae.
            Suspendisse potenti.
          </p>
          <h2>Phasellus Eleifend</h2>
          <p>
            Phasellus eleifend nulla ut sollicitudin blandit. Maecenas et
            bibendum erat, eu sollicitudin nisl. Integer porttitor libero id sem
            consectetur, eu accumsan est cursus.
          </p>
          <h4>End.</h4>
        </div>
      </section>
    </Layout>
  );
};

export default Contents;
