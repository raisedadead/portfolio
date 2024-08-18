import type { NextPage } from 'next';
import Layout from '@/components/layouts';
import { CustomLink as Link } from '@/components/custom-link';
import { ExpandableSection as ES } from '@/components/expandable-section';
import { MetaHead } from '@/components/head';
import { Social } from '@/components/social';
import { cn } from '@/lib/utils';

const Uses: NextPage = () => {
  return (
    <>
      <MetaHead pageTitle='Uses' />
      <Layout variant='main'>
        <section className={cn('mb-8')}>
          <div className={cn('prose prose-lg prose-slate max-w-none')}>
            <h1
              className={cn(
                'py-4 text-center text-3xl font-bold text-slate-800'
              )}
            >
              Everyday Day Carry
            </h1>
          </div>
        </section>
        <section className={cn('mb-12')}>
          <div className={cn('mx-auto max-w-3xl')}>
            <p className={cn('pb-6 text-center text-lg text-slate-600')}>
              A non-exhaustive list of stuff that I use on a daily basis.
            </p>
            <h2
              className={cn(
                'mb-6 text-center text-2xl font-bold text-slate-700'
              )}
            >
              Hardware
            </h2>
            <ul className={cn('list-none space-y-6')}>
              <li>
                <ES
                  title='Apple MacBook Pro (14-inch, 2021)'
                  labels={[
                    { name: '2022', color: 'green' },
                    { name: 'work', color: 'orange' },
                    { name: 'personal', color: 'yellow' }
                  ]}
                  defaultOpen={true}
                >
                  <p className={cn('mb-4 text-lg')}>
                    I daily drive the{' '}
                    <Link
                      className={cn(
                        'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-4 transition-colors hover:text-black hover:decoration-black'
                      )}
                      href='https://support.apple.com/kb/SP854?locale=en_US'
                    >
                      MacBook Pro (14-inch, 2021)
                    </Link>
                    . I use it for work, personal projects, and everything in
                    between. The 14-inch display is a great size for me when on
                    the move, and the ARM-based M1 is a beast!
                  </p>
                  <p className={cn('text-lg')}>
                    At home, this is connected to a dual monitor setup with a
                    thunderbolt dock to connect to my external peripherals.
                  </p>
                </ES>
              </li>
              <li>
                <ES
                  title='DeskPi Super6C (2022)'
                  labels={[
                    { name: '2022', color: 'green' },
                    { name: 'homelab', color: 'purple' },
                    { name: 'personal', color: 'yellow' }
                  ]}
                  defaultOpen={true}
                >
                  <p className={cn('mb-4 text-lg')}>
                    The{' '}
                    <Link
                      className={cn(
                        'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-4 transition-colors hover:text-black hover:decoration-black'
                      )}
                      href='https://deskpi.com/collections/deskpi-super6c'
                    >
                      DeskPi Super6C
                    </Link>{' '}
                    is a <strong>Raspberry Pi Compute Module 4 </strong>
                    Cluster Mini-ITX board that supports up to 6 CM4s. I have
                    populated it with 4 x 8GB Lite editions, 2 x 2GB Lite
                    editions and 128 SanDisk SD cards for the boot drives.
                  </p>
                  <p className={cn('text-lg')}>
                    I use it as a home lab for learning and experimenting with
                    Hashicorp products like Nomad, Consul, Vault, etc.,
                    Kubernetes, Docker, and other technologies. The CM4s are
                    running Raspberry Pi OS (debian) and I manage them with
                    Ansible from my laptop.
                  </p>
                </ES>
              </li>
              <li>
                <ES
                  title='Dell XPS 15 9500 (15-inch, 2020)'
                  labels={[
                    { name: '2020', color: 'green' },
                    { name: 'homelab', color: 'purple' },
                    { name: 'personal', color: 'yellow' }
                  ]}
                >
                  <p className={cn('mb-4 text-lg')}>
                    I used to daily drive the{' '}
                    <Link
                      className={cn(
                        'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-4 transition-colors hover:text-black hover:decoration-black'
                      )}
                      href='http://web.archive.org/web/20200619220029/https://www.pcmag.com/reviews/dell-xps-15-9500'
                    >
                      Dell XPS 15 9500
                    </Link>{' '}
                    running Windows for a few years. In fact, I had been rocking
                    a{' '}
                    <Link
                      className={cn(
                        'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-4 transition-colors hover:text-black hover:decoration-black'
                      )}
                      href='https://hn.mrugesh.dev/how-to-dual-boot-dell-xps-9500-windows-and-linux'
                    >
                      dual-boot setup
                    </Link>{' '}
                    for a while. These days, I have turned it into a Proxmox
                    VE-based homelab and I use the XPS 15 as a workstation for
                    my personal projects.
                  </p>
                  <p className={cn('mb-4 text-lg')}>
                    I have virtualized several flavors of Linux on it, including
                    Home Assistant OS, Debian, and Ubuntu. I also use it to run
                    a few VMs for testing and development. The nice bit is now I
                    can run LXC-based instances as I need. Quite handy when I
                    need a VM on the whim.
                  </p>
                  <p className={cn('text-lg')}>
                    I do plan to replace this machine with a more powerful one.
                    Until then this will do.
                  </p>
                </ES>
              </li>
              <li>
                <ES
                  title='Other Machines'
                  labels={[
                    { name: '< 2020', color: 'green' },
                    { name: 'personal', color: 'yellow' }
                  ]}
                >
                  <ul className={cn('list-disc space-y-2 pl-5')}>
                    <li>
                      <p className={cn('text-lg')}>
                        For a good half a decade (2016-2020), I used a{' '}
                        <Link
                          className={cn(
                            'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-4 transition-colors hover:text-black hover:decoration-black'
                          )}
                          href='https://support.apple.com/kb/SP715?locale=en_US'
                        >
                          MacBook Pro (Retina, 13-inch, Early 2015)
                        </Link>{' '}
                        as my sole computer - Sadly it died in 2022. I&apos;ll
                        miss the times we have had and will get it mummified.
                      </p>
                    </li>
                    <li>
                      <p className={cn('text-lg')}>
                        <Link
                          className={cn(
                            'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-4 transition-colors hover:text-black hover:decoration-black'
                          )}
                          href='http://web.archive.org/web/20120925105640/http://notebooks.com/2012/07/10/lenovo-ideapad-u310-review/'
                        >
                          Lenovo IdeaPad U310
                        </Link>{' '}
                        - It boots, but I don&apos;t use it anymore.
                      </p>
                    </li>
                  </ul>
                </ES>
              </li>
              <li>
                <ES title='Peripherals'>
                  <ul className={cn('list-disc space-y-2 pl-5')}>
                    <li>
                      <Link
                        className={cn(
                          'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-4 transition-colors hover:text-black hover:decoration-black'
                        )}
                        href='https://www.amazon.in/dp/B07V867LW4'
                      >
                        Dell WD19TB Thunderbolt Dock
                      </Link>
                      - 180W Power Delivery, Dual 4K@60Hz, Gigabit LAN
                    </li>
                    <li>
                      <Link
                        className={cn(
                          'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-4 transition-colors hover:text-black hover:decoration-black'
                        )}
                        href='https://www.amazon.in/dp/B08196YFMK'
                      >
                        Logitech MX Keys
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={cn(
                          'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-4 transition-colors hover:text-black hover:decoration-black'
                        )}
                        href='https://www.amazon.in/dp/B071YZJ1G1'
                      >
                        Logitech MX Master 2S
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={cn(
                          'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-4 transition-colors hover:text-black hover:decoration-black'
                        )}
                        href='https://www.amazon.in/dp/B08J5X2LV4'
                      >
                        LG 27UK650-W
                      </Link>{' '}
                      27&quot; 4K UHD LED Monitors <strong>— x 2 nos.</strong>
                    </li>
                    <li>
                      <Link
                        className={cn(
                          'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-4 transition-colors hover:text-black hover:decoration-black'
                        )}
                        href='https://www.amazon.in/dp/B01JOFKL0A'
                      >
                        Cannon Pixma AIO Wireless Printer
                      </Link>
                    </li>
                  </ul>
                </ES>
              </li>
            </ul>
            <h2
              className={cn(
                'mb-6 mt-12 text-center text-2xl font-bold text-slate-700'
              )}
            >
              Software
            </h2>
            <ul className={cn('list-none space-y-6')}>
              <li>
                <ES title='Operating Systems'>TBD — Updating this soon.</ES>
              </li>
            </ul>
          </div>
        </section>
        <section>
          <div
            className={cn('prose prose-lg prose-slate mx-auto mt-8 max-w-3xl')}
          >
            <h3 className={cn('mb-4 text-center font-bold text-slate-700')}>
              Elsewhere on the internet
            </h3>
            <Social />
          </div>
        </section>
      </Layout>
    </>
  );
};
export default Uses;
