import Faq from '@/components/organisms/landing/faq';
import Feature from '@/components/organisms/landing/features';
import Hero from '@/components/organisms/landing/hero';
import Pricing from '@/components/organisms/landing/pricing';
import Service from '@/components/organisms/landing/service';
import StoreFile from '@/components/organisms/landing/store-file';
import Testimonial from '@/components/organisms/landing/testimonial';
import TrustedPartners from '@/components/organisms/landing/trusted-partners';

export default function Landing({ faq }: { faq: any }) {
  return (
    <>
      <Hero />
      <TrustedPartners />
      <StoreFile />
      <Service />
      <Feature />
      <Pricing />
      <Testimonial />
      <Faq faq={faq} />
    </>
  );
}
