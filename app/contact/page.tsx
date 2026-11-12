import type { Metadata } from 'next';
import ContactView from '@/components/contact/ContactView';

export const metadata: Metadata = {
  title: 'Contact Us · House Of GnanRudh',
  description:
    'Get in touch with House Of GnanRudh — email, phone, WhatsApp and the Nellore boutique address. Care team replies within one working day.',
};

export default function ContactPage() {
  return <ContactView />;
}
