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
      <Layout variant='main' className={cn('')}>
        <section className={cn('')}>
          <div className={cn('prose prose-sm prose-slate max-w-none')}>
            <h1 className={cn('py-2 text-center font-bold text-slate-700')}>
              Everyday Day Carry
            </h1>
          </div>
        </section>
        <section className={cn('')}>
          <div className={cn('prose prose-sm prose-slate max-w-none')}>
            <p className={cn('text-center text-slate-600')}>
              A non-exhaustive list of stuff that I use on a daily basis.
            </p>
            <h3 className={cn('text-center font-bold text-slate-700')}>
              Hardware
            </h3>
            <ul className={cn('list-none')}>
              <li>
                <ES
                  title='Apple MacBook Pro (14-inch, 2021)'
                  labels={[
                    { name: '2022', color: 'green' },
                    { name: 'work', color: 'orange' },
                    { name: 'personal', color: 'yellow' }
                  ]}
                >
                  <p>
                    I daily drive the{' '}
                    <Link
                      className={cn(
                        'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-2 hover:text-black hover:decoration-black'
                      )}
                      href='https://support.apple.com/kb/SP854?locale=en_US'
                    >
                      MacBook Pro (14-inch, 2021)
                    </Link>
                    . I use it for work, personal projects, and everything in
                    between. The 14-inch display is a great size for me when on
                    the move, and the ARM-based M1 is a beast!
                  </p>
                  <p>
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
                >
                  <p>
                    The{' '}
                    <Link
                      className={cn(
                        'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-2 hover:text-black hover:decoration-black'
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
                  <p>
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
                  <p>
                    I used to daily drive the{' '}
                    <Link
                      className={cn(
                        'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-2 hover:text-black hover:decoration-black'
                      )}
                      href='http://web.archive.org/web/20200619220029/https://www.pcmag.com/reviews/dell-xps-15-9500'
                    >
                      Dell XPS 15 9500
                    </Link>{' '}
                    running Windows for a few years. In fact, I had been rocking
                    a{' '}
                    <Link
                      className={cn(
                        'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-2 hover:text-black hover:decoration-black'
                      )}
                      href='https://hn.mrugesh.dev/how-to-dual-boot-dell-xps-9500-windows-and-linux'
                    >
                      dual-boot setup
                    </Link>{' '}
                    for a while. These days, I have turned into a Proxmox
                    VE-based homelab and I use the XPS 15 as a workstation for
                    my personal projects.
                  </p>
                  <p>
                    I have virtualized several flavors of Linux on it, including
                    Home Assitant OS, Debian, and Ubuntu. I also use it to run a
                    few VMs for testing and development. The nice bit is now I
                    can run LXC-based instances as I need. Quite handy when I
                    need a VM on the whim.
                  </p>
                  <p>
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
                  <li>
                    <p>
                      For a good half a decade (2016-2020), I used a{' '}
                      <Link
                        className={cn(
                          'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-2 hover:text-black hover:decoration-black'
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
                    <p>
                      <Link
                        className={cn(
                          'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-2 hover:text-black hover:decoration-black'
                        )}
                        href='http://web.archive.org/web/20120925105640/http://notebooks.com/2012/07/10/lenovo-ideapad-u310-review/'
                      >
                        Lenovo IdeaPad U310
                      </Link>{' '}
                      - It boots, but I don&apos;t use it anymore.
                    </p>
                  </li>
                </ES>
              </li>
              <li>
                <ES title='Peripherals'>
                  <ul className={cn('list-none')}>
                    <li>
                      <Link
                        className={cn(
                          'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-2 hover:text-black hover:decoration-black'
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
                          'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-2 hover:text-black hover:decoration-black'
                        )}
                        href='https://www.amazon.in/dp/B08196YFMK'
                      >
                        Logitech MX Keys
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={cn(
                          'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-2 hover:text-black hover:decoration-black'
                        )}
                        href='https://www.amazon.in/dp/B071YZJ1G1'
                      >
                        Logitech MX Master 2S
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={cn(
                          'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-2 hover:text-black hover:decoration-black'
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
                          'text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-2 hover:text-black hover:decoration-black'
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
            <h3 className={cn('text-center text-xl font-bold text-slate-700')}>
              Software
            </h3>
            <ul className={cn('list-none')}>
              <li>
                <ES title='Operating Systems'>TBD — Updating this soon.</ES>
              </li>
            </ul>
          </div>
        </section>
        <section className={cn('')}>
          <div className={cn('prose prose-sm prose-slate mt-4 max-w-none')}>
            <h4 className={cn('text-center font-bold text-slate-700')}>
              Elsewhere on the internet
            </h4>
            <Social />
          </div>
        </section>
      </Layout>
    </>
  );
};
export default Uses;
