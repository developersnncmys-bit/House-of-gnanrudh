import { redirect } from 'next/navigation';

// Story page is disabled — the HeritageScroll intro is commented out
// and `/` now server-redirects straight to `/home`. The Preloader is
// mounted globally in SiteShell so it covers `/home` on the first page
// load and fades after /home has painted (no blank-ivory flash).
export default function Page() {
  redirect('/home');
}
